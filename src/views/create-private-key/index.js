import React from 'react';
import Wrapper from '../../components/wrapper';
import CreatePrivateKey from './create-private-key';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import altertT from '../../utils/images/alert-triangle.png';
import reload from '../../utils/images/reload.png'; 
import increase from '../../utils/images/increase.png';

function Send (){
    return (
        <CreatePrivateKey>
            <Wrapper className="wide-block-wr">
                <div className="quantitypokt">
                    <div className="container">
                        <h1>0.00 POKT</h1>
                        <div className="stats">
                            <div className="stat">
                                <img src={increase} alt="alert" />
                                <span>23,87% </span>
                            </div>
                            <div className="stat">
                                <span>$ 0.00 USD</span>
                                <img src={reload} alt="alert" />
                            </div>
                        </div>
                    </div>
                </div>
                <form className="pass-pk">
                    <div className="container">
                        <div className="cont-input">
                            <label htmlFor="prk">PRIVATE KEY</label>
                            <Input type="password" name="provatek" id="prk" value="Loremipsumdolorsitamet" />
                        </div>
                        <div className="alert">
                            <img src={altertT} alt="alert" />
                            <div className="cont-alert">
                                <div className="title">
                                    <h3>STORE SAVE YOUR PRIVATE KEY!</h3>
                                </div>
                                <p>
                                    You wont be able see it again or change it, make a back up, store it save  preferably offline. You’ll need it to acces your account again.
                                </p>
                            </div>
                        </div>
                        <div className="cont-input second">
                            <label htmlFor="add">Address</label>
                            <Input type="text" name="address" id="add" value="9L69144c864bd87a92e9a969144c864bd87a92e9" disabled />
                        </div>
                        <div className="cont-input">
                            <label htmlFor="puk">Public Key</label>
                            <Input type="text" name="public-k" id="puk" value="a969144c864bd87a92e9a969144c864bd87a92e9" disabled />
                        </div>
                        <div className="btn-subm">
                            <Button href="http://example.com">Account Details</Button>
                        </div>
                    </div>
                </form>
            </Wrapper>
        </CreatePrivateKey>
    );
}

export default Send;