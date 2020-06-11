import React, { Component } from 'react';
import Wrapper from '../../components/wrapper';
import DetailContent from './detail-content';
import Title from '../../components/public/title/title';
import T from '../../components/public/table/Table';
import Th from '../../components/public/table/Th';
import Td from '../../components/public/table/Td';
import Tr from '../../components/public/table/Tr';
import TBody from '../../components/public/table/TBody';
import load from '../../utils/images/load.png';
import none from '../../utils/images/none.png';
import success from '../../utils/images/check_green.png';
import failed from '../../utils/images/wrong_red.png';
import { DataSource } from "../../datasource"
import base from "../../config/config.json"
import queryString from 'query-string';

// Assign the base to the config constant
const config = base

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
        this.dataSource = new DataSource([new URL(config.baseUrl)])
        this.getTx = this.getTx.bind(this)
        this.updateTxInformation = this.updateTxInformation.bind(this)
        // Set current transaction detail object
        this.txDetail = this.props.location.data
    }
    updateTxInformation(txObj){
        document.getElementById("txHash").innerHTML = txObj.txHash
        document.getElementById("sentStatus").innerHTML = txObj.sentStatus
        document.getElementById("status").innerHTML = txObj.status
        // Update the status img
        switch (txObj.status) {
            case "Success":
                document.getElementById("statusImg").src = this.state.successImgSrc
                break;
            case "Failed":
                document.getElementById("statusImg").src = this.state.failedImgSrc
                break;
            default:
                document.getElementById("statusImg").src = this.state.pendingImgSrc
                break;
        }
        document.getElementById("sentAmount").innerHTML = txObj.sentAmount + " POKT"
        document.getElementById("txFee").innerHTML = txObj.txFee + " POKT"
        document.getElementById("fromAddress").innerHTML = txObj.fromAddress
        document.getElementById("toAddress").innerHTML = txObj.toAddress
    }
    async getTx(txHash){
        try {
            const txResponse = await this.dataSource.getTx(txHash)
            if (txResponse === undefined) {
                alert("Couldn't retrieve the transaction using the provided tx hash")
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
                    txFee: config.txFee / 1000000,
                    txType: "TokenTransfer",
                    fromAddress: senderAddress,
                    toAddress: recipientAdress,
                    status: status === true ? "Success" : "Failed",
                    sentStatus: "Sent"
                }
                this.txDetail = txObj
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
            alert("Failed to retrieve the transaction information.")
        }
    }
    render() {
        // Retrieve the url query param for the txHash if available
        const url = this.props.location.search
        const params = queryString.parse(url)
        if (params.txHash) {
            this.txDetail = {
                sentAmount: 0,
                txHash: "",
                txFee: 0,
                txType: "",
                fromAddress: "",
                toAddress: ""
            }
            // Retrieve the tx information
            this.getTx(params.txHash)
        }else if (this.txDetail === undefined ) {
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
                                <Td id="txHash" style={{wordBreak: "break-word"}}> {this.txDetail.txHash} </Td>
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
                                <Td id="sentAmount">{this.txDetail.sentAmount / 1000000} <span>POKT</span></Td>
                            </Tr>
                            <Tr>
                                <Th>TX FEE</Th>
                                <Td id="txFee">{this.txDetail.txFee} POKT</Td>
                            </Tr>
                            <Tr>
                                <Th>Tx Type</Th>
                                <Td>TokenTransfer</Td>
                            </Tr>
                            <Tr>
                                <Th>FROM ADDRESS</Th>
                                <Td id="fromAddress">{this.txDetail.fromAddress}</Td>
                            </Tr>
                            <Tr>
                                <Th>TO ADDRESS</Th>
                                <Td id="toAddress">{this.txDetail.toAddress}</Td>
                            </Tr>
                        </TBody>
                    </T>
                    <T className="detail-table mobile">
                        <TBody className="details-t">
                            <Tr>
                                <Th>TRANSACTION HASH</Th>
                            </Tr>
                            <Tr>
                                <Td> {this.txDetail.txHash} </Td>
                            </Tr>
                            <Tr>
                                <Th>STATUS</Th>
                            </Tr>
                            <Tr>
                                <table className="states">
                                    <TBody> 
                                        <Tr>
                                            <Td> <img src={load} alt="loading state"/> <span>Sending</span> </Td>
                                            <Td> <span>Pending</span> <img src={none} alt="none state"/> </Td>
                                        </Tr>
                                    </TBody>
                                </table>
                            </Tr>
                            <Tr>
                                <Th>AMOUNT</Th>
                            </Tr>
                            <Tr>
                                <Td>{this.txDetail.sentAmount / 1000000} <span>POKT</span></Td>
                            </Tr>
                            <Tr>
                                <Th>TX FEE</Th>
                            </Tr>
                            <Tr>
                                <Td>{this.txDetail.txFee} POKT</Td>
                            </Tr>
                            <Tr>
                                <Th>Tx Type</Th>
                            </Tr>
                            <Tr>
                                <Td>{this.txDetail.txType}</Td>
                            </Tr>
                            <Tr>
                                <Th>FROM ADDRESS</Th>
                            </Tr>
                            <Tr>
                                <Td>{this.txDetail.fromAddress}</Td>
                            </Tr>
                            <Tr>
                                <Th>TO ADDRESS</Th>
                            </Tr>
                            <Tr>
                                <Td>{this.txDetail.toAddress}</Td>
                            </Tr>
                        </TBody>
                    </T>
                </Wrapper>
            </DetailContent>
        );
    }
}

export default TransactionDetail;