import SecureLS from "secure-ls";
import Config from "../../config/config.json";

class PocketService {
    constructor() {
        const encodingType = Config.SECURE_LS_ENCODING_TYPE;
        const isCompression = Config.SECURE_LS_IS_COMPRESSION;
        const encryptionSecret = Config.SECURE_LS_ENCRYPTION_SECRET;

        this.ls = new SecureLS({
            encodingType,
            isCompression,
            encryptionSecret
        });
    }

    /**
     * Save user data in local storage.
     *
     * @param {string} addressHex Address hex string.
     * @param {string} publicKeyHex Public Key hex string.
     * @param {string} ppk Portable Private Key.
     */
    saveUserInCache(addressHex, publicKeyHex, ppk) {
        try {
            this.ls.set("address_hex", {data: addressHex});
            this.ls.set("public_key_hex", {data: publicKeyHex});
            this.ls.set("ppk", {data: ppk});
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Remove user data from local storage.
     */
    removeUserFromCached() {
        this.ls.remove("address_hex");
        this.ls.remove("public_key_hex");
        this.ls.remove("ppk");
    }

    /**
     * Get logged user information.
     *
     */
    getUserInfo() {
        return {
            addressHex: this.ls.get("address_hex").data,
            publicKeyHex: this.ls.get("public_key_hex").data,
            ppk: this.ls.get("ppk").data
        };
    }

    /**
     * Save transaction data in local storage.
     *
     * @param {string} fromAddress Address hex string.
     * @param {string} destinationAddress Address hex string.
     * @param {string} sentAmount Public Key hex string.
     * @param {string} txHash Portable Private Key.
     * @param {string} txFee Portable Private Key.
     * @param {string} status Portable Private Key.
     * @param {string} sentStatus Portable Private Key.
     */
    saveTxInCache(
        fromAddress,
        destinationAddress,
        sentAmount,
        txHash,
        txFee,
        status,
        sentStatus
    ) {
        try {
            this.ls.set("from_address", {data: fromAddress});
            this.ls.set("destination_address", {data: destinationAddress});
            this.ls.set("sent_amount", {data: sentAmount});
            this.ls.set("tx_hash", {data: txHash});
            this.ls.set("tx_fee", {data: txFee});
            this.ls.set("status", {data: status});
            this.ls.set("sent_status", {data: sentStatus});
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Remove Tx data from local storage.
     */
    removeTxFromCached() {
        this.ls.remove("from_address");
        this.ls.remove("destination_address");
        this.ls.remove("sent_amount");
        this.ls.remove("tx_hash");
        this.ls.remove("tx_fee");
        this.ls.remove("status");
        this.ls.remove("sent_status");
    }

    /**
     * Get the sent tx information.
     *
     */
    getTxInfo() {
        return {
            fromAddress: this.ls.get("from_address").data,
            destinationAddress: this.ls.get("destination_address").data,
            sentAmount: this.ls.get("sent_amount").data,
            txHash: this.ls.get("tx_hash").data,
            txFee: this.ls.get("tx_fee").data,
            status: this.ls.get("status").data,
            sentStatus: this.ls.get("sent_status").data
        };
    }
}

export default new PocketService();