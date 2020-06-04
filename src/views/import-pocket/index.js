import React from "react"
import Wrapper from "../../components/wrapper"
import ImportPocketContent from "./import-pocket"
import Title from "../../components/public/title/title"
import Input from "../../components/public/input/input"
import Button from "../../components/public/button/button"
import altertR from "../../utils/images/alert-circle-red.png"
import { DataSource } from "../../datasource"
import Modal, { closeStyle } from "simple-react-modal"
import { typeGuard } from "@pokt-network/pocket-js/dist/web.js"

class ImportPocket extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ppk: undefined,
            privateKey: undefined,
            isModalVisible: false,
        }
        // Set up locals
        this.dataSource = DataSource.instance

        this.isFileInput = this.isFileInput.bind(this)
        this.isTextInput = this.isTextInput.bind(this)
        this.parseFileInputContent = this.parseFileInputContent.bind(this)
        this.setUploaderText = this.setUploaderText.bind(this)
        this.privKeyInputChange = this.privKeyInputChange.bind(this)
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.hideAllErrors = this.hideAllErrors.bind(this)
        this.togglePassphraseError = this.togglePassphraseError.bind(this)
        this.toggleButtonError = this.toggleButtonError.bind(this)
        this.togglePPKError = this.togglePPKError.bind(this)
        this.togglePrivateKeyError = this.togglePrivateKeyError.bind(this)
        this.importAccount = this.importAccount.bind(this)
        this.importAccountFromPPK = this.importAccountFromPPK.bind(this)
        this.importAccountFromPrivateKey = this.importAccountFromPrivateKey.bind(this)
    }

    isFileInput(input) {
        return input.type === "file"
    }

    isTextInput(input) {
        return input.type === "password"
    }

    async parseFileInputContent(input) {
        if (input && input.files.length > 0) {
            const reader = new FileReader()
            const file = input.files[0]
            return new Promise(function (resolve, reject) {
                reader.onloadend = () => {
                    resolve(reader.result)
                }
                reader.onerror = (error) => {
                    console.error(error)
                    resolve(undefined)
                }
                reader.readAsText(file)
            })
        } else {
            return
        }
    }

    setUploaderText(msg) {
        document.getElementById("cont-file").setAttribute("data-text", msg)
    }

    // Private key inputs handler
    async privKeyInputChange(e) {
        // Clear all errors whenever the users tries to input a private key
        this.hideAllErrors()

        // Clear state
        this.setState({
            ppk: undefined,
            privateKey: undefined,
        })

        // Reset the file uploader text
        this.setUploaderText(`Choose your Key File`)

        // Get the private key from the input
        const input = e.target
        if (this.isFileInput(input)) {
            // Reset the private key text input
            document.getElementById("import-privatekey").value = ""

            // Clean private key text input
            const fileInputValue = await this.parseFileInputContent(input)

            // Read file and load it's contents
            if (!fileInputValue) {
                console.error("Error parsing file")
                this.togglePPKError(true, "Error parsing PPK contents.")
                return
            }

            try {
                const ppkObj = JSON.parse(fileInputValue)
                this.setUploaderText(`${`Hint: ${ppkObj.hint}` || "Key File Uploaded Succesfully"}`)
            } catch(e) {
                console.error(e)
                this.togglePPKError(true, "Invalid Key File format, must be a JSON file")
            }

            this.setState({
                ppk: fileInputValue,
            })
        } else if (this.isTextInput(input)) {
            // Clear the file uploader
            document.getElementById("import-ppk").value = ""

            // Get the private key from the input
            const privateKey = input.value

            // Check if it's a valid private key
            const isValidPrivateKey = this.dataSource.validatePrivateKey(privateKey)

            if (!isValidPrivateKey) {
                this.togglePrivateKeyError(true, "Invalid Private Key format.")
                return
            }

            this.setState({
                privateKey: privateKey,
            })
        } else {
            this.toggleButtonError(true, "Invalid private key input")
        }
    }

    showModal() {
        this.setState({
            isModalVisible: true,
        })
    }

    closeModal() {
        this.setState({
            isModalVisible: false,
        })
    }

    hideAllErrors() {
        this.togglePassphraseError(false)
        this.toggleButtonError(false, "")
        this.togglePPKError(false, "")
        this.togglePrivateKeyError(false, "")
    }

    togglePassphraseError(show) {
        const errorSpan = document.getElementById("passphrase-invalid")
        if (errorSpan) {
            errorSpan.style.display = show === true ? "block" : "none"
        }
    }

    toggleButtonError(show, msg) {
        const errorSpan = document.getElementById("button-error")
        if (errorSpan) {
            errorSpan.style.display = show === true ? "block" : "none"
            errorSpan.innerText = msg
        }
    }

    togglePPKError(show, msg) {
        const errorSpan = document.getElementById("ppk-error")
        if (errorSpan) {
            errorSpan.style.display = show === true ? "block" : "none"
            errorSpan.innerText = msg
        }
    }

    togglePrivateKeyError(show, msg) {
        const errorSpan = document.getElementById("private-key-error")
        if (errorSpan) {
            errorSpan.style.display = show === true ? "block" : "none"
            errorSpan.innerText = msg
        }
    }

    async importAccount() {
        // Hide the passphrase error
        this.togglePassphraseError(false)

        // Get the passphrase input and passphrase value
        const passphraseInput = document.getElementById("import-pk-passphrase")
        const passphrase = passphraseInput.value
        if (passphrase.length === 0) {
            // Show the passphrase error and return
            this.togglePassphraseError(true)
            return
        }

        // Clean passphrase input
        passphraseInput.value = ""
        // Handle imports
        let accountObj
        if (this.state.ppk) {
            accountObj = await this.importAccountFromPPK(this.state.ppk, passphrase)
        } else if (this.state.privateKey) {
            accountObj = await this.importAccountFromPrivateKey(this.state.privateKey, passphrase)
        }

        if (!accountObj) {
            // Close the modal to show errors in the main view
            this.toggleButtonError(true, "An error ocurred importing your account, please verify your credentials and try again.")
            this.closeModal()
            return
        }

        // Move to the account detail
        this.props.history.push({
            pathname: "/account",
            data: accountObj,
        })
    }

    // Account import functions
    // Import an account using a key file
    async importAccountFromPPK(ppk, passphrase) {
        try {
            // Import the PPK
            const account = await this.dataSource.importPortablePrivateKey(passphrase, ppk, passphrase)
            if (!account) {
                this.togglePPKError(
                    true,
                    "Failed to decrypt your Key File, please check your passphrase and try again."
                )
                return
            }

            const accountObj = {
                addressHex: account.addressHex,
                publicKeyHex: account.publicKey.toString("hex"),
                ppk: ppk,
            }
            return accountObj
        } catch (error) {
            console.error(error)
            this.togglePPKError(true, "There was an error importing your Key File, please try again.")
        }
        return
    }

    // Import an account using a raw private key
    async importAccountFromPrivateKey(privateKey, passphrase) {
        try {
            // Validate private key
            if (!this.dataSource.validatePrivateKey(privateKey)) {
                this.togglePrivateKeyError(true, "Your private key is invalid, please try again.")
                return
            }

            // Create an account by importing the private key
            const accountOrError = await this.dataSource.importAccount(privateKey, passphrase)
            if (typeGuard(accountOrError, Error)) {
                this.togglePrivateKeyError(true, "There was an error decoding your private key, please try again.")
                return
            }
            const account = accountOrError

            // Create a PPK from the account
            const ppk = await this.dataSource.exportPPK(privateKey, passphrase)
            if (!ppk) {
                this.togglePrivateKeyError(true, "There was an error decoding your private key, please try again.")
                return
            }

            const accountObj = {
                addressHex: account.addressHex,
                publicKeyHex: account.publicKey.toString("hex"),
                ppk: ppk,
            }
            return accountObj
        } catch (error) {
            console.error(error)
            this.togglePrivateKeyError(true, "There was an error decoding your private key, please try again.")
        }
        return
    }

    render() {
        return (
            <ImportPocketContent>
                <Wrapper className="wide-block-wr">
                    <Title>Import a pocket account</Title>
                    <div className="quantity">
                        <form className="import-p-form">
                            <div className="container">
                                <div className="cont-input">
                                    <label htmlFor="keyf">Key File</label>
                                    <div id="cont-file" className="cont-file" data-text="Choose your Key File">
                                        <div className="upload"></div>
                                        <Input
                                            onChange={this.privKeyInputChange}
                                            type="file"
                                            name="key-file"
                                            id="import-ppk"
                                        />
                                    </div>
                                    <span id="ppk-error" className="error" style={{ display: "none" }}>
                                        {" "}
                                        <img src={altertR} alt="alert" />
                                        Incorrect file
                                    </span>
                                </div>
                                <div className="cont-input">
                                    <label htmlFor="import-privatekey">Access by Private Key</label>
                                    <Input
                                        type="password"
                                        name="privatekey"
                                        id="import-privatekey"
                                        placeholder="Enter Private Key"
                                        onChange={this.privKeyInputChange}
                                    />
                                    <span id="private-key-error" className="error" style={{ display: "none" }}>
                                        {" "}
                                        <img src={altertR} alt="alert" />
                                        Incorrect private key
                                    </span>
                                </div>
                            </div>
                            <div className="btn-subm">
                                <Button
                                    disabled={this.state.ppk !== undefined || this.state.privateKey !== undefined}
                                    id="import-ppk"
                                    onClick={this.showModal.bind(this)}
                                >
                                    Import Account
                                </Button>
                                <span id="button-error" className="error" style={{ display: "none" }}>
                                    {" "}
                                    <img src={altertR} alt="alert" /> Please enter Private key
                                </span>
                            </div>
                        </form>
                        <a href="/create" className="account">
                            Don’t have an account? Create a new Pocket account
                        </a>
                    </div>
                </Wrapper>
                <div>
                    <Button style={{ display: "none" }} id="open-modal" onClick={this.showModal.bind(this)}></Button>
                    <Modal
                        style={{ background: "rgba(0, 0, 0, 0.5)" }} //overwrites the default background
                        containerStyle={{
                            background: "white",
                            boxShadow: "0 43px 39px -40px rgba(0,0,0,0.5)",
                            borderRadius: "12px",
                        }} //changes styling on the inner content area
                        containerClassName="pocket-modal"
                        closeOnOuterClick={true}
                        show={this.state.isModalVisible}
                        onClose={this.closeModal.bind(this)}
                    >
                        <div className="cont-input">
                            <label style={{ maginTop: "10px" }} htmlFor="private">
                                Passphrase
                            </label>
                            <Input
                                style={{ maginTop: "10px" }}
                                type="password"
                                name="import-pk-passphrase"
                                id="import-pk-passphrase"
                                placeholder="•••••••••••••••••"
                                minLength="1"
                            />
                        </div>
                        <span id="passphrase-invalid" className="error" style={{ display: "none" }}>
                            {" "}
                            <img src={altertR} alt="alert" />
                            Invalid Passphrase
                        </span>
                        <Button
                            style={{ padding: "9px 9px 8px 24px", width: "33px", display: "block",
                                margin: "10px 0px auto auto" }}
                            onClick={this.importAccount.bind(this)}
                        >
                            OK
                        </Button>
                        <a style={closeStyle} onClick={this.closeModal.bind(this)}>
                            X
                        </a>
                    </Modal>
                </div>
            </ImportPocketContent>
        )
    }
}

export default ImportPocket
