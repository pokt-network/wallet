import React, {Component} from 'react';
import Wrapper from '../../components/wrapper';
import ImportContent from './import';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import altertR from '../../utils/images/alert-circle-red.png';
import { DataSource } from "../../datasource"
import Modal, {closeStyle} from 'simple-react-modal'

class Import extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            file: "",
            jsonStr: "",
            show: false,
            isKeyFile: false
        }
        // Set up locals
        this.dataSource = new DataSource(undefined, [new URL("http://localhost:8081")])
        // Bind functions
        this.handleImports = this.handleImports.bind(this)
        this.handleImportKeyFile = this.handleImportKeyFile.bind(this)
        this.handleImportPrivateKey = this.handleImportPrivateKey.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
    }
    // Show Modal
    show(e) {
        // Check if the button is import portable private key or import private key
        if (e.target.id === "import-ppk") {
            this.setState({
                isKeyFile: true,
                show: true
            })
        }else {
            this.setState({
                isKeyFile: false,
                show: true
            })
        }
    }
    closeModal() {
        this.setState({
            show: false
        })
    }

    close() {
        // Set the passphrase to the state or throw error
        const passphraseInput = document.getElementById("import-pk-passphrase")
        const passphrase = passphraseInput.value
        if (passphrase.length > 0) {
            passphraseInput.value = ""
            // Handle imports
            this.handleImports(passphrase)
        }else {
            document.getElementById("passphrase-invalid").style.display = "block"
        }
    }
    // Handle import button and execute upload button action
    handleUpload = async (e) => {
        document.getElementById("upload-button").click()   
    }
    // Read the file and set to the state
    handleChange = async (e) => {
        if (e.target.files.length > 0) {
            const reader = new FileReader()
            const file = e.target.files[0]

            reader.onloadend = () => {
                this.setState({
                    file: file,
                    jsonStr: reader.result
                })                
            }
            reader.readAsText(file)
        }
    }
    // Handles which import was clicked on and execute the proper function call
    handleImports = async (passphrase) => {
        if (this.state.isKeyFile === true) {
            this.handleImportKeyFile(passphrase)
        }else {
            this.handleImportPrivateKey(passphrase)
        }
    }
    // Import an account using a key file
    handleImportKeyFile = async (passphrase) => {
        try {
            const jsonStr = this.state.jsonStr
            // Clean some variables from the state
            this.setState({jsonStr: ""})
            // Import the PPK
            const account = await this.dataSource.importPortablePrivateKey(passphrase, jsonStr, passphrase)
            if (account === undefined) {
                const errorMessage = document.getElementById("error-message-pk-import")
                errorMessage.style.display = "block"
                errorMessage.innerText = "Failed to validate the portable private key"

            }else {
                const accountObj = {
                    addressHex: account.addressHex,
                    publicKeyHex: account.publicKey.toString("hex"),
                    ppk: jsonStr
                }
                // Set current account and push
                this.props.history.push({
                    pathname: '/createprivatekey',
                    data: accountObj
                })
            }
        } catch (error) {
            const errorMessage = document.getElementById("ppk-passphrase-error")
            errorMessage.style.display = "block"
            errorMessage.innerText = "Invalid Private Key"
        }
    }
    // Import an account using a raw private key
    handleImportPrivateKey = async (passphrase) => {
        try {
            const errorMessage = document.getElementById("passphrase-invalid")
            const privateKey = document.getElementById("privateKey").value

            if (this.dataSource.validatePrivateKey(privateKey) && passphrase.length > 0) {
                const account = await this.dataSource.importAccount(privateKey, passphrase)
                const ppk = await this.dataSource.exportPPK(privateKey, passphrase)
        
                const accountObj = {
                    addressHex: account.addressHex,
                    publicKeyHex: account.publicKey.toString("hex"),
                    ppk: ppk
                }
                // Set current account and push to createprivatekey view
                this.props.history.push({
                    pathname: '/createprivatekey',
                    data: accountObj
                })
            }else {
                errorMessage.style.display = "block"
                errorMessage.innerText = "Invalid Private Key or passphrase format"
            }
        } catch (error) {
            const errorMessage = document.getElementById("passphrase-invalid")
            errorMessage.style.display = "block"
            errorMessage.innerText = "Failed to import account, please verify the private key or passphrase"
        }
    }
    // Render
    render () {
        return (
            <ImportContent>
                <Wrapper className="wide-block-wr">
                    <Title>Import a pocket account</Title>
                    <div className="keys first">
                        <form className="keys-form">
                            <div className="cont-input"> 
                                <div className="btn-subm">
                                <input type="file" id="upload-button" style={{ display: "none" }} onChange={this.handleChange}/>
                                    <label className= "keyfile-label" htmlFor="keyfile">KEY FILE</label>
                                    <Button id="upload" dark onClick={this.handleUpload}>Upload</Button>
                                </div>
                                <span id="error-message-ppk-import" className="error ppk-error"> <img src={altertR} alt="alert" />Incorrect file</span>
                            </div>
                            <div className="cont-input">
                                <div className="btn-subm">
                                    <Button id="import-ppk" onClick={this.show.bind(this)}>Import</Button>
                                </div>
                            </div>
                        </form>
                        <a href="/create" className="account">Don’t have an account? Create a Pocket account</a>
                    </div>
                    <div className="keys second">
                        <form className="private-key">
                            <div className="cont-input">
                                <label htmlFor="private">Private Key</label>
                                <Input type="password" name="priv" id="privateKey" placeholder="•••••••••••••••••" />
                                <span id="error-message-pk-import" className="error ppk-error" style={{display: "none"}}> <img src={altertR} alt="alert" />Incorrect Passphrase</span>
                                <div className="btn-subm">
                                    <Button id="import-private-key" onClick={this.show.bind(this)}>Import</Button>
                                </div>
                            </div>
                        </form>
                    </div>

                </Wrapper>
                <div>
                    <Button style={{display: 'none'}} id="open-modal" onClick={this.show.bind(this)}></Button>
                    <Modal
                        
                        style={{background: 'rgba(0, 0, 0, 0.5)'}} //overwrites the default background
                        containerStyle={{
                            background: 'white',
                            boxShadow: "0 43px 39px -40px rgba(0,0,0,0.5)",
                            borderRadius: "12px"
                        }} //changes styling on the inner content area
                        containerClassName="pocket-modal"
                        closeOnOuterClick={true}
                        show={this.state.show}
                        onClose={this.close.bind(this)}>

                        <div className="cont-input">
                            <label style={{maginTop: '10px'}} htmlFor="private">Passphrase</label>
                            <Input style={{maginTop: '10px'}} type="password" name="import-pk-passphrase" id="import-pk-passphrase" placeholder="•••••••••••••••••" />
                        </div>
                        <span id="passphrase-invalid" className="error" style={{display: "none"}}> <img src={altertR} alt="alert" />Incorrect Passphrase</span>
                        <Button style={{"padding": "9px 29px 8px 24px", "width": "10px", "display": "block"}} 
                            onClick={this.close.bind(this)}>OK</Button>
                        <a style={closeStyle} onClick={this.closeModal.bind(this)}>X</a>
                    </Modal>
                </div>
            </ImportContent>
        );
    }
}
export default Import;