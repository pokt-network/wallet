import React from "react";
import { Modal } from "@pokt-foundation/ui";
import TroubleConnectingContainer from "./container";

export default function TroubleConnectingModal({ open, onClose }) {
  return (
    <Modal onClose={onClose} visible={open}>
      <TroubleConnectingContainer>
        <h3>Having trouble to connect? Try this</h3>
        <ol>
          <li>Connect the ledger device to your wallet</li>
          <li>Enter your pin on the device to access</li>
          <li>Make sure you have installed the Pocket App</li>
          <li>Have it open on your device</li>
        </ol>

        <p>
          If you have not installed the Pocket App add it to your ledger on the
          app manager{" "}
          <a
            href="https://www.ledger.com/ledger-live"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ledger Live
          </a>
          .
        </p>
      </TroubleConnectingContainer>
    </Modal>
  );
}
