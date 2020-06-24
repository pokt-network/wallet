import React, { Component } from 'react';
import Wrapper from '../../components/wrapper';
import DetailContent from './detail-content';
import Title from '../../components/public/title/title';
import T from '../../components/public/table/table';
import Th from '../../components/public/table/th';
import Td from '../../components/public/table/td';
import Tr from '../../components/public/table/tr';
import TBody from '../../components/public/table/tbody';
import Button from '../../components/public/button/button';
import load from '../../utils/images/load.png';
import none from '../../utils/images/none.png';
import success from '../../utils/images/check_green.png';
import failed from '../../utils/images/wrong_red.png';
import { DataSource } from "../../datasource"
import Config from "../../config/config.json"
import {
    withRouter
} from 'react-router-dom'

class TransactionDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            transaction: undefined,
            successImgSrc: success,
            failedImgSrc: failed,
            pendingImgSrc: none

        }
        // Set up locals
        this.dataSource = DataSource.instance
        this.getTx = this.getTx.bind(this)
        this.updateTxInformation = this.updateTxInformation.bind(this)
        this.backToAccountDetail = this.backToAccountDetail.bind(this)
        // Set current transaction detail object
        this.data = this.props.location.data
        this.currentAccount = undefined
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

    updateTxInformation(txObj) {
        document.getElementById("txHash").innerHTML = txObj.txHash
        document.getElementById("txHashMobile").innerHTML = txObj.txHash
        document.getElementById("sentStatus").innerHTML = txObj.sentStatus
        document.getElementById("sentStatusMobile").innerHTML = txObj.sentStatus
        document.getElementById("status").innerHTML = txObj.status
        document.getElementById("statusMobile").innerHTML = txObj.status
        
        // Update the status img
        switch (txObj.status) {
            case "Success":
                document.getElementById("statusImg").src = this.state.successImgSrc
                document.getElementById("statusImgMobile").src = this.state.successImgSrc
                break;
            case "Failed":
                document.getElementById("statusImg").src = this.state.failedImgSrc
                document.getElementById("statusImgMobile").src = this.state.failedImgSrc
                break;
            default:
                document.getElementById("statusImg").src = this.state.pendingImgSrc
                document.getElementById("statusImgMobile").src = this.state.pendingImgSrc
                break;
        }
        document.getElementById("sentAmount").innerHTML = txObj.sentAmount + " POKT"
        document.getElementById("sentAmountMobile").innerHTML = txObj.sentAmount + " POKT"
        document.getElementById("txFee").innerHTML = txObj.txFee + " POKT"
        document.getElementById("txFeeMobile").innerHTML = txObj.txFee + " POKT"
        document.getElementById("fromAddress").innerHTML = txObj.fromAddress
        document.getElementById("fromAddressMobile").innerHTML = txObj.fromAddress
        document.getElementById("toAddress").innerHTML = txObj.toAddress
        document.getElementById("toAddressMobile").innerHTML = txObj.toAddress
    }
    async getTx(txHash){
        try {
            const txResponse = await this.dataSource.getTx(txHash)
            if (txResponse === undefined) {
                console.log("Couldn't retrieve the transaction using the provided tx hash")
                return
            }
            // Update the UI with the retrieved tx
            const logs = JSON.parse(txResponse.transaction.txResult.log)
            const events = logs[0].events
            const status = logs[0].success
            let senderAddress = ""
            let recipientAdress = ""
            let sentAmount = 0
            if (events.length >= 2) {
                // Retrieve the sender address
                const senderAttributes = events[0].attributes
                const senderObj = senderAttributes.find(e => e.key === "sender")
                if (senderObj !== undefined) {
                    senderAddress = senderObj.value
                }

                // Retrieve the destination address
                const recipientAttributes = events[1].attributes
                const recipientObj = recipientAttributes.find(e => e.key === "recipient")
                if (recipientObj !== undefined) {
                    recipientAdress = recipientObj.value
                }

                // Retrieve the amount sent
                const amountObj = recipientAttributes.find(e => e.key === "amount")
                if (amountObj !== undefined) {
                    sentAmount = amountObj.value.replace("upokt", "")
                    sentAmount = Number(sentAmount) / 1000000
                }

                const txObj = {
                    sentAmount: sentAmount,
                    txHash: txResponse.transaction.hash,
                    txFee: Config.txFee / 1000000,
                    txType: "TokenTransfer",
                    fromAddress: senderAddress,
                    toAddress: recipientAdress,
                    status: status === true ? "Success" : "Failed",
                    sentStatus: "Sent"
                }
                this.data.tx = txObj
                this.updateTxInformation(txObj)
            }

            if (events[1].type === "transfer") {
                const attributes = events[1].attributes
                if (attributes[1].key === "amount") {
                    console.log()
                }
            }

        } catch (error) {
            console.log(error)
            console.log("Failed to retrieve the transaction information.")
        }
    }

    componentDidMount(){
        // Navigation Item
        const navAccount = document.getElementById("navAccount")
        
        if (navAccount) {
            navAccount.style.display = "inline"
        }
    }

    render() {
        if (this.data !== undefined){
            if (this.data.account !== undefined) {
                this.currentAccount = this.data.account
            }else {
                console.log("Failed to retrieve account information.")
            }
            // If tx hash is available, call getTx, else check for tx object
            if (this.data.txHash) {
                this.data.tx = {
                    sentAmount: 0,
                    txHash: "",
                    txFee: 0,
                    txType: "",
                    fromAddress: "",
                    toAddress: ""
                }
                // Retrieve the tx information
                this.getTx(this.data.txHash)
            }else if (this.data.tx === undefined ) {
                // Redirect to the home page
                this.props.history.push({
                    pathname: '/'
                })
                return null
            }
        }else {
            // Redirect to the home page
            this.props.history.push({
                pathname: '/'
            })
            return null
        }

        return (
            <DetailContent>
                <Wrapper className="wide-block-wr">
                    <Title>Transaction Detail</Title>
                    <T className="detail-table desktop">
                        <TBody className="details-t">
                            <Tr>
                                <Th>TRANSACTION HASH</Th>
                                <Td id="txHash" style={{wordBreak: "break-word"}}> {this.data.tx.txHash} </Td>
                            </Tr>
                            <Tr>
                                <Th>STATUS</Th>
                                <table className="states">
                                    <TBody> 
                                        <Tr>
                                            <Td> <img src={load} alt="loading state"/> <span id="sentStatus" >Sending</span> </Td>
                                            <Td> <span id="status">Pending</span> <img id="statusImg" src={none} alt="none state"/> </Td>
                                        </Tr>
                                    </TBody>
                                </table>
                            </Tr>
                            <Tr>
                                <Th>AMOUNT</Th>
                                <Td id="sentAmount">{this.data.tx.sentAmount / 1000000} <span>POKT</span></Td>
                            </Tr>
                            <Tr>
                                <Th>TX FEE</Th>
                                <Td id="txFee">{this.data.tx.txFee} POKT</Td>
                            </Tr>
                            <Tr>
                                <Th>TX TYPE</Th>
                                <Td>TokenTransfer</Td>
                            </Tr>
                            <Tr>
                                <Th>FROM ADDRESS</Th>
                                <Td id="fromAddress">{this.data.tx.fromAddress}</Td>
                            </Tr>
                            <Tr>
                                <Th>TO ADDRESS</Th>
                                <Td id="toAddress">{this.data.tx.toAddress}</Td>
                            </Tr>
                        </TBody>
                    </T>
                    <T className="detail-table mobile">
                        <TBody className="details-t">
                            <Tr>
                                <Th>TRANSACTION HASH</Th>
                            </Tr>
                            <Tr>
                                <Td id="txHashMobile" style={{wordBreak: "break-word"}}> {this.data.tx.txHash} </Td>
                            </Tr>
                            <Tr>
                                <Th>STATUS</Th>
                            </Tr>
                            <Tr>
                                <table className="states">
                                    <TBody> 
                                        <Tr>
                                        <Td> <img src={load} alt="loading state"/> <span id="sentStatusMobile" >Sending</span> </Td>
                                            <Td> <span id="statusMobile">Pending</span> <img id="statusImgMobile" src={none} alt="none state"/> </Td>
                                        </Tr>
                                    </TBody>
                                </table>
                            </Tr>
                            <Tr>
                                <Th>AMOUNT</Th>
                            </Tr>
                            <Tr>
                            <Td id="sentAmountMobile">{this.data.tx.sentAmount / 1000000} <span>POKT</span></Td>
                            </Tr>
                            <Tr>
                                <Th>TX FEE</Th>
                            </Tr>
                            <Tr>
                                <Td id="txFeeMobile">{this.data.tx.txFee} POKT</Td>
                            </Tr>
                            <Tr>
                                <Th>TX TYPE</Th>
                            </Tr>
                            <Tr>
                                <Td>TokenTransfer</Td>
                            </Tr>
                            <Tr>
                                <Th>FROM ADDRESS</Th>
                            </Tr>
                            <Tr>
                                <Td id="fromAddressMobile">{this.data.tx.fromAddress}</Td>
                            </Tr>
                            <Tr>
                                <Th>TO ADDRESS</Th>
                            </Tr>
                            <Tr>
                                <Td id="toAddressMobile">{this.data.tx.toAddress}</Td>
                            </Tr>
                        </TBody>
                    </T>
                    <div style={{textAlign: "center"}} className="row">
                        <Button style={{display: "inline-block", marginTop: "20px", width: "176px"}}
                                        onClick={this.backToAccountDetail} className="button" >Back to Account Detail</Button>
                    </div>
                </Wrapper>
            </DetailContent>
        );
    }
}

export default withRouter(TransactionDetail);