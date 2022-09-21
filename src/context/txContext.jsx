import React, { createContext, useContext, useState, useCallback } from "react";

const DEFAULT_TX_STATE = {
  tx: {
    type: "",
    fromAddress: "",
    toAddress: "",
    sentAmount: "",
    txHash: "",
    txFee: 0.01,
    status: "",
    sentStatus: "",
    height: 0,
    memo: "",
    outputAddress: "",
    operatorPublicKey: "",
  },
  updateTx: () => null,
  removeTx: () => null,
};

const TxContext = createContext(DEFAULT_TX_STATE);

export function useTx() {
  const context = useContext(TxContext);

  if (!context) {
    throw new Error("useTx cannot be used without declaring the provider");
  }

  return context;
}

export function TxContextProvider({ children }) {
  const [tx, setTx] = useState({
    type: "",
    fromAddress: "",
    toAddress: "",
    sentAmount: "",
    txHash: "",
    txFee: 0.01,
    status: "",
    sentStatus: "",
    height: 0,
    memo: "",
    outputAddress: "",
    operatorPublicKey: "",
  });

  const updateTx = useCallback(
    (
      type,
      fromAddress,
      toAddress,
      sentAmount,
      txHash,
      txFee,
      status,
      sentStatus,
      height,
      memo,
      operatorPublicKey = "",
      outputAddress = ""
    ) => {
      setTx({
        type,
        fromAddress,
        toAddress,
        sentAmount,
        txHash,
        txFee,
        status,
        sentStatus,
        height,
        memo,
        operatorPublicKey,
        outputAddress,
      });
    },
    []
  );

  const removeTx = useCallback(() => {
    setTx(DEFAULT_TX_STATE);
  }, []);

  return (
    <TxContext.Provider value={{ tx, updateTx, removeTx }}>
      {children}
    </TxContext.Provider>
  );
}
