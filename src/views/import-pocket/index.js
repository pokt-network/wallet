import React from "react";
import Wrapper from "../../components/wrapper";
import ImportPocketContent from "./import-pocket";
import Title from "../../components/public/title/title";
import Input from "../../components/public/input/input";
import Button from "../../components/public/button/button";
import altertR from "../../utils/images/alert-circle-red.png";
import exit from "../../utils/images/exit.png";
import Modal from "simple-react-modal";
import { withRouter } from "react-router-dom";
import PocketService from "../../core/services/pocket-service";
import { getDataSource } from "../../datasource";
import { typeGuard } from "@pokt-network/pocket-js";

const dataSource = getDataSource();

class ImportPocket extends React.Component {
    constructor() {
        super();

        this.state = {
            ppk: undefined,
            privateKey: undefined,
            isModalVisible: false,
            uploaderText: undefined,
            ppkError: undefined,
            privateKeyError: undefined,
            buttonError: undefined,
            keyfileName: undefined,
        };

        // Binds
        this.isFileInput = this.isFileInput.bind(this);
        this.isTextInput = this.isTextInput.bind(this);
        this.parseFileInputContent = this.parseFileInputContent.bind(this);
        this.setUploaderText = this.setUploaderText.bind(this);
        this.privKeyInputChange = this.privKeyInputChange.bind(this);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.hideAllErrors = this.hideAllErrors.bind(this);
        this.togglePassphraseError = this.togglePassphraseError.bind(this);
        this.toggleButtonError = this.toggleButtonError.bind(this);
        this.togglePPKError = this.togglePPKError.bind(this);
        this.togglePrivateKeyError = this.togglePrivateKeyError.bind(this);
        this.importAccount = this.importAccount.bind(this);
        this.importAccountFromPPK = this.importAccountFromPPK.bind(this);
        this.importAccountFromPrivateKey =
            this.importAccountFromPrivateKey.bind(this);
    }

    isFileInput(input) {
        return input.type === "file";
    }

    isTextInput(input) {
        return input.type === "password";
    }

    async parseFileInputContent(input) {
        if (input && input.files.length > 0) {
            const reader = new FileReader();
            const file = input.files[0];

            this.setState({
                keyfileName: file.name,
            });

            return new Promise(function (resolve, reject) {
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = (error) => {
                    console.error(error);
                    resolve(undefined);
                };
                reader.readAsText(file);
            });
        } else {
            return;
        }
    }

    setUploaderText(msg) {
        this.setState({ uploaderText: msg });
    }

    // Private key inputs handler
    async privKeyInputChange(e) {
        // Clear all errors whenever the users tries to input a private key
        this.hideAllErrors();

        // Reset the file uploader text
        this.setUploaderText("Choose your Key File");

        // Clear state
        this.setState({
            ppk: undefined,
            privateKey: undefined,
            uploaderText: undefined,
        });

        // Get the private key from the input
        const input = e.target;

        if (this.isFileInput(input)) {
            // Reset the private key text input
            document.getElementById("import-privatekey").value = "";

            // Clean private key text input
            const fileInputValue = await this.parseFileInputContent(input);

            // Read file and load it's contents
            if (!fileInputValue) {
                console.error("Error parsing file");
                this.togglePPKError("Error parsing PPK contents.");

                return;
            }

            try {
                const { keyfileName } = this.state;
                let str = keyfileName;

                // Slice the key file name
                if (keyfileName.length >= 21) {
                    str = keyfileName.slice(0, 21);
                }

                this.setUploaderText(
                    `${`Name: ${str}...` || "Key File Uploaded Succesfully"}`
                );
            } catch (e) {
                console.error(e);
                this.togglePPKError(
                    "Invalid Key File format, must be a JSON file"
                );
            }

            this.setState({
                ppk: fileInputValue,
            });
        } else if (this.isTextInput(input)) {
            // Clear the file uploader
            document.getElementById("import-ppk").value = "";

            // Get the private key from the input
            const privateKey = input.value;

            // Check if it's a valid private key
            const isValidPrivateKey = dataSource.validatePrivateKey(privateKey);

            if (!isValidPrivateKey) {
                this.togglePrivateKeyError("Invalid private key input.");

                return;
            }

            this.setState({
                keyfileName: undefined,
                privateKey: privateKey,
            });
        }
    }

    showModal() {
        const { ppk, privateKey } = this.state;
        const show = ppk || privateKey !== undefined ? true : false;

        this.setState({
            isModalVisible: show,
        });
    }

    closeModal() {
        this.setState({
            isModalVisible: false,
        });
    }

    hideAllErrors() {
        this.togglePassphraseError(undefined);
        this.toggleButtonError(undefined);
        this.togglePPKError(undefined);
        this.togglePrivateKeyError(undefined);
    }

    togglePassphraseError(msg) {
        this.setState({
            passphraseError: msg === undefined ? msg : "Invalid Passphrase",
        });
    }

    toggleButtonError(msg) {
        this.setState({
            buttonError: msg,
        });
    }

    togglePPKError(msg) {
        this.setState({
            ppkError: msg,
        });
    }

    togglePrivateKeyError(msg) {
        this.setState({
            privateKeyError: msg,
        });
    }

    async importAccount() {
        // Retrieve the ppk or privateKey values
        const { ppk, privateKey } = this.state;

        // Hide the passphrase error
        this.togglePassphraseError(undefined);

        // Get the passphrase input and passphrase value
        const passphraseInput = document.getElementById("import-pk-passphrase");
        const passphrase = passphraseInput.value;

        if (passphrase.length === 0) {
            // Show the passphrase error and return
            this.togglePassphraseError(true);
            return;
        }

        // Clean passphrase input
        passphraseInput.value = "";
        // Handle imports
        let accountObj;

        if (ppk) {
            accountObj = await this.importAccountFromPPK(ppk, passphrase);
        } else if (privateKey) {
            accountObj = await this.importAccountFromPrivateKey(
                privateKey,
                passphrase
            );
        }

        if (!accountObj) {
            // Close the modal to show errors in the main view
            this.toggleButtonError(
                "An error ocurred importing your account, please verify your credentials and try again."
            );
            this.closeModal();
            return;
        }

        // Move to the account detail
        this.props.history.push({
            pathname: "/account",
            data: accountObj,
        });
    }

    // Account import functions
    // Import an account using a key file
    async importAccountFromPPK(ppk, passphrase) {
        try {
            // Import the PPK
            const account = await dataSource.importPortablePrivateKey(
                passphrase,
                ppk,
                passphrase
            );

            if (typeGuard(account, Error)) {
                console.error(account);
                return false;
            }

            PocketService.saveUserInCache(
                account.addressHex,
                account.publicKey.toString("hex"),
                ppk.toString()
            );

            return true;
        } catch (error) {
            console.error(error);
            this.togglePPKError(
                "There was an error importing your Key File, please try again."
            );

            return false;
        }
    }

    // Import an account using a raw private key
    async importAccountFromPrivateKey(privateKey, passphrase) {
        try {
            // Validate private key
            if (!dataSource.validatePrivateKey(privateKey)) {
                this.togglePrivateKeyError(
                    "Your private key is invalid, please try again."
                );

                return false;
            }

            // Create an account by importing the private key
            const accountOrError = await dataSource.importAccount(
                privateKey,
                passphrase
            );

            if (typeGuard(accountOrError, Error)) {
                console.error(accountOrError);
                return false;
            }

            const account = accountOrError;

            // Create a PPK from the account
            const ppk = await dataSource.exportPPK(privateKey, passphrase);

            if (!ppk) {
                this.togglePrivateKeyError(
                    "There was an error decoding your private key, please try again."
                );
                console.error(accountOrError);
                return false;
            }

            PocketService.saveUserInCache(
                account.addressHex,
                account.publicKey.toString("hex"),
                ppk.toString()
            );

            return true;
        } catch (error) {
            console.error(error);
            this.togglePrivateKeyError(
                "There was an error decoding your private key, please try again."
            );

            return false;
        }
    }

    render() {
        const {
            ppk,
            uploaderText,
            privateKey,
            ppkError,
            privateKeyError,
            buttonError,
            passphraseError,
        } = this.state;

        return (
            <ImportPocketContent>
                <Wrapper className="wide-block-wr">
                    <Title>Import a pocket account</Title>
                    <div className="quantity">
                        <form className="import-p-form">
                            <div className="container">
                                <div className="cont-input">
                                    <label htmlFor="keyf">
                                        Access using a Key File
                                    </label>
                                    <div
                                        id="cont-file"
                                        className={
                                            uploaderText !== undefined
                                                ? "cont-file"
                                                : "cont-file-empty"
                                        }
                                    >
                                        {uploaderText !== undefined
                                            ? uploaderText
                                            : "Choose your Key File"}
                                        <div className="upload"></div>
                                        <Input
                                            onChange={this.privKeyInputChange}
                                            type="file"
                                            name="key-file"
                                            id="import-ppk"
                                        />
                                    </div>
                                    <span
                                        id="ppk-error"
                                        className="error"
                                        style={{
                                            display: `${
                                                ppkError === undefined
                                                    ? "none"
                                                    : "block"
                                            }`,
                                        }}
                                    >
                                        {" "}
                                        <img src={altertR} alt="alert" />
                                        {ppkError}
                                    </span>
                                </div>
                            </div>
                            <div className="divider">Or</div>
                            <div className="container">
                                <div className="cont-input">
                                    <label htmlFor="import-privatekey">
                                        Access using a Private Key
                                    </label>
                                    <Input
                                        type="password"
                                        name="privatekey"
                                        id="import-privatekey"
                                        placeholder="Enter Private Key"
                                        onChange={this.privKeyInputChange}
                                    />
                                    <span
                                        id="private-key-error"
                                        className="error"
                                        style={{
                                            display: `${
                                                privateKeyError === undefined
                                                    ? "none"
                                                    : "block"
                                            }`,
                                        }}
                                    >
                                        {" "}
                                        <img src={altertR} alt="alert" />
                                        {privateKeyError}
                                    </span>
                                    <span
                                        className="error"
                                        style={{
                                            display: `${
                                                buttonError !== undefined &&
                                                ppkError === undefined &&
                                                privateKeyError === undefined
                                                    ? "block"
                                                    : "none"
                                            }`,
                                        }}
                                    >
                                        {" "}
                                        <img src={altertR} alt="alert" />{" "}
                                        {buttonError}
                                    </span>
                                </div>
                            </div>
                            <div className="btn-subm">
                                <Button
                                    disabled={
                                        ppk !== undefined ||
                                        privateKey !== undefined
                                    }
                                    onClick={this.showModal.bind(this)}
                                >
                                    Import Account
                                </Button>
                            </div>
                        </form>
                        <a href="/create" className="account">
                            Don’t have an account? Create a new Pocket account
                        </a>
                    </div>
                </Wrapper>
                <div>
                    <Button
                        style={{ display: "none" }}
                        id="open-modal"
                        onClick={this.showModal.bind(this)}
                    ></Button>
                    <Modal
                        style={{ background: "rgba(0, 0, 0, 0.5)" }} //overwrites the default background
                        containerStyle={{
                            width: "534px",
                            background: "white",
                            boxShadow: "0 43px 39px -40px rgba(0,0,0,0.5)",
                            borderRadius: "12px",
                        }} //changes styling on the inner content area
                        containerClassName="pocket-modal"
                        closeOnOuterClick={true}
                        show={this.state.isModalVisible}
                        onClose={this.closeModal.bind(this)}
                    >
                        <div
                            className="cont-input"
                            style={{ textAlign: "center" }}
                        >
                            <label
                                style={{
                                    textAlign: "left",
                                    margin: "31px 0px 0px 87px",
                                    color: "#06202e",
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    textTransform: "uppercase",
                                    display: "block",
                                }}
                                htmlFor="private"
                            >
                                ENTER PASSPHRASE
                            </label>
                            <Input
                                className="import-pk-passphrase"
                                style={{ marginTop: "8px" }}
                                type="password"
                                name="import-pk-passphrase"
                                id="import-pk-passphrase"
                                placeholder="Passphrase"
                                minLength="1"
                            />
                        </div>
                        <span
                            id="passphrase-invalid"
                            className="error"
                            style={{
                                display:
                                    passphraseError === undefined
                                        ? "none"
                                        : "block",
                            }}
                        >
                            <img src={altertR} alt="alert" />
                            {passphraseError}
                        </span>
                        <Button
                            style={{
                                textAlign: "center",
                                width: "119px",
                                display: "block",
                                padding: "9px 6px",
                                margin: "26px auto 10px auto",
                            }}
                            onClick={this.importAccount.bind(this)}
                        >
                            Import
                        </Button>
                        <button
                            className="close"
                            onClick={this.closeModal.bind(this)}
                        >
                            <img src={exit} alt="exit icon close" />
                        </button>
                    </Modal>
                </div>
            </ImportPocketContent>
        );
    }
}

export default withRouter(ImportPocket);
