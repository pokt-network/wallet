import React from "react";
import { useTheme } from "@pokt-foundation/ui";

import IconError from "../../icons/iconError";
import ErrorLabelContainer from "./container";

export default function ErrorLabel({ message, show, ...props }) {
  const theme = useTheme();
  return (
    <>
      {show ? (
        <ErrorLabelContainer {...props}>
          <IconError color={theme.negative} className="icon" />
          <p className="message">{message}</p>
        </ErrorLabelContainer>
      ) : null}
    </>
  );
}
