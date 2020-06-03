/* global BigInt */
import {
    Pocket,
    PocketRpcProvider,
    typeGuard,
    RpcError,
    PocketAAT,
    Hex,
    CoinDenom
} from "@pokt-network/pocket-js/dist/web.js"
import base from "../config/config.json"

// Assign the base to the config constant
const config = base

export class DataSource {
    constructor(pocketAAT, dispatchers) {
        this.pocketAAT = pocketAAT
        this.dispatchers = dispatchers
    }

    // Retrieve or set a pocket instance
    async getPocketInstance() {
        if (!this.pocket) {
            const clientPrivateKey = config.clientPrivateKey
            const appPublicKey = config.walletAppPublicKey
            const appPrivateKey = "cc295ffce930181ed01d38ce2934988c17787bdbfb53e6d6d6bbc3a71e4bf537a7e8ec112d0c7bcb2521fe783eac704b874a148541f9e9d43bbb9f831503abea"
            // const rpcProviderPocket = new Pocket(new URL(this.dispatchers[0]))
            const rpcProviderPocket = new Pocket([new URL(this.dispatchers[0])])
            const appSignature = config.walletAppAATSignature
            const passphrase = config.clientPassphrase
            const version = "0.0.1"
            const blockchain = "0002"
            // Import client PubKey and unlock account
            const clientAccount = await rpcProviderPocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), passphrase)
            await rpcProviderPocket.keybase.unlockAccount(clientAccount.addressHex, passphrase, 0)
            const clientPubKeyHex = clientAccount.publicKey.toString("hex")
            // Generate the AAT
            const aat = await PocketAAT.from(version, clientPubKeyHex, appPublicKey, appPrivateKey)
            // const aat = await PocketAAT.fromSignature(version, clientPubKeyHex, appPublicKey, appSignature)
            // const aat = new PocketAAT(
            //     version,
            //     clientPubKeyHex,
            //     appPublicKey,
            //     appSignature
            // )

            const pocketRpcProvider = new PocketRpcProvider(
                rpcProviderPocket,
                aat,
                blockchain
            )
            this.pocket = new Pocket(this.dispatchers, pocketRpcProvider)
        }
        return this.pocket
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
            Buffer.from(privateKey, "hex"),
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
     * @returns {BigInt}
     */
    async getBalance(address) {
        const pocket = await this.getPocketInstance()

        const balanceResponseOrError = await pocket.rpc().query.getBalance(address, BigInt(0))
        if (typeGuard(balanceResponseOrError, RpcError)) {
            return 0
        } else {
            const uPOKT = Number(balanceResponseOrError.balance.toString())
            return uPOKT / 1000000
        }
    }
    /**
     * @returns {BigInt}
     */
    async sendTransaction(ppk, passphrase, toAddress) {
        const pocket = await this.getPocketInstance()
        const accountOrError = await this.importPortablePrivateKey(passphrase, ppk, passphrase)
        if (typeGuard(accountOrError, RpcError)) {
            return accountOrError
        }

        const transactionSenderOrError = await pocket.withImportedAccount(accountOrError.address, passphrase)
        if (typeGuard(transactionSenderOrError, RpcError)) {
            return transactionSenderOrError
        }

        let rawTxResponse = await transactionSenderOrError
        .send(accountOrError.addressHex, toAddress, "100000")
        .submit("pocket-test", "100000", CoinDenom.Upokt, "From the Pocket Wallet")
        
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
        const pocket = await this.getPocketInstance()
        let receivedTxs
        let sentTxs
        try {
            // Retrieve received transactions
            const receivedTxsOrError = await this.getTxs(pocket, address, true)

            if (!typeGuard(receivedTxsOrError, RpcError) && receivedTxsOrError !== undefined) {
                receivedTxs = receivedTxsOrError.toJSON()
            }

            // Retrieve sent transactions
            const sentTxsOrError = await this.getTxs(pocket, address, false)

            if (!typeGuard(sentTxsOrError, RpcError) && sentTxsOrError !== undefined) {
                sentTxs = sentTxsOrError.toJSON()
            }

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
     * @returns {}
     */
    async getTxs(pocket, address, received){
        // Retrieve received transactions
        const receivedTxsOrError = await pocket.rpc().query.getAccountTxs(address, received, false, 1, 10)
        // 
        if (!typeGuard(receivedTxsOrError, RpcError)) {
            const txs = receivedTxsOrError
            // Check the amount of total records
            let page = receivedTxsOrError.totalCount / 10
            // Check if the page is decimal
            if (page % 1 !== 0) {
                page = Math.round(page)
                if (page === 1 || page === 0) {
                    return txs
                }
            }
            // Call the last page
            const txsOrError = await pocket.rpc().query.getAccountTxs(address, received, false, page, 10)
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