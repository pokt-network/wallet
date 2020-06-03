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
import {RpcError, typeGuard} from "@pokt-network/pocket-js/dist/web.js"

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
        this.toggleNotBalanceError = this.toggleNotBalanceError.bind(this)
        this.toggleAddressError = this.toggleAddressError.bind(this)
        this.updateAmountValue = this.updateAmountValue.bind(this)
        this.updateDestinationAddress = this.updateDestinationAddress.bind(this)
        this.updateValues = this.updateValues.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.showModal = this.showModal.bind(this)
        this.sendTransaction = this.sendTransaction.bind(this)
        this.requestPassphrase = this.requestPassphrase.bind(this)
        this.closePassModal = this.closePassModal.bind(this)
        this.showPassModal = this.showPassModal.bind(this)

        // Set current Account
        this.currentAccount = this.props.location.data
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
    showPassModal() {
        const modal = document.getElementById("popup-passphrase")
        if (modal) {
            modal.style.display = "block"
        }
    }

    closePassModal() {
        const modal = document.getElementById("popup-passphrase")
        if (modal) {
            modal.style.display = "none"
        }
    }
    requestPassphrase() {
        // Show passphrase modal
        this.showPassModal()
    }
    async sendTransaction(){
        const ppk = this.currentAccount.ppk
        const passphrase = document.getElementById("modal-passphrase")
        const destinationAddress = document.getElementById("destination-address")
        if (passphrase && destinationAddress) {
            const txResponse = await this.dataSource.sendTransaction(ppk, passphrase.value, destinationAddress.value)

            if (typeGuard(txResponse, RpcError)) {
                this.closeModal()
                this.closePassModal()
                this.toggleAddressError(true, "Failed to send the transaction")
                console.log(RpcError)
            }else {
                alert(txResponse)
            }
        }
        
    }
    // Update
    updateValues() {
        this.updateAmountValue()
        this.updateDestinationAddress()
    }
    // Update amount
    updateAmountValue(){
        // Retrieve current amount value set element
        const amountElement = document.getElementById("pokt-amount")
        // Retrieve modal amount value element
        const amountElementText = document.getElementById("modal-amount-to-send")
        // Check if both element exists
        if (amountElement && amountElementText) {
            // Validate the address
            if(amountElement.value <= 0) {
                this.toggleAddressError(true, "Amount to send is invalid.")
                return
            }
            // Convert the decimals to upokt to use the value for the send-tx
            const value = amountElement.value * 1000000
            // Add the amount to send element value for the modal label
            const valueText = amountElement.value + " POKT"
            // Update the modal amount element value
            amountElementText.innerText = valueText
            // Save the amount in uPOKT to send in the state
            this.setState({amountToSend: value}) 
            // Show modal
            this.showModal()
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
            // Validate the address
            if(this.dataSource.validateAddress(destinationAddress.value)) {
                // Add the destination address to the modal element
                destinationModal.value = destinationAddress.value
            }else {
                this.toggleAddressError(true, "Address is invalid")
            }
        }
    }
    // Component did mount
    componentDidMount() {

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
                                    <span style={{display: "none"}} id="address-error" className="error"> <img src={altertR} alt="alert" /> Please enter an address</span>
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
                                                        <Button onClick={this.requestPassphrase} >Send</Button>
                                                    </div>
                                                </form>
                                            </div>
                                            <span id="balance-error" style={{ display: "none" }} className="error"> <img src={altertR} alt="alert" /> Not Enough Balance</span>
                                        </PopupContent>
                                    </div>
                                    <div style={{ display: "none" }} id="popup-passphrase" className="container popup">
                                        <PopupContent className="modal popup-child">
                                            <a className="close" onClick={this.closePassModal}>
                                                <img src={exit} alt="exit icon close"/>
                                            </a>
                                            <h2> Enter your passphrase: </h2>
                                            <div className="content">
                                                <form className="passphrase">
                                                    <div className="cont-input">
                                                        <Input type="password" name="passphrase" id="modal-passphrase" 
                                                        />
                                                    </div>
                                                    <div className="btn-subm">
                                                        <Button onClick={this.sendTransaction} >Send</Button>
                                                    </div>
                                                </form>
                                            </div>
                                            <span id="balance-error" style={{ display: "none" }} className="error"> <img src={altertR} alt="alert" /> Not Enough Balance</span>
                                        </PopupContent>
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