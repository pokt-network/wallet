import React from "react";
import DropdownButton from "../Dropdown/index";
import AccordionContainer from "./container";
import ArrowDownIcon from "../../utils/images/icons/arrow-down.png";

export default function Accordion({ text, children }) {
  return (
    <AccordionContainer>
      <DropdownButton
        text={text}
        icon={ArrowDownIcon}
        alt="down arrow"
        className="text-with-action"
      />

      <div className="action-container">{children}</div>
    </AccordionContainer>
  );
}
