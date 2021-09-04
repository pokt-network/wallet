import {
  Pocket,
  Configuration,
  typeGuard,
  RpcError,
  CoinDenom,
  Hex,
} from "@pokt-network/pocket-js";
import { getGatewayClient } from "./gateway";
import axios from 'axios';
import Errors from "./errors";

export class DataSource {
  constructor(config) {
    const gatewayUrl = config ? (config.gatewayUrl || "") : "";
    const httpConfig = config ? (config.http || {}) : {};

    if (gatewayUrl === "") {
      throw Errors.ConfigErrors.RequiredParam('gatewayUrl');
    }

    if (Object.keys(httpConfig).length === 0) {
      console.warn(
        Errors.ConfigErrors.RequiredParam('http')
      );
    }

    this.gwClient = getGatewayClient(gatewayUrl, httpConfig);

    const pocketClientConfiguration = new Configuration(
      1,
      1000,
      0,
      20000,
      undefined,
      undefined,
      Number(config.blockTime),
      undefined,
      false,
      false,
      config.useLegacyCodec,
    );

    this.__pocket = new Pocket([""], undefined, pocketClientConfiguration);

    this.config = config;
  }

  /**
   * @returns {Account}
   */
  async exportPPKFromAccount(account, passphrase) {

    const ppkOrError = await this.__pocket.keybase.exportPPKfromAccount(
      account.addressHex,
      passphrase,
      "pocket wallet",
      passphrase
    );

    return ppkOrError;
  }

  /**
   * @returns {Account}
   */
  async createAccount(passphrase) {

    const accountOrError = await this.__pocket.keybase.createAccount(passphrase);

    if (typeGuard(accountOrError, Error)) {
      return undefined;
    } else {
      return accountOrError;
    }
  }

  /**
   * @returns {Account}
   */
  async importPortablePrivateKey(password, jsonStr, passphrase) {
    const accountOrError = await this.__pocket.keybase.importPPKFromJSON(
      password,
      jsonStr,
      passphrase
    );

    if (typeGuard(accountOrError, Error)) {
      return accountOrError;
    } else {
      return accountOrError;
    }
  }

  /**
   *
   * @returns {Account}
   */
  async importAccount(privateKey, passphrase) {

    const accountOrError = await this.__pocket.keybase.importAccount(
      Buffer.from(privateKey, "hex"),
      passphrase
    );

    if (typeGuard(accountOrError, Error)) {
      return undefined;
    } else {
      return accountOrError;
    }
  }

  /**
   * @returns {UnlockedAccount}
   */
  async getUnlockedAccount(addressHex, passphrase) {

    const unlockedOrError = await this.__pocket.keybase.getUnlockedAccount(
      addressHex,
      passphrase
    );

    if (typeGuard(unlockedOrError, Error)) {
      return undefined;
    } else {
      return unlockedOrError;
    }
  }

  /**
   * @returns {object}
   */
  async exportPPK(privateKey, passphrase) {

    const ppkOrError = await this.__pocket.keybase.exportPPK(
      privateKey,
      passphrase,
      "pocket wallet"
    );

    if (typeGuard(ppkOrError, Error)) {
      return undefined;
    } else {
      return ppkOrError;
    }
  }

  /**
   * @returns {Number}
   */
  async getBalance(address) {
    let balanceResponse;
    try {
      balanceResponse = await this.gwClient.makeQuery('getBalance', address, 0);
    } catch (error) {
      console.log(error);
      return 0;
    }

    const uPOKT = Number(balanceResponse.balance.toString());
    return uPOKT / 1000000;
  }

  /**
   * @returns {Float}
   */
  async getPrice() {
    console.log('getting price');

    let response = await axios.get('https://thunderheadotc.com/api/price/')
    let data =  response["data"]
    if (data["status"] == "200") {
      return parseFloat(data["price"])
    }
    else {
      return -1
    }

  }

  /**
   * @returns {Object}
   */
  async getTx(txHash) {
    let txResponse;
    try {
      txResponse = await this.gwClient.makeQuery('getTransaction', txHash);
    } catch (error) {
      console.log(error);
      return undefined;
    }

    return txResponse;
  }

  /**
   * @returns {Object | undefined}
   */
  async getApp(address) {
    let app;

    try {
      app = await this.gwClient.makeQuery('getApp', address, 0)
    } catch (error) {
      console.log(error);
      return undefined;
    }

    return app;
  }

  /**
   * @returns {Object | undefined}
   */
  async getNode(address) {
    let node;
    try {
      node = await this.gwClient.makeQuery('getNode', address, 0);
    } catch (error) {
      console.log(error);
      return undefined;
    }

    return node;
  }

  /**
   * @returns {Object}
   */
  async sendTransaction(ppk, passphrase, toAddress, amount) {
    // uPOKT
    const defaultFee = this.config.txFee || 10000;

    const accountOrUndefined = await this.__pocket.keybase.importPPKFromJSON(
      passphrase,
      ppk,
      passphrase
    );

    if (typeGuard(accountOrUndefined, Error)) {
      return new Error("Failed to import account due to wrong passphrase provided");
    };

    const transactionSenderOrError = await this.__pocket.withImportedAccount(
      accountOrUndefined.address,
      passphrase
    );

    if (typeGuard(transactionSenderOrError, RpcError)) {
      return new Error(transactionSenderOrError.message);
    };

    const rawTxPayloadOrError = await transactionSenderOrError
      .send(accountOrUndefined.addressHex, toAddress, amount.toString())
      .createTransaction(this.config.chainId, defaultFee.toString(), CoinDenom.Upokt, "Pocket Wallet");

    if (typeGuard(rawTxPayloadOrError, RpcError)) {
      console.log(`Failed to process transaction with error: ${rawTxPayloadOrError}`);
      return new Error(rawTxPayloadOrError.message);
    }

    let rawTxResponse;
    try {
      rawTxResponse = await this
        .gwClient
        .makeQuery(
          'sendRawTx',
          rawTxPayloadOrError.address,
          rawTxPayloadOrError.txHex
        );
    } catch (error) {
      console.log(`Failed to send transaction with error: ${error.raw_log}`);
      return new Error(error.raw_log);
    }

    return rawTxResponse;
  }

  /**
   * @returns {Object}
   */
   async unjailNode(ppk, passphrase) {
    // uPOKT
    const defaultFee = this.config.txFee || 10000;

    const accountOrUndefined = await this.__pocket.keybase.importPPKFromJSON(
      passphrase,
      ppk,
      passphrase
    );

    if (typeGuard(accountOrUndefined, Error)) {
      return new Error("Failed to import account due to wrong passphrase provided");
    };

    const transactionSenderOrError = await this.__pocket.withImportedAccount(
      accountOrUndefined.address,
      passphrase
    );

    if (typeGuard(transactionSenderOrError, RpcError)) {
      return new Error(transactionSenderOrError.message);
    };

    const rawTxPayloadOrError = await transactionSenderOrError
      .nodeUnjail(accountOrUndefined.addressHex)
      .createTransaction(this.config.chainId, defaultFee.toString(), CoinDenom.Upokt, "Unjail Node - Pocket Wallet");

    if (typeGuard(rawTxPayloadOrError, RpcError)) {
      console.log(`Failed to process transaction with error: ${rawTxPayloadOrError.message}`);
      return new Error(rawTxPayloadOrError.message);
    }

    let rawTxResponse;
    try {
      rawTxResponse = await this
        .gwClient
        .makeQuery(
          'sendRawTx',
          rawTxPayloadOrError.address,
          rawTxPayloadOrError.txHex
        );
    } catch (error) {
      console.log(`Failed to send transaction with error: ${error.raw_log}`);
      return new Error(error.raw_log);
    }

    return rawTxResponse;
  }

  /**
   * @returns {Object}
   */
   async unstakeNode(ppk, passphrase) {
    // uPOKT
    const defaultFee = this.config.txFee || 10000;

    const accountOrUndefined = await this.__pocket.keybase.importPPKFromJSON(
      passphrase,
      ppk,
      passphrase
    );

    if (typeGuard(accountOrUndefined, Error)) {
      return new Error("Failed to import account due to wrong passphrase provided");
    };

    const transactionSenderOrError = await this.__pocket.withImportedAccount(
      accountOrUndefined.address,
      passphrase
    );

    if (typeGuard(transactionSenderOrError, RpcError)) {
      return new Error(transactionSenderOrError.message);
    };

    const rawTxPayloadOrError = await transactionSenderOrError
      .nodeUnstake(accountOrUndefined.addressHex)
      .createTransaction(this.config.chainId, defaultFee.toString(), CoinDenom.Upokt, "Unstake Node - Pocket Wallet");

    if (typeGuard(rawTxPayloadOrError, RpcError)) {
      console.log(`Failed to process transaction with error: ${rawTxPayloadOrError}`);
      return new Error(rawTxPayloadOrError.message);
    }

    let rawTxResponse;
    try {
      rawTxResponse = await this
        .gwClient
        .makeQuery(
          'sendRawTx',
          rawTxPayloadOrError.address,
          rawTxPayloadOrError.txHex
        );
    } catch (error) {
      console.log(`Failed to send transaction with error: ${error.raw_log}`);
      return new Error(error.raw_log);
    }

    return rawTxResponse;
  }

  /**
   * @returns {Object}
   */
  mergeTxs(received, sent) {
    //
    received.txs.forEach((tx) => {
      tx.type = "Received";
    });
    //
    sent.txs.forEach((tx) => {
      tx.type = "Sent";
    });
    //
    const mergedTxs = received.txs.concat(sent.txs);
    const filterByBlockHeight = mergedTxs.sort(function (a, b) {
      return a.height - b.height;
    });

    return filterByBlockHeight;
  }

  /**
   * @returns {Object}
   */
  sortTxs(object, sentOrReceived) {
    object.txs.forEach((tx) => {
      tx.type = sentOrReceived;
    });

    const filterByBlockHeight = object.txs.sort(function (a, b) {
      return a.height - b.height;
    });

    return filterByBlockHeight;
  }

  /**
   * @returns {Object | undefined}
   */
  async getAllTransactions(address) {
    let receivedTxs;
    try {
      receivedTxs = await this.getTxs(address, true);
    } catch (error) {
      console.error(error);
      return undefined;
    }

    let sentTxs;
    try {
      sentTxs = await this.getTxs(address, false);
    } catch (error) {
      console.error(error);
      return undefined;
    }

    if (receivedTxs === undefined && sentTxs === undefined) return undefined;

    // Check if both arrays are not empty
    if (
      receivedTxs && receivedTxs.txs &&
      receivedTxs.txs.length > 0 &&
      sentTxs && sentTxs.txs &&
      sentTxs.txs.length > 0
    ) {
      return this.mergeTxs(receivedTxs, sentTxs);
    } else if (receivedTxs && receivedTxs.txs && receivedTxs.txs.length > 0) {
      return this.sortTxs(receivedTxs, "Received");
    } else if (sentTxs && sentTxs.txs && sentTxs.txs.length > 0) {
      return this.sortTxs(sentTxs, "Sent");
    } else {
      return undefined;
    }
  }

  /**
   * @returns {Object[]}
   */
  async getTxs(address, received) {
    const maxTxs = Number(this.config.maxTransactionListCount);
    // Retrieve received transactions
    let receivedTxs;

    try {
      receivedTxs = await this.gwClient.makeQuery('getAccountTxs', address, received, false, 1, maxTxs);
    } catch (error) {
      console.log({ error  })
      return undefined;
    }

    return receivedTxs;
  }

  /**
   * @returns {boolean}
   */
  validateAddress(address) {
    return Hex.validateAddress(address);
  }

  /**
   * @returns {boolean}
   */
  validatePrivateKey(privateKey) {
    return Hex.isHex(privateKey) && privateKey.length === 128;
  }

  /**
   * @returns {boolean}
   */
  typeGuard(object, type) {
    if (typeGuard(object, type)) {
      return true;
    }
    return false;
  }
}
