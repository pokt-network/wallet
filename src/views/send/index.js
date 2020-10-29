import React, {Component} from 'react';
import Wrapper from '../../components/wrapper';
import SendContent from './send';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import exit from '../../utils/images/exit.png';
import PopupContent from './popup-content';
import altertR from '../../utils/images/alert-circle-red.png';
import Config from "../../config/config.json";
import {withRouter} from 'react-router-dom';
import PocketService from "../../core/services/pocket-service";
import {DataSource} from "../../datasource/datasource";
import {typeGuard} from "@pokt-network/pocket-js";

const dataSource = new DataSource();

class Send extends Component {
    constructor() {
        super();
        this.state = {
            isModalVisible: false,
            addressHex: undefined,
            destinationAdress: undefined,
            publicKeyHex: undefined,
            ppk: undefined,
            visibility: false,
            isPassModalVisible: false,
            amountToSend: 0,
            isAmountValid: false,
            isAddressValid: false,
            txFee: Number(Config.TX_FEE),
            disableSendBtn: false,
            poktAmount: 0.00,
            poktAmountUsd: 0.00,
            modalAmountToSendPokt: "0.00 POKT",
            modalAmountToSendUsd: "0.00 USD",
            balanceError: undefined,
            addressError: undefined,
            amountError: undefined,
            passphraseError: undefined
        };

        this.toggleNotBalanceError = this.toggleNotBalanceError.bind(this);
        this.toggleAddressError = this.toggleAddressError.bind(this);
        this.toggleAmountError = this.toggleAmountError.bind(this);
        this.updateDestinationAddress = this.updateDestinationAddress.bind(this);
        this.showModal = this.showModal.bind(this);
        this.sendTransaction = this.sendTransaction.bind(this);
        this.showPassModal = this.showPassModal.bind(this);
        this.finishSendTransaction = this.finishSendTransaction.bind(this);
        this.pushToTxDetail = this.pushToTxDetail.bind(this);
        this.updateValues = this.updateValues.bind(this);
        this.backToAccountDetail = this.backToAccountDetail.bind(this);
        this.handlePoktValueChange = this.handlePoktValueChange.bind(this);
        this.handleUsdValueChange = this.handleUsdValueChange.bind(this);
        this.enableLoaderIndicatory = this.enableLoaderIndicatory.bind(this);
        this.togglePassphraseError = this.togglePassphraseError.bind(this);
        this.validate = this.validate.bind(this);
    }

    enableLoaderIndicatory(show){
        const loaderElement = document.getElementById("loader");

        if (loaderElement) {
            loaderElement.style.display = show === true ? "block" : "none";
        };
    }
    
    showModal(show) {
        this.setState({
            isModalVisible: show,
        });
    }

    showPassModal(show) {
        // Show/Hide the modal 
        this.setState({
            passphraseError: undefined,
            isPassModalVisible: show,
            disableSendBtn: show === true ? false : true
        });
    }

    validate() {
        const {isAddressValid, isAmountValid} = this.state;
        console.log(`${isAddressValid}, ${isAmountValid}`);
        if (isAddressValid === false) {
            this.setState({
                isPassModalVisible: false,
                addressError: "Invalid Address."
            });
            return false;
        }

        if (isAmountValid === false) {
            this.setState({
                isPassModalVisible: false,
                amountError: "Amount is invalid."
            });
            return false;
        }

        return true;
    }

    async sendTransaction(){
        // Enable loader indicator
        this.enableLoaderIndicatory(true);

        const {addressHex, publicKeyHex, ppk, amountToSend, txFee} = this.state;

        const passphrase = document.getElementById("modal-passphrase");
        const destinationAddress = document.getElementById("destination-address");
        
        if (passphrase && destinationAddress && ppk && amountToSend > 0) {
            // Update the state values for the addresses
            this.setState({
                destinationAdress: destinationAddress.value,
                disableSendBtn: true
            });

            const txResponse = await dataSource.sendTransaction(
                ppk,
                passphrase.value,
                destinationAddress.value,
                amountToSend
            );

            if (typeGuard(txResponse, Error)) {
                // Disable loader indicator
                this.enableLoaderIndicatory(false);
                // Show error message
                this.togglePassphraseError(txResponse.message)
                
                return;
            }

            this.finishSendTransaction();
            // Print in console the tx response
            console.log(txResponse);
            
            // Save the user information locally
            PocketService.saveUserInCache(addressHex, publicKeyHex, ppk);
            // Save the tx information locally
            PocketService.saveTxInCache(
                addressHex,
                destinationAddress.value,
                amountToSend.toString(),
                txResponse.hash,
                (txFee / 1000000).toString(),
                "Pending",
                "Pending"
            );

            // Disable loader indicator
            this.enableLoaderIndicatory(false);
            // Push to transaction detail page
            this.pushToTxDetail();
        } else {
            // Disable loader indicator
            this.enableLoaderIndicatory(false);
            // Show error message
            this.toggleAddressError("Amount to send or the destination address is invalid.");

            this.showPassModal(false);
        }
    }

    backToAccountDetail() {
        // Move to the transaction detail
        this.props.history.push({
            pathname: "/account"
        })
    }

    pushToTxDetail() {
        // Move to the transaction detail
        this.props.history.push({
            pathname: "/transaction-detail"
        })
    }
    
    // Close and clean after sending a transaction
    finishSendTransaction() {
        // Set default values
        this.setState({
            amountToSend: 0,
            poktAmount: 0.00,
            destinationAddress: undefined
        });

        document.getElementById("modal-passphrase").value = "";
        
        // Close active modals
        this.showModal(false);
        this.showPassModal(false);
    }

    updateValues() {
        this.handlePoktValueChange();
        this.handleUsdValueChange();
        this.updateDestinationAddress();
    }

    handlePoktValueChange() {
        // Retrieve current amount value set element
        const amountElement = document.getElementById("pokt-amount");
        // Retrieve modal amount value element
        const amountElementText = document.getElementById("modal-amount-to-send");
        
        // Check the elements
        if (amountElement && amountElementText) {
            if(amountElement.value <= 0 || amountElement.value === "") {
                this.toggleAmountError("Amount to send is invalid.");
                this.setState({isAmountValid: false});
                return;
            }
            // Update the USD value element
            const usdAmountElement = document.getElementById("pokt-amount-usd");
            const usdAmountElementText = document.getElementById("modal-usd-amount-to-send");
            
            // Check
            if (usdAmountElement && usdAmountElementText) {
                // Convert the decimals to upokt to use the value for the send-tx
                const value = amountElement.value * 1000000;
                // Convert pokt to usd
                const usdValue = Number(Config.POKT_USD_VALUE) * amountElement.value;

                // Save the values in the state
                this.setState({
                    amountToSend: Math.round(value),
                    isAmountValid: true,
                    poktAmount: amountElement.value,
                    poktAmountUsd: usdValue.toFixed(2),
                    modalAmountToSendPokt: `${amountElement.value} POKT`,
                    modalAmountToSendUsd: `${usdValue.toFixed(2)} USD`
                });
                
                // Remove error message
                this.toggleAmountError(undefined);
            }
        } else {
            this.toggleAmountError("An error ocurred, please try again.");
            this.setState({isAmountValid: false});
            return;
        }
    }

    handleUsdValueChange(){
        // Retrieve current amount value set element
        const usdAmountElement = document.getElementById("pokt-amount-usd");
        // Retrieve modal amount value element
        const usdAmountElementText = document.getElementById("modal-usd-amount-to-send");

        // Check the elements
        if (usdAmountElement && usdAmountElementText) {
            if(usdAmountElement.value <= 0 || usdAmountElementText.value === "") {
                this.toggleAmountError("Amount to send is invalid.");
                this.setState({isAmountValid: false});
                return;
            }
            // Update the POKT value element
            const amountElement = document.getElementById("pokt-amount");
            const amountElementText = document.getElementById("modal-amount-to-send");

            // Check
            if (amountElement && amountElementText) {
                // Convert the decimals to upokt to use the value for the send-tx
                const value = usdAmountElement.value / Number(Config.POKT_USD_VALUE);
                // Update the pokt amount elements too
                const poktValue = value * 1000000;

                // Save the amount in uPOKT to send in the state
                this.setState({
                    amountToSend: Math.round(poktValue), 
                    isAmountValid: true,
                    poktAmount: value.toFixed(2),
                    poktAmountUsd: usdAmountElement.value,
                    modalAmountToSendPokt: `${value.toFixed(2)} POKT`,
                    modalAmountToSendUsd: `${usdAmountElement.value} USD`
                });

                // Remove error message
                this.toggleAmountError(undefined);
            }
        }
    }

    // Update destination address
    updateDestinationAddress(){
        // Retrieve the current destination address element
        const destinationAddress = document.getElementById("destination-address");
        // Retrieve modal destination adress element
        const destinationModal = document.getElementById("modal-destination-address");

        // Check if both element exists
        if (destinationAddress && destinationModal) {
            // Validate the address
            if(dataSource.validateAddress(destinationAddress.value)) {
                this.setState({
                    destinationAddress: destinationAddress.value,
                    isAddressValid: true
                });
                this.toggleAddressError(undefined);
            }else {
                this.toggleAddressError("Address is invalid");
                this.setState({isAddressValid: false});
            }
        }
    }

    // Component did mount
    componentDidMount() {
        const {addressHex, publicKeyHex, ppk} = PocketService.getUserInfo();

        if (addressHex && publicKeyHex && ppk) {
            // Save information to the state
            this.setState({
                addressHex, 
                publicKeyHex, 
                ppk
            });
        } else {
            // Redirect to the home page
            this.props.history.push({
                pathname: '/'
            });
        }
    }

    toggleNotBalanceError(msg) {
        this.setState({
            balanceError: msg
        });
    }
    
    toggleAddressError(msg) {
        this.setState({
            addressError: msg
        });
    }

    toggleAmountError(msg) {
        this.setState({
            amountError: msg
        });
    }

    togglePassphraseError(msg) {
        this.setState({
            passphraseError: msg
        });
    }

    // Render
    render() {
        const {
            isModalVisible,
            isPassModalVisible,
            poktAmount,
            poktAmountUsd,
            modalAmountToSendPokt,
            modalAmountToSendUsd,
            balanceError,
            addressError,
            amountError,
            passphraseError,
            destinationAddress,
            disableSendBtn
        } = this.state;

        return (
                <SendContent>
                    <Wrapper className="wide-block-wr">
                        <Title>Send Transaction</Title>
                        <div className="quantity">
                            <form className="quantity-form">
                                <div className="row">
                                    <div className="container">
                                        <input style={{color: "black"}} onChange={this.handlePoktValueChange} type="number" name="quantity" step="0.01" id="pokt-amount" placeholder="0.00" value={poktAmount} />
                                        <label htmlFor="pokt">POKT</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="container">
                                        <input onChange={this.handleUsdValueChange} type="number" name="quantity" id="pokt-amount-usd" placeholder="0.00" value={poktAmountUsd} />
                                        <label htmlFor="usd">USD</label>
                                    </div>
                                </div>
                            </form>
                            <div className="send-form">
                                <div className="container">
                                    <label htmlFor="adrs">To address</label>
                                    <Input type="text" name="address" id="destination-address" onChange={this.updateValues} placeholder="Pocket account address"/>
                                    <span style={{
                                        display: addressError !== undefined ? "block" : "none"
                                    }} id="address-error" className="error"> <img src={altertR} alt="alert" /> {addressError}</span>
                                    <span style={{
                                        display: amountError !== undefined ? "block" : "none"
                                    }} id="amount-error" className="error"> <img src={altertR} alt="alert" /> {amountError}</span>
                                    <label>TX Fee {this.state.txFee / 1000000} POKT</label>
                                    <Button style={{display: "inline-block", marginTop: "20px"}} 
                                        onClick={()=> this.validate() === true ? this.showPassModal(true) : this.showPassModal(false)} className="button" >Send</Button>
                                    <div style={{ 
                                        display: isModalVisible === true ? "block" : "none" 
                                        }} id="popup" className="container popup">
                                        <PopupContent className="modal popup-child">
                                            <button className="close" onClick={this.closeModal}>
                                                <img src={exit} alt="exit icon close"/>
                                            </button>
                                            <h2> Are you sure you want to send from your Balance: </h2>
                                            <div className="content">
                                                <div style={{marginBottom: "10px"}} className="qty">
                                                    <div id="modal-amount-to-send" className="pokt" disabled>
                                                        {modalAmountToSendPokt}
                                                    </div>
                                                    <div id="modal-usd-amount-to-send" className="usd">
                                                        {modalAmountToSendUsd}
                                                    </div>
                                                </div>
                                                <form className="pass-pk">
                                                    <div className="cont-input">
                                                        <label htmlFor="toadd">To Address</label>
                                                        <Input type="text" name="toaddress" id="modal-destination-address" 
                                                            disabled
                                                            value={destinationAddress}
                                                        />
                                                    </div>
                                                    <div className="btn-subm">
                                                        <Button onClick={()=> this.showPassModal(true)} >Confirm</Button>
                                                    </div>
                                                </form>
                                            </div>
                                            <span id="balance-error" style={{ 
                                                display: balanceError !== undefined ? "block" : "none" 
                                                }} className="error"> <img src={altertR} alt="alert" /> Not Enough Balance</span>
                                        </PopupContent>
                                    </div>
                                    <div style={{ 
                                            display: isPassModalVisible === true ? "block" : "none" 
                                        }} id="popup-passphrase" className="container popup">
                                        <PopupContent className="modal popup-child">
                                            <button className="close" onClick={()=> this.showPassModal(false)}>
                                                <img src={exit} alt="exit icon close"/>
                                            </button>
                                            <h2> Enter your passphrase: </h2>
                                            <div className="content">
                                                <form className="passphrase">
                                                    <div className="cont-input">
                                                        <Input type="password" name="passphrase" id="modal-passphrase" />
                                                    </div>
                                                <span id="passphrase-error" style={{
                                                    display: passphraseError !== undefined ? "block" : "none"
                                                }} className="error"> <img src={altertR} alt="alert" /> {passphraseError}</span>
                                                    <div className="btn-subm">
                                                        <Button id="sendButton" disabled={disableSendBtn} onClick={this.sendTransaction} >Send</Button>
                                                    </div>
                                                </form>
                                            </div>
                                        </PopupContent>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Wrapper>
                    <div style={{textAlign: "center"}} className="row">
                        <Button style={{display: "inline-block", marginTop: "60px", width: "176px", backgroundColor: "#474747" }}
                                        onClick={this.backToAccountDetail} className="button" >Back to Account Detail</Button>
                    </div>
                </SendContent>
        );
    }
}

export default withRouter(Send);