import {
  Banner,
  Button,
  Modal,
  TextInput,
  useTheme,
} from "@pokt-foundation/ui";
import React, { useCallback } from "react";
import CopyButton from "../../components/copy/copy";
import IconWithLabel from "../../components/iconWithLabel/iconWithLabel";
import PasswordInput from "../../components/input/passwordInput";
import Layout from "../../components/layout";
import {
  SendTransactionModalContainer,
  SendTransactionViewContainer,
} from "../../components/send/confirmSend";
import SendHeaderContainer from "../../components/send/header";
import useTransport from "../../hooks/useTransport";
import useWindowSize from "../../hooks/useWindowSize";
import IconBack from "../../icons/iconBack";

export default function ConfirmSend({
  pokts,
  toAddress,
  step,
  setStep,
  sendTransaction,
  setPassphrase,
  passphraseError,
  sendRef,
}) {
  const theme = useTheme();
  const { width } = useWindowSize();
  const { isUsingHardwareWallet } = useTransport();

  const goBack = useCallback(() => setStep(0), [setStep]);

  const onPassphraseChange = useCallback(
    ({ target }) => {
      const { value } = target;
      setPassphrase(value);
    },
    [setPassphrase]
  );

  const onSendClick = useCallback(() => {
    if (sendRef.current) {
      sendRef.current.disabled = true;
      sendTransaction();
    }
  }, [sendTransaction, sendRef]);

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
          <Modal
            visible={step === 1}
            onClose={goBack}
            padding="44px 24px"
            className="pocket-modal"
          >
            <SendTransactionModalContainer>
              {!isUsingHardwareWallet ? (
                <>
                  <h1 className="title">
                    Confirm your passphrase to complete <br /> the transaction
                  </h1>

                  <div className="password-input-container">
                    <PasswordInput
                      placeholder="Keyfile Passphrase"
                      color={theme.accentAlternative}
                      onChange={(e) => onPassphraseChange(e)}
                    />

                    <IconWithLabel
                      message={passphraseError}
                      show={passphraseError}
                      type="error"
                    />
                  </div>
                </>
              ) : (
                <Banner title="Action Required" mode="info">
                  Please confirm on your ledger device to complete the
                  connection.
                </Banner>
              )}

              <h2 className="you-are-sending">
                You are sending {pokts / 1000000} POKT to:
              </h2>

              <CopyButton text={toAddress} className="to-address" />

              <Button
                mode="primary"
                className="send-button"
                onClick={onSendClick}
                innerRef={sendRef}
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
            {!isUsingHardwareWallet ? (
              <div className="password-input-container">
                <PasswordInput
                  placeholder="Keyfile Passphrase"
                  color={theme.accentAlternative}
                  onChange={(e) => onPassphraseChange(e)}
                />
                <IconWithLabel
                  message={passphraseError}
                  show={passphraseError}
                  type="error"
                />
              </div>
            ) : (
              <Banner title="Action Required" mode="info">
                Please confirm on your ledger device to complete the connection.
              </Banner>
            )}

            <h2>You are sending</h2>
            <p>{pokts / 1000000} POKT</p>

            <CopyButton text={toAddress} className="to-address" />

            <Button
              mode="primary"
              className="send-button"
              wide
              onClick={onSendClick}
              innerRef={sendRef}
            >
              Send
            </Button>

            <div className="back-button-container">
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
