import React, { createContext, useState, useCallback } from "react";
import { useHistory } from "react-router";
import WebTransport from "@ledgerhq/hw-transport-webusb";

export const TransportContext = createContext();

export function TransportProvider({ children }) {
  const [transport, setTransport] = useState();
  const history = useHistory();

  const onSelectDevice = useCallback(async () => {
    const transport = await WebTransport.create();

    window.ledgerTransport = transport;
    transport.on("disconnect", () => {
      setTransport(null);

      history.push("/connect");
    });
    setTransport(transport);
  }, [history]);

  return (
    <TransportContext.Provider value={{ transport, onSelectDevice }}>
      {children}
    </TransportContext.Provider>
  );
}
