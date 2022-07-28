import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Main } from "@pokt-foundation/ui";
import JSBI from "jsbi";
import history from "./history";
import "./normalize.css";
import ThemeProvider from "./context/themeContext";
import WalletRoutes from "./views/WalletRoutes";
import { UserContextProvider } from "./context/userContext";
import { TxContextProvider } from "./context/txContext";
import { TransportProvider } from "./context/transportContext";

function App() {
  useEffect(() => {
    // BigInt polyfill for iOS devices
    if (window.BigInt === undefined) {
      window.BigInt = JSBI.BigInt;
    }
  }, []);

  return (
    <Router history={history}>
      <UserContextProvider>
        <TransportProvider>
          <TxContextProvider>
            <ThemeProvider>
              <div className="loader-container" id="loader">
                <div className="loader"></div>
              </div>
              <Main>
                <WalletRoutes />
              </Main>
            </ThemeProvider>
          </TxContextProvider>
        </TransportProvider>
      </UserContextProvider>
    </Router>
  );
}

export default App;
