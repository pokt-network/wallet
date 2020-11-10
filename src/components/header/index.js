import React, { Component } from "react";
import Wrapper from '../wrapper';
import Menu from "./menu";
import MobileButton from "./mobile-button";
import Logo from "./logo";
import StyledUl from "./ul";
import StyledLi from "./li";
import HeaderContainer from "./header";
import logo from '../../utils/images/logo-white.png';
import Config from "../../config/config.json";
import PocketService from "../../core/services/pocket-service";
import {withRouter} from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuHidden: true
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
    // Refresh the page
    window.location.reload();
  };

  pushToDetails() {
    // const accountDetailsPage = `${window.location.hostname}:3000/account`;
    // console.log(accountDetailsPage);
    // window.location.replace(accountDetailsPage);
    // eslint-disable-next-line react/prop-types
    this.props.history.push("/account");
  }

  render() {
    const {isMenuHidden} = this.state;
    
    return (
      
      <HeaderContainer isHidden={isMenuHidden}>
        <Wrapper className="header">
          <Logo target="_target" href="https://www.pokt.network/"> <img src={logo} alt="logo pocket" /> <span>/ &nbsp; WALLET</span> </Logo>
          <Menu isHidden={isMenuHidden}>
            <StyledUl>
            <StyledLi>
                <button className="nav-button" id="account-detail-nav" onClick={() => this.pushToDetails()} >Account Detail</button>
              </StyledLi>
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
