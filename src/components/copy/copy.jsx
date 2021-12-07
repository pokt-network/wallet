import React from "react";
import { ButtonBase, IconCopy } from "@pokt-foundation/ui";
import CopyButtonContainer from "./container";

export default function CopyButton({ text, width, ...props }) {
  return (
    <CopyButtonContainer width={width} {...props}>
      <ButtonBase className="copy-button">
        <span>{text}</span>
        <IconCopy />
      </ButtonBase>
    </CopyButtonContainer>
  );
}
