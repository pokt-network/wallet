import React, { useState } from "react";
import useTransport from "../../hooks/useTransport";
import LedgerIcon from "../../utils/images/ledger.png";
import Button from "../public/secondaryButton/button";

export default function ConnectLedgerHome() {
  const { onSelectDevice } = useTransport();
  const [loading] = useState(false);

  return (
    <>
      <p className="connect-description">
        Connect your <img src={LedgerIcon} alt="Ledger wallet" /> Hardware
        Wallet directly to your computer.
      </p>
      <Button onClick={onSelectDevice}>
        {loading ? "Verifying" : "Connect"}
      </Button>
    </>
  );
}
