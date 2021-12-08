import React, { useState, useEffect } from "react";
import { ButtonBase, IconCopy } from "@pokt-foundation/ui";
import CopyButtonContainer from "./container";
import MessageALert from "../messageAlert/messageAlert";

export default function CopyButton({ text, width, ...props }) {
  const [displayAlert, setDisplayAlert] = useState(false);

  const onCopyClick = () => {
    navigator.clipboard.writeText(text);
    setDisplayAlert(true);
    console.log(555);
    if (props.onClick) props.onClick();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayAlert(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [displayAlert]);

  return (
    <CopyButtonContainer width={width} {...props}>
      <ButtonBase className="copy-button" onClick={onCopyClick}>
        <span>{text}</span>
        <IconCopy />
        <MessageALert className={displayAlert ? "active" : ""}>
          Copied!
        </MessageALert>
      </ButtonBase>
    </CopyButtonContainer>
  );
}
