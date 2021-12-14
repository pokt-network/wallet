import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "@pokt-foundation/ui";
import { Route, Switch, useLocation } from "react-router-dom";

import Home from "./home/index";
import Send from "./send/send";
import Create from "./create/createWallet";
import LogOut from "./log-out/index";
import ImportPocket from "./import-pocket/importPocket";
import TransactionDetail from "./transaction-detail/transactionDetail";
import AccountDetail from "./account-detail/accountDetail";
import Header from "../components/header";
import Footer from "../components/footer";

import { TransportProvider } from "../context/transportContext";

const routes = [
  {
    path: "/",
    name: "Home",
    Component: Home,
  },
  {
    path: "/import",
    name: "Import",
    Component: ImportPocket,
  },
  {
    path: "/create",
    name: "Create",
    Component: Create,
  },
  {
    path: "/send",
    name: "Send",
    Component: Send,
  },
  {
    path: "/logout",
    name: "Logout",
    Component: LogOut,
  },
  {
    path: "/account",
    name: "Account",
    Component: AccountDetail,
  },
  {
    path: "/transaction-detail",
    name: "Transaction Detail",
    Component: TransactionDetail,
  },
];

export default function WalletRoutes() {
  const theme = useTheme();
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  const onAnimationEnd = useCallback(() => {
    if (transitionStage === "fadeOut") {
      setTransistionStage("fadeIn");
      setDisplayLocation(location);
    }
  }, [location, transitionStage]);

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <div
      className={transitionStage}
      style={{
        minWidth: "100vw",
        height: "100vh",
        background: `linear-gradient(
            126.96deg,
            ${theme.backgroundGradient1} -5.41%,
            ${theme.backgroundGradient2} 101.86%
          )`,
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <Header />
      <Switch location={displayLocation}>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/import" component={ImportPocket}></Route>
        <Route exact path="/create" component={Create}></Route>

        <TransportProvider>
          <Route exact path="/send" component={Send}></Route>
          <Route exact path="/logout" component={LogOut}></Route>
          <Route exact path="/account" component={AccountDetail}></Route>
          <Route
            exact
            path="/transaction-detail"
            component={TransactionDetail}
          ></Route>
        </TransportProvider>
      </Switch>
      <Footer />
    </div>
  );
}
