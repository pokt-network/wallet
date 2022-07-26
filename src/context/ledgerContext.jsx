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
    window.BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    const entropy = Math.floor(Math.random() * 99999999999999999);

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
      console.log("stringify: ", stringifiedTx);
      console.log("hex: ", hexTx);

      const sig = await pocketApp.signTransaction(
        LEDGER_CONFIG.derivationPath,
        hexTx
      );
      console.log("sig: ", sig);

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
