import React, { Component } from 'react';
import Wrapper from '../../components/wrapper';
import AccountLContent from './account-detail';
import Input from '../../components/public/input/input';
import Button from '../../components/public/button/button';
import ToggleBtn from '../../components/public/toggle/toggle-btn';
import ContainerToggle from '../../components/public/toggle/container-toggle';
import token from '../../utils/images/token.png';
import unstaking from '../../utils/images/unstaking.png';
import unstaked from '../../utils/images/unstaked.png';
import staked from '../../utils/images/staked.png';
import node from '../../utils/images/node.png';
import app from '../../utils/images/app.png';
import na from '../../utils/images/NA.png';
import sent from '../../utils/images/sent.png';
import received from '../../utils/images/received.png';
import load from '../../utils/images/load.png'; 
import reload from '../../utils/images/reload.png';
import reloadActive from '../../utils/images/refresh-active.png'
import T from '../../components/public/table/table';
import Th from '../../components/public/table/th';
import Td from '../../components/public/table/td';
import Tr from '../../components/public/table/tr';
import THead from '../../components/public/table/thead';
import TBody from '../../components/public/table/tbody';
import copy from '../../utils/images/copy.png'
import { DataSource } from "../../datasource"
import Config from "../../config/config.json"
import {
    withRouter
} from 'react-router-dom'

class AccountLatest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            normal: undefined,
            app: undefined,
            node: undefined,
            visibility: true,
            addressHex: "",
            publicKeyHex: "",
            unstakingImgSrc: unstaking,
            stakedImgSrc: staked,
            unstakedImgSrc: unstaked,
            reloadImgSrc: reload,
            reloadActiveImgSrc: reloadActive
        }
        // Set up locals
        this.dataSource = DataSource.instance
        // Binds
        this.onToggleBtn = this.onToggleBtn.bind(this)
        this.getBalance = this.getBalance.bind(this)
        this.getAccountType = this.getAccountType.bind(this)
        this.addApp = this.addApp.bind(this)
        this.addNode = this.addNode.bind(this)
        this.getTransactions = this.getTransactions.bind(this)
        this.pushToSend = this.pushToSend.bind(this)
        this.pushToTxDetail = this.pushToTxDetail.bind(this)
        this.refreshView = this.refreshView.bind(this)
        this.enableLoaderIndicatory = this.enableLoaderIndicatory.bind(this)
        this.updateAccountDetails = this.updateAccountDetails.bind(this)
        this.copyAddress = this.copyAddress.bind(this)
        this.copyPublicKey = this.copyPublicKey.bind(this)
        this.reloadBtnState = this.reloadBtnState.bind(this)
        // Set current Account
        this.currentAccount = this.props.location.data
    }
    copyAddress(){
        const address = document.getElementById("address")
        if (address) {
            address.select();
            address.setSelectionRange(0, 99999); /*For mobile devices*/

            document.execCommand("copy");
            console.log("Copied the text "+ address.value)
        }
    }
    copyPublicKey(){
        const publicKey = document.getElementById("public-key")
        if (publicKey) {
            publicKey.select();
            publicKey.setSelectionRange(0, 99999); /*For mobile devices*/

            document.execCommand("copy");
            console.log("Copied the text "+ publicKey.value)
        }
    }
    // Retrieve the latest transactions
    async getTransactions() {
        const allTxs = await this.dataSource.getAllTransactions(this.currentAccount.addressHex)
        if (allTxs !== undefined) {
            this.updateTransactionList(allTxs)
        }else {
            const section = document.getElementById("noTransactions")
            const toogleBtn = document.getElementById("tooglebtn")
            if (section && toogleBtn) {
                section.style.display = "block"
                toogleBtn.style.display = "none"
            }
            this.setState({visibility: false})
            this.enableLoaderIndicatory(false)
        }
    }
    updateTransactionList(txs) {
        try {
            // Transaction list section
            const section = document.getElementById('transation-list-section')
            // Invert the list
            const rTxs = txs.reverse()
            // Images src paths
            const sentImgSrc = sent
            const receivedImgSrc = received
            let idCounter = 1
            rTxs.forEach(tx => {
                const events = JSON.parse(tx.tx_result.log)[0].events

                if (events[1].type === "transfer") {
                    const attributes = events[1].attributes
                    if (attributes[1].key === "amount") {
                        const value = attributes[1].value.replace("upokt","")
    
                        const txHash = tx.hash
                        const imageSrc = tx.type.toLowerCase() === "sent" ? sentImgSrc : receivedImgSrc
                        const TrClass = document.getElementById("tr-element").className
                        const TdClass = document.getElementById("td-element").className
                        
                        const txTemplate = '<Tr class="'+TrClass+'">\n' +
                            '<Td class="'+TdClass+'"> <img src='+ imageSrc +' alt="'+ tx.type.toLowerCase() +'" /> </Td>\n' +
                            '<Td class="'+TdClass+'"> <div class="qty">'+ value / 1000000 +' <span>POKT</span></div> <div class="status">'+ tx.type.toLowerCase() +'</div> </Td>\n' +
                            '<Td class="'+TdClass+' block-align">'+tx.height+'</Td>\n' +
                            '<Td class="'+TdClass+'"> <a id="txHashElement'+idCounter+'"> '+txHash+' </a> </Td>\n' +
                        '</Tr>'
                        section.insertAdjacentHTML('beforeend', txTemplate)
                        // Add onClick event to the clickable element
                        const toTxDetail = document.getElementById("txHashElement"+idCounter)
                        if (toTxDetail) {
                            toTxDetail.addEventListener("click", () => { this.pushToTxDetail(txHash) })
                        }
                        idCounter++
                    }else {
                        console.dir(attributes, {depth: null})
                    }
                }
            })
            // Display the table
            section.style.display = "block"
            this.enableLoaderIndicatory(false)
        } catch (error) {
            console.log(error)
            this.enableLoaderIndicatory(false)
        }
    }
    // Account type, amount staked and staking status
    async addApp() {
        if (this.state.app !== undefined) {
            // Update the staked amount
            const appStakedTokensLabel = document.getElementById("app-staked-tokens-amount")
            if (appStakedTokensLabel) {
                const POKT = Number(this.state.app.stakedTokens.toString()) / 1000000
                appStakedTokensLabel.innerText = POKT
            }
            // Update the unstaking status
            const appStakingStatusLabel = document.getElementById("app-staking-status")
            // Update the status img
            const appStakeStatusImg = document.getElementById("app-stake-status-img")
            if (appStakeStatusImg && appStakingStatusLabel) {
                if (this.state.app.status === 1) {
                    appStakingStatusLabel.innerText = "UNSTAKING"
                    appStakeStatusImg.src = this.state.unstakingImgSrc
                }else if(this.state.app.status === 2){
                    appStakingStatusLabel.innerText = "STAKED"
                    appStakeStatusImg.src = this.state.stakedImgSrc
                }else {
                    appStakingStatusLabel.innerText = "UNSTAKED"
                    appStakeStatusImg.src = this.state.unstakedImgSrc
                }
            }
            // Show the app section
            const appTypeSection = document.getElementById("app-type-section")
            if (appTypeSection) {
                appTypeSection.style.display = "flex"
            }
        }
    }
    // Account type, amount staked and staking status
    async addNode() {
        if (this.state.node !== undefined) {
            // Update the staked amount
            const nodeStakedTokensLabel = document.getElementById("node-staked-tokens-amount")
            if (nodeStakedTokensLabel) {
                const POKT = Number(this.state.node.stakedTokens.toString()) / 1000000
                nodeStakedTokensLabel.innerText = POKT
            }
            // Update the unstaking status
            const nodeStakingStatusLabel = document.getElementById("node-staking-status")
            // Update the status img
            const nodeStakeStatusImg = document.getElementById("node-stake-status-img")
            if (nodeStakeStatusImg && nodeStakingStatusLabel) {
                if (this.state.node.status === 1) {
                    nodeStakeStatusImg.src = this.state.unstakingImgSrc
                    nodeStakingStatusLabel.innerText = "UNSTAKING"
                }else if(this.state.app.status === 2){
                    nodeStakingStatusLabel.innerText = "STAKED"
                    nodeStakeStatusImg.src = this.state.stakedImgSrc
                }else {
                    nodeStakingStatusLabel.innerText = "UNSTAKED"
                    nodeStakeStatusImg.src = this.state.unstakedImgSrc
                }
            }
            
            // Show the app section
            const nodeTypeSection = document.getElementById("node-type-section")
            if (nodeTypeSection) {
                nodeTypeSection.style.display = "flex"
            }
        }
    }
    // Account type, amount staked and staking status
    async addNormalAccount() {
        if (this.state.normal !== undefined) {
            // Show the app section
            const accountTypeSection = document.getElementById("normal-type-section")
            if (accountTypeSection) {
                accountTypeSection.style.display = "flex"
            }
        }
    }
    // Account type, amount staked and staking status
    async getAccountType() {
        const appOrError = await this.dataSource.getApp(this.currentAccount.addressHex)
        if (appOrError !== undefined) {
            this.setState({app: appOrError.application})
            this.addApp()
        }
        const nodeOrError = await this.dataSource.getNode(this.currentAccount.addressHex)
        if (nodeOrError !== undefined) {
            this.setState({node: nodeOrError.node})
            this.addNode()
        }

        if (appOrError === undefined && nodeOrError === undefined) {
            this.setState({normal: true})
            this.addNormalAccount()
        }
    }
    
    // Retrieves the account balance
    async getBalance() {
        const balance = await this.dataSource.getBalance(this.currentAccount.addressHex)

        const poktBalanceElement = document.getElementById('pokt-balance')
        const poktUsdBalanceElement = document.getElementById('pokt-balance-usd')

        if (poktBalanceElement && poktUsdBalanceElement) {
            // Update account detail values
            poktBalanceElement.innerText = balance.toFixed(2) + " POKT"
            poktUsdBalanceElement.innerText = "$ " + (balance * Config.poktUsdValue).toFixed(2) + " USD"
            this.setState({
                addressHex: this.currentAccount.addressHex,
                publicKeyHex: this.currentAccount.publicKeyHex
            })
        }
    }
    pushToTxDetail(txHash) {
        // Check the account info before pushing
        if (this.currentAccount.addressHex === undefined ||
            this.currentAccount.publicKeyHex === undefined ||
            this.currentAccount.ppk === undefined) {
            this.toggleError(true, "No account available, please create an account")
            return
        }
        if (txHash) {
            const accountObj = {
                addressHex: this.currentAccount.addressHex,
                publicKeyHex: this.currentAccount.publicKeyHex,
                ppk: this.currentAccount.ppk,
            }
            const obj = {
                tx: undefined,
                txHash: txHash,
                account: accountObj
            }
            // Move to the account detail
            this.props.history.push({
                pathname: "/transaction-detail",
                data: obj,
            })
        }
    }
    pushToSend() {
        // Check the account info before pushing
        if (this.currentAccount.addressHex === undefined ||
            this.currentAccount.publicKeyHex === undefined ||
            this.currentAccount.ppk === undefined) {
            this.toggleError(true, "No account available, please create an account")
            return
        }
        const accountObj = {
            addressHex: this.currentAccount.addressHex,
            publicKeyHex: this.currentAccount.publicKeyHex,
            ppk: this.currentAccount.ppk,
        }
        // Move to the account detail
        this.props.history.push({
            pathname: "/send",
            data: accountObj,
        })
    }
    reloadBtnState(boolean){
        const reloadBtn = document.getElementById("reload-btn")
        if (reloadBtn) {
            reloadBtn.src = boolean ? this.state.reloadActiveImgSrc : this.state.reloadImgSrc
        }
    }

    // Transaction list toggle
    onToggleBtn() {
        this.setState((prevState) => {
            return { visibility: !prevState.visibility };
        })
    }
    enableLoaderIndicatory(show){
        const loaderElement = document.getElementById("loader")
        if (loaderElement) {
            loaderElement.style.display = show === true ? "block" : "none"
        }
    }
    updateAccountDetails(){
        const addressElement = document.getElementById("address")
        const publicElement = document.getElementById("public-key")
        if (addressElement && publicElement) {
            addressElement.value = this.currentAccount.addressHex
            publicElement.value = this.currentAccount.publicKeyHex
        }
    }
    refreshView() {
        this.enableLoaderIndicatory(true)
        this.updateAccountDetails()
        this.getBalance()
        this.getAccountType()
        this.getTransactions()
    }
    componentDidMount() {
        if (this.currentAccount !== undefined) {
            this.refreshView()
        }

        // Navigation Item
        const navAccount = document.getElementById("navAccount")
        
        if (navAccount) {
            navAccount.style.display = "inline"
        }
        
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
            <AccountLContent>
                <Wrapper className="wide-block-wr">
                    <div className="quantitypokt">
                        <div className="container">
                            <h1 id="pokt-balance" >0.00 POKT</h1>
                            <div style={{flexDirection: "column"}} className="stats">
                                <div className="stat">
                                    <span id="pokt-balance-usd">$ 0 USD</span>
                                    <img 
                                    id="reload-btn"
                                    src={reload}
                                    className="refresh-btn" 
                                    onMouseOut={() => this.reloadBtnState(false)}
                                    onMouseOver={() => this.reloadBtnState(true)}
                                    style={{
                                        src: `${this.state.hovered ? reloadActive : reload}`,
                                        cursor: "pointer"
                                    }}
                                    onClick={this.refreshView} 
                                    alt="reload" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pokt-options">
                        {/* Normal Account Section */}
                        <div style={{ display: "none" }} id="normal-type-section" className="container">
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block"}} src={token} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}}>  0 </h2>
                                </div>
                                <span className="title">Staked POKT</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block"}} id="normal-stake-status-img" src={unstaked} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}}>  UNSTAKED </h2>
                                </div>
                                <span className="title">Staking Status</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block", marginBottom: "4px"}} src={na} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}}> NA</h2>
                                </div>
                                <span className="title">Account Type</span>
                            </div>
                        </div>
                        {/* / Normal Account Section */}
                        {/* NODE Section */}
                        <div style={{ display: "none" }} id="node-type-section" className="container">
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block"}} src={token} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}} id="node-staked-tokens-amount" >  0</h2>
                                </div>
                                <span className="title">Staked POKT</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block"}} id="node-stake-status-img" src={unstaking} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}} id="node-staking-status"> UNSTAKING </h2>
                                </div>
                                <span className="title">Staking Status</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block"}} src={node} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}}>  NODE</h2>
                                </div>
                                <span className="title">Account Type</span>
                            </div>
                        </div>
                        {/* / NODE Section */}
                        {/* APP Section */}
                        <div style={{ display: "none", marginTop: "16px" }} id="app-type-section" className="container">
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block"}} src={token} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}} id="app-staked-tokens-amount">  0 </h2>
                                </div>
                                <span className="title">Staked POKT</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block"}} id="app-stake-status-img" src={unstaking} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}} id="app-staking-status"> UNSTAKING </h2>
                                </div>
                                <span className="title">Staking Status</span>
                            </div>
                            <div className="option">
                                <div className="heading">
                                    <img style={{display: "inline-block"}} src={app} alt="staked tokens"/>
                                    <h2 style={{display: "inline-block", verticalAlign: "bottom"}}>  APP</h2>
                                </div>
                                <span className="title">Account Type</span>
                            </div>
                        </div>
                        {/* / APP Section */}
                        <div className="btn-subm">
                            <Button href="https://dashboard.pokt.network/" dark>Buy POKT</Button>
                            <Button id="send-pokt" onClick={this.pushToSend}>Send</Button>
                        </div> 
                    </div>
                    <form className="pass-pk">
                        <div className="container">
                            <div className="cont-input">
                                <label htmlFor="add">Address</label>
                                <Input style={{height: "11px"}} type="text" name="address" id="address" readonly/>
                                <span className="copy-button" onClick={this.copyAddress}> <img src={copy} alt="copy" /></span>
                            </div>
                            <div className="cont-input second">
                                <label htmlFor="puk">Public Key</label>
                                <Input style={{height: "11px"}} type="text" name="public-k" id="public-key" readonly/>
                                <span className="copy-button" onClick={this.copyPublicKey}> <img src={copy} alt="copy" /></span>
                            </div>
                        </div>
                    </form>
                    <div className="toggle-btn">
                        <ToggleBtn style={{display: "none"}} id="noTransactions">No Transactions</ToggleBtn>
                        <ToggleBtn id="tooglebtn" onClick={this.onToggleBtn}>Latest Transactions</ToggleBtn>
                    </div>
                    <ContainerToggle isVisible={this.state.visibility}>
                        <T>
                            <THead className="latest-tx">
                                <Tr>
                                <Th> </Th>
                                <Th>STATUS</Th>
                                <Th>BLOCK HEIGHT</Th>
                                <Th> TX HASH</Th>
                                </Tr>
                            </THead>
                            <TBody style={{display: "none"}} id="transation-list-section" className="l-tx table-scroll">
                                 <Tr id="tr-element" style={{display: "none"}}>
                                    <Td id="td-element"> <img src={load} alt="loading" /> </Td>
                                    <Td> <div className="qty">0.00 <span>POKT</span></div> <div className="status">Sending</div> </Td>
                                </Tr>
                            </TBody>
                        </T>
                    </ContainerToggle>
                </Wrapper>
            </AccountLContent>
        );
    }
}

export default withRouter(AccountLatest);