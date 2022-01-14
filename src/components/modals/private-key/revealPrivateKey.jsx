import React, { useCallback, useState, useRef, useEffect } from "react";
import { Banner, Button, IconCopy, Modal, useTheme } from "@pokt-foundation/ui";
import PrivateKeyContainer from "./container";
import PasswordInput from "../../input/passwordInput";
import { getDataSource } from "../../../datasource";
import useWindowSize from "../../../hooks/useWindowSize";
import ErrorLabel from "../../error-label/error";
import MessageALert from "../../messageAlert/messageAlert";
import {
  validationError,
  VALIDATION_ERROR_TYPES,
} from "../../../utils/validations";

const dataSource = getDataSource();

export default function RevealPrivateKey({ visible, onClose, ppk }) {
  const { width } = useWindowSize();
  const theme = useTheme();
  const pkRef = useRef(null);
  const [privateKey, setPrivateKey] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [passphraseError, setPassphraseError] = useState("");
  const [displayAlert, setDisplayAlert] = useState(false);

  const handleCopy = useCallback(() => {
    if (pkRef.current) {
      navigator.clipboard.writeText(pkRef.current.innerText);
      setDisplayAlert(true);
    }
  }, []);

  const reveal = useCallback(async () => {
    if (ppk) {
      const account = await dataSource.importPortablePrivateKey(
        passphrase,
        ppk,
        passphrase
      );

      if (account === undefined) {
        setPassphraseError("Invalid passphrase");
        return;
      }

      const unlockedAccount = await dataSource.getUnlockedAccount(
        account.addressHex,
        passphrase
      );

      if (unlockedAccount === undefined) {
        setPassphraseError("Invalid passphrase");
        return;
      }

      setPassphraseError("");
      setPrivateKey(unlockedAccount.privateKey.toString("hex"));
      setPassphrase("");
    }
  }, [ppk, passphrase]);

  const onPassphraseChange = useCallback(({ value }) => {
    setPassphrase(value);
  }, []);

  const onCloseCleanup = useCallback(() => {
    onClose();
    setPrivateKey("");
    setPassphrase("");
    setPassphraseError("");
    setDisplayAlert(false);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayAlert(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [displayAlert]);

  return (
    <Modal
      visible={visible}
      onClose={onCloseCleanup}
      width={width > 768 ? undefined : "100%"}
      className="pocket-modal"
    >
      <PrivateKeyContainer>
        <div className="save-banner">
          <Banner title="SAVE YOUR PRIVATE KEY!" mode="warning">
            You won't be able to reveal it again or restore it. Make a backup
            and store it safely, preferably offline. You’ll need it to access
            your account.
          </Banner>
        </div>

        {privateKey && privateKey.length > 0 ? null : (
          <PasswordInput
            placeholder="Passphrase"
            name="passphrase"
            className="passphrase-input"
            onChange={({ target }) => onPassphraseChange(target)}
            color={theme.accentAlternative}
            style={
              passphraseError
                ? validationError(VALIDATION_ERROR_TYPES.input)
                : undefined
            }
          />
        )}

        <ErrorLabel message={passphraseError} show={passphraseError} />

        {privateKey && privateKey.length > 0 ? (
          <div className="private-key-container">
            <label className="private-key label">Private Key</label>
            <div className="custom-pk-container">
              <MessageALert className={displayAlert ? "active" : ""}>
                Copied!
              </MessageALert>
              <p ref={pkRef}>{privateKey}</p>
              <IconCopy size="small" onClick={handleCopy} />
            </div>
          </div>
        ) : (
          <div className="reveal-button-container">
            <Button className="reveal-button" onClick={reveal} mode="primary">
              Reveal
            </Button>
          </div>
        )}
      </PrivateKeyContainer>
    </Modal>
  );
}
