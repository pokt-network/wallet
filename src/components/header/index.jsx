import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
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
import IconWallet from "../../icons/iconWallet";
import IconDollarSign from "../../icons/iconDollarSign";
import { PUBLIC_ROUTES, ROUTES } from "../../utils/routes";
import { useUser } from "../../context/userContext";
import { useTx } from "../../context/txContext";
import useTransport from "../../hooks/useTransport";
import useWindowSize from "../../hooks/useWindowSize";

export default function Header() {
  const location = useLocation();
  const history = useHistory();
  const { width } = useWindowSize();
  const { user, removeUser } = useUser();
  const { pocketApp, removeTransport } = useTransport();
  const { removeTx } = useTx();
  const [isMenuHidden, setIsMenuHidden] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onToggleMenu = useCallback(() => {
    setIsMenuHidden((prevState) => !prevState);
  }, []);

  const onLogOut = useCallback(() => {
    removeUser();
    removeTx();
    removeTransport();
    history.push(ROUTES.import);
  }, [removeUser, removeTx, removeTransport, history]);

  const loggedInCheck = useCallback(() => {
    const { addressHex, publicKeyHex, ppk } = user;
    const { transport } = pocketApp;
    const userInfo =
      transport && addressHex ? true : addressHex && publicKeyHex && ppk;

    if (userInfo) {
      setIsLoggedIn(true);
    } else if (!userInfo) {
      setIsLoggedIn(false);
      if (!PUBLIC_ROUTES.includes(location.pathname)) {
        history.push(ROUTES.home);
      }
    }
  }, [user, history, location, pocketApp]);

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
            {isLoggedIn && (
              <StyledLi
                className={
                  location.pathname === ROUTES.account ? "active" : undefined
                }
              >
                <Link
                  to={ROUTES.account}
                  className={
                    location.pathname === ROUTES.account ? "active" : undefined
                  }
                >
                  {width <= 767 && <IconWallet className="mobile-menu-icon" />}
                  Account Detail
                </Link>
              </StyledLi>
            )}
            <StyledLi>
              <a tartget="_target" href={Config.BUY_POKT_BASE_URL}>
                {width <= 767 && (
                  <IconDollarSign className="mobile-menu-icon" />
                )}
                Buy POKT
              </a>
            </StyledLi>
            {isLoggedIn && (
              <StyledLi>
                <Link
                  to={ROUTES.nonCustodial}
                  className={
                    location.pathname === ROUTES.nonCustodial
                      ? "active"
                      : undefined
                  }
                >
                  Custodial Nodes
                </Link>
              </StyledLi>
            )}
            {isLoggedIn && (
              <StyledLi>
                <button
                  className="nav-button"
                  id="log-out-nav"
                  onClick={onLogOut}
                >
                  {!isMenuHidden && <IconLogOut className="mobile-menu-icon" />}
                  Log out
                  {isMenuHidden && <IconLogOut className="log-out-icon" />}
                </button>
              </StyledLi>
            )}
          </StyledUl>
        </Menu>
        <MobileButton onClick={onToggleMenu} isOpen={!isMenuHidden} />
      </Wrapper>
    </HeaderContainer>
  );
}
