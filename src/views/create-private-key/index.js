import React, {Component} from 'react'
import Wrapper from '../../components/wrapper'
import CreatePrivateKeyContent from './create-private-key'
import Input from '../../components/public/input/input'
import Button from '../../components/public/button/button'
import altertT from '../../utils/images/alert-triangle.png'
import reload from '../../utils/images/reload.png' 
import increase from '../../utils/images/increase.png'
import { DataSource } from "../../datasource"

class CreatePrivateKey extends Component {
    
        constructor(props) {
            super(props)
            
            // Bind functions
            this.getBalance = this.getBalance.bind(this)
            this.handleDownload = this.handleDownload.bind(this)
            // Set current Account
            this.currentAccount = this.props.location.data
        }
        // Handle the download button action
            handleDownload = async (e) => {
                document.getElementById("upload-button").click()   
        }
        // Retrieves the account balance
        getBalance = async (address) => {
            const balance = await this.dataSource.getBalance(address)
            // Update balance value
            document.getElementById('balance').innerText = balance + " POKT"
        }

        render () {
        // Check if current account is set
        if (this.currentAccount !== undefined) {
            // Call getBalance
            this.getBalance(this.currentAccount.addressHex)
        }else {
            // Redirect to the home page
            this.props.history.push({
                pathname: '/'
            })
            return null
        }
        
        return (
            <CreatePrivateKeyContent>
                <Wrapper className="wide-block-wr">
                    <div className="quantitypokt">
                        <div className="container">
                            <h1 id="balance">0.00 POKT</h1>
                            <div className="stats">
                                <div className="stat">
                                    <img src={increase} alt="alert" />
                                    <span>23,87% </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="pass-pk">
                        <div className="container">
                            <div className="cont-input">
                                <label htmlFor="prk">PRIVATE KEY</label>
                                <Input type="password" name="privateKey" id="prk" defaultValue={this.currentAccount.encryptedPrivateKeyHex || ""} />
                                <Button className="download-btn" onClick={this.handleDownload} >Download</Button>
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
                            <div className="cont-input second">
                                <label htmlFor="add">Address</label>
                                <Input type="text" name="address" id="add" defaultValue={this.currentAccount.addressHex || ""} disabled />
                            </div>
                            <div className="cont-input">
                                <label htmlFor="puk">Public Key</label>
                                <Input type="text" name="public-k" id="puk" defaultValue={this.currentAccount.publicKeyHex || ""} disabled />
                            </div>
                            <div className="btn-subm">
                                <Button href="http://example.com">Account Details</Button>
                            </div>
                        </div>
                    </form>
                </Wrapper>
            </CreatePrivateKeyContent>
        )
    }
}
export default CreatePrivateKey
