import React from "react";
import { Modal } from "@pokt-foundation/ui";
import VerifyAddressContainer from "./container";
import CopyButton from "../../copy/copy";

export default function VerifyAddressModal({ open, address }) {
  return (
    <Modal visible={open} closeButton={false}>
      <VerifyAddressContainer>
        <h3>Confirm Your Wallet Address</h3>
        <p>
          To ensure your transactions are safe and secure, please confirm that
          the wallet address displayed here matches the address shown on your
          Ledger device.
        </p>
        <h4 className="copy-title">Address</h4>
        <CopyButton text={address} width={488} />
      </VerifyAddressContainer>
    </Modal>
  );
}
