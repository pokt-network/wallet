import React from "react";
import { useTheme } from "@pokt-foundation/ui";
import { Route, Switch } from "react-router-dom";

import Home from "./home/index";
import Send from "./send/send";
import Create from "./create/createWallet";
import ConnectLedger from "./connect-ledger";
import LogOut from "./log-out/index";
import ImportPocket from "./import-pocket/importPocket";
import TransactionDetail from "./transaction-detail/transactionDetail";
import AccountDetail from "./account-detail/accountDetail";
import Header from "../components/header";
import Footer from "../components/footer";

import { TransportProvider } from "../context/transportContext";

export default function WalletRoutes() {
  const theme = useTheme();
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
      <Switch>
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
          <Route exact path="/connect" component={ConnectLedger}></Route>
        </TransportProvider>
      </Switch>
      <Footer />
    </div>
  );
}
