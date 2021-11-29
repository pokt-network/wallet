import React from "react";
import Button from "../public/secondaryButton/button";
import Title from "../public/title/title";
import ConfirmActionContainer from "./confirm-action-container";
import ExitIcon from "../../utils/images/exit.png";
import Modal from "../public/modal";

export default function ConfirmSelectModal({ show, setShow }) {
  const onClose = () => setShow(false);
  return (
    <Modal show={show} closeOnOuterClick={true} onClose={onClose}>
      <ConfirmActionContainer>
        <img src={ExitIcon} alt="exit" className="exitIcon" onClick={onClose} />
        <Title className="title">Confirm action on your Ledger device</Title>
        <Button>Verifying</Button>
      </ConfirmActionContainer>
    </Modal>
  );
}
