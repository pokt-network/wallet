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


class TransactionDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            transaction: undefined
        }
        const obj = {
            sentAmount: 1000000,
            txHash: "97F4EF40FE47574F414CE22BA73A08EEAE23931BC5D1C902AB5CE913AC530B1B",
            txFee: 10000000,
            txType: "TokenTransfer",
            fromAddress: "19c0551853f19ce1b7a4a1ede775c6e3db431b0f",
            toAddress: "802fddec29f99cae7a601cf648eafced1c062d39"
        }
        // Set current transaction detail object
        // this.txDetail = this.props.location.data
        this.txDetail = obj
    }
    render() {
        // Check if current transaction is set
        if (this.txDetail === undefined) {
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
                                <Td style={{wordBreak: "break-word"}}> {this.txDetail.txHash} </Td>
                            </Tr>
                            <Tr>
                                <Th>STATUS</Th>
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
                                <Td>{this.txDetail.sentAmount / 1000000} <span>POKT</span></Td>
                            </Tr>
                            <Tr>
                                <Th>TX FEE</Th>
                                <Td>100,000 uPOKT</Td>
                            </Tr>
                            <Tr>
                                <Th>Tx Type</Th>
                                <Td>{this.txDetail.txType}</Td>
                            </Tr>
                            <Tr>
                                <Th>TO ADDRESS</Th>
                                <Td>{this.txDetail.toAddress}</Td>
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
                                <Td>100,000 uPOKT</Td>
                            </Tr>
                            <Tr>
                                <Th>Tx Type</Th>
                            </Tr>
                            <Tr>
                                <Td>{this.txDetail.txType}</Td>
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