import React, { useCallback, useState } from "react";
import LedgerIcon from "../../utils/images/ledger.png";
import Button from "../public/secondaryButton/button";
import WebTransport from "@ledgerhq/hw-transport-webusb";

export default function ConnectLedgerHome({ setStep, onSelectDevice }) {
  const [loading, setLoading] = useState(false);
  const onConnectClick = useCallback(async () => {
    const transport = await WebTransport.create();
    onSelectDevice(transport);

    // setLoading(true);

    // setTimeout(() => {
    //   setLoading(false);
    //   setStep(1);
    // }, [2000]);
  }, [onSelectDevice]);

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
