import React from "react";
import SimpleModal from "simple-react-modal";
import ModalContainer from "./modal";

export default function Modal({
  children,
  show,
  onClose,
  className,
  containerClassName,
}) {
  return (
    <ModalContainer>
      <SimpleModal
        show={show}
        className={className ? className : "default"}
        containerClassNamwe={
          containerClassName ? containerClassName : "default"
        }
        closeOnOuterClick
        onClose={onClose}
      >
        {children}
      </SimpleModal>
    </ModalContainer>
  );
}
