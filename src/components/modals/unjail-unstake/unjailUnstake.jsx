import React, { useCallback, useState } from "react";
import { Button, Modal, useTheme } from "@pokt-foundation/ui";

import UnjailUnstakeContainer from "./container";
import PasswordInput from "../../input/passwordInput";
import { getDataSource } from "../../../datasource";
import pocketService from "../../../core/services/pocket-service";
import { Config } from "../../../config/config";
import ErrorLabel from "../../error-label/error";

const dataSource = getDataSource();

export default function UnjailUnstake({
  visible,
  onClose,
  ppk,
  type,
  pushToTxDetail,
}) {
  const theme = useTheme();
  const [passphrase, setPassphrase] = useState("");
  const [passphraseError, setPassphraseError] = useState("");

  const unjailNode = useCallback(async () => {
    if (ppk && passphrase) {
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

      const txResponse = await dataSource.unjailNode(ppk, passphrase);

      if (txResponse.txhash !== undefined) {
        setPassphrase("");
        const publicKeyHex = unlockedAccount.privateKey.toString("hex");
        pocketService.saveUserInCache(account.addressHex, publicKeyHex, ppk);
        pocketService.saveTxInCache(
          "Unjail",
          account.addressHex,
          account.addressHex,
          0,
          txResponse.txhash,
          Number(Config.TX_FEE) / 1000000,
          "Pending",
          "Pending"
        );
        localStorage.setItem("unjailing", true);
        pushToTxDetail(txResponse.txhash, true);
        return;
      } else {
        setPassphrase("Failed to submit unjail tx");
        return;
      }
    } else {
      setPassphraseError("Invalid passphrase");
    }
  }, [ppk, passphrase, pushToTxDetail]);

  const unstakeNode = useCallback(async () => {
    if (ppk && passphrase) {
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

      const txResponse = await dataSource.unstakeNode(ppk, passphrase);

      if (txResponse.txhash !== undefined) {
        setPassphrase("");
        const publicKeyHex = unlockedAccount.privateKey.toString("hex");

        pocketService.saveUserInCache(account.addressHex, publicKeyHex, ppk);

        pocketService.saveTxInCache(
          "Unstake",
          account.addressHex,
          account.addressHex,
          0,
          txResponse.txhash,
          Number(Config.TX_FEE) / 1000000,
          "Pending",
          "Pending"
        );

        pushToTxDetail(txResponse.txhash, true);
        return;
      } else {
        setPassphraseError("Invalid passphrase");
        return;
      }
    } else {
      setPassphraseError("Invalid passphrase");
    }
  }, [passphrase, ppk, pushToTxDetail]);

  const onPassphraseChange = useCallback(({ value }) => {
    setPassphrase(value);
  }, []);

  return (
    <Modal visible={visible} onClose={onClose}>
      <UnjailUnstakeContainer>
        <h1 className="title">
          You are about to send <br /> an {type} transaction{" "}
        </h1>
        <PasswordInput
          placeholder="Keyfile Passphrase"
          color={theme.accentAlternative}
          onChange={({ target }) => onPassphraseChange(target)}
          style={{
            border: passphraseError ? `2px solid ${theme.negative}` : undefined,
          }}
        />
        <ErrorLabel message={passphraseError} show={passphraseError} />
        <Button
          className="send-button"
          mode="primary"
          onClick={type === "unjail" ? unjailNode : unstakeNode}
        >
          Send
        </Button>
      </UnjailUnstakeContainer>
    </Modal>
  );
}
