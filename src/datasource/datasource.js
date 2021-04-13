/* global BigInt */
import {
  Pocket,
  HttpRpcProvider,
  PocketRpcProvider,
  Configuration,
  typeGuard,
  RpcError,
  PocketAAT,
  Hex,
  CoinDenom,
} from "@pokt-network/pocket-js";

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
      config.maxDispatchers,
      1000,
      0,
      20000,
      undefined,
      undefined,
      Number(config.blockTime),
      undefined,
      false,
      false
    );

    this.__pocket = new Pocket([], undefined, pocketClientConfiguration);
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
    const balanceResponseOrError = await this.gwClient.getBalance(address, BigInt(0));

    if (typeGuard(balanceResponseOrError, RpcError)) {
      console.log(balanceResponseOrError);
      return 0;
    } else {
      const uPOKT = Number(balanceResponseOrError.balance.toString());
      return uPOKT / 1000000;
    }
  }

  /**
   * @returns {Object}
   */
  async getTx(txHash) {
    const txResponseOrError = await this.gwClient.getTransaction(txHash);

    if (typeGuard(txResponseOrError, RpcError)) {
      console.log(txResponseOrError);
      return undefined;
    }
    return txResponseOrError;
  }

  /**
   * @returns {Object | undefined}
   */
  async getApp(address) {
    const provider = await getRPCProvider();

    const appOrError = await this.gwClient.getApp(address, BigInt(0));

    if (typeGuard(appOrError, RpcError)) {
      return undefined;
    } else {
      return appOrError;
    }
  }
  
  /**
   * @returns {Object | undefined}
   */
  async getNode(address) {
    const nodeOrError = await this.gwClient.getNode(address, BigInt(0));

    if (typeGuard(nodeOrError, RpcError)) {
      return undefined;
    } else {
      return nodeOrError;
    }
  }

  /**
   * @returns {Object}
   */
  async sendTransaction(ppk, passphrase, toAddress, amount) {
    // uPOKT
    const defaultFee = this.txFee || 10000;

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
      console.log(transactionSenderOrError);
      return new Error(transactionSenderOrError.message);
    };

    const rawTxPayloadOrError = await transactionSenderOrError
      .send(accountOrUndefined.addressHex, toAddress, amount.toString())
      .process(Config.CHAIN_ID, defaultFee.toString(), CoinDenom.Upokt, "Pocket Wallet");

    if (typeGuard(rawTxPayloadOrError, RpcError)) {
      console.log(`Failed to process transaction with error: ${rawTxResponse}`);
      return new Error(rawTxPayloadOrError.message);
    }

    const rawTxResponseOrError = await this.gwClient.sendRawTx(rawTxPayload.addressHex, rawTxPayload.encodedTxBytes);

    if (typeGuard(rawTxResponseOrError, RpcError)) {
      console.log(`Failed to send transaction with error: ${rawTxResponse}`);
      return new Error(rawTxResponse.message);
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
    let sentTxs;

    try {
      // Retrieve received transactions
      const receivedTxsOrError = await this.getTxs(address, true);

      if (!typeGuard(receivedTxsOrError, RpcError) && receivedTxsOrError !== undefined) {
        receivedTxs = receivedTxsOrError.toJSON();
      }

      // Retrieve sent transactions
      const sentTxsOrError = await this.getTxs(address, false);

      if (!typeGuard(sentTxsOrError, RpcError) && sentTxsOrError !== undefined) {
        sentTxs = sentTxsOrError.toJSON();
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
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  /**
   * @returns {Object[]}
   */
  async getTxs(address, received) {
    const provider = await getRPCProvider();
    const maxTxs = Number(Config.MAX_TRANSACTION_LIST_COUNT);
    // Retrieve received transactions
    const receivedTxsOrError = await this.gwClient.getAccountTxs(address, received, false, 1, maxTxs);

    if (!typeGuard(receivedTxsOrError, RpcError)) {
      const txs = receivedTxsOrError;
      // Check the amount of total records
      let page = receivedTxsOrError.totalCount / maxTxs;
      // Check if the page is decimal
      if (page % 1 !== 0) {
        page = Math.round(page);
        if (page === 1 || page === 0) {
          return txs;
        }
      }
      // Call the last page
      const txsOrError = await this.gwClient.getAccountTxs(address, received, false, page, maxTxs);

      if (!typeGuard(txsOrError, RpcError)) {
        return txsOrError;
      }
      return undefined;
    } else {
      return undefined;
    }
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