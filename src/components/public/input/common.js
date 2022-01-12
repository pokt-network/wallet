import React from "react";
import Input from ".";
import UploadIcon from "../../../utils/images/icons/upload.png";
import EyeOffIcon from "../../../utils/images/icons/eye-off.png";

export default function InputCommon({ type, inputProps }) {
  if (type === "upload") {
    return <Input icon={UploadIcon} inputProps={inputProps} />;
  } else if (type === "password") {
    return <Input icon={EyeOffIcon} inputProps={inputProps} />;
  } else if (type === "passwordNoIcon") {
    return <Input type="password" inputProps={inputProps} />;
  }
}
