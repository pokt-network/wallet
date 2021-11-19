import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import Layout from "../../components/connect-ledger";
import ConnectLedgerContent from "./connect-ledger";
import pocketService from "../../core/services/pocket-service";
import ConnectLedgerHome from "../../components/connect-ledger/connect-ledger-home";
import SelectWallet from "../../components/connect-ledger/Select-wallet";

function ConnectLedger({ history }) {
  const [step, setStep] = useState(1);

  // Fix in wallet redesign
  useEffect(() => {
    const { addressHex, publicKeyHex, ppk } = pocketService.getUserInfo();

    if (addressHex && publicKeyHex && ppk) {
      // Navigation Items
      const navAccount = document.getElementById("account-detail-nav");
      const navLogOut = document.getElementById("log-out-nav");

      if (navAccount && navLogOut) {
        navAccount.style.display = "block";
        navLogOut.style.display = "block";
      }
    } else {
      // Clear before redirecting to the login page
      localStorage.clear();
      // Redirect to the home page
      history.push({
        pathname: "/",
      });
    }
  }, [history]);

  return (
    <Layout title={step === 0 ? "Connect Hardware Wallet" : "Select Wallet"}>
      <ConnectLedgerContent>
        {step === 0 ? (
          <ConnectLedgerHome setStep={setStep} />
        ) : (
          <SelectWallet />
        )}
      </ConnectLedgerContent>
    </Layout>
  );
}

export default withRouter(ConnectLedger);
