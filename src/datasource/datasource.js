/* global BigInt */
import {
    Pocket,
    PocketRpcProvider,
    typeGuard,
    RpcError,
    PocketAAT,
    Configuration,
    Hex
} from "@pokt-network/pocket-js/dist/web.js"

export class DataSource {
    constructor(pocketAAT, dispatchers) {
        this.pocketAAT = pocketAAT
        this.dispatchers = dispatchers
    }

    // Retrieve or set a pocket instance
    async getPocketInstance() {
        if (!this.pocket) {
            //
            const configuration = new Configuration(5, 1000, undefined, 40000)
            const rpcProviderPocket = new Pocket(this.dispatchers, undefined, configuration)
            // Import client PubKey and unlock account
            const clientPrivateKey = "c86b5424ab1d73da92522d21adbd48b217a66b61f78fa8e2c93e9ea47afa55716220b1e1364c4f120914d80000b63bdac6a58fc3dbb2ff063bcfcb4f8915a49b"
            const clientAccount = await rpcProviderPocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), "test123")
            await rpcProviderPocket.keybase.unlockAccount(clientAccount.addressHex, "test123", 0)
            const clientPubKeyHex = "6220b1e1364c4f120914d80000b63bdac6a58fc3dbb2ff063bcfcb4f8915a49b"
                clientAccount.publicKey.toString("hex")
            const appPubKeyHex = "a7e8ec112d0c7bcb2521fe783eac704b874a148541f9e9d43bbb9f831503abea"                
            const appSignature = "7949373c02eff36a87a2b847319a804eaed5f664c8333a3cb6c3ad14dbe98380ef1c53bee321e95670b123a1c4993ce02f130a98ec00ea6cac926a410b5f920f"

            const aat = new PocketAAT(
                "0.0.1",
                clientPubKeyHex,
                appPubKeyHex,
                appSignature
            )

            const blockchain = "0002"
            const pocketRpcProvider = new PocketRpcProvider(
                rpcProviderPocket,
                aat,
                blockchain
            )
            this.pocket = new Pocket(this.dispatchers, pocketRpcProvider)
        }
        return this.pocket
    }

    // /**
    //  * @returns {Account}
    //  */
    // async unlockAccount(publicKey, passphrase) {
    //     const pocket = await this.getPocketInstance()
    //     const addressHex = addressFromPublickey(publicKey)

    //     const unlockOrError = await pocket.keybase.unlockAccount(addressHex, passphrase, 0)
    //     if (typeGuard(unlockOrError, Error)) {
    //         return false
    //     } else {
    //         return true
    //     }
    // }

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
     * @returns {boolean}
     */
    validateAddress(address) {
        return Hex.validateAddress(address)
    }
    /**
     * @returns {boolean}
     */
    validatePrivateKey(ppk) {
        return Hex.isHex(ppk) && ppk.length === 128
    }
}