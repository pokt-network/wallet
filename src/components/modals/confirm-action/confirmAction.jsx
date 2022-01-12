import React from "react";
import { Button, Modal } from "@pokt-foundation/ui";
import ConfirmActionContainer from "./container";

export default function ConfirmActionModal({
  visible,
  onClose,
  onContinue,
  onCancel,
}) {
  return (
    <Modal visible={visible} onClose={onClose} className="pocket-modal">
      <ConfirmActionContainer>
        <h1>Confirm action</h1>
        <p>
          Are you sure you want to complete this action? <br /> All your
          progress will be lost if not saved.
        </p>

        <div className="buttons-container">
          <Button onClick={onCancel}>Cancel</Button>
          <Button mode="primary" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </ConfirmActionContainer>
    </Modal>
  );
}
