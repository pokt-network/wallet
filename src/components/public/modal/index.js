import React from "react";
import SimpleModal from "simple-react-modal";
import ModalContainer from "./modal";

export default function Modal({
  children,
  show,
  onClose,
  className,
  modalClassName,
  containerClassName,
}) {
  return (
    <ModalContainer
      className={className}
      modalClassName={modalClassName}
      containerClassNamwe={containerClassName}
    >
      <SimpleModal
        show={show}
        className={modalClassName}
        containerClassNamwe={containerClassName}
        closeOnOuterClick
        onClose={onClose}
      >
        {children}
      </SimpleModal>
    </ModalContainer>
  );
}
