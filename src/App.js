import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Main } from "@pokt-foundation/ui";


import history from "./history";
import "./normalize.css";
import JSBI from "jsbi";
import ThemeProvider from "./context/themeContext";
import WalletRoutes from "./views/WalletRoutes";

function App() {
  useEffect(() => {
    // BigInt polyfill for iOS devices
    if (window.BigInt === undefined) {
      window.BigInt = JSBI.BigInt;
    }
  }, []);

  return (
    <Router history={history}>
      <ThemeProvider>
        <div className="loader-container" id="loader">
          <div className="loader"></div>
        </div>
        <Main>
          <WalletRoutes />
        </Main>
      </ThemeProvider>
    </Router>
  );
}

export default App;
