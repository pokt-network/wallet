import React, { createContext, useState, useCallback } from "react";
import { useHistory } from "react-router";

export const TransportContext = createContext();

export function TransportProvider({ children }) {
  const [transport, setTransport] = useState();
  const history = useHistory();

  const onSelectDevice = useCallback(
    (transportCreator) => {
      const transport = transportCreator();

      window.ledgerTransport = transport;
      transport.on("disconnect", () => {
        setTransport(null);

        history.push("/connect");
      });
      setTransport(transport);
    },
    [history]
  );

  return (
    <TransportContext.Provider value={{ transport, onSelectDevice }}>
      {children}
    </TransportContext.Provider>
  );
}
