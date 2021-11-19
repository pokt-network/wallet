import React, { Component } from "react";
import Wrapper from '../wrapper';
import Menu from "./menu";
import MobileButton from "./mobile-button";
import Logo from "./logo";
import StyledUl from "./ul";
import StyledLi from "./li";
import HeaderContainer from "./header";
import logo from '../../utils/images/logo-white.png';
import PocketService from "../../core/services/pocket-service";
import {Link, withRouter} from 'react-router-dom';
import {Config} from "../../config/config";

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuHidden: true,
      isLoggedIn: false,
    }
    this.props = props;
  }

  onToggleMenu() {
    this.setState((prevState) => {
      return { isMenuHidden: !prevState.isMenuHidden };
    });
  };

  onLogOut() {
    // Remove any information related to the account
    PocketService.removeUserFromCached();
    // Remove any tx information from cached
    PocketService.removeTxFromCached();
    // Clear the local storage
    localStorage.clear();
    // Refresh the page
    window.location.reload();
  };

  pushToDetails() {
    this.props.history.push("/account");
  }

  loggedInCheck() {
    const {addressHex, publicKeyHex, ppk} = PocketService.getUserInfo();
    const userInfo = addressHex && publicKeyHex && ppk; 

    if (userInfo && !this.state.isLoggedIn) {
      this.setState({
        isLoggedIn: true
      });
    } else if (!userInfo && this.state.isLoggedIn) {
      this.setState({
        isLoggedIn: false
      })
    }
  }

  componentDidUpdate() {
    this.loggedInCheck()
  }

  componentDidMount() {
    this.loggedInCheck()
  }

  render() {
    const {isMenuHidden, isLoggedIn} = this.state;
    
    return (
      <HeaderContainer isHidden={isMenuHidden}>
        <Wrapper className="header">
          <Logo target="_target" href="https://www.pokt.network/"> <img src={logo} alt="logo pocket" /> <span>/ &nbsp; WALLET</span> </Logo>
          <Menu isHidden={isMenuHidden}>
            <StyledUl>
              <StyledLi>
                <button className="nav-button" id="account-detail-nav" onClick={() => this.pushToDetails()} >Account Detail</button>
              </StyledLi>
              {isLoggedIn ?
                <StyledLi>
                  <Link to="/connect">Connect ledger</Link>
                </StyledLi> : null}
              <StyledLi>
                <a tartget="_target" href={Config.BUY_POKT_BASE_URL}>Buy POKT</a>
              </StyledLi>
              <StyledLi>
                <button className="nav-button" id="log-out-nav" onClick={this.onLogOut} >Log out</button>
              </StyledLi>
            </StyledUl>
          </Menu>
          <MobileButton onClick={() => this.onToggleMenu()} />
        </Wrapper>
      </HeaderContainer>
    );
  }
}

export default withRouter(Header);
