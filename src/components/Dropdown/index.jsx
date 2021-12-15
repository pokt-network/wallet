import React from "react";
import DropdownButtonContainer from "./dropdownContainer";

export default function DropdownButton({
  text,
  className,
  icon,
  alt,
  onClick,
  ...props
}) {
  return (
    <DropdownButtonContainer {...props} onClick={onClick}>
      <p>{text}</p>
      <img src={icon} alt={alt} />
    </DropdownButtonContainer>
  );
}
