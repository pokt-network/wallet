import React, {Component} from 'react';
import Wrapper from '../../components/wrapper';
import CreateContent from './create';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import altertR from '../../utils/images/alert-circle-red.png';
import altertT from '../../utils/images/alert-triangle.png';
import { DataSource } from "../../datasource"

class Create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addressHex: undefined,
            publicKeyHex: undefined,
            ppk: undefined,
        }
        // Set up locals
        this.dataSource = new DataSource(undefined, [new URL("http://localhost:8081")])
        // Bind functions
        this.handleCreateAccount = this.handleCreateAccount.bind(this)
        this.handleDownload = this.handleDownload.bind(this)
        this.pushToAccountDetail = this.pushToAccountDetail.bind(this)
        this.toggleError = this.toggleError.bind(this)
    }

    // Handle the download button action
    async handleDownload(e) {
        if (this.state.ppk === undefined) {
            console.log("Can't download if no account was created.")
            return
        }
        const ppkJsonStr = this.state.ppk
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(ppkJsonStr);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "keyfile.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();   
    }
    
    toggleError(show, msg) {
        const errorSpan = document.getElementById("error-label")
        if (errorSpan) {
            errorSpan.style.display = show === true ? "block" : "none"
            errorSpan.innerText = msg
        }
    }
    pushToAccountDetail() {
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
        const passphrase = document.getElementById('passp').value
        // Verify the passphrase length
        if (passphrase.length > 0) {
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
                // Update the address and public key values
                document.getElementById("address").value = this.state.addressHex
                document.getElementById("pub-key").value = this.state.publicKeyHex

                // Scroll to the account information section
                var element = document.querySelector("#address");
                element.scrollIntoView();
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
                        <h2>PROTECT YOUR PRIVATE KEY<br /> WITH a passphrase</h2>
                        <p>Write down a Passphrase to protect your key file. This should have: minimun 15 alphanumeric symbols, one capital letter, one lowercase, one special characters and one number.</p>
                        <form className="pass-form">
                            <div className="cont-input">
                                <Input type="password" name="passphrase" id="passp" placeholder="•••••••••••••••••" />
                                <span id="error-label" className="error passphrase-error"> <img src={altertR} alt="alert" /></span>
                            </div>
                            <div className="btn-subm">
                                <Button onClick={this.handleCreateAccount} >Create</Button>
                            </div>
                        </form>
                        <div style={{display: "inline", maxWidth: "500px"}} className="cont-input">
                            <label style={{fontWeight: "bold"}} htmlFor="prk">PRIVATE KEY</label>
                            <Button className="download-btn" onClick={this.handleDownload} >Download Key File</Button>
                        </div>
                        <a style={{display: "block", marginTop: "26px"}} 
                        href="/import" className="account">Already have an account? Access my Pocket account</a>
                    </div>
                    <div className="alert">
                        <img src={altertT} alt="alert" />
                        <div className="cont-alert">
                            <div className="title">
                                <h3>STORE SAVE YOUR PRIVATE KEY!</h3>
                            </div>
                            <p>
                            You wont be able see it again or change it, make a back up, store it save  preferably offline. You’ll need it to acces your account again.
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
                            <Input style={{ backgroundColor: "#f5f5f5"}} type="text" name="public-k" id="pub-key" defaultValue={""} disabled />
                        </div>
                        <div className="btn-subm account-details">
                            
                            <Button onClick={this.pushToAccountDetail}>Account Details</Button>
                        </div>
                    </div>
                </Wrapper>
            </CreateContent>
        );
    }
}
export default Create;