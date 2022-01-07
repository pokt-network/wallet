import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "@pokt-foundation/ui";
import { Route, Switch, useLocation } from "react-router-dom";
import Home from "./home/index";
import Send from "./send/send";
import Create from "./create/createWallet";
import ImportPocket from "./import-pocket/importPocket";
import TransactionDetail from "./transaction-detail/transactionDetail";
import AccountDetail from "./account-detail/accountDetail";
import Header from "../components/header";
import Footer from "../components/footer";

import { TransportProvider } from "../context/transportContext";

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
    >
      <Header />
      <Switch location={displayLocation}>
        <div onAnimationEnd={onAnimationEnd} className={transitionStage}>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/import" component={ImportPocket}></Route>
          <Route exact path="/create" component={Create}></Route>

          <TransportProvider>
            <Route exact path="/send" component={Send}></Route>
            <Route exact path="/account" component={AccountDetail}></Route>
            <Route
              exact
              path="/transaction-detail"
              component={TransactionDetail}
            ></Route>
          </TransportProvider>
        </div>
      </Switch>
      <Footer />
    </div>
  );
}
