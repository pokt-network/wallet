import React from "react";
import IconError from "../../icons/iconError";
import ErrorLabelContainer from "./container";

export default function ErrorLabel({ message, show, ...props }) {
  return (
    <>
      {show ? (
        <ErrorLabelContainer {...props}>
          <IconError color="#F93232" className="icon" />
          <p className="message">{message}</p>
        </ErrorLabelContainer>
      ) : null}
    </>
  );
}
