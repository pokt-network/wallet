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
import useTransport from "../../../hooks/useTransport";
import { typeGuard } from "@pokt-network/pocket-js";

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
  const {
    updateUser,
    user: { addressHex: userAddress },
  } = useUser();
  const { updateTx } = useTx();
  const {
    isUsingHardwareWallet,
    unjailNode: transportUnjailNode,
    unstakeNode: transportUnstakeNode,
  } = useTransport();
  const [passphrase, setPassphrase] = useState("");
  const [passphraseError, setPassphraseError] = useState("");

  const unjailNode = useCallback(async () => {
    if (isUsingHardwareWallet) {
      const ledgerUnjailResponse = await transportUnjailNode(nodeAddress);

      if (typeGuard(ledgerUnjailResponse, Error)) {
        setPassphraseError(
          ledgerUnjailResponse?.message
            ? ledgerUnjailResponse.message
            : "Failed to send the transaction, please verify the information."
        );
        return;
      }

      updateTx(
        "Unjail",
        userAddress,
        nodeAddress,
        0,
        ledgerUnjailResponse.txhash,
        Number(Config.TX_FEE) / 1000000,
        "Pending",
        "Pending",
        undefined,
        "Pocket Wallet"
      );
      localStorage.setItem("unjailing", true);
      pushToTxDetail(ledgerUnjailResponse.txhash);
      return;
    }

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
          nodeAddress,
          0,
          txResponse.txhash,
          Number(Config.TX_FEE) / 1000000,
          "Pending",
          "Pending",
          undefined,
          "Pocket Wallet"
        );
        localStorage.setItem("unjailing", true);
        pushToTxDetail(txResponse.txhash);
        return;
      } else {
        setPassphrase("Failed to submit unjail tx");
        return;
      }
    } else {
      setPassphraseError("Invalid passphrase");
    }
  }, [
    ppk,
    passphrase,
    pushToTxDetail,
    updateUser,
    updateTx,
    nodeAddress,
    transportUnjailNode,
    isUsingHardwareWallet,
    userAddress,
  ]);

  const unstakeNode = useCallback(async () => {
    if (isUsingHardwareWallet) {
      const ledgerUnjailResponse = await transportUnstakeNode(nodeAddress);

      if (typeGuard(ledgerUnjailResponse, Error)) {
        setPassphraseError(
          ledgerUnjailResponse?.message
            ? ledgerUnjailResponse.message
            : "Failed to send the transaction, please verify the information."
        );
        return;
      }

      updateTx(
        "Unstake",
        userAddress,
        nodeAddress,
        0,
        ledgerUnjailResponse.txhash,
        Number(Config.TX_FEE) / 1000000,
        "Pending",
        "Pending",
        undefined,
        "Pocket Wallet"
      );

      pushToTxDetail(ledgerUnjailResponse.txhash);
      return;
    }

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
          nodeAddress,
          0,
          txResponse.txhash,
          Number(Config.TX_FEE) / 1000000,
          "Pending",
          "Pending",
          undefined,
          "Pocket Wallet"
        );

        pushToTxDetail(txResponse.txhash);
        return;
      } else {
        setPassphraseError("Invalid passphrase");
        return;
      }
    } else {
      setPassphraseError("Invalid passphrase");
    }
  }, [
    passphrase,
    ppk,
    pushToTxDetail,
    updateUser,
    updateTx,
    nodeAddress,
    transportUnstakeNode,
    isUsingHardwareWallet,
    userAddress,
  ]);

  const onPassphraseChange = useCallback(({ value }) => {
    setPassphrase(value);
  }, []);

  return (
    <Modal visible={visible} onClose={onClose} className="pocket-modal">
      <UnjailUnstakeContainer>
        <h1 className="title">
          You are about to send <br /> an {type} transaction{" "}
        </h1>
        {!isUsingHardwareWallet && (
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
        )}
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
