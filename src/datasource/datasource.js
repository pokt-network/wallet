/* global BigInt */
import {
    Pocket,
    PocketRpcProvider,
    Configuration,
    typeGuard,
    RpcError,
    PocketAAT,
    Hex,
    CoinDenom
} from "@pokt-network/pocket-js/dist/web.js"
import Config from "../config/config.json"

export class DataSource {
    static AATVersion = "0.0.1"

    constructor(dispatchers) {
        this.dispatchers = dispatchers
    }

    // Retrieve or set a pocket instance
    async getPocketInstance() {
        if (!this.pocket || !this.pocket.rpc()) {
            const configuration = new Configuration(5, 1000, undefined, 40000, true, undefined, undefined, undefined, undefined, false)
            const clientPubKeyHex = Config.clientPublicKey
            const clientPrivateKey = Config.clientPrivateKey
            const clientPassphrase = Config.clientPassphrase
            const walletAppPublicKey = Config.walletAppPublicKey
            const walletAppSignature = Config.walletAppAATSignature

            // Pocket instance
            const pocket = new Pocket(this.dispatchers, undefined, configuration)
            const blockchain = Config.chain

            // Import client Account
            const clientAccountOrError = await pocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), clientPassphrase)
            if (typeGuard(clientAccountOrError, Error)) {
                throw clientAccountOrError
            }
            // Unlock the client account
            const unlockOrError = await pocket.keybase.unlockAccount(clientAccountOrError.addressHex, clientPassphrase, 0)
            if (typeGuard(unlockOrError, Error)) {
                throw clientAccountOrError
            }

            // Generate the AAT
            const aat = new PocketAAT(
                DataSource.AATVersion,
                clientPubKeyHex,
                walletAppPublicKey,
                walletAppSignature
            )
            // const pocketRpcProvider = new HttpRpcProvider(this.dispatchers)
            const pocketRpcProvider = new PocketRpcProvider(
                pocket,
                aat,
                blockchain
            )
            
            this.pocket = new Pocket(this.dispatchers, pocketRpcProvider, configuration)
            return this.pocket
        }else {
            return this.pocket
        }
    }

    /**
     * @returns {Account}
     */
    async exportPPKFromAccount(account, passphrase) {
        const pocket = await this.getPocketInstance()

        const ppkOrError = await pocket.keybase.exportPPKfromAccount(account, passphrase, "pocket wallet", passphrase)
        
        return ppkOrError
    }

    /**
     * @returns {Account}
     */
    async createAccount(passphrase) {
        const pocket = await this.getPocketInstance()
        const accountOrError = await pocket.keybase.createAccount(passphrase)

        if (typeGuard(accountOrError, Error)) {
            return undefined
        } else {
            return accountOrError
        }
    }

    /**
     * @returns {Account}
     */
    async importPortablePrivateKey(password, jsonStr, passphrase) {
        const pocket = await this.getPocketInstance()
        const accountOrError = await pocket.keybase.importPPKFromJSON(
            password,
            jsonStr,
            passphrase
        )

        if (typeGuard(accountOrError, Error)) {
            return undefined
        } else {
            return accountOrError
        }
    }

     /**
     * @returns {Account}
     */
    async importAccount(privateKey, passphrase) {
        const pocket = await this.getPocketInstance()
        const accountOrError = await pocket.keybase.importAccount(
            Buffer.from(privateKey, "hex"),
            passphrase
        )

        if (typeGuard(accountOrError, Error)) {
            return undefined
        } else {
            return accountOrError
        }
    }
    /**
     * @returns {object}
     */
    async exportPPK(privateKey, passphrase) {
        const pocket = await this.getPocketInstance()
        const ppkOrError = await pocket.keybase.exportPPK(
            privateKey,
            passphrase,
            "pocket wallet"
        )

        if (typeGuard(ppkOrError, Error)) {
            return undefined
        } else {
            return ppkOrError
        }
    }

    /**
     * @returns {Number}
     */
    async getBalance(address) {
        const pocket = await this.getPocketInstance()

        const balanceResponseOrError = await pocket.rpc().query.getBalance(address, BigInt(0))
        if (typeGuard(balanceResponseOrError, RpcError)) {
            console.log(RpcError)
            return 0
        } else {
            const uPOKT = Number(balanceResponseOrError.balance.toString())
            return uPOKT / 1000000
        }
    }
        /**
     * @returns {Object}
     */
    async getTx(tx) {
        const pocket = await this.getPocketInstance()
        const txResponseOrError = await pocket.rpc().query.getTX(tx)
        if (typeGuard(txResponseOrError, RpcError)) {
            console.log(RpcError)
            return undefined
        }
        return txResponseOrError
    }
    /**
     * @returns {Object}
     */
    async sendTransaction(ppk, passphrase, toAddress, amount) {
        // uPOKT
        const defaultFee = "100000"
        this.pocket = undefined
        const pocket = await this.getPocketInstance()
        const accountOrUndefined = await this.importPortablePrivateKey(passphrase, ppk, passphrase)
        if (accountOrUndefined === undefined) {
            console.log("Failed to import account due to wrong passphrase provided")
            return accountOrUndefined
        }

        const transactionSenderOrError = await pocket.withImportedAccount(accountOrUndefined.address, passphrase)
        if (typeGuard(transactionSenderOrError, RpcError)) {
            console.log(transactionSenderOrError)
            return undefined
        }

        let rawTxResponse = await transactionSenderOrError
        .send(accountOrUndefined.addressHex, toAddress, amount.toString())
        .submit("pocket-test", defaultFee, CoinDenom.Upokt, "Pocket Wallet")
        
        return rawTxResponse
    }
    /**
     * @returns {Object | undefined}
     */
    async getApp(address) {
        const pocket = await this.getPocketInstance()

        const appOrError = await pocket.rpc().query.getApp(address, BigInt(0))
        
        if (typeGuard(appOrError, RpcError)) {
            return undefined
        } else {
            return appOrError
        }
    }

    /**
     * @returns {Object | undefined}
     */
    async getNode(address) {
        const pocket = await this.getPocketInstance()

        const nodeOrError = await pocket.rpc().query.getNode(address, BigInt(0))

        if (typeGuard(nodeOrError, RpcError)) {
            return undefined
        } else {
            return nodeOrError
        }
    }
    /**
     * @returns {Object}
     */
    mergeTxs(received, sent) {
        //
        received.txs.forEach(tx => {
            tx.type = "Received"
        })
        //
        sent.txs.forEach(tx => {
            tx.type = "Sent"
        })
        //
        const mergedTxs = received.txs.concat(sent.txs)
        const filterByBlockHeight = mergedTxs.sort(function(a, b){
            return a.height-b.height
        })
        
        return filterByBlockHeight
    }

    /**
     * @returns {Object | undefined}
     */
    async getAllTransactions(address) {
        let receivedTxs
        let sentTxs
        try {
            // Retrieve received transactions
            const receivedTxsOrError = await this.getTxs(address, true)

            if (!typeGuard(receivedTxsOrError, RpcError) && receivedTxsOrError !== undefined) {
                receivedTxs = receivedTxsOrError.toJSON()
            }

            // Retrieve sent transactions
            const sentTxsOrError = await this.getTxs(address, false)

            if (!typeGuard(sentTxsOrError, RpcError) && sentTxsOrError !== undefined) {
                sentTxs = sentTxsOrError.toJSON()
            }

            if(receivedTxs === undefined) return undefined
            // Check if both arrays are not empty
            if (receivedTxs.txs.length > 0 && sentTxs.txs.length > 0) {
                return this.mergeTxs(receivedTxs, sentTxs)
            }else if (receivedTxs.length > 0) {
                return receivedTxs
            }else if (sentTxs.length > 0) {
                return sentTxs
            }else {
                return undefined
            }
        } catch (error) {
            console.log(error)
            return undefined
        }
    }
    /**
     * @returns {Object[]}
     */
    async getTxs(address, received){
        const pocket = await this.getPocketInstance()
        const maxTxs = Config.maxTransactionListCount
        // Retrieve received transactions
        const receivedTxsOrError = await pocket.rpc().query.getAccountTxs(address, received, false, 1, maxTxs)
        // 
        if (!typeGuard(receivedTxsOrError, RpcError)) {
            const txs = receivedTxsOrError
            // Check the amount of total records
            let page = receivedTxsOrError.totalCount / maxTxs
            // Check if the page is decimal
            if (page % 1 !== 0) {
                page = Math.round(page)
                if (page === 1 || page === 0) {
                    return txs
                }
            }
            // Call the last page
            const txsOrError = await this.pocket.rpc().query.getAccountTxs(address, received, false, page, maxTxs)
            // 
            if (!typeGuard(txsOrError, RpcError)) {
                return txsOrError
            }
            return undefined
        }else {
            return undefined
        }
    }

    /**
     * @returns {boolean}
     */
    validateAddress(address) {
        return Hex.validateAddress(address)
    }
    /**
     * @returns {boolean}
     */
    validatePrivateKey(privateKey) {
        return Hex.isHex(privateKey) && privateKey.length === 128
    }
    /**
     * @returns {boolean}
     */
    typeGuard(object, type) {
        if (typeGuard(object, type)) {
            return true
        }
        return false
    }
}