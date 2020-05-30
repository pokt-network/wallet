import React, { Component } from 'react';
import Wrapper from '../../components/wrapper';
import AccountLContent from './account-latest';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import ToggleBtn from '../../components/public/toggle/toggle-btn';
import ContainerToggle from '../../components/public/toggle/container-toggle';
import token from '../../utils/images/token.png';
import unstaking from '../../utils/images/unstaking.png';
import node from '../../utils/images/node.png';
import sent from '../../utils/images/sent.png';
import load from '../../utils/images/load.png';
import reload from '../../utils/images/reload.png'; 
import arrowUp from '../../utils/images/arrow-up.png';
import T from '../../components/public/table/Table';
import Th from '../../components/public/table/Th';
import Td from '../../components/public/table/Td';
import Tr from '../../components/public/table/Tr';
import THead from '../../components/public/table/THead';
import TBody from '../../components/public/table/TBody';
import TFooter from '../../components/public/table/TFooter';


class AccountLatest extends Component {
    state = {
        visibility: false
    };
    onToggleBtn = () => {
        this.setState((prevState) => {
            return { visibility: !prevState.visibility };
        });
    };
    render() {
        return (
            <AccountLContent>
                <Wrapper className="wide-block-wr">
                    <div className="quantitypokt">
                        <div className="container">
                            <h1>345,789.403 POKT</h1>
                            <div className="stats">
                                <div className="stat">
                                    <img src={arrowUp} alt="arrow up" />
                                    <span>23,87% </span>
                                </div>
                                <div className="stat">
                                    <span>$ 293,793.376 USD</span>
                                    <img src={reload} alt="reload" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pokt-options">
                        <div className="container">
                            <div className="option">
                                <div className="heading">
                                    <h2> <img src={token} alt="staked tokens"/> 1900 <span>POKT</span></h2>
                                </div>
                                <span className="title">Staked Tokens</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <h2> <img src={unstaking} alt="staked tokens"/> UNSTAKING </h2>
                                </div>
                                <span className="title">Staking Status</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <h2> <img src={node} alt="staked tokens"/> NODE</h2>
                                </div>
                                <span className="title">Account Type</span>
                            </div>
                        </div>
                        <div className="btn-subm">
                            <Button href="http://example.com" dark>Buy POKT</Button>
                            <Button href="http://example.com">Send</Button>
                        </div> 
                    </div>
                    <form className="pass-pk">
                        <div className="container">
                            <div className="cont-input">
                                <label htmlFor="add">Address</label>
                                <Input type="text" name="address" id="add" value="9L69144c864bd87a92e9a969144c864bd87a92e9" disabled />
                            </div>
                            <div className="cont-input second">
                                <label htmlFor="puk">Public Key</label>
                                <Input type="text" name="public-k" id="puk" value="a969144c864bd87a92e9a969144c864bd87a92e9" disabled />
                            </div>
                        </div>
                    </form>
                    <div className="toggle-btn">
                        <ToggleBtn id="tooglebtn" onClick={this.onToggleBtn}>Latest Transactions</ToggleBtn>
                    </div>
                    <ContainerToggle isVisible={this.state.visibility}>
                        <T>
                            <THead className="latest-tx">
                                <Tr>
                                <Th> </Th>
                                <Th>STATUS</Th>
                                <Th>TIMESTAMP</Th>
                                <Th> TX HASH</Th>
                                </Tr>
                            </THead>
                            <TBody className="l-tx">
                                <Tr>
                                    <Td> <img src={load} alt="loading" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Sending</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                                <Tr>
                                    <Td> <img src={sent} alt="sent" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Sent</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                                <Tr>
                                    <Td> <img src={sent} alt="sent" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Received</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                                <Tr>
                                    <Td> <img src={sent} alt="sent" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Sending</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                                <Tr>
                                    <Td> <img src={sent} alt="sent" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Sent</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                                <Tr>
                                    <Td> <img src={sent} alt="sent" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Received</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                                <Tr>
                                    <Td> <img src={sent} alt="sent" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Sending</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                                <Tr>
                                    <Td> <img src={sent} alt="sent" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Sent</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                                <Tr>
                                    <Td> <img src={sent} alt="sent" /> </Td>
                                    <Td> <div className="qty">246,576.058 <span>POKT</span></div> <div className="status">Received</div> </Td>
                                    <Td>34 sec ago</Td>
                                    <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
                                </Tr>
                            </TBody>
                            <TFooter>
                                <Tr>
                                <Td colSpan={6}> 
                                    <a href="http://example.com" className="button button-1"> Load More </a> 
                                </Td>
                                </Tr>
                            </TFooter>
                        </T>
                    </ContainerToggle>
                </Wrapper>
            </AccountLContent>
        );
    }
}

export default AccountLatest;