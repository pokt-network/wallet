import React from "react";
import Modal from "simple-react-modal";
import Button from "../public/secondaryButton/button";
import Title from "../public/title/title";
import ConfirmActionContainer from "./confirm-action-container";
import ExitIcon from "../../utils/images/exit.png";

export default function ConfirmSelectModal({ show, setShow }) {
  const onClose = () => setShow(false);
  return (
    <Modal
      show={show}
      closeOnOuterClick={true}
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
      containerStyle={{
        maxWidth: "534px",
        height: "250px",
        background: "white",
        boxShadow: "0 43px 39px -40px rgba(0,0,0,0.5)",
        borderRadius: "12px",
        padding: "5px 0px 13px",
        width: "auto",
      }}
      onClose={onClose}
    >
      <ConfirmActionContainer>
        <img src={ExitIcon} alt="exit" className="exitIcon" onClick={onClose} />
        <Title className="title">Confirm action on your Ledger device</Title>
        <Button>Verifying</Button>
      </ConfirmActionContainer>
    </Modal>
  );
}
