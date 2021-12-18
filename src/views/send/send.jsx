import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, TextInput, useTheme } from "@pokt-foundation/ui";

import Layout from "../../components/layout";
import SendHeaderContainer from "../../components/send/header";
import SendContent from "../../components/send/content";
import {
  SendTransactionModalContainer,
  SendTransactionViewContainer,
} from "../../components/send/confirmSend";
import PasswordInput from "../../components/input/passwordInput";
import CopyButton from "../../components/copy/copy";
import useWindowSize from "../../hooks/useWindowSize";
import IconBack from "../../icons/iconBack";
import { Config } from "../../config/config";
import { getDataSource } from "../../datasource";
import pocketService from "../../core/services/pocket-service";
import { typeGuard } from "@pokt-network/pocket-js";
import { useHistory } from "react-router";
import { isPassphraseValid } from "../../utils/validations";
import ErrorLabel from "../../components/error-label/error";
import { isAddress } from "../../utils/isAddress";

const dataSource = getDataSource();

function ConfirmSend({
  pokts,
  toAddress,
  step,
  setStep,
  sendTransaction,
  setPassphrase,
  passphraseError,
  theme,
}) {
  const { width } = useWindowSize();

  const goBack = useCallback(() => setStep(0), [setStep]);

  const onPassphraseChange = useCallback(
    ({ target }) => {
      const { value } = target;

      if (!isPassphraseValid(value)) return;

      setPassphrase(value);
    },
    [setPassphrase]
  );

  return (
    <>
      {width > 768 ? (
        <Layout
          title={
            <SendHeaderContainer>
              <h1 className="title">Send Transaction</h1>
              <div className="input-container">
                <TextInput
                  type="number"
                  placeholder="00.00"
                  step="0.01"
                  name="pokt"
                  min={0}
                />
                <label htmlFor="pokt">POKT</label>
              </div>
            </SendHeaderContainer>
          }
        >
          <Modal visible={step === 1} onClose={goBack} padding="44px 24px">
            <SendTransactionModalContainer>
              <h1 className="title">
                Confirm your Passphase to complete <br /> the transaction
              </h1>

              <div className="password-input-container">
                <PasswordInput
                  placeholder="Keyfile Passphrase"
                  color={theme.accentAlternative}
                  onChange={(e) => onPassphraseChange(e)}
                />

                <ErrorLabel message={passphraseError} show={passphraseError} />
              </div>

              <h2 className="you-are-sending">
                You are sending {pokts / 1000000} POKT to:
              </h2>

              <CopyButton text={toAddress} className="to-address" />

              <Button
                mode="primary"
                className="send-button"
                onClick={sendTransaction}
              >
                Send
              </Button>

              <button className="back-button" onClick={goBack}>
                <IconBack />
                <span>Back</span>
              </button>
            </SendTransactionModalContainer>
          </Modal>
        </Layout>
      ) : (
        <Layout
          title={
            <SendHeaderContainer>
              <h1 className="secondary-title">
                Confirm your Passphase to complete the transaction
              </h1>
            </SendHeaderContainer>
          }
        >
          <SendTransactionViewContainer>
            <div className="password-input-container">
              <PasswordInput
                placeholder="Keyfile Passphrase"
                color={theme.accentAlternative}
                onChange={(e) => onPassphraseChange(e)}
              />
              <ErrorLabel message={passphraseError} show={passphraseError} />
            </div>

            <h2>You are sending</h2>
            <p>{pokts / 1000000} POKT</p>

            <CopyButton text={toAddress} className="to-address" />

            <Button
              mode="primary"
              className="send-button"
              wide
              onClick={sendTransaction}
            >
              Send
            </Button>

            <div className="daback-button-container">
              <button className="back-button" onClick={goBack}>
                <IconBack />
                <span>Back</span>
              </button>
            </div>
          </SendTransactionViewContainer>
        </Layout>
      )}
    </>
  );
}

function SendTransaction({
  fees,
  handlePoktValueChange,
  poktAmount,
  updateDestinationAddress,
  validate,
  setStep,
  amountError,
  addressError,
  destinationAddress,
  theme,
}) {
  const onSendClick = useCallback(() => {
    const isValid = validate();

    if (!isValid) {
      return;
    }

    setStep(1);
  }, [validate, setStep]);

  return (
    <Layout
      title={
        <SendHeaderContainer>
          <h1 className="title">Send Transaction</h1>
          <div className="input-container">
            <TextInput
              type="number"
              placeholder="00.00"
              step="0.01"
              name="pokt"
              min={0}
              onChange={handlePoktValueChange}
              value={poktAmount}
            />
            <label htmlFor="pokt">POKT</label>
          </div>
        </SendHeaderContainer>
      }
    >
      <SendContent>
        <TextInput
          placeholder="Send to Address"
          onChange={updateDestinationAddress}
          value={destinationAddress}
          style={{
            border: addressError ? `2px solid ${theme.negative}` : undefined,
          }}
        />
        <p>TX Fee {Number(fees / 1000000).toLocaleString("en-US")} POKT</p>
        <ErrorLabel message={addressError} show={addressError} />
        <ErrorLabel message={amountError} show={amountError} />

        <Button mode="primary" onClick={onSendClick}>
          Send
        </Button>
      </SendContent>
    </Layout>
  );
}

export default function Send() {
  const history = useHistory();
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [addressHex, setAddressHex] = useState(undefined);
  const [destinationAddress, setDestinationAddress] = useState(undefined);
  const [publicKeyHex, setPublicKeyHex] = useState(undefined);
  const [ppk, setPpk] = useState(undefined);
  const [amountToSend, setAmountToSend] = useState(0);
  const [upoktBalance, setUpoktBalance] = useState(0);
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [txFee] = useState(Number(Config.TX_FEE));
  const [poktAmount, setPoktAmount] = useState(undefined);
  const [, setPoktAmountUsd] = useState(undefined);
  const [addressError, setAddressError] = useState(undefined);
  const [amountError, setAmountError] = useState(undefined);
  const [passphraseError, setPassphraseError] = useState(undefined);
  const [passphrase, setPassphrase] = useState(undefined);

  const getAccountBalance = useCallback(async (addressHex) => {
    const upoktBalance = (await dataSource.getBalance(addressHex)) * 1000000;
    setUpoktBalance(upoktBalance);
  }, []);

  const validate = useCallback(() => {
    if (isAddressValid === false) {
      setAddressError("Invalid address");
      return false;
    }

    if (isAmountValid === false) {
      setAmountError("Invalid amount");
      return false;
    }

    return true;
  }, [isAddressValid, isAmountValid]);

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
    if (passphrase && destinationAddress && ppk && amountToSend > 0) {
      const txResponse = await dataSource.sendTransaction(
        ppk,
        passphrase,
        destinationAddress,
        amountToSend
      );

      if (typeGuard(txResponse, Error)) {
        setPassphraseError(
          txResponse?.message
            ? txResponse.message
            : "Failed to send the transaction, please verify the information."
        );
        return;
      }

      pocketService.saveUserInCache(addressHex, publicKeyHex, ppk);
      pocketService.saveTxInCache(
        "TokenTransfer",
        addressHex,
        destinationAddress,
        amountToSend / 1000000,
        txResponse.txhash,
        txFee / 1000000,
        "Pending",
        "Pending"
      );

      pushToTxDetail(txResponse.txhash);
    } else {
      setAddressError("Amount to send or the destination address are invalid.");
    }
  }, [
    addressHex,
    amountToSend,
    destinationAddress,
    ppk,
    publicKeyHex,
    txFee,
    passphrase,
    pushToTxDetail,
  ]);

  const handlePoktValueChange = useCallback(
    ({ target }) => {
      const { value } = target;
      if (value <= 0) {
        setAmountError("Amount to send is invalid.");
        setPoktAmount(0);
        setPoktAmountUsd(0);
        setIsAmountValid(false);
        return;
      }

      const upoktValue = Math.round(value * 1000000);
      if (upoktBalance < upoktValue + txFee) {
        setAmountToSend(upoktValue);
        setPoktAmount(value);
        setIsAmountValid(false);
        setAmountError("Insufficient balance.");
      } else {
        setAmountToSend(upoktValue);
        setIsAmountValid(true);
        setPoktAmount(value);
        setAmountError("");
      }
    },
    [txFee, upoktBalance]
  );

  const updateDestinationAddress = useCallback(
    ({ target }) => {
      const { value } = target;

      if (addressHex.toLowerCase() === value.toLowerCase()) {
        setAddressError(
          "Recipient address cannot be the same as the sender's address."
        );
        setIsAddressValid(false);
      } else if (isAddress(value)) {
        setDestinationAddress(value);
        setIsAddressValid(true);
        setAddressError("");
        return;
      } else {
        setIsAddressValid(false);
        setAddressError("Address is invalid.");
      }
    },
    [addressHex]
  );

  useEffect(() => {
    const { addressHex, publicKeyHex, ppk } = pocketService.getUserInfo();

    if (addressHex && publicKeyHex && ppk) {
      setAddressHex(addressHex);
      setPublicKeyHex(publicKeyHex);
      setPpk(ppk);
      getAccountBalance(addressHex);
    } else {
      localStorage.clear();
      history.push({
        pathname: "/",
      });
    }
  }, [history, getAccountBalance]);

  return (
    <>
      {step === 0 ? (
        <SendTransaction
          fees={txFee}
          handlePoktValueChange={handlePoktValueChange}
          poktAmount={poktAmount}
          validate={validate}
          setStep={setStep}
          updateDestinationAddress={updateDestinationAddress}
          amountError={amountError}
          addressError={addressError}
          destinationAddress={destinationAddress}
          theme={theme}
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
          theme={theme}
        />
      )}
    </>
  );
}
