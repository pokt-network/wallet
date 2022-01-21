import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Wrapper from "../wrapper";
import Menu from "./menu";
import MobileButton from "./mobile-button";
import Logo from "./logo";
import StyledUl from "./ul";
import StyledLi from "./li";
import HeaderContainer from "./header";
import logo from "../../utils/images/pokt-logo.png";
import { Config } from "../../config/config";
import IconLogOut from "../../icons/iconLogout";
import { PUBLIC_ROUTES, ROUTES } from "../../utils/routes";
import { useUser } from "../../context/userContext";
import { useTx } from "../../context/txContext";
import { useHistory } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const history = useHistory();
  const { user, removeUser } = useUser();
  const { removeTx } = useTx();
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onToggleMenu = useCallback(() => {
    setIsMenuHidden((prevState) => !prevState);
  }, []);

  const onLogOut = useCallback(() => {
    removeUser();
    removeTx();
    history.push(ROUTES.import);
  }, [removeUser, removeTx, history]);

  const loggedInCheck = useCallback(() => {
    const { addressHex, publicKeyHex, ppk } = user;
    const userInfo = addressHex && publicKeyHex && ppk;

    if (userInfo) {
      setIsLoggedIn(true);
    } else if (!userInfo) {
      setIsLoggedIn(false);
      if (!PUBLIC_ROUTES.includes(location.pathname)) {
        history.push(ROUTES.home);
      }
    }
  }, [user, history, location]);

  useEffect(() => {
    loggedInCheck();
  });

  return (
    <HeaderContainer isHidden={isMenuHidden}>
      <Wrapper className="header">
        <Logo href={ROUTES.home}>
          <img src={logo} alt="Pocket Network logo" />
        </Logo>
        <Menu isHidden={isMenuHidden}>
          <StyledUl>
            <div className="separator" />
            {isLoggedIn ? (
              <StyledLi>
                <Link
                  to={ROUTES.account}
                  className={
                    location.pathname === ROUTES.account ? "active" : undefined
                  }
                >
                  Account Detail
                </Link>
              </StyledLi>
            ) : null}
            <StyledLi>
              <a tartget="_target" href={Config.BUY_POKT_BASE_URL}>
                Buy POKT
              </a>
            </StyledLi>
            {isLoggedIn ? (
              <StyledLi>
                <button
                  className="nav-button"
                  id="log-out-nav"
                  onClick={onLogOut}
                >
                  Log out
                  <IconLogOut className="log-out-icon" />
                </button>
              </StyledLi>
            ) : null}
          </StyledUl>
        </Menu>
        <MobileButton onClick={onToggleMenu} isOpen={!isMenuHidden} />
      </Wrapper>
    </HeaderContainer>
  );
}
