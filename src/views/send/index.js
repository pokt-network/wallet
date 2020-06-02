import React, {Component} from 'react';
import Wrapper from '../../components/wrapper';
import SendContent from './send';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import Popup from "reactjs-popup";
import Button from '../../components/public/button/button';
import exit from '../../utils/images/exit.png';
import PopupContent from './popup-content';
import altertR from '../../utils/images/alert-circle-red.png';
import { DataSource } from "../../datasource"
import base from "../../config/config.json"
//
const config = base
//
class Send extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addressHex: undefined,
            publicKeyHex: undefined,
            ppk: undefined,
            visibility: false,
            currentBalance: 0,
            amountToSend: 0,
            amountToSendLabel: "0.00",
            destinationAddress: ""
        }
        // Set up locals
        this.dataSource = new DataSource(undefined, [config.baseUrl])
        this.getBalance = this.getBalance.bind(this)
        this.toggleNotBalanceError = this.toggleNotBalanceError.bind(this)
        this.toggleAddressError = this.toggleAddressError.bind(this)
        this.updateAmountValue = this.updateAmountValue.bind(this)
        this.updateDestinationAddress = this.updateDestinationAddress.bind(this)
        this.updateValues = this.updateValues.bind(this)
        this.currentAccount = {
            addressHex: "19c0551853f19ce1b7a4a1ede775c6e3db431b0f"
        }
    }
    // Update
    updateValues() {
        setTimeout(this.updateAmountValue(), 2000)
        setTimeout(this.updateDestinationAddress(), 2000)
    }
    // Update amount
    updateAmountValue(){
        const amountElement = document.getElementById("pokt-amount")
        const amountElementText = document.getElementById("modal-amount-to-send")

        if (amountElement && amountElementText) {
            const value = amountElement.value * 1000000
            const valueText = amountElement.value + " POKT"
            this.setState({amountToSend: value, amountToSendLabel: valueText}) 
        }
        
    }
    // Update destination address
    updateDestinationAddress(){
        const destinationAddress = document.getElementById("destination-address")
        const destinationAddressLabel = document.getElementById("modal-destination-adress")

        if (destinationAddress && destinationAddressLabel) {
            destinationAddressLabel.value = destinationAddress.value
            this.setState({destinationAddress: destinationAddress.value}) 
        }
    }
    // Component did mount
    componentDidMount() {
        this.getBalance();
    }
    toggleNotBalanceError(show, msg) {
        const errorSpan = document.getElementById("balance-error")
        if (errorSpan) {
            errorSpan.style.display = show === true ? "block" : "none"
            errorSpan.innerText = msg
        }
    }
    toggleAddressError(show, msg) {
        const errorSpan = document.getElementById("address-error")
        if (errorSpan) {
            errorSpan.style.display = show === true ? "block" : "none"
            errorSpan.innerText = msg
        }
    }
    // Retrieves the account balance
    async getBalance() {
        const balance = await this.dataSource.getBalance(this.currentAccount.addressHex)
        // Update the state with the account balance
        this.setState({currentBalance: balance})
    }
    // Render
    render() {
        // Check if current account is set
        if (this.currentAccount === undefined) {
            // Redirect to the home page
            this.props.history.push({
                pathname: '/'
            })
            return null
        }
        return (
                <SendContent>
                    <Wrapper className="wide-block-wr">
                        <Title>Send Transaction</Title>
                        <div className="quantity">
                            <form className="quantity-form">
                                <div className="row">
                                    <div className="container">
                                        <input style={{color: "black"}} type="number" name="quantity" step="0.01" id="pokt-amount" placeholder="0.00" />
                                        <label htmlFor="pokt">POKT</label>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="container">
                                        <input type="number" name="quantity" id="usd" placeholder="0,00" />
                                        <label htmlFor="usd">USD</label>
                                    </div>
                                </div> */}
                            </form>
                            <div className="send-form">
                                <div className="container">
                                    <label htmlFor="adrs">To address</label>
                                    <Input type="text" name="address" id="destination-address" placeholder="Pocket account address" />
                                    <span id="address-error" className="error"> <img src={altertR} alt="alert" /> Please enter an address</span>
                                    <label>TX Fee 100,000 uPOKT</label>
                                    <div className="btn-subm">
                                    <Popup onOpen={() => {
                                        setTimeout(this.updateValues(), 2000)
                                        }} trigger={<Button className="button" >Send</Button>} modal>
                                        {close => (
                                        <PopupContent className="modal">
                                            <a className="close" onClick={close}>
                                                <img src={exit} alt="exit icon close"/>
                                            </a>
                                            <h2> Are you sure you want to send from  your Balance: </h2>
                                            <div className="content">
                                                <div className="qty">
                                                    <div id="modal-amount-to-send" className="pokt" disabled>
                                                        {this.state.amountToSendLabel | "0.00 POKT"}
                                                    </div>
                                                    {/* <div className="usd">
                                                        0,00USD
                                                    </div> */}
                                                </div>
                                                <form className="pass-pk">
                                                    <div className="cont-input">
                                                        <label htmlFor="toadd">To Address</label>
                                                        <Input type="text" name="toaddress" id="modal-destination-address" 
                                                            value={this.state.destinationAddress || ""} disabled
                                                        />
                                                    </div>
                                                    <div className="btn-subm">
                                                        <Button href="http://example.com">Send</Button>
                                                    </div>
                                                </form>
                                            </div>
                                        </PopupContent>
                                        )}
                                    </Popup>
                                        <span id="balance-error" style={{ display: "none" }} className="error"> <img src={altertR} alt="alert" /> Not Enough Balance</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Wrapper>
                </SendContent>
        );
    }
}

export default Send;