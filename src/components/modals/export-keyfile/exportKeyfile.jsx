import React, { useState } from "react";
import { Banner, Button, Modal } from "@pokt-foundation/ui";
import useWindowSize from "../../../hooks/useWindowSize";
import ExportKeyfileContainer from "./container";
import PasswordInput from "../../input/passwordInput";
import { useCallback } from "react";
import { getDataSource } from "../../../datasource";
import ErrorLabel from "../../error-label/error";
import { typeGuard } from "@pokt-network/pocket-js";
import { isPassphraseValid } from "../../../utils/validations";

const dataSource = getDataSource();

export default function ExportKeyfile({ visible, onClose }) {
  const { width } = useWindowSize();
  const [privateKey, setPrivateKey] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [privateKeyError, setPrivateKeyError] = useState("");
  const [passphraseError, setPassphraseError] = useState("");

  const exportKeyfile = useCallback(async () => {
    if (!isPassphraseValid(passphrase)) {
      setPassphraseError(
        "Passphrase must be minimum 8 characters, 1 min uppercase letter and 1 special character."
      );
      return;
    }

    if (!dataSource.validatePrivateKey(privateKey)) {
      setPrivateKeyError("Your private key is invalid, please try again.");
      return;
    }

    const account = await dataSource.importAccount(privateKey, passphrase);
    if (typeGuard(account, Error)) {
      setPrivateKeyError(account);
      return;
    }

    const ppkOrError = await dataSource.exportPPK(privateKey, passphrase);
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(ppkOrError);
    const downloadAnchorNode = document.createElement("a");

    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "keyfile.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [passphrase, privateKey]);

  const onCloseCleanup = useCallback(() => {
    setPrivateKeyError("");
    setPrivateKey("");
    setPassphrase("");
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      onClose={onCloseCleanup}
      width={width > 768 ? undefined : "100%"}
      className="pocket-modal"
    >
      <ExportKeyfileContainer>
        <div className="export-banner">
          <Banner title="SAVE YOUR PASSPHRASE" mode="warning">
            This will generate a new keyfile with the given passphrase so
            remember to save it or you will not be able to access your account
            with this keyfile.
          </Banner>
        </div>
        <PasswordInput
          placeholder="Private Key"
          name="private key"
          className="private-key-input"
          onChange={({ target }) => setPrivateKey(target.value)}
        />
        <ErrorLabel
          message={privateKeyError}
          show={privateKeyError}
          className="error"
        />

        <PasswordInput
          placeholder="Keyfile passphrase"
          name="Keyfile passphrase"
          className="keyfile-passphrase-input"
          onChange={({ target }) => setPassphrase(target.value)}
        />
        <ErrorLabel
          message={passphraseError}
          show={passphraseError}
          className="error"
        />

        <div className="export-button-container">
          <Button
            className="export-button"
            onClick={exportKeyfile}
            mode="primary"
          >
            Reveal
          </Button>
        </div>
      </ExportKeyfileContainer>
    </Modal>
  );
}
