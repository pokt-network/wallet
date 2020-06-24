import React, {Component} from 'react';
import Wrapper from '../../components/wrapper';
import SendContent from './send';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import exit from '../../utils/images/exit.png';
import PopupContent from './popup-content';
import altertR from '../../utils/images/alert-circle-red.png';
import { DataSource } from "../../datasource"
import Config from "../../config/config.json"
import {
    withRouter
} from 'react-router-dom'

class Send extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            fromAddressHex: undefined,
            destinationAdressHex: undefined,
            publicKeyHex: undefined,
            ppk: undefined,
            visibility: false,
            amountToSend: 0,
            isAmountValid: false,
            isAddressValid: false,
            txFee: Config.txFee
        }
        // Set up locals
        this.dataSource = DataSource.instance

        this.toggleNotBalanceError = this.toggleNotBalanceError.bind(this)
        this.toggleAddressError = this.toggleAddressError.bind(this)
        this.toggleAmountError = this.toggleAmountError.bind(this)
        this.updateAmountValue = this.updateAmountValue.bind(this)
        this.updateDestinationAddress = this.updateDestinationAddress.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.showModal = this.showModal.bind(this)
        this.sendTransaction = this.sendTransaction.bind(this)
        this.requestPassphrase = this.requestPassphrase.bind(this)
        this.closePassModal = this.closePassModal.bind(this)
        this.showPassModal = this.showPassModal.bind(this)
        this.finishSendTransaction = this.finishSendTransaction.bind(this)
        this.pushToTxDetail = this.pushToTxDetail.bind(this)
        this.updateValues = this.updateValues.bind(this)
        this.backToAccountDetail = this.backToAccountDetail.bind(this)
        this.handlePoktValueChange = this.handlePoktValueChange.bind(this)
        this.handleUsdValueChange = this.handleUsdValueChange.bind(this)
        // Set current Account
        this.currentAccount = this.props.location.data
    }
    showModal() {
        const modal = document.getElementById("popup")
        if (modal && this.state.isAmountValid && this.state.isAddressValid) {
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
            document.getElementById("sendButton").disabled = false
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
        // Disable the send button
        document.getElementById("sendButton").disabled = true
        const ppk = this.currentAccount.ppk
        const passphrase = document.getElementById("modal-passphrase")
        const destinationAddress = document.getElementById("destination-address")
        const amountToSend = this.state.amountToSend
        
        if (passphrase && destinationAddress && ppk && amountToSend > 0) {
            // Update the state values for the addresses
            this.setState({
                fromAddressHex: this.currentAccount.addressHex, 
                destinationAdressHex: destinationAddress.value
            })

            const txResponse = await this.dataSource.sendTransaction(
                ppk,
                passphrase.value,
                destinationAddress.value,
                amountToSend
            )
            this.finishSendTransaction()
            if (txResponse === undefined) {
                this.toggleAddressError(true, "Failed to send the transaction, please check the information.")
                console.log(txResponse)
            }else {
                const accountObj = {
                    addressHex: this.currentAccount.addressHex,
                    publicKeyHex: this.currentAccount.publicKeyHex,
                    ppk: this.currentAccount.ppk,
                }
                const tx = {
                    sentAmount: amountToSend,
                    txHash: txResponse.hash,
                    txFee: this.state.txFee / 1000000,
                    fromAddress: this.state.fromAddressHex,
                    toAddress: this.state.destinationAdressHex,
                    status: "Pending",
                    sentStatus: "Sending"
                }
                const obj = {
                    tx: tx,
                    txHash: undefined,
                    account: accountObj
                }

                this.pushToTxDetail(obj)
            }
        }
    }
    backToAccountDetail() {
        if (this.currentAccount !== undefined) {
            const accountObj = {
                addressHex: this.currentAccount.addressHex,
                publicKeyHex: this.currentAccount.publicKeyHex,
                ppk: this.currentAccount.ppk,
            }
            // Move to the transaction detail
            this.props.history.push({
                pathname: "/account",
                data: accountObj,
            })
        }else {
            console.log("No account vailable.")
        }
    }
    pushToTxDetail(tx) {
        // Check the tx information before pushing
        if (!tx) {
            this.toggleError(true, "No transaction detail available.")
            return
        }
        // Move to the transaction detail
        this.props.history.push({
            pathname: "/transaction-detail",
            data: tx,
        })
    }
    // Close and clean after sending a transaction
    finishSendTransaction() {
        this.setState({amountToSend: 0})
        document.getElementById("pokt-amount").value = 0.00
        document.getElementById("modal-passphrase").value = ""
        document.getElementById("destination-address").value = ""
        this.closeModal()
        this.closePassModal()
    }
    updateValues(){
        this.updateAmountValue()
        this.updateDestinationAddress()
    }
    handlePoktValueChange(){
        // Retrieve current amount value set element
        const amountElement = document.getElementById("pokt-amount")
        // Retrieve modal amount value element
        const amountElementText = document.getElementById("modal-amount-to-send")
        // Check
        if (amountElement && amountElementText) {
            if(amountElement.value <= 0 || amountElement.value === "") {
                this.toggleAmountError(true, "Amount to send is invalid.")
                this.setState({isAmountValid: false})
                return
            }
            // Update the USD value element
            const usdAmountElement = document.getElementById("pokt-amount-usd")
            const usdAmountElementText = document.getElementById("modal-usd-amount-to-send")
            // Check
            if (usdAmountElement && usdAmountElementText) {
                // Convert the decimals to upokt to use the value for the send-tx
                const value = amountElement.value * 1000000
                // Add the amount to send element value for the modal label
                const valueText = amountElement.value + " POKT"
                // Update the modal amount element value
                amountElementText.innerText = valueText
                // Update the usd amount elements too
                const usdValue = Config.poktUsdValue * amountElement.value
                usdAmountElement.value = usdValue.toFixed(2)
                usdAmountElementText.innerText = usdAmountElement.value + " USD"
                // Save the amount in uPOKT to send in the state
                this.setState({amountToSend: Math.round(value), isAmountValid: true})
                this.toggleAmountError(false, "")
            }
        }
    }
    handleUsdValueChange(){
        // Retrieve current amount value set element
        const usdAmountElement = document.getElementById("pokt-amount-usd")
        // Retrieve modal amount value element
        const usdAmountElementText = document.getElementById("modal-usd-amount-to-send")
        // Check
        if (usdAmountElement && usdAmountElementText) {
            if(usdAmountElement.value <= 0 || usdAmountElementText.value === "") {
                this.toggleAmountError(true, "Amount to send is invalid.")
                this.setState({isAmountValid: false})
                return
            }
            // Update the POKT value element
            const amountElement = document.getElementById("pokt-amount")
            const amountElementText = document.getElementById("modal-amount-to-send")
            // Check
            if (amountElement && amountElementText) {
                // Convert the decimals to upokt to use the value for the send-tx
                const value = usdAmountElement.value / Config.poktUsdValue
                // Add the amount to send element value for the modal label
                const valueText = usdAmountElement.value + " USD"
                // Update the modal amount element value
                usdAmountElementText.innerText = valueText
                // Update the pokt amount elements too
                const poktValue = value * 1000000
                amountElement.value = value.toFixed(2)
                amountElementText.innerText = amountElement.value + " POKT"
                // Save the amount in uPOKT to send in the state
                this.setState({amountToSend: Math.round(poktValue), isAmountValid: true})
                this.toggleAmountError(false, "")
            }
        }
    }
    // Update amount
    updateAmountValue(){
        // Retrieve current amount value set elements
        const amountElement = document.getElementById("pokt-amount")
        const usdAmountElement = document.getElementById("pokt-amount-usd")
        
        // Retrieve modal amount value elements
        const amountElementText = document.getElementById("modal-amount-to-send")
        const usdAmountElementText = document.getElementById("modal-usd-amount-to-send")
        // Check if both element exists
        if (amountElement && amountElementText && usdAmountElement && usdAmountElementText) {
            // Validate the address
            if(amountElement.value <= 0 || amountElement.value === "") {
                this.toggleAmountError(true, "Amount to send is invalid.")
                this.setState({isAmountValid: false})
                return
            }
            // Convert the decimals to upokt to use the value for the send-tx
            const value = amountElement.value * 1000000
            // Add the amount to send element value for the modal label
            const valueText = amountElement.value + " POKT"
            // Update the modal amount element value
            amountElementText.innerText = valueText
            // Save the amount in uPOKT to send in the state
            this.setState({amountToSend: value, isAmountValid: true})
            this.toggleAmountError(false, "Amount to send is invalid.")
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
                this.setState({isAddressValid: true})
                this.toggleAddressError(false, "Address is invalid")
            }else {
                this.toggleAddressError(true, "Address is invalid")
                this.setState({isAddressValid: false})
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
    toggleAmountError(show, msg) {
        const errorSpan = document.getElementById("amount-error")
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
                                        <input style={{color: "black"}} onChange={this.handlePoktValueChange} type="number" name="quantity" step="0.01" id="pokt-amount" placeholder="0.00" />
                                        <label htmlFor="pokt">POKT</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="container">
                                        <input onChange={this.handleUsdValueChange} type="number" name="quantity" id="pokt-amount-usd" placeholder="0.00" />
                                        <label htmlFor="usd">USD</label>
                                    </div>
                                </div>
                            </form>
                            <div className="send-form">
                                <div className="container">
                                    <label htmlFor="adrs">To address</label>
                                    <Input type="text" name="address" id="destination-address" onChange={this.updateValues} placeholder="Pocket account address" />
                                    <span style={{display: "none"}} id="address-error" className="error"> <img src={altertR} alt="alert" /> Please enter an address</span>
                                    <span style={{display: "none"}} id="amount-error" className="error"> <img src={altertR} alt="alert" /> Invalid amount</span>
                                    <label>TX Fee {this.state.txFee / 1000000} POKT</label>
                                    <Button style={{display: "inline-block", marginTop: "20px"}} 
                                        onClick={this.showModal} className="button" >Send</Button>
                                    <div style={{ display: "none" }} id="popup" className="container popup">
                                        <PopupContent className="modal popup-child">
                                            <button className="close" onClick={this.closeModal}>
                                                <img src={exit} alt="exit icon close"/>
                                            </button>
                                            <h2> Are you sure you want to send from  your Balance: </h2>
                                            <div className="content">
                                                <div style={{marginBottom: "10px"}} className="qty">
                                                    <div id="modal-amount-to-send" className="pokt" disabled>
                                                        0.00 POKT
                                                    </div>
                                                    <div id="modal-usd-amount-to-send" className="usd">
                                                        0.00USD
                                                    </div>
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
                                            <button className="close" onClick={this.closePassModal}>
                                                <img src={exit} alt="exit icon close"/>
                                            </button>
                                            <h2> Enter your passphrase: </h2>
                                            <div className="content">
                                                <form className="passphrase">
                                                    <div className="cont-input">
                                                        <Input type="password" name="passphrase" id="modal-passphrase" 
                                                        />
                                                    </div>
                                                    <div className="btn-subm">
                                                        <Button id="sendButton" onClick={this.sendTransaction} >Send</Button>
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
                    <div style={{textAlign: "center"}} className="row">
                        <Button style={{display: "inline-block", marginTop: "20px", width: "176px"}}
                                        onClick={this.backToAccountDetail} className="button" >Back to Account Detail</Button>
                    </div>
                </SendContent>
        );
    }
}

export default withRouter(Send);