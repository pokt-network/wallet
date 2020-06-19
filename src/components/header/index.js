import React, { Component } from "react";
import Wrapper from '../wrapper';
import Menu from "./menu";
import MobileButton from "./mobile-button";
import Logo from "./logo";
import StyledUl from "./ul";
import StyledLi from "./li";
import HeaderContainer from "./header";
import logo from '../../utils/images/logo-white.png';
import arrow from '../../utils/images/right-arrow.png';
import Config from "../../config/config.json"

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuHidden: true
    }
  }

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
                <a href={Config.dashboardBaseUrl}>Buy POKT</a>
              </StyledLi>
              <StyledLi style={{display: "none"}} id="navAccount" className="sub_menu">
                <a href={hrefLink}> Account <img src={arrow} alt="greater than" /> </a>
                <ul>
                  <li><a href style={{cursor: "pointer"}} onClick={this.onLogOut} >Log out</a></li>
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
