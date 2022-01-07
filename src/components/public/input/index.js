import React from "react";
import InputWithIconContainer from "./container";
import InputStyled from "./input";

export default function Input({ icon, alt, onClick, inputProps }) {
  return (
    <InputWithIconContainer>
      {icon ? <img src={icon} alt={alt} onClick={onClick} /> : null}
      <InputStyled {...inputProps} />
    </InputWithIconContainer>
  );
}
