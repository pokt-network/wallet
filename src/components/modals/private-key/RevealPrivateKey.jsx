import React, { useCallback, useState } from "react";
import { Banner, Button, Modal } from "@pokt-foundation/ui";

import PrivateKeyContainer from "./container";
import PasswordInput from "../../input/passwordInput";
import CopyButton from "../../copy/copy";
import { getDataSource } from "../../../datasource";
import useWindowSize from "../../../hooks/useWindowSize";

const dataSource = getDataSource();

export default function RevealPrivateKey({ visible, onClose, ppk }) {
  const { width } = useWindowSize();
  const [privateKey, setPrivateKey] = useState("");
  const [passphrase, setPassphrase] = useState("");

  const reveal = useCallback(async () => {
    if (ppk) {
      const account = await dataSource.importPortablePrivateKey(
        passphrase,
        ppk,
        passphrase
      );

      if (account === undefined) {
        //error
        return;
      }

      const unlockedAccount = await dataSource.getUnlockedAccount(
        account.addressHex,
        passphrase
      );

      if (unlockedAccount === undefined) {
        //passphrase
        return;
      }

      setPrivateKey(unlockedAccount.privateKey.toString("hex"));
      setPassphrase("");
    }
  }, [ppk, passphrase]);

  const onPassphraseChange = useCallback(({ value }) => {
    setPassphrase(value);
  }, []);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      width={width > 768 ? undefined : "100%"}
    >
      <PrivateKeyContainer>
        <div className="save-banner">
          <Banner title="SAVE YOUR PRIVATE KEY!" mode="warning">
            You wont be able to reveal it again or restore it. Make a back up
            and store it safely, preferably offline. You’ll need it to access
            your account.
          </Banner>
        </div>

        <label className="passphrase label" htmlFor="passphrase">
          Passphrase
        </label>

        <PasswordInput
          placeholder="Passphrase"
          name="passphrase"
          className="passphrase-input"
          onChange={({ target }) => onPassphraseChange(target)}
        />

        {privateKey && privateKey.length > 0 ? (
          <div className="private-key-container">
            <label className="private-key label">Private Key</label>
            <CopyButton text={privateKey} width="488px" hideAlert />
          </div>
        ) : (
          <Button
            className="reveal-button"
            onClick={reveal}
            wide
            mode="primary"
          >
            Reveal
          </Button>
        )}
      </PrivateKeyContainer>
    </Modal>
  );
}
