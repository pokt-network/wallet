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
import copy from '../../utils/images/copy.png';
import {Config} from "../../config/config";
import {
    withRouter
} from 'react-router-dom';
import Modal from "simple-react-modal";
import altertR from "../../utils/images/alert-circle-red.png";
import exit from '../../utils/images/exit.png';
import altertT from '../../utils/images/alert-triangle.png';
import PocketService from "../../core/services/pocket-service";
import { getDataSource } from "../../datasource";

const dataSource = getDataSource();

class AccountLatest extends Component {
    constructor() {
        super();

        this.state = {
            normal: undefined,
            app: undefined,
            node: undefined,
            visibility: true,
            addressHex: "",
            publicKeyHex: "",
            ppk: "",
            poktBalance: 0,
            usdBalance: 0,
            noTransactions: true,
            appStakedTokens: 0,
            nodeStakedTokens: 0,
            appStakingStatus: "UNSTAKED",
            nodeStakingStatus: "UNSTAKED",
            appStakingStatusImg: unstaked,
            nodeStakingStatusImg: unstaked,
            displayApp: false,
            displayNode: false,
            privateKey: undefined,
            displayError: false,
            errorMessage: "",
            displayTxListSection: false,
            unstakingImgSrc: unstaking,
            stakedImgSrc: staked,
            unstakedImgSrc: unstaked,
            reloadImgSrc: reload,
            reloadActiveImgSrc: reloadActive,
            isPkRevealModalVisible: false,
            isUnjailModalVisible: false,
            isUnstakeModalVisible: false,
            maxTxListCount: Number(Config.MIN_TRANSACTION_LIST_COUNT),
            txList: [],
            passphraseInput: "",
            displayPkRevealModal: <i class="fas fa-less"></i>,
            displayUnjailModal: <i class="fas fa-less"></i>,
            displayUnstakeModal: <i class="fas fa-less"></i>,
        };

        // Binds
        this.onToggleBtn = this.onToggleBtn.bind(this);
        this.getBalance = this.getBalance.bind(this);
        this.getAccountType = this.getAccountType.bind(this);
        this.addApp = this.addApp.bind(this);
        this.addNode = this.addNode.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
        this.pushToSend = this.pushToSend.bind(this);
        this.pushToTxDetail = this.pushToTxDetail.bind(this);
        this.refreshView = this.refreshView.bind(this);
        this.enableLoaderIndicatory = this.enableLoaderIndicatory.bind(this);
        this.reloadBtnState = this.reloadBtnState.bind(this);
        this.revealPrivateKey = this.revealPrivateKey.bind(this);
        this.unjailNode = this.unjailNode.bind(this);
        this.unstakeNode = this.unstakeNode.bind(this);
        this.showPkRevealModal = this.showPkRevealModal.bind(this);
        this.closePkRevealModal = this.closePkRevealModal.bind(this);
        this.showUnjailModal = this.showUnjailModal.bind(this);
        this.closeUnjailModal = this.closeUnjailModal.bind(this);
        this.showUnstakeModal = this.showUnstakeModal.bind(this);
        this.closeUnstakeModal = this.closeUnstakeModal.bind(this);
        this.togglePkRevealModal = this.togglePkRevealModal.bind(this);
        this.toggleUnjailModal = this.toggleUnjailModal.bind(this);
        this.toggleUnstakeModal = this.toggleUnstakeModal.bind(this);
    }

    increaseMaxTxListCount() {
      if (this.state.maxTxListCount < Number(Config.MAX_TRANSACTION_LIST_COUNT)) {
        this.setState({ maxTxListCount: this.state.maxTxListCount + 50 });
      }
    }

    maxListCountExceeded() {
      return this.state.maxTxListCount > Number(Config.MAX_TRANSACTION_LIST_COUNT)
    }

    showPkRevealModal() {
        this.setState({
            isPkRevealModalVisible: true,
        });
    }

    closePkRevealModal() {
        this.setState({
            isPkRevealModalVisible: false,
        });

        this.togglePkRevealModal(false);
    }

    showUnjailModal() {
        this.setState({
            isUnjailModalVisible: true,
        });
    }

    closeUnjailModal() {
        this.setState({
            isUnjailModalVisible: false,
        });
        this.toggleUnjailModal(false);
    }

    showUnstakeModal() {
        this.setState({
            isUnstakeModalVisible: true,
        });
    }

    closeUnstakeModal() {
        this.setState({
            isUnstakeModalVisible: false,
        });
        this.toggleUnstakeModal(false);
    }

    togglePkRevealModal(show) {

        this.setState({
            displayPkRevealModal: show
        })
    }

    toggleUnjailModal(show) {
        this.setState({
            displayUnjailModal: show,
        })
    }

    toggleUnstakeModal(show) {
        this.setState({
            displayUnstakeModal: show,
        })
    }

    toggleUnjail(show) {
        this.setState({
            displayConfirmUnjail: show,
        })
    }

    async revealPrivateKey() {
        const {ppk} = this.state;

        const passphraseInput = this.state.passphraseInput;
        // Check for ppk and the element
        if (ppk && passphraseInput) {

            const account = await dataSource.importPortablePrivateKey(
                passphraseInput,
                ppk,
                passphraseInput
            );

            if (account === undefined) {
                this.setState({
                    displayError: true,
                    errorMessage: "Invalid passphrase."
                });

                return;
            }

            const unlockedAccount = await dataSource.getUnlockedAccount(account.addressHex, passphraseInput);

            if (unlockedAccount === undefined) {
                this.setState({
                    displayError: true,
                    errorMessage: "Invalid passphrase."
                });
                return;
            }

            // Show the private key information
            this.setState({
                privateKey: unlockedAccount.privateKey.toString("hex")
            });

            // Clear the passphrase input
            this.setState({passphraseInput: ""})

            // Toggle the passphrase view off
            this.togglePkRevealModal(true);
        }

    }

    async unjailNode() {    
        // Enable loader indicator
        this.enableLoaderIndicatory(true);

        const {ppk} = this.state;
        
        const passphraseInput = this.state.passphraseInput;

        // Check for ppk and the element
        if (ppk && passphraseInput) {

            const account = await dataSource.importPortablePrivateKey(
                passphraseInput,
                ppk,
                passphraseInput
            );

            if (account === undefined) {
                this.setState({
                    displayError: true,
                    errorMessage: "Invalid passphrase."
                });
                this.enableLoaderIndicatory(false);
                return;
            }

            const unlockedAccount = await dataSource.getUnlockedAccount(account.addressHex, passphraseInput);

            if (unlockedAccount === undefined) {
                this.setState({
                    displayError: true,
                    errorMessage: "Invalid passphrase."
                });
                this.enableLoaderIndicatory(false);
                return;
            }
            
            const txResponse = await dataSource.unjailNode(ppk, passphraseInput);
            console.log('TxResponse:', txResponse)

            if (txResponse.txhash !== undefined) {

                this.setState({
                    visibility: true
                });
                // Clear the passphrase input
                this.setState({passphraseInput: ""})

                // Toggle the passphrase view off
                this.toggleUnjailModal(true);

                // Close unjail modal
                this.closeUnjailModal();
              
                const publicKeyHex = unlockedAccount.privateKey.toString("hex");

                // Save the user information locally
                PocketService.saveUserInCache(account.addressHex, publicKeyHex, ppk);

                // Save the tx information locally
                PocketService.saveTxInCache(
                    "Unjail",
                    account.addressHex,
                    account.addressHex,
                    0,
                    txResponse.txhash,
                    Number(Config.TX_FEE) / 1000000,
                    "Pending",
                    "Pending"
                );
              
                localStorage.setItem('unjailing', true);

                // Disable loader indicator
                this.enableLoaderIndicatory(false);

                // Switch to details view
                this.pushToTxDetail(txResponse.txhash, true);

                return;
            } else {
                this.setState({
                    visibility: false,
                    displayError: true,
                    errorMessage: "Failed to submit unjail tx."
                });
                this.enableLoaderIndicatory(false);
                return;
            }
        }
    }

    async unstakeNode() {    
        // Enable loader indicator
        this.enableLoaderIndicatory(true);

        const {ppk} = this.state;
        
        const passphraseInput = this.state.passphraseInput;

        // Check for ppk and the element
        if (ppk && passphraseInput) {

            const account = await dataSource.importPortablePrivateKey(
                passphraseInput,
                ppk,
                passphraseInput
            );

            if (account === undefined) {
                this.setState({
                    displayError: true,
                    errorMessage: "Invalid passphrase."
                });

                return;
            }

            const unlockedAccount = await dataSource.getUnlockedAccount(account.addressHex, passphraseInput);

            if (unlockedAccount === undefined) {
                this.setState({
                    displayError: true,
                    errorMessage: "Invalid passphrase."
                });
                return;
            }
            
            const txResponse = await dataSource.unstakeNode(ppk, passphraseInput);
            console.log('TxResponse:', txResponse)
            
            if (txResponse.txhash !== undefined) {
                this.setState({
                    visibility: true
                });
                // Clear the passphrase input
                this.setState({passphraseInput: ""})

                // Toggle the passphrase view off
                this.toggleUnstakeModal(true);

                // Close unstake modal
                this.closeUnstakeModal();

                const publicKeyHex = unlockedAccount.privateKey.toString("hex");

                // Save the user information locally
                PocketService.saveUserInCache(account.addressHex, publicKeyHex, ppk);

                // Save the tx information locally
                PocketService.saveTxInCache(
                    "Unstake",
                    account.addressHex,
                    account.addressHex,
                    0,
                    txResponse.txhash,
                    Number(Config.TX_FEE) / 1000000,
                    "Pending",
                    "Pending"
                );
              
                // Disable loader indicator
                this.enableLoaderIndicatory(false);

                // Switch to details view
                this.pushToTxDetail(txResponse.txhash, true);

                return;
            } else {
                this.setState({
                    visibility: false,
                    displayError: true,
                    errorMessage: "Failed to submit unstake tx."
                });
                // Disable loader indicator
                this.enableLoaderIndicatory(false);
                return;
            }
        }
    }

    // Retrieve the latest transactions
    async getTransactions(addressHex) {
        const allTxs = await dataSource.getAllTransactions(addressHex, this.state.maxTxListCount);

        if (allTxs !== undefined) {
          this.setState({
              visibility: true,
              noTransactions: false
          });
          this.updateTransactionList(allTxs);
        } else {
          this.setState({
              visibility: false,
              noTransactions: true
          });
          this.enableLoaderIndicatory(false);
        }
    }

    getTransactionData(stdTx) { 
        if (stdTx.msg.type === "pos/MsgUnjail") {
            return { type: "unjail", amount: 0 };
        } else if (stdTx.msg.type === "pos/MsgBeginUnstake") {
            return {type: "unstake", amount: 0 };
        } else {
            const sendAmount = Object.keys(stdTx.msg).includes('amount') ? 
            stdTx.msg.amount / 1000000 : stdTx.msg.value.amount / 1000000;
            return { type: "sent", amount: sendAmount };

        }
    }

    updateTransactionList(txs) {
      try {
        // Invert the list
        const rTxs = txs.reverse();
        // Images src paths
        const sentImgSrc = sent;
        const receivedImgSrc = received;

        const renderTxs = (tx => {
          if (!tx.stdTx.msg.amount && !tx.stdTx.msg.value) {
            return;
          }

          const { type: transactionType, amount } = this.getTransactionData(tx.stdTx);

          return {
            hash: tx.hash,
            imageSrc: tx.type.toLowerCase() === 'sent' ? sentImgSrc : receivedImgSrc,
            amount: amount === typeof number ? amount : 0,
            type: transactionType,
            height: tx.height,
            options: {
              onClick: this.pushToTxDetail.bind(this, tx.hash, false),
              TrClass: document.getElementById("tr-element").className,
              TdClass: document.getElementById("td-element").className,
            }
          }
        });
        const renderedTxs = rTxs.map(renderTxs).filter(i => i);
        this.setState({ txList: renderedTxs })
        // Display the table
        this.setState({displayTxListSection: true});

        this.enableLoaderIndicatory(false);
      } catch (error) {
          console.log(error);
          this.enableLoaderIndicatory(false);
      }
  }

  async addApp() {
      const {app, stakedImgSrc, unstakingImgSrc, unstakedImgSrc} = this.state;

      let obj = {
          stakingStatus: "UNSTAKED",
          stakingStatusImg: unstakedImgSrc,
          stakedTokens: 0
      };

      if (app !== undefined) {
          // Update the staked amount
          if (app.staked_tokens) {
            obj.stakedTokens = (Number(app.staked_tokens.toString()) / 1000000).toFixed(3);
        }

          if (app.status === 1) {
              obj.stakingStatus = "UNSTAKING";
              obj.stakingStatusImg = unstakingImgSrc;
          } else if (app.status === 2){
              obj.stakingStatus = "STAKED";
              obj.stakingStatusImg = stakedImgSrc;
          };
      }

      // Update the state
      this.setState({
          displayApp: true,
          appStakedTokens: obj.stakedTokens,
          appStakingStatus: obj.stakingStatus,
          appStakingStatusImg: obj.stakingStatusImg,
      });
  }

  async addNode() {
      const {node, stakedImgSrc, unstakingImgSrc, unstakedImgSrc} = this.state;
      
      let obj = {
          stakingStatus: "UNSTAKED",
          stakingStatusImg: unstakedImgSrc,
          stakedTokens: 0,
      };


      if (node !== undefined) {
          const isUnjailing = localStorage.getItem('unjailing');

          // Update the staked amount
          if (node.tokens) {
            obj.stakedTokens = (Number(node.tokens.toString()) / 1000000).toFixed(3);
          }

          if (node.status === 1) {
              obj.stakingStatus = "UNSTAKING";
              obj.stakingStatusImg = unstakingImgSrc;
          } else if(node.status === 2) {
              obj.stakingStatus = "STAKED";
              obj.stakingStatusImg = stakedImgSrc;
          } 
          
          if(node.jailed) {
            if (isUnjailing) {
                obj.stakingStatus = "UNJAILING";
            } else {
                obj.stakingStatus = "JAILED";
            }
            obj.stakingStatusImg = stakedImgSrc;
         } else {
            localStorage.setItem('unjailing', false);
         };
      }

      // Update the state
      this.setState({
          displayNode: true,
          nodeStakedTokens: obj.stakedTokens,
          nodeStakingStatus: obj.stakingStatus,
          nodeStakingStatusImg: obj.stakingStatusImg
      });
  }

  // Account type, amount staked and staking status
  async getAccountType(addressHex) {

      // Try to get the app information
      const appOrError = await dataSource.getApp(addressHex);

      if (appOrError !== undefined) {
          this.setState({app: appOrError});
          this.addApp();
      }

      // Try to get the node information
      const nodeOrError = await dataSource.getNode(addressHex);

      if (nodeOrError !== undefined) {
          this.setState({node: nodeOrError});
          this.addNode();
      }

      // If not and app or node, load normal account
      if (appOrError === undefined && nodeOrError === undefined) {
          // Account type, amount staked and staking status
          this.setState({displayNormalAccount: true});
      }
  }

  // Retrieves the account balance
  async getBalance(addressHex) {

      if (addressHex) {
          const balance = await dataSource.getBalance(addressHex);

          // Update account detail values
          const poktBalance = balance.toFixed(2);
          const usdBalance = (balance * Number(Config.POKT_USD_VALUE)).toFixed(2);

          // Save balance to the state
          this.setState({
              poktBalance,
              usdBalance
          })
      }
  }

  pushToTxDetail(txHash, useCache) {
      const {addressHex, publicKeyHex, ppk} = this.state;

      // Check the account info before pushing
      if (!addressHex ||
          !publicKeyHex ||
          !ppk
      ) {
          this.setState({
              errorMessage: "No account available, please create or import an account",
              displayError: true
          });
          return;
      };

      if (txHash) {
          // Move to the account detail
          this.props.history.push({
              pathname: "/transaction-detail",
              data: {txHash},
              loadFromCache: useCache,
          });
       }
  }

  pushToSend() {
      const {addressHex, publicKeyHex, ppk} = this.state;
      // Check the account info before pushing
      if (!addressHex ||
          !publicKeyHex ||
          !ppk
      ) {
          this.setState({
              errorMessage: "No account available, please create an account",
              displayError: true
          });

          return;
      }

      // Move to the send transaction view
      this.props.history.push({
          pathname: "/send"
      });
  }

  reloadBtnState(boolean){
      const {reloadActiveImgSrc, reloadImgSrc} = this.state;
      const reloadBtn = document.getElementById("reload-btn");

      if (reloadBtn) {
          reloadBtn.src = boolean ? reloadActiveImgSrc : reloadImgSrc;
      };
  }

  // Transaction list toggle
  onToggleBtn() {
      this.setState((prevState) => {
          return { visibility: !prevState.visibility };
      });
  }

  enableLoaderIndicatory(show){
      const loaderElement = document.getElementById("loader");
      if (loaderElement) {
          loaderElement.style.display = show === true ? "block" : "none"
      }
  }

  refreshView(addressHex, loadMore = false) {
      this.enableLoaderIndicatory(true);
      this.getBalance(addressHex);
      this.getAccountType(addressHex);

      if (loadMore) {
        this.increaseMaxTxListCount();
      }
      this.getTransactions(addressHex, this.state.maxTxListCount);
  }

  componentDidMount() {

      const {addressHex, publicKeyHex, ppk} = PocketService.getUserInfo();

      if (addressHex && publicKeyHex && ppk) {
          // Navigation Items
          const navLogOut = document.getElementById("log-out-nav");

          if (navLogOut) {
              navLogOut.style.display = "block";
          }

          // Save information to the state
          this.setState({
              addressHex,
              publicKeyHex,
              ppk
          });
          // Load the account balance, type and transaction list
          this.refreshView(addressHex);
      } else {
          // Clear before redirecting to the login page
          localStorage.clear();
          // Redirect to the home page
          this.props.history.push({
              pathname: '/'
          });
      }
  }

  // Render
  render() {
      // Check if current account information is set
      const {
          addressHex,
          publicKeyHex,
          privateKey,
          poktBalance,
          visibility,
          noTransactions,
          appStakedTokens,
          appStakingStatus,
          appStakingStatusImg,
          nodeStakedTokens,
          nodeStakingStatus,
          nodeStakingStatusImg,
          displayApp,
          displayNode,
          displayError,
          errorMessage,
          isPkRevealModalVisible,
          isUnjailModalVisible,
          isUnstakeModalVisible,
          displayNormalAccount,
          displayPkRevealModal,
          displayUnjailModal,
          hovered,
          txList,
      } = this.state;

      if (addressHex === undefined || publicKeyHex === undefined) {
          // Clear before redirecting to the login page
          localStorage.clear();
          // Redirect to the home page
          this.props.history.push({
              pathname: '/'
          })
          return null;
      }

      return (
          <AccountLContent>
              <Wrapper className="wide-block-wr">
                  <div className="quantitypokt">
                      <div className="container">
                          <h1 >{poktBalance} POKT</h1>
                          <div style={{flexDirection: "column"}} className="stats">
                              <div className="stat">
                                  <img
                                  id="reload-btn"
                                  src={reload}
                                  className="refresh-btn"
                                  onMouseOut={() => this.reloadBtnState(false)}
                                  onMouseOver={() => this.reloadBtnState(true)}
                                  style={{
                                      src: `${hovered ? reloadActive : reload}`,
                                      cursor: "pointer",
                                      display: "none"
                                  }}
                                  onClick={() => this.refreshView(addressHex, true)}
                                  alt="reload"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="pokt-options">
                      {/* Normal Account Section */}
                      <div style={{
                          display: displayNormalAccount === true ? "flex" : "none"
                          }} id="normal-type-section" className="container">
                          <div className="option">
                              <div className="heading">
                                  <img style={{
                                      display: "inline-block",
                                      marginRight: "2px",
                                      marginBottom: "-2.4px"
                                      }} src={token} alt="staked tokens"/>
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
                      <div style={{
                          display: displayNode === true ? "flex" : "none"
                          }} id="node-type-section" className="container">
                          <div className="option">
                              <div className="heading">
                              <img style={{
                                      display: "inline-block",
                                      marginRight: "2px",
                                      marginBottom: "-2.4px"
                                      }}src={token} alt="staked tokens"/>
                                  <h2 style={{display: "inline-block", verticalAlign: "bottom"}} id="node-staked-tokens-amount" > {nodeStakedTokens} </h2>
                              </div>
                              <span className="title">Staked POKT</span>
                          </div>
                          <div className="option">
                              <div className="heading">
                                  <img style={{display: "inline-block", marginRight: "2px", marginBottom: "-1px"}} id="node-stake-status-img" src={nodeStakingStatusImg} alt="staked tokens"/>
                                  <h2 style={{display: "inline-block", verticalAlign: "bottom"}} id="node-staking-status"> {nodeStakingStatus} </h2>
                              </div>
                              <span className="title">Staking Status</span>
                          </div>
                          <div className="option">
                              <div className="heading">
                                  <img style={{display: "inline-block", marginRight: "2px", marginBottom: "-1px"}} src={node} alt="staked tokens"/>
                                  <h2 style={{display: "inline-block", verticalAlign: "bottom"}}>  NODE</h2>
                              </div>
                              <span className="title">Account Type</span>
                          </div>
                      </div>
                      {/* / NODE Section */}
                      {/* APP Section */}
                      <div style={{
                          display: displayApp === true ? "flex" : "none",
                          marginTop: "16px"
                          }} id="app-type-section" className="container">
                          <div className="option">
                              <div className="heading">
                                  <img style={{
                                      display: "inline-block",
                                      marginRight: "2px",
                                      marginBottom: "-2.4px"
                                      }} src={token} alt="staked tokens"/>
                                  <h2 style={{display: "inline-block", verticalAlign: "bottom"}} id="app-staked-tokens-amount">  {appStakedTokens} </h2>
                              </div>
                              <span className="title">Staked POKT</span>
                          </div>
                          <div className="option">
                              <div className="heading">
                                  <img style={{display: "inline-block", marginRight: "2px", marginBottom: "-1px"}} id="app-stake-status-img" src={appStakingStatusImg} alt="staked tokens"/>
                                  <h2 style={{display: "inline-block", verticalAlign: "bottom"}} id="app-staking-status"> {appStakingStatus} </h2>
                              </div>
                              <span className="title">Staking Status</span>
                          </div>
                          <div className="option">
                              <div className="heading">
                                  <img style={{display: "inline-block", marginRight: "2px", marginBottom: "-1px"}} src={app} alt="staked tokens"/>
                                  <h2 style={{display: "inline-block", verticalAlign: "bottom"}}>  APP</h2>
                              </div>
                              <span className="title">Account Type</span>
                          </div>
                      </div>
                      {/* / APP Section */}
                      <div className="btn-subm">
                          <Button target="_target" href={Config.BUY_POKT_BASE_URL} dark>Buy POKT</Button>
                          {/* Node Staked */}
                          {nodeStakingStatus === 'JAILED' && <Button id="unjail-node" onClick={this.showUnjailModal} dark>Unjail</Button>}
                          {nodeStakingStatus === 'STAKED' && <Button id="unstake-node" onClick={this.showUnstakeModal} dark>Unstake</Button>}
                          {/* Shared */}
                          <Button id="send-pokt" onClick={this.pushToSend}>Send</Button>
                      </div>
                  </div>
                  <form className="pass-pk">
                      <div className="container">
                          <div className="cont-input">
                              <label htmlFor="add">Address</label>
                              <Input style={{height: "11px", fontSize: "12px"}} type="text" name="address" id="address" defaultValue={addressHex} readOnly={true}/>
                              <span className="copy-button" onClick={() => {navigator.clipboard.writeText(addressHex)}}> <img src={copy} alt="copy" /></span>
                          </div>
                          <div className="cont-input second">
                              <label htmlFor="puk">Public Key</label>
                              <Input style={{height: "11px", fontSize: "12px"}} type="text" name="public-k" id="public-key" defaultValue={publicKeyHex} readOnly={true}/>
                              <span className="copy-button" onClick={() => {navigator.clipboard.writeText(publicKeyHex)}}> <img src={copy} alt="copy" /></span>
                          </div>
                          <div className="cont-input third">
                              <Button id="reveal-pk" onClick={this.showPkRevealModal}>Reveal Private Key</Button>
                          </div>
                      </div>
                  </form>
                  <div className="toggle-btn">
                      <ToggleBtn style={{
                          display: noTransactions === true ? "block" : "none"
                      }} >No Transactions</ToggleBtn>
                      <ToggleBtn style={{
                          display: noTransactions === true ? "none" : "block"
                      }} id="tooglebtn" onClick={this.onToggleBtn}>Latest Transactions</ToggleBtn>
                  </div>
                  <ContainerToggle isVisible={visibility}>
                    <T>
                      <THead className="latest-tx">
                        <Tr>
                          <Th> </Th>
                          <Th>STATUS</Th>
                          <Th>BLOCK HEIGHT</Th>
                          <Th> TX HASH</Th>
                        </Tr>
                      </THead>
                      <TBody style={{display: "block"}} id="transation-list-section" className="l-tx table-scroll">
                        {
                          txList.length && txList
                            .map(
                              ({ options: { TrClass, TdClass, onClick }, ...tx }) => (
                                  <Tr class={TrClass}>
                                    <Td class={TdClass}>
                                      <img src={tx.imageSrc} alt={tx.type.toLowerCase()}/>
                                    </Td>
                                    <Td class={TdClass}>
                                      <div class="qty">
                                        {tx.amount} <span>POKT</span>
                                      </div>
                                      <div class="status">{tx.type.toLowerCase()}</div>
                                    </Td>
                                    <Td class={TdClass+"block-align"}>{tx.height}</Td>
                                    <Td onClick={onClick} class={TdClass}>
                                      <Button
                                        style={{
                                          background: 'none',
                                          color: 'none',
                                          margin: '0px',
                                          padding: '0px',
                                          '-webkit-text-decoration': 'none',
                                          textDecoration: 'none',
                                          borderRadius: '0px',
                                          transition: 'none',
                                        }}
                                        onClick={onClick}>
                                          {tx.hash}
                                        </Button>
                                    </Td>
                                  </Tr>
                            )
                          )
                        }
                         <Tr id="tr-element" style={{display: "none"}}>
                            <Td id="td-element"> <img src={load} alt="loading" /> </Td>
                            <Td> <div className="qty">0.00 <span>POKT</span></div> <div className="status">Sending</div> </Td>
                        </Tr>
                      </TBody>
                    </T>
                    <Button
                      style={{
                          textAlign: "center",
                          width: "119px",
                          display:  this.maxListCountExceeded() ? "none" : "block",
                          padding: "9px 6px",
                          margin: "24px auto 10px auto" }}
                          onClick={() => this.refreshView(addressHex, true)}
                          disabled={this.maxListCountExceeded()}
                      >
                        Load more
                    </Button>
                  </ContainerToggle>
              </Wrapper>
              {/* Reveal PK Modal */}
              <Modal
                      style={{ background: "rgba(0, 0, 0, 0.5)" }} //overwrites the default background
                      containerStyle={{
                          width: "534px",
                          background: "white",
                          boxShadow: "0 43px 39px -40px rgba(0,0,0,0.5)",
                          borderRadius: "12px",
                          padding: "5px 0px 13px"
                      }} //changes styling on the inner content area
                      containerClassName="pocket-modal"
                      closeOnOuterClick={true}
                      show={isPkRevealModalVisible}
                      onClose={this.closePkRevealModal.bind(this)}
                  >
                      <div className="cont-input" style={{textAlign: "center"}}>
                          <label style={{display: isPkRevealModalVisible === true ? "block" : "none"}} id="passphrase-label" className="passphrase-label" htmlFor="private">
                              PASSPHRASE
                          </label>
                          <Input
                              className="reveal-pk-passphrase"
                              style={{
                                  display: isPkRevealModalVisible === true ? "block" : "none",
                                  margin: "8px auto auto auto",
                                  width: "350px" }}
                              type="password"
                              name="reveal-pk-passphrase"
                              id="reveal-pk-passphrase"
                              placeholder="Passphrase"
                              minLength="1"
                              onChange={(e) => this.setState({ passphraseInput: e.target.value })}
                          />
                          <div id="private-key-container" style={{display: displayPkRevealModal === true ? "block" : "none"}}>
                              <label id="private-key-label" className="passphrase-label" htmlFor="private">
                                  PRIVATE KEY
                              </label>
                              <Input style={{
                                  backgroundColor: "#f5f5f5",
                                  height: "20px",
                                  width: "350px",
                                  marginTop: "9px"
                                  }} type="text" name="private-k" id="private-key-input" defaultValue={privateKey ? privateKey : ""} readonly />
                              <span style={{marginTop: "18px"}} className="copy-button" onClick={() => {navigator.clipboard.writeText(privateKey)}}> <img src={copy} alt="copy" /></span>
                          </div>
                      </div>
                      <span id="passphrase-invalid" className="error" style={{ display: displayError === true ? "block" : "none" }}>
                          <img src={altertR} alt="alert" />
                          {` ${errorMessage}`}
                      </span>
                        <Button
                            style={{
                                textAlign: "center",
                                width: "119px",
                                display: displayPkRevealModal === true ? "none" : "block",
                                padding: "9px 6px",
                                margin: "24px auto 10px auto" }}
                            onClick={this.revealPrivateKey.bind(this)}
                        >
                            Reveal
                        </Button>
                        <button className="close" onClick={this.closePkRevealModal.bind(this)}>
                            <img src={exit} alt="exit icon close"/>
                        </button>
                        <div className="alert">
                                <img src={altertT} alt="alert" />
                                <div className="cont-alert">
                                    <div className="title">
                                        <h3>SAVE YOUR PRIVATE KEY!</h3>
                                    </div>
                                    <p>
                                        You wont be able to reveal it again or restore it. Make a back up and store it safely, preferably offline. You’ll need it to access your account.
                                    </p>
                                </div>
                            </div>
                    </Modal>
            {/* Unjail Modal */}
            <Modal
                style={{ background: "rgba(0, 0, 0, 0.5)" }} //overwrites the default background
                containerStyle={{
                    width: "534px",
                    background: "white",
                    boxShadow: "0 43px 39px -40px rgba(0,0,0,0.5)",
                    borderRadius: "12px",
                    padding: "5px 0px 13px"
                }} //changes styling on the inner content area
                containerClassName="pocket-confirm-unjail-modal"
                closeOnOuterClick={true}
                show={isUnjailModalVisible}
                onClose={this.closeUnjailModal.bind(this)}
            >
                <div className="cont-input" style={{textAlign: "center"}}>
                    <label style={{display: isUnjailModalVisible === true ? "block" : "none"}} id="passphrase-label" className="passphrase-label" htmlFor="private">
                        PASSPHRASE
                    </label>
                    <Input
                        className="confirm-unjail-passphrase"
                        style={{
                            display: isUnjailModalVisible === true ? "block" : "none",
                            margin: "8px auto auto auto",
                            width: "350px" }}
                        type="password"
                        name="confirm-unjail-passphrase"
                        id="confirm-unjail-passphrase"
                        placeholder="Passphrase"
                        minLength="1"
                        onChange={(e) => this.setState({ passphraseInput: e.target.value })}
                    />
                </div>
                <span id="passphrase-invalid" className="error" style={{ display: displayError === true ? "block" : "none" }}>
                    <img src={altertR} alt="alert" />
                    {` ${errorMessage}`}
                </span>
                <label style={{fontSize: 14, display: isUnjailModalVisible === true ? "block" : "none", alignContent:'center'}} id="passphrase-label" className="passphrase-label" htmlFor="private">
                        ARE YOU SURE YOU WANT TO GET UNJAILED?
                    </label>
                <Button
                    style={{
                        textAlign: "center",
                        width: "119px",
                        display: displayUnjailModal === true ? "none" : "block",
                        padding: "9px 6px",
                        margin: "24px auto 10px auto" }}
                    onClick={this.unjailNode.bind(this)}
                >
                    Proceed
                </Button>
                <button className="close" onClick={this.closeUnjailModal.bind(this)}>
                    <img src={exit} alt="exit icon close"/>
                </button>
            </Modal>
            {/* Unstake Modal */}
            <Modal
                style={{ background: "rgba(0, 0, 0, 0.5)" }} //overwrites the default background
                containerStyle={{
                    width: "534px",
                    background: "white",
                    boxShadow: "0 43px 39px -40px rgba(0,0,0,0.5)",
                    borderRadius: "12px",
                    padding: "5px 0px 13px"
                }} //changes styling on the inner content area
                containerClassName="pocket-confirm-unstake-modal"
                closeOnOuterClick={true}
                show={isUnstakeModalVisible}
                onClose={this.closeUnstakeModal.bind(this)}
            >
                <div className="cont-input" style={{textAlign: "center"}}>
                    <label style={{display: isUnstakeModalVisible === true ? "block" : "none"}} id="passphrase-label" className="passphrase-label" htmlFor="private">
                        PASSPHRASE
                    </label>
                    <Input
                        className="confirm-unstake-passphrase"
                        style={{
                            display: isUnstakeModalVisible === true ? "block" : "none",
                            margin: "8px auto auto auto",
                            width: "350px" }}
                        type="password"
                        name="confirm-unjail-passphrase"
                        id="confirm-unjail-passphrase"
                        placeholder="Passphrase"
                        minLength="1"
                        onChange={(e) => this.setState({ passphraseInput: e.target.value })}
                    />
                </div>
                <span id="passphrase-invalid" className="error" style={{ display: displayError === true ? "block" : "none" }}>
                    <img src={altertR} alt="alert" />
                    {` ${errorMessage}`}
                </span>
                <label style={{fontSize: 14, display: isUnstakeModalVisible === true ? "block" : "none", alignContent:'center'}} id="passphrase-label" className="passphrase-label" htmlFor="private">
                        ARE YOU SURE YOU WANT TO UNSTAKE?
                    </label>
                <Button
                    style={{
                        textAlign: "center",
                        width: "119px",
                        display: displayUnjailModal === true ? "none" : "block",
                        padding: "9px 6px",
                        margin: "24px auto 10px auto" }}
                    onClick={this.unstakeNode.bind(this)}
                >
                    Proceed
                </Button>
                <button className="close" onClick={this.closeUnstakeModal.bind(this)}>
                    <img src={exit} alt="exit icon close"/>
                </button>
            </Modal>
            </AccountLContent>
        );
    }
}

export default withRouter(AccountLatest);
