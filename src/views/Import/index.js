import {React, Component} from 'react';
import Wrapper from '../../components/wrapper';
import ImportContent from './import';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import altertR from '../../utils/images/alert-circle-red.png';
import { DataSource } from "../../datasource"

class Import extends Component {
    constructor(props) {
        super(props)
        // Set up locals
        this.dataSource = new DataSource(undefined, [new URL("http://localhost:8081")])
        // Bind functions
        this.handleImportAccount = this.handleImportAccount.bind(this)
    }
    // Create account function
    handleImportAccount = async () => {
        // Verify the passphrase length
        // if (passphrase.length > 1) {
        //     const account = await this.dataSource.createAccount(passphrase)
        //     const accountObj = {
        //         addressHex: account.addressHex,
        //         publicKeyHex: account.publicKey.toString("hex"),
        //         encryptedPrivateKeyHex: account.encryptedPrivateKeyHex
        //     }
        //     // Set current account and push to createprivatekey view
        //     this.props.history.push({
        //         pathname: '/createprivatekey',
        //         data: accountObj
        //       })
            
        //     // Go to create private key
        //     // window.location = `/createprivatekey`
        // }else{
        //     alert("passphrase is too short")
        // }
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
                                <label htmlFor="keyfile">KEY FILE</label>
                                <Input type="text" name="keyf" id="keyfile" placeholder="Upload your Key File" />
                                <span className="error"> <img src={altertR} alt="alert" />Incorrect file</span>
                                <div className="btn-subm">
                                    <Button dark href="http://example.com">Upload</Button>
                                </div>
                            </div>
                            <div className="cont-input">
                                <label htmlFor="passp">Passphrase</label>
                                <Input type="password" name="passphrase" id="passp" placeholder="•••••••••••••••••" />
                                <span className="error"> <img src={altertR} alt="alert" />Incorrect Passphrase</span>
                                <div className="btn-subm">
                                    <Button href="http://example.com">Import</Button>
                                </div>
                            </div>
                        </form>
                        <a href="http://example.com" className="account">Don’t have an account? Create a Pocket account</a>
                    </div>
                    <div className="keys second">
                        <form className="private-key">
                            <div className="cont-input">
                                <label htmlFor="private">Private Key</label>
                                <Input type="password" name="priv" id="private" placeholder="•••••••••••••••••" />
                                <span className="error"> <img src={altertR} alt="alert" />Incorrect Private Key</span>
                                <div className="btn-subm">
                                    <Button href="http://example.com">Import</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Wrapper>
            </ImportContent>
        );
    }
}
export default Import;