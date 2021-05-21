import Axios from "axios";
import Errors from "./errors";

/**
 * Http Adapter.
 * Configure your headers and what not in here.
 * Interceptors and Network Layer middlewares should come in here.
 */
class AxiosProvider {
  constructor(baseURL, config) {
    this.http = Axios.create({
      baseURL,
      timeout: config.timeout || 100000,
      headers: config.headers,
    });
  }
}

/**
 * Http Control Layer.
 * Throw your http control logic in here, i.e: if error, if data, if 201.
 */
class PocketQueriesController {
  provider = null;

  requests = {
    getBalance: (address, height) => ({
      url: '/v1/query/balance',
      method: 'post',
      data: {
        address,
        height,
      }
    }),
    getTransaction: (id) => ({
      url: '/v1/query/tx',
      method: 'post',
      data: {
        hash: id,
      }
    }),
    getApp: (address, height) => ({
      url: '/v1/query/app',
      method: 'post',
      data: {
        address,
        height,
      }
    }),
    getNode: (address, height) => ({
      url: '/v1/query/node',
      method: 'post',
      data: {
        address,
        height,
      }
    }),
    getAccountTxs: (address, received, prove, page, per_page) => ({
      url: '/v1/query/accounttxs',
      method: 'post',
      data: {
        address,
        prove,
        received,
        page,
        per_page,
      }
    }),
    sendRawTx: (fromAddress, tx) => ({
      url: '/v1/client/rawtx',
      method: 'post',
      data: {
        address: fromAddress,
        raw_hex_bytes: tx,
      }
    })
  }

  use(provider) {
    this.provider = provider;
    return this;
  }

  // looks ugly with the ifs
  // but the gateway constantly responds with 200
  // and responds with errors in response.data
  // in a non-consistent form.
  parseSuccessfulResponse = (response) => {
    
    if (typeof response.data === 'string' && response.data.indexOf('Method Not Allowed') > -1) {
      throw new Error('Method Not Allowed')
    }

    if (response.data.code && response.data.code !== 200) {
      throw response.data;
    }

    return response.data;
  }

  parseErrorResponse = (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      throw error.response.data.error;
    }

    if (typeof error === 'string') {
      throw new Error(error)
    }

    throw error;

  }

  perform = async (requestName, ...args) => {
    const reqConfig = typeof this.requests[requestName] === 'function' ?
      this.requests[requestName](...args) :
      this.requests[requestName];

    const response = await this
      .provider
      .http
      .request(reqConfig)
      .then(this.parseSuccessfulResponse)
      .catch(this.parseErrorResponse);

    return response;
  }
  
  // does not really need to be bound to `this`, but keeping it for semantics' sake.
  // arguments explicit forwardong for clear signature lookup, avoid using `...args` 
  _getBalance = (address, height) => this.perform.call(this, 'getBalance', address, height) 
  _getTransaction = (id) => this.perform.call(this, 'getTransaction', id)
  _getApp = (address, height) => this.perform.call(this, 'getApp', address, height)
  _getNode = (address, height) => this.perform.call(this, 'getNode', address, height)
  _getAccountTxs = (address, received, prove, page, per_page) => this.perform.call(this, 'getAccountTxs', address, received, prove, page, per_page)
  _sendRawTx = (fromAddress, tx) => this.perform.call(this, 'sendRawTx', fromAddress, tx)

  // For semantic separation, and for "ease of middlewaring" when necessary.
  // hook your processors to your cals in here
  query = {
    getBalance: this._getBalance,
    getTransaction: this._getTransaction,
    getApp: this._getApp,
    getNode: this._getNode,
    getAccountTxs: async (...args) => {
      const rawResponse = await this._getAccountTxs(...args);
      const response = this.processors.accountTxs.processResponse(rawResponse);

      return response;
    },
    sendRawTx: async (fromAddress, tx) => {
      const request = this.processors.rawTx.processRequest({ fromAddress, tx });
      const rawResponse = await this._sendRawTx(request.addressHex, request.rawTxBytes);
      const response = this.processors.rawTx.processResponse(rawResponse);

      return response;
    }
  }

  // request/response processors
  processors = {
    rawTx: {
      processRequest: ({ fromAddress, tx }) => ({
        addressHex: fromAddress.toString('hex'),
        rawTxBytes: tx.toString('hex'),
      }),
      processResponse: (response) => response,
    },

    accountTxs: {
      processResponse: (response) => {
        const base64ToStr = (v) => Buffer.from(v, "base64").toString();
        const kvToStr = (kvObj) => ({
          key: base64ToStr(kvObj.key),
          value: base64ToStr(kvObj.value),
        });

        const mapEvents = (events) => events.map(
          (e) => ({ ...e, attributes: e.attributes.map(kvToStr) })
        )

        const txs = response.txs.map(
          (tx) => ({
            ...tx,
            tx_result: {
              ...tx.tx_result,
              events: mapEvents(tx.tx_result.events),
            }
          })
        )

        return { ...response, txs }
      }
   }
  }
}

/**
 * Exposes registered/allowed gateway queries.
 * This layer is added for gateway level logic control. i.e: custom errors and responses.
 */
class GatewayClient {
  constructor(httpProvider, requestsController, config) {
    this.controller = requestsController.use(httpProvider)
    this.config     = config;
  }

  queries = [
    'getBalance',
    'getTransaction',
    'getApp',
    'getNode',
    'getAccountTxs',
    'sendRawTx',
  ]

  /**
   * @returns {BigInt}
   */
  async makeQuery(queryName, ...args) {
    if (!(this.queries.includes(queryName) > -1)) {
      throw Errors
    }
    return await this
      .controller
      .query[queryName](...args);
  }
}

const getGatewayClient = (baseUrl, config) => {
  const httpProvider = new AxiosProvider(baseUrl, config);
  const requestsCtrl = new PocketQueriesController();
  const gwClient = new GatewayClient(httpProvider, requestsCtrl, { baseUrl, ...config });

  return gwClient;
}

export {
  AxiosProvider,
  PocketQueriesController,
  GatewayClient,
  getGatewayClient,
}
