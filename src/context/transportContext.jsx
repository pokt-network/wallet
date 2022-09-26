import React, { createContext, useState, useCallback } from "react";
import WebHIDTransport from "@ledgerhq/hw-transport-webhid";
import WebUSBTransport from "@ledgerhq/hw-transport-webusb";
import AppPokt from "hw-app-pokt";
import { LEDGER_CONFIG } from "../utils/hardwareWallet";
import { Config } from "../config/config";
import { useUser } from "./userContext";
import { getDataSource } from "../datasource";
import { typeGuard } from "@pokt-network/pocket-js";
import { STDX_MSG_TYPES } from "../utils/validations";

const dataSource = getDataSource();

const DEFAULT_TRANSPORT_STATE = {
  pocketApp: "",
  setPocketApp: null,
  onSelectDevice: async () => Promise(),
  removeTransport: async () => null,
  sendTransaction: async () => Promise(),
  isUsingHardwareWallet: false,
  isHardwareWalletLoading: false,
  setIsHardwareWalletLoading: null,
  unjailNode: () => Promise(),
  unstakeNode: () => Promise(),
  stakeNode: () => Promise(),
};

export const TransportContext = createContext(DEFAULT_TRANSPORT_STATE);

export function TransportProvider({ children }) {
  const {
    user: { addressHex: userAddress, publicKeyHex: publicKey },
  } = useUser();
  const [pocketApp, setPocketApp] = useState("");
  const [isHardwareWalletLoading, setIsHardwareWalletLoading] = useState(false);
  const isUsingHardwareWallet = pocketApp?.transport ? true : false;

  const initializePocketApp = useCallback((transport) => {
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

  const sendTransaction = async (
    memo = "Pocket Wallet",
    type = STDX_MSG_TYPES.send,
    amount,
    toAddress
  ) => {
    setIsHardwareWalletLoading(true);
    const entropy = Number(
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    ).toString();

    const tx = {
      chain_id: Config.CHAIN_ID,
      entropy,
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
          from_address: userAddress,
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
        setIsHardwareWalletLoading(false);
        return ledgerTxResponse;
      }

      setIsHardwareWalletLoading(false);
      return ledgerTxResponse;
    } catch (e) {
      console.error("error: ", e);
      setIsHardwareWalletLoading(false);
      return e;
    }
  };

  const unjailNode = async (toAddress) => {
    setIsHardwareWalletLoading(true);
    const entropy = Number(
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    ).toString();

    const tx = {
      chain_id: Config.CHAIN_ID,
      entropy,
      fee: [
        {
          amount: Config.TX_FEE || "10000",
          denom: "upokt",
        },
      ],
      memo: "Unjail Node - Pocket Wallet",
      msg: {
        type: STDX_MSG_TYPES.unjail8,
        value: {
          address: toAddress,
          signer_address: userAddress,
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

      const ledgerTxResponse = await dataSource.unjailNodeFromLedger(
        publicKey,
        sig.signature,
        tx
      );
      if (typeGuard(ledgerTxResponse, Error)) {
        setIsHardwareWalletLoading(false);
        return ledgerTxResponse;
      }
      setIsHardwareWalletLoading(false);
      return ledgerTxResponse;
    } catch (e) {
      console.error("error: ", e);
      setIsHardwareWalletLoading(false);
      return e;
    }
  };

  const unstakeNode = async (validatorAddress) => {
    setIsHardwareWalletLoading(true);
    const entropy = Number(
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    ).toString();

    const tx = {
      chain_id: Config.CHAIN_ID,
      entropy,
      fee: [
        {
          amount: Config.TX_FEE || "10000",
          denom: "upokt",
        },
      ],
      memo: "Unstake Node - Pocket Wallet",
      msg: {
        type: STDX_MSG_TYPES.unstake8,
        value: {
          signer_address: userAddress,
          validator_address: validatorAddress,
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

      const ledgerTxResponse = await dataSource.unstakeNodeFromLedger(
        publicKey,
        sig.signature,
        tx
      );
      if (typeGuard(ledgerTxResponse, Error)) {
        setIsHardwareWalletLoading(false);
        return ledgerTxResponse;
      }
      return ledgerTxResponse;
    } catch (e) {
      console.error("error: ", e);
      setIsHardwareWalletLoading(false);
      return e;
    }
  };

  const stakeNode = async (
    chains,
    publicKey,
    serviceURL,
    amount,
    outputAddress
  ) => {
    setIsHardwareWalletLoading(true);
    const entropy = Number(
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    ).toString();

    const tx = {
      chain_id: Config.CHAIN_ID,
      entropy,
      fee: [
        {
          amount: Config.TX_FEE || "10000",
          denom: "upokt",
        },
      ],
      memo: "Stake Node - Pocket Wallet",
      msg: {
        type: STDX_MSG_TYPES.stake8,
        value: {
          chains,
          output_address: outputAddress,
          public_key: {
            type: "crypto/ed25519_public_key",
            value: publicKey,
          },
          service_url: `${
            serviceURL.protocol ? serviceURL.protocol : "https:"
          }//${serviceURL.hostname}:${
            serviceURL.port ? serviceURL.port : "443"
          }`,
          value: amount,
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
      const ledgerTxResponse = await dataSource.stakeNodeFromLedger(
        publicKey,
        sig.signature,
        serviceURL,
        tx
      );
      if (typeGuard(ledgerTxResponse, Error)) {
        setIsHardwareWalletLoading(false);
        return ledgerTxResponse;
      }
      return ledgerTxResponse;
    } catch (e) {
      console.error("error: ", e);
      setIsHardwareWalletLoading(false);
      return e;
    }
  };

  return (
    <TransportContext.Provider
      value={{
        onSelectDevice,
        pocketApp,
        setPocketApp,
        removeTransport,
        isUsingHardwareWallet,
        sendTransaction,
        isHardwareWalletLoading,
        setIsHardwareWalletLoading,
        unjailNode,
        unstakeNode,
        stakeNode,
      }}
    >
      {children}
    </TransportContext.Provider>
  );
}
