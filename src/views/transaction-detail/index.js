import React, { Component } from 'react';
import Wrapper from '../../components/wrapper';
import DetailContent from './detail-content';
import Title from '../../components/public/title/title';
import T from '../../components/public/table/table';
import Th from '../../components/public/table/th';
import Td from '../../components/public/table/td';
import Tr from '../../components/public/table/tr';
import TBody from '../../components/public/table/tbody';
import none from '../../utils/images/none.png';
import success from '../../utils/images/check_green.png';
import failed from '../../utils/images/wrong_red.png';
import {Config} from "../../config/config"
import {
    withRouter
} from 'react-router-dom'
import PocketService from "../../core/services/pocket-service";
import {getDataSource} from "../../datasource";

const dataSource = getDataSource();

class TransactionDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            txHash: this.props.location && this.props.location.data ? this.props.location.data.txHash : undefined,
            loadFromCache: this.props.location.loadFromCache,
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
        this.capitalize = this.capitalize.bind(this);
        this.openExplorer = this.openExplorer.bind(this);
    }

    openExplorer(address) {
        const url = `${Config.BLOCK_EXPLORER_BASE_URL}/account/${address}`;
        window.open(url);
    }

    capitalize(string) {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : ""
    }

    updateTxInformation(txObj = undefined) {
        const { tx, successImgSrc, failedImgSrc, pendingImgSrc } = this.state;
        const transaction = txObj !== undefined ? txObj : tx;

        switch (transaction.status.toLowerCase()) {

            case "success":
                document.getElementById("statusImg").src = successImgSrc;
                document.getElementById("statusImgMobile").src = successImgSrc;
                break;
            case "failed":
                document.getElementById("statusImg").src = failedImgSrc;
                document.getElementById("statusImgMobile").src = failedImgSrc;
                break;
            default:
                document.getElementById("statusImg").src = pendingImgSrc;
                document.getElementById("statusImgMobile").src = pendingImgSrc;
                break;
        }
    }

    getTransactionData(stdTx) { 
        if (stdTx.msg.type === "pos/MsgUnjail") {
            return { 
                type: "Unjail", 
                from: stdTx.msg.value.address, 
                to: stdTx.msg.value.address, 
                amount: 0 
            };
        } else if (stdTx.msg.type === "pos/MsgBeginUnstake") {
            return { 
                type: "Unstake", 
                from: stdTx.msg.value.validator_address, 
                to: stdTx.msg.value.validator_address, 
                amount: 0 
            };
        } 
        else if (stdTx.msg.type === "pos/MsgStake") {
            return { 
                type: "Stake", 
                from: "Myself", 
                to: "Myself", 
                amount: stdTx.msg.value.value
            };
        }
        else {
            return { 
                type: "TokenTransfer", 
                from: stdTx.msg.value.from_address, 
                to: stdTx.msg.value.to_address, 
                amount: stdTx.msg.value.amount 
            };
        }
    }

    async getTx(txHash) {
        try {
          const txResponse = await dataSource.getTx(txHash.toLowerCase());

            if (txResponse.stdTx === undefined) {
                console.log("Couldn't retrieve the transaction using the provided tx hash");
                return;
            }

            const { type: transactiontype, from: fromAddress, to: toAddress, amount } = this.getTransactionData(txResponse.stdTx);

            // Update the UI with the retrieved tx
            const txSummary = {
               from: fromAddress,
               to: toAddress,
               amount: amount,
               status: txResponse.tx_result.code === 0 ? "Success" : "Failure",
               hash: txResponse.hash,
               type: transactiontype
            }

            this.setState({
                tx: {
                    sentAmount: txSummary.amount,
                    hash: txSummary.hash,
                    fee: Number(Config.TX_FEE) / 1000000,
                    type: txSummary.type,
                    fromAddress: txSummary.from,
                    toAddress: txSummary.to,
                    status: txSummary.status,
                    sentStatus: "Sent"
                }
            });

            // Cach the tx information
            PocketService.saveTxInCache(
                txSummary.from,
                txSummary.to,
                txSummary.amount,
                txSummary.hash,
                Number(Config.TX_FEE) / 1000000,
                txSummary.status,
                "Sent"
            )

            this.updateTxInformation();
        } catch (error) {
            console.log(error)
            console.log("Failed to retrieve the transaction information.")
        }
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Navigation Items
        const navAccount = document.getElementById("account-detail-nav");
        const navLogOut = document.getElementById("log-out-nav");

        if (navAccount && navLogOut) {
            navAccount.style.display = "block";
            navLogOut.style.display = "block";
        }

        // Retrieve the tx and txhash from state
        const { txHash, loadFromCache } = this.state;

        if (txHash !== undefined && !loadFromCache) {
            // Retrieve the tx information from the network
            this.getTx(txHash);
        } else {
            // Retrieve the tx information from cached
            const {
                type,
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
                type &&
                fromAddress &&
                toAddress &&
                sentAmount !== undefined &&
                txHash &&
                txFee &&
                status &&
                sentStatus
            ) {
                const sentAmountFormatted = sentAmount * 1000000;

                const obj = {
                    tx: {
                        type,
                        fromAddress,
                        toAddress,
                        sentAmount: sentAmountFormatted,
                        hash: txHash,
                        fee: txFee,
                        status,
                        sentStatus
                    }
                }

                // Save information to the state
                this.setState(obj);
                // Update the tx information
                this.updateTxInformation(obj.tx);
            } else {
                // Clear before redirecting to the login page
                localStorage.clear();
                // Redirect to the home page
                this.props.history.push({
                    pathname: '/'
                });
            }
        }
    }

    render() {
        const { tx } = this.state;
        const txExplorerLink = `${Config.BLOCK_EXPLORER_BASE_URL}/tx/${tx.hash}`;

        return (
            <DetailContent>
                <Wrapper className="wide-block-wr">
                    <Title>Transaction Detail</Title>
                    <T className="detail-table desktop">
                        <TBody className="details-t">
                            <Tr>
                                <Th>TRANSACTION HASH</Th>
                                <Td id="txHash" style={{ wordBreak: "break-word" }}>
                                  <a href={txExplorerLink}>{tx.hash}</a>
                                </Td>
                            </Tr>
                            <Tr>
                                <Th>STATUS</Th>
                                <Td>
                                    <img style={{
                                        top: "9px",
                                        left: "14px",
                                        position: "absolute"
                                    }} id="statusImg" src={none} alt="none state" />
                                    <span style={{
                                        top: "13px",
                                        left: "38px",
                                        position: "absolute"
                                    }} id="status">{this.capitalize(tx.status)}</span>
                                </Td>
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
                                <Td>{tx.type}</Td>
                            </Tr>
                            <Tr>
                                <Th>SENDER</Th>
                                <Td style={{
                                    color: "#27a9e0",
                                    cursor: "pointer"
                                }} id="fromAddress" onClick={() => this.openExplorer(tx.fromAddress)} >{tx.fromAddress}</Td>
                            </Tr>
                            <Tr>
                                <Th>RECIPIENT</Th>
                                <Td style={{
                                    color: "#27a9e0",
                                    cursor: "pointer"
                                }} id="toAddress" onClick={() => this.openExplorer(tx.toAddress)} >{tx.toAddress}</Td>
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
                                <Td>
                                    <img style={{
                                        top: "9px",
                                        left: "14px",
                                        position: "absolute"
                                    }} id="statusImgMobile" src={none} alt="none state" />
                                    <span style={{
                                        top: "13px",
                                        left: "38px",
                                        position: "absolute"
                                    }} id="statusMobile">{this.capitalize(tx.status)}</span>
                                </Td>
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
                                <Td>{tx.type}</Td>
                            </Tr>
                            <Tr>
                                <Th>SENDER</Th>
                            </Tr>
                            <Tr>
                                <Td id="fromAddressMobile">{tx.fromAddress}</Td>
                            </Tr>
                            <Tr>
                                <Th>RECIPIENT</Th>
                            </Tr>
                            <Tr>
                                <Td id="toAddressMobile">{tx.toAddress}</Td>
                            </Tr>
                        </TBody>
                    </T>
                </Wrapper>
            </DetailContent>
        );
    }
}

export default withRouter(TransactionDetail);
