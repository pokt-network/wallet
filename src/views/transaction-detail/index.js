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
import Config from "../../config/config.json"
import {
    withRouter
} from 'react-router-dom'
import PocketService from "../../core/services/pocket-service";
import {DataSource} from "../../datasource/datasource";

const dataSource = new DataSource();

class TransactionDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            txHash: this.props.location.data,
            successImgSrc: success,
            failedImgSrc: failed,
            pendingImgSrc: none,
            tx: {
                type: undefined,
                hash: undefined,
                sentStatus: undefined,
                status: undefined,
                sentAmount: undefined,
                fee: undefined,
                fromAddress: undefined,
                toAddress: undefined
            }
        };

        // Bindings
        this.getTx = this.getTx.bind(this);
        this.updateTxInformation = this.updateTxInformation.bind(this);
        this.backToAccountDetail = this.backToAccountDetail.bind(this);
        this.capitalize = this.capitalize.bind(this);
    }

    capitalize(string) {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : ""
    }

    backToAccountDetail() {
        // Move to the account detail page
        this.props.history.push({
            pathname: "/account"
        })
    }

    updateTxInformation() {
        const { tx, successImgSrc, failedImgSrc, pendingImgSrc, success, failed } = this.state;
        
        // Update the status img
        switch (tx.status.toLowerCase()) {
            case "success":
                document.getElementById("statusImg").src = successImgSrc;
                document.getElementById("statusImgMobile").src = successImgSrc;
                document.getElementById("sentStatus").src = success;
                document.getElementById("sentStatusMobile").src = success;
                break;
            case "failed":
                document.getElementById("statusImg").src = failedImgSrc;
                document.getElementById("statusImgMobile").src = failedImgSrc;
                document.getElementById("sentStatus").src = failed;
                document.getElementById("sentStatusMobile").src = failed;
                break;
            default:
                document.getElementById("statusImg").src = pendingImgSrc;
                document.getElementById("statusImgMobile").src = pendingImgSrc;
                document.getElementById("sentStatus").src = load;
                document.getElementById("sentStatusMobile").src = load;
                break;
        }
    }

    async getTx(txHash) {
        try {
            const txResponse = await dataSource.getTx(txHash);

            if (txResponse === undefined) {
                console.log("Couldn't retrieve the transaction using the provided tx hash");
                return;
            }

            // Update the UI with the retrieved tx
            const logs = JSON.parse(txResponse.transaction.txResult.log);
            const events = logs[0].events;
            const status = logs[0].success;

            let senderAddress = "";
            let recipientAdress = "";
            let sentAmount = 0;

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
                // Save the tx information into the state
                this.setState({
                    tx: {
                        sentAmount: sentAmount,
                        hash: txResponse.transaction.hash,
                        fee: Number(Config.TX_FEE) / 1000000,
                        type: "TokenTransfer",
                        fromAddress: senderAddress,
                        toAddress: recipientAdress,
                        status: status === true ? "Success" : "Failed",
                        sentStatus: "Sent"
                    }
                });

                // Cach the tx information
                PocketService.saveTxInCache(
                    senderAddress,
                    recipientAdress,
                    sentAmount,
                    txResponse.transaction.hash,
                    Number(Config.TX_FEE) / 1000000,
                    status === true ? "Success" : "Failed",
                    "Sent"
                )

                this.updateTxInformation();
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

    componentDidMount() {
        // Navigation Item
        const navAccount = document.getElementById("navAccount");

        if (navAccount) {
            navAccount.style.display = "inline";
        }

        // Retrieve the tx and txhash from state
        const {txHash} = this.state;

        if (txHash !== undefined) {
            // Retrieve the tx information from the network
            this.getTx(txHash.txHash);
        } else {
            // Retrieve the tx information from cached
            const {
                fromAddress,
                toAddress,
                sentAmount,
                txHash,
                txFee,
                status,
                sentStatus
            } = PocketService.getTxInfo();

            // Check if values are set
            if (
                fromAddress &&
                toAddress &&
                sentAmount &&
                txHash &&
                txFee &&
                status &&
                sentStatus
            ) {
                // Save information to the state
                this.setState({
                    fromAddress,
                    toAddress,
                    sentAmount,
                    txHash,
                    txFee,
                    status,
                    sentStatus
                });
            } else {
                // Redirect to the home page
                this.props.history.push({
                    pathname: '/'
                });
            }
        }


    }

    render() {
        const { tx } = this.state;

        return (
            <DetailContent>
                <Wrapper className="wide-block-wr">
                    <Title>Transaction Detail</Title>
                    <T className="detail-table desktop">
                        <TBody className="details-t">
                            <Tr>
                                <Th>TRANSACTION HASH</Th>
                                <Td id="txHash" style={{ wordBreak: "break-word" }}> {tx.hash} </Td>
                            </Tr>
                            <Tr>
                                <Th>STATUS</Th>
                                <table className="states">
                                    <TBody>
                                        <Tr>
                                            <Td> <img src={load} alt="loading state" /> <span id="sentStatus" >{this.capitalize(tx.sentStatus)}</span> </Td>
                                            <Td> <span id="status">{this.capitalize(tx.status)}</span> <img id="statusImg" src={none} alt="none state" /> </Td>
                                        </Tr>
                                    </TBody>
                                </table>
                            </Tr>
                            <Tr>
                                <Th>AMOUNT</Th>
                                <Td id="sentAmount">{tx.sentAmount / 1000000} <span>POKT</span></Td>
                            </Tr>
                            <Tr>
                                <Th>TX FEE</Th>
                                <Td id="txFee">{tx.fee} POKT</Td>
                            </Tr>
                            <Tr>
                                <Th>TX TYPE</Th>
                                <Td>TokenTransfer</Td>
                            </Tr>
                            <Tr>
                                <Th>FROM ADDRESS</Th>
                                <Td id="fromAddress">{tx.fromAddress}</Td>
                            </Tr>
                            <Tr>
                                <Th>TO ADDRESS</Th>
                                <Td id="toAddress">{tx.toAddress}</Td>
                            </Tr>
                        </TBody>
                    </T>
                    <T className="detail-table mobile">
                        <TBody className="details-t">
                            <Tr>
                                <Th>TRANSACTION HASH</Th>
                            </Tr>
                            <Tr>
                                <Td id="txHashMobile" style={{ wordBreak: "break-word" }}> {tx.hash} </Td>
                            </Tr>
                            <Tr>
                                <Th>STATUS</Th>
                            </Tr>
                            <Tr>
                                <table className="states">
                                    <TBody>
                                        <Tr>
                                            <Td> <img src={load} alt="loading state" /> <span id="sentStatusMobile" >Sending</span> </Td>
                                            <Td> <span id="statusMobile">{this.capitalize(tx.status)}</span> <img id="statusImgMobile" src={none} alt="none state" /> </Td>
                                        </Tr>
                                    </TBody>
                                </table>
                            </Tr>
                            <Tr>
                                <Th>AMOUNT</Th>
                            </Tr>
                            <Tr>
                                <Td id="sentAmountMobile">{tx.sentAmount / 1000000} <span>POKT</span></Td>
                            </Tr>
                            <Tr>
                                <Th>TX FEE</Th>
                            </Tr>
                            <Tr>
                                <Td id="txFeeMobile">{tx.fee} POKT</Td>
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
                                <Td id="fromAddressMobile">{tx.fromAddress}</Td>
                            </Tr>
                            <Tr>
                                <Th>TO ADDRESS</Th>
                            </Tr>
                            <Tr>
                                <Td id="toAddressMobile">{tx.toAddress}</Td>
                            </Tr>
                        </TBody>
                    </T>
                    <div style={{ textAlign: "center" }} className="row">
                        <Button style={{ display: "inline-block", marginTop: "20px", width: "176px" }}
                            onClick={this.backToAccountDetail} className="button" >Back to Account Detail</Button>
                    </div>
                </Wrapper>
            </DetailContent>
        );
    }
}

export default withRouter(TransactionDetail);