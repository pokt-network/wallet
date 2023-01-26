import React, { useCallback, useEffect, useRef, useState } from "react";
import { typeGuard } from "@pokt-network/pocket-js";
import { useHistory } from "react-router";
import { Config } from "../../config/config";
import { getDataSource } from "../../datasource";
import { isAddress } from "../../utils/isAddress";
import { useUser } from "../../context/userContext";
import { useTx } from "../../context/txContext";
import useTransport from "../../hooks/useTransport";
import ConfirmSend from "./confirm";
import SendTransaction from "./sendTransaction";
import { STDX_MSG_TYPES } from "../../utils/validations";
import { UPOKT } from "../../utils/utils";
import { Resolution } from "@unstoppabledomains/resolution";
import { useLoader } from "../../context/loaderContext";

const resolution = new Resolution();

const dataSource = getDataSource();

export default function Send() {
  const history = useHistory();
  const { updateUser, user } = useUser();
  const { updateTx } = useTx();
  const {
    pocketApp,
    isUsingHardwareWallet,
    sendTransaction: sendTransactionWithLedger,
  } = useTransport();
  const { updateLoader } = useLoader();
  const sendRef = useRef(null);
  const [step, setStep] = useState(0);
  const [addressHex, setAddressHex] = useState(undefined);
  const [destinationAddress, setDestinationAddress] = useState(undefined);
  const [publicKeyHex, setPublicKeyHex] = useState(undefined);
  const [ppk, setPpk] = useState(undefined);
  const [amountToSend, setAmountToSend] = useState(0);
  const [upoktBalance, setUpoktBalance] = useState(0);
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [txFee] = useState(Number(Config.TX_FEE));
  const [poktAmount, setPoktAmount] = useState(undefined);
  const [, setPoktAmountUsd] = useState(undefined);
  const [addressError, setAddressError] = useState(undefined);
  const [amountError, setAmountError] = useState(undefined);
  const [passphraseError, setPassphraseError] = useState(undefined);
  const [passphrase, setPassphrase] = useState(undefined);
  const [memoText, setMemoText] = useState("");

  const getAccountBalance = useCallback(async (addressHex) => {
    const upoktBalance = (await dataSource.getBalance(addressHex)) * UPOKT;
    setUpoktBalance(upoktBalance);
  }, []);

  const validate = useCallback(() => {
    if (isAmountValid === false) {
      setAmountError("Invalid amount.");
      return false;
    }

    return true;
  }, [isAmountValid]);

  const pushToTxDetail = useCallback(
    (txHash) => {
      history.push({
        pathname: "/transaction-detail",
        data: { txHash, comesFromSend: true },
        loadFromCache: true,
      });
    },
    [history]
  );

  const sendTransaction = useCallback(async () => {
    if (isUsingHardwareWallet) {
      const ledgerTxResponse = await sendTransactionWithLedger(
        memoText,
        STDX_MSG_TYPES.send,
        amountToSend,
        destinationAddress
      );

      if (typeGuard(ledgerTxResponse, Error)) {
        setPassphraseError(
          ledgerTxResponse?.message
            ? ledgerTxResponse.message
            : "Failed to send the transaction, please verify the information."
        );
        if (sendRef.current) sendRef.current.disabled = false;
        return;
      }

      updateTx(
        "TokenTransfer",
        addressHex,
        destinationAddress,
        amountToSend / UPOKT,
        ledgerTxResponse.txhash,
        txFee / UPOKT,
        "Pending",
        "Pending",
        undefined,
        memoText ? memoText : "Pocket wallet"
      );

      pushToTxDetail(ledgerTxResponse.txhash);
      return;
    }

    if (passphrase && destinationAddress && ppk && amountToSend > 0) {
      const txResponse = await dataSource.sendTransaction(
        ppk,
        passphrase,
        destinationAddress,
        amountToSend,
        memoText ? memoText : undefined
      );

      if (typeGuard(txResponse, Error)) {
        setPassphraseError(
          txResponse?.message
            ? txResponse.message
            : "Failed to send the transaction, please verify the information."
        );
        if (sendRef.current) sendRef.current.disabled = false;
        return;
      }

      updateUser(addressHex, publicKeyHex, ppk);

      updateTx(
        "TokenTransfer",
        addressHex,
        destinationAddress,
        amountToSend / UPOKT,
        txResponse.txhash,
        txFee / UPOKT,
        "Pending",
        "Pending",
        undefined,
        memoText ? memoText : "Pocket wallet"
      );

      pushToTxDetail(txResponse.txhash);
    } else {
      setAddressError("Amount to send or the destination address are invalid.");
      if (sendRef.current) sendRef.current.disabled = false;
    }
  }, [
    isUsingHardwareWallet,
    sendTransactionWithLedger,
    addressHex,
    amountToSend,
    destinationAddress,
    ppk,
    publicKeyHex,
    txFee,
    passphrase,
    pushToTxDetail,
    memoText,
    updateUser,
    updateTx,
  ]);

  const handlePoktValueChange = useCallback(
    ({ value, formattedValue }) => {
      const normalizedValue = Number(value);

      if (value <= 0 || !normalizedValue) {
        setAmountError("Amount to send is invalid.");
        setPoktAmount(0);
        setPoktAmountUsd(0);
        setIsAmountValid(false);
        return;
      }

      const upoktValue = Math.round(normalizedValue * UPOKT);
      if (upoktBalance < upoktValue + txFee) {
        setAmountToSend(upoktValue);
        setPoktAmount(formattedValue);
        setIsAmountValid(false);
        setAmountError("Insufficient balance.");
      } else {
        setAmountToSend(upoktValue);
        setIsAmountValid(true);
        setPoktAmount(formattedValue);
        setAmountError("");
      }
    },
    [txFee, upoktBalance]
  );

  const updateDestinationAddress = useCallback(
    async (value) => {
      updateLoader(true);

      let addr;
      try {
        addr = await resolution.addr(value, "POKT");
      } catch (e) {
        console.error("Resolution Error: ", e);
      }

      if (
        addressHex.toLowerCase() === value.toLowerCase() ||
        addressHex.toLowerCase() === addr.toLowerCase()
      ) {
        setAddressError(
          "Recipient address cannot be the same as the sender's address."
        );
        updateLoader(false);
        return;
      } else if (isAddress(value)) {
        setDestinationAddress(value);
        setAddressError("");
      } else if (isAddress(addr)) {
        setDestinationAddress(addr);
        setAddressError("");
      } else {
        setDestinationAddress(value);
        setAddressError("Address is invalid.");
        updateLoader(false);
        return;
      }

      const isValid = validate();
      if (!isValid) {
        updateLoader(false);
        return;
      }

      updateLoader(false);
      setStep(1);
    },
    [addressHex, updateLoader, validate]
  );

  useEffect(() => {
    const { addressHex, ppk, publicKeyHex } = user;
    const { transport } = pocketApp;

    if (addressHex && publicKeyHex && ppk) {
      setAddressHex(addressHex);
      setPublicKeyHex(publicKeyHex);
      setPpk(ppk);
      getAccountBalance(addressHex);
    } else if (addressHex && publicKeyHex && transport) {
      setAddressHex(addressHex);
      setPublicKeyHex(publicKeyHex);
      getAccountBalance(addressHex);
    } else {
      localStorage.clear();
      history.push({
        pathname: "/",
      });
    }
  }, [history, getAccountBalance, user, pocketApp]);

  return (
    <>
      {step === 0 ? (
        <SendTransaction
          fees={txFee}
          handlePoktValueChange={handlePoktValueChange}
          poktAmount={poktAmount}
          updateDestinationAddress={updateDestinationAddress}
          amountError={amountError}
          addressError={addressError}
          memoText={memoText}
          setMemoText={setMemoText}
          destinationAddress={destinationAddress}
        />
      ) : (
        <ConfirmSend
          step={step}
          setStep={setStep}
          pokts={amountToSend}
          toAddress={destinationAddress}
          sendTransaction={sendTransaction}
          setPassphrase={setPassphrase}
          passphraseError={passphraseError}
          setPassphraseError={setPassphraseError}
          sendRef={sendRef}
        />
      )}
    </>
  );
}
