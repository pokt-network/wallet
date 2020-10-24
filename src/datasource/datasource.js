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
import Config from "../config/config.json";

const CONFIGURATION = new Configuration(
    Config.MAX_DISPATCHERS,
    1000,
    0,
    20000,
    undefined,
    undefined,
    Number(Config.BLOCK_TIME),
    undefined,
    false,
    false
);

/**
 * Retrieve a list of URL's from the configuration for the dispatchers
 *
 * @returns {URL[]} Dispatcher urls.
 */
function getPocketDispatchers() {
    const dispatchersStr = Config.DISPATCHERS || "";

    if (dispatchersStr === "") {
        return [];
    }

    return dispatchersStr.split(",").map(function (dispatcherURLStr) {
        return new URL(dispatcherURLStr);
    });
}

/**
 * @returns {HttpRpcProvider | PocketRpcProvider} RPC Provider.
 */
async function getRPCProvider() {
    const providerType = Config.PROVIDER_TYPE;

    if (providerType.toLowerCase() === "http") {
        return getHttpRPCProvider();
    } else if (providerType.toLowerCase() === "pocket") {
        return await getPocketRPCProvider();
    } else {
        // Default to HTTP RPC Provider
        return getHttpRPCProvider();
    }
}

/**
 * @returns {HttpRpcProvider} HTTP RPC Provider.
 */
function getHttpRPCProvider() {
    const node = Config.HTTP_PROVIDER;

    if (!node || node === "") {
        throw new Error(`Invalid HTTP Provider node: ${node}`);
    }

    return new HttpRpcProvider(new URL(node));
}

/**
 * @returns {PocketRpcProvider} Pocket RPC Provider.
 */
async function getPocketRPCProvider() {
    const clientPubKeyHex = Config.CLIENT_PUBLIC_KEY;
    const clientPrivateKey = Config.CLIENT_PRIVATE_KEY;
    const clientPassphrase = Config.CLIENT_PASSPHRASE;
    const walletAppPublicKey = Config.WALLET_APP_PUBLIC_KEY;
    const walletAppSignature = Config.WALLET_APP_AAT_SIGNATURE;
    const blockchain = Config.CHAIN;

    if (
        clientPubKeyHex &&
        clientPrivateKey &&
        clientPassphrase &&
        walletAppPublicKey &&
        walletAppSignature &&
        blockchain
    ) {
        // Dispatcher
        const dispatchers = getPocketDispatchers();

        if (!dispatchers || dispatchers.length === 0) {
            throw new Error(`Failed to retrieve a list of dispatcher for the PocketRpcProvider: ${dispatchers}`);
        }

        // Pocket instance
        const pocket = new Pocket(dispatchers, undefined, CONFIGURATION);

        // Import client Account
        const clientAccountOrError = await pocket.keybase.importAccount(
            Buffer.from(clientPrivateKey, "hex"),
            clientPassphrase
        );

        if (typeGuard(clientAccountOrError, Error)) {
            throw clientAccountOrError;
        }

        // Unlock the client account
        const unlockOrError = await pocket.keybase.unlockAccount(
            clientAccountOrError.addressHex,
            clientPassphrase,
            0
        );

        if (typeGuard(unlockOrError, Error)) {
            throw clientAccountOrError;
        }

        // Generate the AAT
        const aat = new PocketAAT(
            Config.AAT_VERSION,
            clientPubKeyHex,
            walletAppPublicKey,
            walletAppSignature
        );

        // Pocket Rpc Instance
        return new PocketRpcProvider(
            pocket,
            aat,
            blockchain,
            true
        );
    } else {
        throw new Error(
            `One of the environment variables are missing: CLIENT_PUBLIC_KEY=${Config.CLIENT_PUBLIC_KEY}, CLIENT_PRIVATE_KEY=${Config.CLIENT_PRIVATE_KEY}, CLIENT_PASSPHRASE=${Config.CLIENT_PASSPHRASE}, WALLET_APP_PUBLIC_KEY=${Config.WALLET_APP_PUBLIC_KEY}, WALLET_APP_AAT_SIGNATURE=${Config.WALLET_APP_AAT_SIGNATURE}, CHAIN=${Config.CHAIN}`
        );
    }
}

export class DataSource {

    constructor() {
        this.dispatchers = getPocketDispatchers();

        if (!this.dispatchers || this.dispatchers.length === 0) {
            throw new Error(
                `Failed to retrieve a list of dispatchers to instantiate Pocket: ${this.dispatchers}`
            );
        }

        this.__pocket = new Pocket(this.dispatchers, undefined, CONFIGURATION);
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
            return undefined;
        } else {
            return accountOrError;
        }
    }

    /**
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
        const provider = await getRPCProvider();

        const balanceResponseOrError = await this.__pocket
            .rpc(provider)
            .query.getBalance(address, BigInt(0));
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
    async getTx(tx) {
        const provider = await getRPCProvider();
        const txResponseOrError = await this.__pocket.rpc(provider).query.getTX(tx);

        if (typeGuard(txResponseOrError, RpcError)) {
            console.log(txResponseOrError);
            return undefined;
        }
        return txResponseOrError;
    }
    /**
     * @returns {Object}
     */
    async sendTransaction(ppk, passphrase, toAddress, amount) {
        // uPOKT
        const defaultFee = "100000";

        const accountOrUndefined = await this.importPortablePrivateKey(
            passphrase,
            ppk,
            passphrase
        );
        if (accountOrUndefined === undefined) {
            console.log("Failed to import account due to wrong passphrase provided");
            return accountOrUndefined;
        }
        
        const transactionSenderOrError = await this.__pocket.withImportedAccount(
            accountOrUndefined.address,
            passphrase
        );

        if (typeGuard(transactionSenderOrError, RpcError)) {
            console.log(transactionSenderOrError);
            return undefined;
        }

        const rawTxResponse = await transactionSenderOrError
            .send(accountOrUndefined.addressHex, toAddress, amount.toString())
            .submit(Config.CHAIN_ID, defaultFee, CoinDenom.Upokt, "Pocket Wallet");

        return rawTxResponse;
    }
    /**
     * @returns {Object | undefined}
     */
    async getApp(address) {
        const provider = await getRPCProvider();

        const appOrError = await this.__pocket.rpc(provider).query.getApp(address, BigInt(0));

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
        const provider = await getRPCProvider();

        const nodeOrError = await this.__pocket.rpc(provider).query.getNode(address, BigInt(0));

        if (typeGuard(nodeOrError, RpcError)) {
            return undefined;
        } else {
            return nodeOrError;
        }
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

            if (
                !typeGuard(receivedTxsOrError, RpcError) &&
                receivedTxsOrError !== undefined
            ) {
                receivedTxs = receivedTxsOrError.toJSON();
            }

            // Retrieve sent transactions
            const sentTxsOrError = await this.getTxs(address, false);

            if (
                !typeGuard(sentTxsOrError, RpcError) &&
                sentTxsOrError !== undefined
            ) {
                sentTxs = sentTxsOrError.toJSON();
            }

            if (receivedTxs === undefined && sentTxs === undefined) return undefined;
            // Check if both arrays are not empty
            if (
                receivedTxs.txs &&
                receivedTxs.txs.length > 0 &&
                sentTxs.txs &&
                sentTxs.txs.length > 0
            ) {
                return this.mergeTxs(receivedTxs, sentTxs);
            } else if (receivedTxs.txs.length > 0) {
                return this.sortTxs(receivedTxs, "Received");
            } else if (sentTxs.txs.length > 0) {
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
        const receivedTxsOrError = await this.__pocket
            .rpc(provider)
            .query.getAccountTxs(address, received, false, 1, maxTxs);
        //
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
            const txsOrError = await this.__pocket
                .rpc(provider)
                .query.getAccountTxs(address, received, false, page, maxTxs);
            //
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