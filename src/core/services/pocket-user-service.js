import SecureLS from "secure-ls";
import Config from "../../config/config.json";

class PocketUserService {
    constructor() {
        this.ls = new SecureLS(Config.SECURE_LS);
    }

    /**
     * Save user data in local storage.
     *
     * @param {string} addressHex Address hex string.
     * @param {string} publicKeyHex Public Key hex string.
     * @param {string} ppk Portable Private Key.
     * @param {string} passphrase PPK passphrase.
     */
    saveUserInCache(addressHex, publicKeyHex, ppk, passphrase) {
        try {
            this.ls.set("address_hex", {data: addressHex});
            this.ls.set("public_key_hex", {data: publicKeyHex});
            this.ls.set("ppk", {data: ppk});
            this.ls.set("passphrase", {data: passphrase});
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
        this.ls.remove("passphrase");
    }

    /**
     * Get logged user information.
     *
     * @return {{provider: string, name: string, email: string}}
     */
    getUserInfo() {
        return {
            addressHex: this.ls.get("address_hex").data,
            publicKeyHex: this.ls.get("public_key_hex").data,
            ppk: this.ls.get("ppk").data,
            passphrase: this.ls.get("passphrase").data
        };
    }
}

export default new PocketUserService();