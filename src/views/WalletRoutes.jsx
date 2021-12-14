import React from "react";
import { useTheme } from "@pokt-foundation/ui";
import { Route, Switch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

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
        position: "relative",
      }}
    >
      <Header />
      <Switch>
        <TransportProvider>
          {routes.map(({ path, Component }) => (
            <Route key={path} exact path={path}>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={300}
                  classNames="page"
                  unmountOnExit
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "15px",
                      right: "15px",
                      top: "80px",
                    }}
                  >
                    <Component />
                  </div>
                </CSSTransition>
              )}
            </Route>
          ))}
        </TransportProvider>
      </Switch>
      <Footer />
    </div>
  );
}
