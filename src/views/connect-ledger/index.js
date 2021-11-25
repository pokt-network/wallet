import React, { useEffect } from "react";
import { withRouter } from "react-router";
import Layout from "../../components/connect-ledger";
import ConnectLedgerContent from "./connect-ledger";
import pocketService from "../../core/services/pocket-service";
import ConnectLedgerHome from "../../components/connect-ledger/connect-ledger-home";
import SelectWallet from "../../components/connect-ledger/Select-wallet";
import Card from "../../components/public/card/card";
import useTransport from "../../hooks/useTransport";

function ConnectLedger({ history }) {
  const { transport, onSelectDevice } = useTransport();

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
    <Layout title={!transport ? "Connect Hardware Wallet" : "Select Wallet"}>
      <Card>
        <ConnectLedgerContent>
          {!transport ? (
            <ConnectLedgerHome onSelectDevice={onSelectDevice} />
          ) : (
            <SelectWallet transport={transport} />
          )}
        </ConnectLedgerContent>
      </Card>
    </Layout>
  );
}

export default withRouter(ConnectLedger);
