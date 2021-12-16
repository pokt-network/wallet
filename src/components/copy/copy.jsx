import React, { useState, useEffect } from "react";
import { TextCopy } from "@pokt-foundation/ui";
import CopyButtonContainer from "./container";
import MessageALert from "../messageAlert/messageAlert";

export default function CopyButton({ text, width, hideAlert, ...props }) {
  const [displayAlert, setDisplayAlert] = useState(false);

  const onCopyClick = (message) => {
    navigator.clipboard.writeText(message);
    setDisplayAlert(true);
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
      <TextCopy
        className="copy-button"
        value={text}
        onCopy={hideAlert ? null : onCopyClick}
        message={text}
      />
      <MessageALert className={displayAlert ? "active" : ""}>
        Copied!
      </MessageALert>
    </CopyButtonContainer>
  );
}
