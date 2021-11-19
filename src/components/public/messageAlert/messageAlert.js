import styled from "styled-components";
import { colors } from "../../../utils/colors";

const MessageALert = styled.span`
  position: absolute;
  background-color: ${colors.black};
  border-radius: 6px;
  color: ${colors.white};
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
`;

export default MessageALert;
