import React, { Component } from "react";
import { NavLink } from 'react-router-dom';

import Wrapper from '../wrapper';
import Menu from "./menu";
import MobileButton from "./mobile-button";
import Logo from "./logo";
import StyledUl from "./ul";
import StyledLi from "./li";
import HeaderContainer from "./header";
import logo from '../../utils/images/logo-white.png';
import arrow from '../../utils/images/right-arrow.png';
import base from "../../config/config.json"
// Assign the base to the config constant
const config = base

class Header extends Component {
  state = {
    isMenuHidden: true
  };

  onToggleMenu() {
    this.setState((prevState) => {
      return { isMenuHidden: !prevState.isMenuHidden };
    });
  };

  onLogOut() {
    // Refresh the page to delete any state information related to the account
    window.location.reload();
  };

  render() {
    let hrefLink = '#';
    return (
      <HeaderContainer isHidden={this.state.isMenuHidden}>
        <Wrapper className="header">
          <Logo href="/"> <img src={logo} alt="logo pocket" /> <span>/ &nbsp; WALLET</span> </Logo>
          <Menu isHidden={this.state.isMenuHidden}>
            <StyledUl>
              <StyledLi>
                <NavLink exact activeClassName="active" to="/send" onClick={this.onToggleMenu}>Send</NavLink>
              </StyledLi>
              <StyledLi>
                <a href={config.dashboardBaseUrl}>Buy POKT</a>
              </StyledLi>
              <StyledLi className="sub_menu">
                <a href={hrefLink}> Account <img src={arrow} alt="greater than" /> </a>
                <ul>
                  
                  <li><a style={{cursor: "pointer"}} onClick={this.onLogOut} >Log out</a></li>
              </ul>
              </StyledLi>
            </StyledUl>
          </Menu>
          <MobileButton onClick={this.onToggleMenu} />
        </Wrapper>
      </HeaderContainer>
    );
  }
}

export default Header;
