import React, {Component} from 'react';
import Wrapper from '../../components/wrapper';
import SendContent from './send';
import Title from '../../components/public/title/title';
import Input from '../../components/public/input/input';
import PopupPW from './popup';
import altertR from '../../utils/images/alert-circle-red.png';
import { DataSource } from "../../datasource"

class Send extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addressHex: undefined,
            publicKeyHex: undefined,
            ppk: undefined,
            visibility: false
        }
        // Set up locals
        this.dataSource = new DataSource(undefined, [new URL("http://localhost:8081")])
        this.getBalance = this.getBalance.bind(this)
        this.toggleNotBalanceError = this.toggleNotBalanceError.bind(this)
        this.toggleAddressError = this.toggleAddressError.bind(this)

        this.currentAccount = {
            addressHex: "19c0551853f19ce1b7a4a1ede775c6e3db431b0f"
        }
    }
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
        // Scroll to the account information section
        // var element = document.querySelector("#pokt-balance");
        // element.scrollIntoView({
        //     behavior: 'smooth'
        // })
        // // Update account detail values
        // document.getElementById('pokt-balance').innerText = balance + " POKT"
        // document.getElementById('address').value = this.currentAccount.addressHex
        // document.getElementById('public-key').value = this.currentAccount.publicKeyHex
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
                                        <input style={{color: "black"}} type="number" name="quantity" step="0.01" id="pokt" placeholder="0.00" />
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
                            <form className="send-form">
                                <div className="container">
                                    <label htmlFor="adrs">To address</label>
                                    <Input type="text" name="address" id="adrs" placeholder="Pocket account address" />
                                    <span id="address-error" className="error"> <img src={altertR} alt="alert" /> Please enter an address</span>
                                    <label>TX Fee 100,000POKT</label>
                                    <div className="btn-subm">
                                        <PopupPW />
                                        <span id="balance-error" style={{ display: "none" }} className="error"> <img src={altertR} alt="alert" /> Not Enough Balance</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Wrapper>
                </SendContent>
        );
    }
}

export default Send;