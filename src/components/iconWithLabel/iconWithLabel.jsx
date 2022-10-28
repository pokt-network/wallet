import React from "react";
import IconError from "../../icons/iconError";
import IconLoader from "../../icons/iconLoader";
import IconWithLabelContainer from "./container";

export default function IconWithLabel({ message, show, type, ...props }) {
  return (
    <>
      {show ? (
        <IconWithLabelContainer {...props}>
          {type === "error" && <IconError color="#F93232" className="icon" />}
          {type === "loading" && (
            <IconLoader color="#E8E6F8" className="icon" />
          )}
          <p className={`message ${type}`}>{message}</p>
        </IconWithLabelContainer>
      ) : null}
    </>
  );
}
