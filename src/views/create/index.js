import React, {Component} from 'react';
import Wrapper from '../../components/wrapper';
import CreateContent from './create';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import altertR from '../../utils/images/alert-circle-red.png';
import altertT from '../../utils/images/alert-triangle.png';
import copy from '../../utils/images/copy.png';
import {
    withRouter
} from 'react-router-dom';
import PocketService from "../../core/services/pocket-service";
import {DataSource} from "../../datasource/datasource";

const dataSource = new DataSource();

class Create extends Component {
    constructor() {
        super();
        // Set up defaults
        this.state = {
            addressHex: "",
            publicKeyHex: "",
            ppk: "",
            validPassphrase: false,
            keyFileDownloaded: false,
            createBtnEnabled: true,
            downloadKeyFileBtnEnabled: false,
            errorLabel: {show: false, message: undefined},
            pushToAccountDetail: false
        };

        // Bind functions
        this.handleCreateAccount = this.handleCreateAccount.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.pushToAccountDetail = this.pushToAccountDetail.bind(this);
        this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
        this.copyAddress = this.copyAddress.bind(this);
        this.copyPublicKey = this.copyPublicKey.bind(this);
    }

    copyAddress(){
        const address = document.getElementById("address")
        if (address) {
            address.select();
            address.setSelectionRange(0, 99999); /*For mobile devices*/

            document.execCommand("copy");
            console.log("Copied the text "+ address.value)
        }
    }

    copyPublicKey(){
        const publicKey = document.getElementById("publicKey")
        if (publicKey) {
            publicKey.select();
            publicKey.setSelectionRange(0, 99999); /*For mobile devices*/

            document.execCommand("copy");
            console.log("Copied the text "+ publicKey.value);
        }
    }

    handlePassphraseChange() {
        const passphrase = document.getElementById("passphrase").value;
        const confirmPassphrase = document.getElementById("confirmPassphrase").value;
        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

        if (passphrase && passphrase) {
            if (!passwordRegex.test(passphrase)) {
                this.setState({
                    errorLabel: {show: true, message: "Passphrase must be minimum 15 characters, 1 min uppercase letter and 1 special character."}
                });
            } else if (passphrase !== confirmPassphrase) {
                this.setState({
                    errorLabel: {show: true, message: "Passphrase and Confirm passphrase are not identical."}
                });
            } else {
                this.setState({
                    errorLabel: {show: false, message: undefined},
                    validPassphrase: true
                });
            }
        }
    }

    // Handle the download button action
    async handleDownload() {

        const {ppk} = this.state;

        if (ppk === undefined) {
            this.setState({
                errorLabel: {show: true, message: "Can't download if no account was created."}
            });
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(ppk);
        const downloadAnchorNode = document.createElement('a');

        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "keyfile.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        // Update the state
        this.setState({
            pushToAccountDetail: true, 
            keyFileDownloaded: true
        })
    }
    
    pushToAccountDetail() {
        const {keyFileDownloaded, addressHex, publicKeyHex, ppk} = this.state;

        // Check if the key file was downloaded
        if (!keyFileDownloaded) {
            this.setState({
                errorLabel: {show: true, message: "Please download your key file before proceeding."}
            });

            return;
        }

        // Check the account info before pushing
        if (addressHex.length === 0 ||
            publicKeyHex.length === 0 ||
            ppk.length === 0
            ) {

            this.toggleError(true, "No account available, please create an account");
            
            return;
        }

        // Move to the account detail
        this.props.history.push({
            pathname: "/account"
        })
    }
    // Create account function
    async handleCreateAccount() {
        // Retrieve the passphrase value
        const passphrase = document.getElementById("passphrase").value;
        const confirmPassphrase = document.getElementById("confirmPassphrase").value;

        // Verify the passphrase length
        if (passphrase === confirmPassphrase && this.state.validPassphrase) {
            const account = await dataSource.createAccount(passphrase);
            const ppkOrError = await dataSource.exportPPKFromAccount(account, passphrase);

            if (dataSource.typeGuard(ppkOrError, Error)) {
                // Log and show error message
                console.log(ppkOrError);

                this.setState({
                    errorLabel: {show: true, message: "Failed to create an account"}
                });
            }else {
                // Save the account information in the state
                this.setState({
                    addressHex: account.addressHex,
                    publicKeyHex: account.publicKey.toString("hex"),
                    ppk: ppkOrError.toString(),
                    createBtnEnabled: false,
                    downloadKeyFileBtnEnabled: true
                })

                // Save the user account information
                PocketService.saveUserInCache(account.addressHex, account.publicKey.toString("hex"), ppkOrError.toString());
                
                // Scroll to the account information section
                const element = document.querySelector("#top");
                element.scrollIntoView({
                    behavior: 'smooth'
                })
            }
        }else {
            this.setState({
                errorLabel: {show: true, message: "The passphrase does not fit the requirements"}
            });
        }
    }
        // Render
        render () {
            const {
                addressHex, 
                publicKeyHex, 
                errorLabel,
                createBtnEnabled, 
                downloadKeyFileBtnEnabled,
                pushToAccountDetail
            } = this.state;

            return (
            <CreateContent>
                <Wrapper className="wide-block-wr">
                    <Title>CREATE a pocket account</Title>
                    <div className="passphrase">
                        <h2 id="top" >PROTECT YOUR POCKET ACCOUNT<br /> WITH a passphrase</h2>
                        <p>Write down a Passphrase to protect your key file. This should have: minimum 15 alphanumeric symbols, one capital letter, one lowercase, one special characters and one number.</p>
                        <form className="pass-form">
                            <div className="cont-input">
                                <Input onChange={this.handlePassphraseChange} type="password" name="passphrase" id="passphrase" placeholder="Passphrase" />
                                <span style={{
                                    display: `${errorLabel.show === true ? "block" : "none"}`
                                }} id="passphraseError" className="error passphrase-error"> <img src={altertR} alt="alert" />{errorLabel.message}</span>
                                <Input style={{marginTop: "30px"}} onChange={this.handlePassphraseChange} type="password" name="confirmPassphrase" id="confirmPassphrase" placeholder="Confirm Passphrase" />
                            </div>
                            <div className="btn-subm">
                                <Button style={{
                                    display: `${createBtnEnabled === true ? "inline-block" : "none"}`
                                }} id="createAccountButton" onClick={this.handleCreateAccount} >Create</Button>
                                <Button style={{
                                    display: `${downloadKeyFileBtnEnabled === true ? "inline-block" : "none"}`,
                                    position: "relative", 
                                    margin: "0px", 
                                    left: "0px"
                                }} id="downloadKeyFile" className="download-btn" onClick={this.handleDownload} >Download Key File</Button>
                            </div>
                        </form>
                        <a style={{display: "block", marginTop: "26px"}} 
                        href="/import" className="account">Already have an account? Access my Pocket account</a>
                    </div>
                    <div className="alert">
                        <img src={altertT} alt="alert" />
                        <div className="cont-alert">
                            <div className="title">
                                <h3>DOWNLOAD YOUR KEYSTORE FILE!</h3>
                            </div>
                            <p>
                            You won't be able see it again or change it; make a back up and store it safely, preferably offline. You’ll need it to access your account again.
                            </p>
                        </div>
                    </div>
                    <div className="container account-info">
                        <div className="cont-input second">
                            <label className="account-info-label" htmlFor="add">ADDRESS</label>
                            <Input style={{ backgroundColor: "#f5f5f5", height: "20px"}} type="text" name="address" id="address" defaultValue={addressHex} readOnly={true} />
                            <span className="copy-button" onClick={this.copyAddress}> <img src={copy} alt="copy" /></span>
                        </div>
                        <div className="cont-input">
                            <label style={{height: "20px"}} className="account-info-label" htmlFor="puk">PUBLIC KEY</label>
                            <Input style={{ backgroundColor: "#f5f5f5", height: "20px"}} type="text" name="public-k" id="publicKey" defaultValue={publicKeyHex} readOnly={true} />
                            <span className="copy-button" onClick={this.copyPublicKey}> <img src={copy} alt="copy" /></span>
                        </div>
                        <div className="btn-subm account-details">
                            <Button 
                            style={{
                                display: `${pushToAccountDetail === true ? "inline-block" : "none"}`
                            }}
                            id="push-to-account" className={pushToAccountDetail === true ? "" : "isDisabled"} onClick={this.pushToAccountDetail}>Account Details</Button>
                        </div>
                    </div>
                </Wrapper>
            </CreateContent>
        )
    }
}
export default withRouter(Create);