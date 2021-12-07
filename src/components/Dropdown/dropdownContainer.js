import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";
import { ButtonBase } from "@pokt-foundation/ui";

const DropdownButtonContainer = styled(ButtonBase)`
  min-height: 52px;
  min-width: 562px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  p {
    display: inline-block;
    color: ${(props) => props.theme.colors.secondaryWhite};
    font-size: 18px;
    font-weight: bold;
    line-height: 110%;
    margin-left: 55px;
    font-family: 'Manrope';
  }

  img {
    width: 12px;
    height: 6px;
    vertical-align: middle;
    margin: 0 32px 0 0;
  }

  .icon-button {
    background-color: transparent;
    border: none;
    width: 12px;
    height: 6px;
    padding: 0;

    &:focus-visible {
      outline: none;
    }
  }

  ${maxPhone(css`
    min-width: 100%;
  `)}
`;

export default DropdownButtonContainer;
