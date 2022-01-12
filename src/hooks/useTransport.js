import { useContext } from "react";
import { TransportContext } from "../context/transportContext";

function useTransport() {
  const transportContext = useContext(TransportContext);

  if (transportContext === undefined) {
    throw new Error("useTransport must be used within a TransportProvider");
  }

  return transportContext;
}

export default useTransport;
