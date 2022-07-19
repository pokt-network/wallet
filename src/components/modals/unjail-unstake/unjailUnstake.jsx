import React, { useCallback, useState } from "react";
import { Button, Modal, useTheme } from "@pokt-foundation/ui";

import UnjailUnstakeContainer from "./container";
import PasswordInput from "../../input/passwordInput";
import { getDataSource } from "../../../datasource";
import { Config } from "../../../config/config";
import IconWithLabel from "../../iconWithLabel/iconWithLabel";
import {
  validationError,
  VALIDATION_ERROR_TYPES,
} from "../../../utils/validations";
import { useUser } from "../../../context/userContext";
import { useTx } from "../../../context/txContext";

const dataSource = getDataSource();

export default function UnjailUnstake({
  visible,
  onClose,
  ppk,
  type,
  pushToTxDetail,
  nodeAddress,
}) {
  const theme = useTheme();
  const { updateUser } = useUser();
  const { updateTx } = useTx();
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

      const txResponse = await dataSource.unjailNode(
        ppk,
        passphrase,
        nodeAddress
      );

      if (txResponse.txhash !== undefined) {
        setPassphrase("");
        const publicKeyHex = unlockedAccount.privateKey.toString("hex");
        updateUser(account.addressHex, publicKeyHex, ppk.toString());
        updateTx(
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
  }, [ppk, passphrase, pushToTxDetail, updateUser, updateTx, nodeAddress]);

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

      const txResponse = await dataSource.unstakeNode(
        ppk,
        passphrase,
        nodeAddress
      );

      if (txResponse.txhash !== undefined) {
        setPassphrase("");
        const publicKeyHex = unlockedAccount.privateKey.toString("hex");

        updateUser(account.addressHex, publicKeyHex, ppk.toString());

        updateTx(
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
  }, [passphrase, ppk, pushToTxDetail, updateUser, updateTx, nodeAddress]);

  const onPassphraseChange = useCallback(({ value }) => {
    setPassphrase(value);
  }, []);

  return (
    <Modal visible={visible} onClose={onClose} className="pocket-modal">
      <UnjailUnstakeContainer>
        <h1 className="title">
          You are about to send <br /> an {type} transaction{" "}
        </h1>
        <PasswordInput
          placeholder="Keyfile Passphrase"
          color={theme.accentAlternative}
          onChange={({ target }) => onPassphraseChange(target)}
          style={
            passphraseError
              ? validationError(VALIDATION_ERROR_TYPES.input)
              : undefined
          }
        />
        <IconWithLabel
          message={passphraseError}
          show={passphraseError}
          type="error"
        />
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
