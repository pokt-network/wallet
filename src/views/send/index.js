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
            isModalVisible: false,
            addressHex: undefined,
            publicKeyHex: undefined,
            ppk: undefined,
            visibility: false,
            currentBalance: 0,
            amountToSend: 0
        }
        // Set up locals
        this.dataSource = new DataSource(undefined, [config.baseUrl])
        this.getBalance = this.getBalance.bind(this)
        this.toggleNotBalanceError = this.toggleNotBalanceError.bind(this)
        this.toggleAddressError = this.toggleAddressError.bind(this)
        this.updateAmountValue = this.updateAmountValue.bind(this)
        this.updateDestinationAddress = this.updateDestinationAddress.bind(this)
        this.updateValues = this.updateValues.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.showModal = this.showModal.bind(this)

        this.currentAccount = {
            addressHex: "19c0551853f19ce1b7a4a1ede775c6e3db431b0f"
        }
    }
    showModal() {
        const modal = document.getElementById("popup")
        if (modal) {
            modal.style.display = "block"
        }
    }

    closeModal() {
        const modal = document.getElementById("popup")
        if (modal) {
            modal.style.display = "none"
        }
    }
    // Update
    updateValues() {
        this.updateAmountValue()
        this.updateDestinationAddress()
        this.showModal()
    }
    // Update amount
    updateAmountValue(){
        // Retrieve current amount value set element
        const amountElement = document.getElementById("pokt-amount")
        // Retrieve modal amount value element
        const amountElementText = document.getElementById("modal-amount-to-send")
        // Check if both element exists
        if (amountElement && amountElementText) {
            // Convert the decimals to upokt to use the value for the send-tx
            const value = amountElement.value * 1000000
            // Add the amount to send element value for the modal label
            const valueText = amountElement.value + " POKT"
            // Update the modal amount element value
            amountElementText.innerText = valueText
            // Save the amount in uPOKT to send in the state
            this.setState({amountToSend: value}) 
            console.log("update amount value= "+valueText)
        }
    }
    // Update destination address
    updateDestinationAddress(){
        // Retrieve the current destination address element
        const destinationAddress = document.getElementById("destination-address")
        // Retrieve modal destination adress element
        const destinationModal = document.getElementById("modal-destination-address")
        // Check if both element exists
        if (destinationAddress && destinationModal) {
            // Add the destination address to the modal element
            destinationModal.value = destinationAddress.value
            console.log("update adress value= "+destinationAddress.value)
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
                                    <Button style={{display: "inline-block", marginTop: "20px"}} 
                                        onClick={this.updateValues} className="button" >Send</Button>
                                    <div style={{ display: "none" }} id="popup" className="container popup">
                                        <PopupContent className="modal popup-child">
                                            <a className="close" onClick={this.closeModal}>
                                                <img src={exit} alt="exit icon close"/>
                                            </a>
                                            <h2> Are you sure you want to send from  your Balance: </h2>
                                            <div className="content">
                                                <div style={{display: "inline-flex", marginBottom: "10px"}} className="qty">
                                                    <div id="modal-amount-to-send" className="pokt" disabled>
                                                        0.00 POKT
                                                    </div>
                                                    {/* <div className="usd">
                                                        0,00USD
                                                    </div> */}
                                                </div>
                                                <form className="pass-pk">
                                                    <div className="cont-input">
                                                        <label htmlFor="toadd">To Address</label>
                                                        <Input type="text" name="toaddress" id="modal-destination-address" 
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="btn-subm">
                                                        <Button href="http://example.com">Send</Button>
                                                    </div>
                                                </form>
                                            </div>
                                        </PopupContent>
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