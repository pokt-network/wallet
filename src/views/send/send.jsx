import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, TextInput, useTheme } from "@pokt-foundation/ui";

import Layout from "../../components/layout";
import SendHeaderContainer from "../../components/send/header";
import SendContent from "../../components/send/content";
import { SendTransactionModalContainer } from "../../components/send/confirmSend";
import PasswordInput from "../../components/input/passwordInput";
import CopyButton from "../../components/copy/copy";
import useWindowSize from "../../hooks/useWindowSize";
import IconBack from "../../icons/iconBack";
import { Config } from "../../config/config";
import { getDataSource } from "../../datasource";
import pocketService from "../../core/services/pocket-service";
import { typeGuard } from "@pokt-network/pocket-js";
import { useHistory } from "react-router";

const dataSource = getDataSource();

function ConfirmSend({ pokts, toAddress, step, setStep }) {
  const theme = useTheme();
  const { width } = useWindowSize();

  const goBack = useCallback(() => setStep(0), [setStep]);

  return (
    <Layout
      title={
        <SendHeaderContainer>
          <h1
            className="title"
            style={{
              color: theme.content,
            }}
          >
            Confirm your Passphase to complete <br /> the transaction
          </h1>
        </SendHeaderContainer>
      }
    >
      {width > 768 ? (
        <Modal visible={step === 1} onClose={goBack} padding="44px 24px">
          <SendTransactionModalContainer>
            <h1 className="title">
              Confirm your Passphase to complete <br /> the transaction
            </h1>

            <div className="password-input-container">
              <PasswordInput
                placeholder="Keyfile Passphrase"
                color={theme.accentAlternative}
              />
            </div>

            <div className="sending-container">
              <div className="you-are-sending">
                <h2>You are sending</h2>
                <p>{pokts} POKT</p>
              </div>

              <CopyButton
                width="100%"
                text={toAddress}
                className="to-address"
              />
            </div>

            <Button mode="primary" className="send-button">
              Send
            </Button>

            <button className="back-button" onClick={goBack}>
              <IconBack />
              <span>Back</span>
            </button>
          </SendTransactionModalContainer>
        </Modal>
      ) : null}
    </Layout>
  );
}

function SendTransaction({ fees }) {
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
            />
            <label htmlFor="pokt">POKT</label>
          </div>
        </SendHeaderContainer>
      }
    >
      <SendContent>
        <TextInput placeholder="Send to Address" />
        <p>TX Fee {fees}POKT</p>
        <Button mode="primary">Send</Button>
      </SendContent>
    </Layout>
  );
}

export default function Send() {
  let history = useHistory();
  const [step, setStep] = useState(1);
  const [addressHex, setAddressHex] = useState(undefined);
  const [destinationAddress, setDestinationAddress] = useState(undefined);
  const [publicKeyHex, setPublicKeyHex] = useState(undefined);
  const [ppk, setPpk] = useState(undefined);
  const [visibility, setVisibility] = useState(false);
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);
  const [amountToSend, setAmountToSend] = useState(0);
  const [upoktBalance, setUpoktBalance] = useState(0);
  const [isAmountValid, setISAmountValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [txFee, setTxFee] = useState(Number(Config.TX_FEE));
  const [disableSendBtn, setDisableSendBtn] = useState(false);
  const [poktAmount, setPoktAmount] = useState(undefined);
  const [poktAmountUsd, setPoktAmountUsd] = useState(undefined);
  const [modalAmountToSendPokt, setModalAmountToSendPokt] =
    useState("0.00 POKT");
  const [modalAmountToSendUsd, setModalAmountToSendUsd] = useState("0.00 USD");
  const [balanceError, setBalanceError] = useState(undefined);
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
      // this.setState({
      //   isPassModalVisible: false,
      //   addressError: "Invalid Address.",
      // });
      return false;
    }

    if (isAmountValid === false) {
      // this.setState({
      //   isPassModalVisible: false,
      // });
      return false;
    }

    return true;
  }, [isAddressValid, isAmountValid]);

  const pushToTxDetail = useCallback(
    (txHash) => {
      history.push({
        pathname: "/transaction-detail",
        data: { txHash },
        loadFromCache: true,
      });
    },
    [history]
  );

  const sendTransaction = useCallback(async () => {
    // Enable loader indicator
    // this.enableLoaderIndicatory(true);

    // const passphrase = document.getElementById("modal-passphrase");
    // const destinationAddress = document.getElementById("destination-address");

    if (passphrase && destinationAddress && ppk && amountToSend > 0) {
      // Update the state values for the addresses
      // this.setState({
      //   destinationAdress: destinationAddress.value,
      //   disableSendBtn: true,
      // });

      const txResponse = await dataSource.sendTransaction(
        ppk,
        passphrase,
        destinationAddress,
        amountToSend
      );

      if (typeGuard(txResponse, Error)) {
        // Disable loader indicator
        // this.enableLoaderIndicatory(false);
        // Show error message
        // this.togglePassphraseError(
        //   txResponse.message !== undefined
        //     ? txResponse.message
        //     : "Failed to send the transaction, please verify the information."
        // );
        return;
      }

      // Save the user information locally
      pocketService.saveUserInCache(addressHex, publicKeyHex, ppk);

      // Save the tx information locally
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

      // Disable loader indicator
      // this.enableLoaderIndicatory(false);
      // Push to transaction detail page
      pushToTxDetail(txResponse.txhash);
    } else {
      // Disable loader indicator
      // this.enableLoaderIndicatory(false);
      // Show error message
      // this.toggleAddressError(
      //   "Amount to send or the destination address are invalid."
      // );
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

  useEffect(() => {
    const { addressHex, publicKeyHex, ppk } = pocketService.getUserInfo();

    if (addressHex && publicKeyHex && ppk) {
      setAddressHex(addressHex);
      setPublicKeyHex(publicKeyHex);
      setPpk(ppk);
      getAccountBalance(addressHex);
    } else {
      // Clear before redirecting to the login page
      localStorage.clear();
      // Redirect to the home page
      history.push({
        pathname: "/",
      });
    }
  }, [history, getAccountBalance]);

  return (
    <>
      {step === 0 ? (
        <SendTransaction />
      ) : (
        <ConfirmSend
          step={step}
          setStep={setStep}
          pokts="3,293,793.375212"
          toAddress="3b21df976c27a39817aa35dc3235a5188d4d805f"
        />
      )}
    </>
  );
}
