import styled, { css } from "styled-components";
import { maxPhone } from "../../../utils/media";

const Button = styled.button`
  background: ${(props) =>
    props.transparent ? props.theme.transparent : props.theme.green};
  color: ${(props) =>
    props.transparent
      ? props.theme.colors.secondaryWhite
      : props.theme.colors.secondaryBlack};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin: 0 35px;
  padding: 16px 32px;
  text-decoration: none;
  border-radius: 10px;
  transition: background-color 0.3s ease-in-out;

  border: ${(props) =>
    props.transparent
      ? `2px solid ${props.theme.colors.secondaryWhite}`
      : props.theme.colors.green};

  ${maxPhone(css`
    display: block;
    font-size: 14px;
    padding: 15px 50px;
  `)};
`;

export default Button;
