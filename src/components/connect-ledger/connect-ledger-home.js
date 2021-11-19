import React, { useCallback, useState } from "react";
import LedgerIcon from "../../utils/images/ledger.png";
import Button from "../public/secondaryButton/button";

export default function ConnectLedgerHome({ setStep }) {
  const [loading, setLoading] = useState(false);
  const onConnectClick = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep(1);
    }, [2000]);
  }, [setStep]);

  return (
    <>
      <p className="connect-description">
        Connect your <img src={LedgerIcon} alt="Ledger wallet" /> Hardware
        Wallet directly to your computer.
      </p>
      <Button onClick={onConnectClick}>
        {loading ? "Verifying" : "Connect"}
      </Button>
    </>
  );
}
