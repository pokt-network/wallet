import React, {Component} from 'react';
import Wrapper from '../../components/wrapper';
import CreateContent from './create';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import altertR from '../../utils/images/alert-circle-red.png';
import altertT from '../../utils/images/alert-triangle.png';
import { DataSource } from "../../datasource"
import {
    withRouter
} from 'react-router-dom'

class Create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addressHex: undefined,
            publicKeyHex: undefined,
            ppk: undefined,
            validPassphrase: false,
            keyFileDownloaded: false
        }
        // Set up locals
        this.dataSource = DataSource.instance
        // Bind functions
        this.handleCreateAccount = this.handleCreateAccount.bind(this)
        this.handleDownload = this.handleDownload.bind(this)
        this.pushToAccountDetail = this.pushToAccountDetail.bind(this)
        this.toggleError = this.toggleError.bind(this)
        this.handlePassphraseChange = this.handlePassphraseChange.bind(this)
    }

    handlePassphraseChange() {
        const passphrase = document.getElementById("passphrase").value
        const confirmPassphrase = document.getElementById("confirmPassphrase").value
        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")

        if (passphrase && passphrase) {
            if (!passwordRegex.test(passphrase)) {
                this.toggleError(true, "Passphrase must be minimum 15 characters, 1 min uppercase letter and 1 special character.")
            }else if (passphrase !== confirmPassphrase) {
                this.toggleError(true, "Passphrase and Confirm passphrase are not identical")
            }else{
                this.setState({validPassphrase: true})
                this.toggleError(false, "")
            }
        }
    }

    // Handle the download button action
    async handleDownload(e) {
        if (this.state.ppk === undefined) {
            console.log("Can't download if no account was created.")
            return
        }
        const ppkJsonStr = this.state.ppk
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(ppkJsonStr)
        var downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href",     dataStr)
        downloadAnchorNode.setAttribute("download", "keyfile.json")
        document.body.appendChild(downloadAnchorNode) // required for firefox
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
        // Update the state
        this.setState({keyFileDownloaded: true})
        // Remove the class from the account detail button
        const element = document.getElementById("push-to-account")
        element.classList.remove("isDisabled")
    }
    
    toggleError(show, msg) {
        const errorSpan = document.getElementById("passphraseError")
        if (errorSpan) {
            errorSpan.style.display = show === true ? "block" : "none"
            errorSpan.innerText = msg
        }
    }
    pushToAccountDetail() {
        if (!this.state.keyFileDownloaded) {
            this.toggleError(true, "Please download your key file before proceeding")
            return
        }
        // Check the account info before pushing
        if (this.state.addressHex === undefined ||
            this.state.publicKeyHex === undefined ||
            this.state.ppk === undefined) {
            this.toggleError(true, "No account available, please create an account")
            return
        }
        const accountObj = {
            addressHex: this.state.addressHex,
            publicKeyHex: this.state.publicKeyHex,
            ppk: this.state.ppk,
        }
        // Move to the account detail
        this.props.history.push({
            pathname: "/account",
            data: accountObj,
        })
    }
    // Create account function
    async handleCreateAccount() {
        // Retrieve the passphrase value
        const passphrase = document.getElementById("passphrase").value
        const confirmPassphrase = document.getElementById("confirmPassphrase").value
        // Verify the passphrase length
        if (passphrase === confirmPassphrase && this.state.validPassphrase) {
            const account = await this.dataSource.createAccount(passphrase)
            const ppkOrError = await this.dataSource.exportPPKFromAccount(account, passphrase)

            if (this.dataSource.typeGuard(ppkOrError, Error)) {
                console.log(ppkOrError)
                this.toggleError(true, "Failed to create an account")
            }else {
                this.setState({
                    addressHex: account.addressHex,
                    publicKeyHex: account.publicKey.toString("hex"),
                    ppk: ppkOrError,
                })
                // Update the UI elements
                const addressLabel = document.getElementById("address")
                const publicKeyLabel = document.getElementById("publicKey")
                const createAccountButton = document.getElementById("createAccountButton")
                const downloadKeyFileButton = document.getElementById("downloadKeyFile")

                if (addressLabel && publicKeyLabel && createAccountButton && downloadKeyFileButton) {
                    addressLabel.value = this.state.addressHex
                    publicKeyLabel.value = this.state.publicKeyHex

                    createAccountButton.style.display = "none"
                    downloadKeyFileButton.style.display = "inline-block"
                }
                // Scroll to the account information section
                const element = document.querySelector("#top");
                element.scrollIntoView({
                    behavior: 'smooth'
                })
            }
        }else {
            this.toggleError(true, "The passphrase does not fit the requirements")
        }
    }
        // Render
        render () {
            return (
            <CreateContent>
                <Wrapper className="wide-block-wr">
                    <Title>CREATE a pocket account</Title>
                    <div className="passphrase">
                        <h2 id="top" >PROTECT YOUR PRIVATE KEY<br /> WITH a passphrase</h2>
                        <p>Write down a Passphrase to protect your key file. This should have: minimum 15 alphanumeric symbols, one capital letter, one lowercase, one special characters and one number.</p>
                        <form className="pass-form">
                            <div className="cont-input">
                                <Input onChange={this.handlePassphraseChange} type="password" name="passphrase" id="passphrase" placeholder="Passphrase" />
                                <span id="passphraseError" className="error passphrase-error"> <img src={altertR} alt="alert" /></span>
                                <Input style={{marginTop: "30px"}} onChange={this.handlePassphraseChange} type="password" name="confirmPassphrase" id="confirmPassphrase" placeholder="Confirm Passphrase" />
                            </div>
                            <div className="btn-subm">
                                <Button id="createAccountButton" onClick={this.handleCreateAccount} >Create</Button>
                                <Button id="downloadKeyFile" className="download-btn" style={{display: "none", position: "relative", margin: "0px", left: "0px"}} onClick={this.handleDownload} >Download Key File</Button>
                            </div>
                        </form>
                        <a style={{display: "block", marginTop: "26px"}} 
                        href="/import" className="account">Already have an account? Access my Pocket account</a>
                    </div>
                    <div className="alert">
                        <img src={altertT} alt="alert" />
                        <div className="cont-alert">
                            <div className="title">
                                <h3>SAVE YOUR PRIVATE KEY!</h3>
                            </div>
                            <p>
                            You won't be able see it again or change it -- make a back up and store it safely, preferably offline. You’ll need it to access your account again.
                            </p>
                        </div>
                    </div>
                    <div className="container account-info">
                        <div className="cont-input second">
                            <label className="account-info-label" htmlFor="add">ADDRESS</label>
                            <Input style={{ backgroundColor: "#f5f5f5"}} type="text" name="address" id="address" defaultValue={""} disabled />
                        </div>
                        <div className="cont-input">
                            <label className="account-info-label" htmlFor="puk">PUBLIC KEY</label>
                            <Input style={{ backgroundColor: "#f5f5f5"}} type="text" name="public-k" id="publicKey" defaultValue={""} disabled />
                        </div>
                        <div className="btn-subm account-details">
                            
                            <Button id="push-to-account" className="isDisabled" onClick={this.pushToAccountDetail}>Account Details</Button>
                        </div>
                    </div>
                </Wrapper>
            </CreateContent>
        )
    }
}
export default withRouter(Create);