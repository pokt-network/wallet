import { typeGuard } from "@pokt-network/pocket-js";
import React, { createContext, useContext } from "react";
import { Config } from "../config/config";
import { getDataSource } from "../datasource";
import useTransport from "../hooks/useTransport";
import { LEDGER_CONFIG } from "../utils/hardwareWallet";
import { useUser } from "./userContext";

const dataSource = getDataSource();

export const LedgerContext = createContext(null);

export function LedgerProvider({ children }) {
  const {
    user: { addressHex: fromAddress, publicKeyHex: publicKey },
  } = useUser();
  const { pocketApp } = useTransport();

  const signTransaction = async (
    memo = "Pocket Wallet",
    type = "pos/Send",
    amount,
    toAddress
  ) => {
    const entropy = Number(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString().toString()

    const tx = {
      chain_id: Config.CHAIN_ID,
      entropy: entropy.toString(),
      fee: [
        {
          amount: Config.TX_FEE || "10000",
          denom: "upokt",
        },
      ],
      memo,
      msg: {
        type,
        value: {
          amount: amount.toString(),
          from_address: fromAddress,
          to_address: toAddress,
        },
      },
    };

    try {
      const stringifiedTx = JSON.stringify(tx);
      const hexTx = Buffer.from(stringifiedTx, "utf-8").toString("hex");
      const sig = await pocketApp.signTransaction(
        LEDGER_CONFIG.derivationPath,
        hexTx
      );

      const ledgerTxResponse = await dataSource.sendTransactionFromLedger(
        publicKey,
        sig.signature,
        tx
      );
      if (typeGuard(ledgerTxResponse, Error)) {
        return ledgerTxResponse;
      }

      return ledgerTxResponse;
    } catch (e) {
      console.error("error: ", e);
      return e;
    }
  };
  return (
    <LedgerContext.Provider value={{ signTransaction }}>
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const ledgerContext = useContext(LedgerContext);

  if (ledgerContext === undefined) {
    throw new Error("useLedger must be used within a LedgerProvider");
  }

  return ledgerContext;
}
