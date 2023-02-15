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
import { UPOKT } from "../../utils/utils";

export default function ConfirmSend({
  pokts,
  toAddress,
  step,
  setStep,
  sendTransaction,
  setPassphrase,
  passphraseError,
  sendRef,
  setPassphraseError,
  uDomain,
}) {
  const theme = useTheme();
  const { width } = useWindowSize();
  const {
    isUsingHardwareWallet,
    isHardwareWalletLoading,
    setIsHardwareWalletLoading,
  } = useTransport();

  const goBack = useCallback(() => {
    setPassphraseError("");
    setStep(0);
    setIsHardwareWalletLoading(false);
  }, [setStep, setPassphraseError, setIsHardwareWalletLoading]);

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
                  value={pokts / UPOKT}
                />
                <label htmlFor="pokt">POKT</label>
              </div>
            </SendHeaderContainer>
          }
        >
          <Modal
            visible={step === 1}
            onClose={isHardwareWalletLoading ? () => null : goBack}
            closeButton={!isHardwareWalletLoading}
            padding="44px 24px"
            className="pocket-modal"
          >
            <SendTransactionModalContainer>
              {!isUsingHardwareWallet && (
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
              )}

              {isUsingHardwareWallet && isHardwareWalletLoading && (
                <div className="ledger-banner-container">
                  <Banner title="Action Required" mode="info">
                    Please confirm on your ledger device to complete the
                    transaction.
                  </Banner>
                </div>
              )}

              <h2 className="you-are-sending">
                You are sending {pokts / UPOKT} POKT to:
              </h2>

              {uDomain && <h3 className="copyBtn-title">Address</h3>}
              <CopyButton text={toAddress} className="to-address" />
              {uDomain && (
                <>
                  <h3 className="copyBtn-title">Domain</h3>
                  <CopyButton text={uDomain} className="to-udomain" />
                </>
              )}

              {isUsingHardwareWallet && (
                <IconWithLabel
                  message={passphraseError}
                  show={passphraseError}
                  type="error"
                />
              )}

              <Button
                mode="primary"
                className="send-button"
                onClick={onSendClick}
                innerRef={sendRef}
              >
                Send
              </Button>

              {isUsingHardwareWallet &&
                passphraseError &&
                !isHardwareWalletLoading && (
                  <button className="back-button" onClick={goBack}>
                    <IconBack />
                    <span>Back</span>
                  </button>
                )}
            </SendTransactionModalContainer>
          </Modal>
        </Layout>
      ) : (
        <Layout
          title={
            <SendHeaderContainer>
              <h1 className="secondary-title">
                {!isUsingHardwareWallet
                  ? "Confirm your Passphase to complete the transaction"
                  : "Confirm your information to complete the transaction"}
              </h1>
            </SendHeaderContainer>
          }
        >
          <SendTransactionViewContainer>
            {!isUsingHardwareWallet && (
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
            )}

            {isUsingHardwareWallet && isHardwareWalletLoading && (
              <div className="ledger-banner-container">
                <Banner title="Action Required" mode="info">
                  Please confirm on your ledger device to complete the
                  transaction.
                </Banner>
              </div>
            )}

            <h2 className="you-are-sending">You are sending</h2>
            <p className="pokt-amount">{pokts / UPOKT} POKT</p>

            {uDomain && <h3 className="copyBtn-title">Address</h3>}
            <CopyButton text={toAddress} className="to-address" />
            {uDomain && (
              <>
                <h3 className="copyBtn-title">Domain</h3>
                <CopyButton text={uDomain} className="to-udomain" />
              </>
            )}

            {isUsingHardwareWallet && (
              <IconWithLabel
                message={passphraseError}
                show={passphraseError}
                type="error"
              />
            )}

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
