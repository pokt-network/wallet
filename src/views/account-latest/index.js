import React, { Component } from 'react';
import Wrapper from '../../components/wrapper';
import AccountLContent from './account-latest';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import ToggleBtn from '../../components/public/toggle/toggle-btn';
import ContainerToggle from '../../components/public/toggle/container-toggle';
import st from '../../utils/images/18x22.png';
import ss from '../../utils/images/25x25.png';
import at from '../../utils/images/22x22.png';
import reload from '../../utils/images/reload.png'; 
import arrowUp from '../../utils/images/arrow-up.png';


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
                                    <span>$ 0.00 USD</span>
                                    <img src={reload} alt="reload" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pokt-options">
                        <div className="container">
                            <div className="option">
                                <div className="heading">
                                    <h2> <img src={st} alt="staked tokens"/> 1900 <span>POKT</span></h2>
                                </div>
                                <span>Staked Tokens</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <h2> <img src={ss} alt="staked tokens"/> UNSTAKING </h2>
                                </div>
                                <span>Staking Status</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <h2> <img src={at} alt="staked tokens"/> NODE</h2>
                                </div>
                                <span>Account Type</span>
                            </div>
                        </div>
                        <div className="btn-subm">
                            <Button href="http://example.com" dark>Buy POKT</Button>
                            <Button href="http://example.com">Send</Button>
                        </div> 
                    </div>
                    <form className="pass-pk">
                        <div className="container">
                            <div className="cont-input second">
                                <label htmlFor="add">Address</label>
                                <Input type="text" name="address" id="add" value="9L69144c864bd87a92e9a969144c864bd87a92e9" disabled />
                            </div>
                            <div className="cont-input">
                                <label htmlFor="puk">Public Key</label>
                                <Input type="text" name="public-k" id="puk" value="a969144c864bd87a92e9a969144c864bd87a92e9" disabled />
                            </div>
                        </div>
                    </form>
                    <div className="toggle-btn">
                        <ToggleBtn id="tooglebtn" onClick={this.onToggleBtn}>Latest Transactions</ToggleBtn>
                    </div>
                    <ContainerToggle isVisible={this.state.visibility}>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos tempora explicabo illum praesentium vitae doloremque, dolor deleniti? Libero temporibus deserunt assumenda voluptates perferendis neque consequuntur quaerat, corrupti aspernatur. Ipsa, perferendis.
                    </ContainerToggle>
                </Wrapper>
            </AccountLContent>
        );
    }
}

export default AccountLatest;