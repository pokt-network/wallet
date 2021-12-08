import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const MessageALert = styled.span`
  position: absolute;
  background-color: ${(props) => props.theme.colors.black};
  border-radius: 6px;
  color: ${(props) => props.theme.colors.white};
  display: none;
  font-size: 0.9em;
  opacity: 1;
  padding: 6px;
  z-index: 100;
  top: 0;
  right: -60px;

  &.active {
    display: block;
  }

  ${maxPhone(css`
    top: -35px;
    right: 0;
  `)}
`;

export default MessageALert;
