import React, { createContext, useState, useCallback } from "react";
import WebHIDTransport from "@ledgerhq/hw-transport-webhid";
import WebUSBTransport from "@ledgerhq/hw-transport-webusb";
import U2FTransport from "@ledgerhq/hw-transport-u2f";
import AppPokt from "hw-app-pokt";
import { LEDGER_CONFIG } from "../utils/hardwareWallet";

const DEFAULT_TRANSPORT_STATE = {
  pocketApp: null,
  setPocketApp: null,
  onSelectDevice: () => [null, null],
  removeTransport: () => null,
};

export const TransportContext = createContext(DEFAULT_TRANSPORT_STATE);

export function TransportProvider({ children }) {
  const [pocketApp, setPocketApp] = useState(null);

  const initializePocketApp = useCallback((transport) => {
    transport.setExchangeTimeout = LEDGER_CONFIG.exchangeTimeout;
    const pocket = new AppPokt(transport);
    return pocket;
  }, []);

  const onSelectDevice = useCallback(async () => {
    if (pocketApp?.transport) {
      return [true, initializePocketApp(pocketApp.transport)];
    }

    let transport;
    let error;

    try {
      transport = await WebHIDTransport.create();
      return [true, initializePocketApp(transport)];
    } catch (e) {
      console.error(`HID Transport is not supported: ${e}`);
      error = e;
    }

    if (window.USB) {
      try {
        transport = await WebUSBTransport.create();
        return [true, initializePocketApp(transport)];
      } catch (e) {
        console.error(`WebUSB Transport is not supported: ${e}`);
        error = e;
      }
    } else {
      try {
        transport = await U2FTransport.create();
        return [true, initializePocketApp(transport)];
      } catch (e) {
        console.error(`U2F Transport is not supported: ${e}`);
        error = e;
      }
    }

    return [false, error];
  }, [initializePocketApp, pocketApp]);

  const removeTransport = useCallback(async () => {
    try {
      await pocketApp.transport.close();
      setPocketApp("");
    } catch (e) {
      console.error(`Error closing device: ${e}`);
    }
  }, [pocketApp]);

  return (
    <TransportContext.Provider
      value={{ onSelectDevice, pocketApp, setPocketApp, removeTransport }}
    >
      {children}
    </TransportContext.Provider>
  );
}
