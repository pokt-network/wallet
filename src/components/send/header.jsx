import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const SendHeaderContainer = styled.section`
  .input-container {
    display: flex;
    justify-content: space-between;
    width: 100%;

    label,
    input {
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 110%;
      display: flex;
      align-items: center;
      text-align: right;
      color: ${(props) => props.theme.colors.secondaryWhite};
      width: 300px;
    }

    input {
      background: transparent;
      border: none;

      &::placeholder {
        color: currentColor;
      }
    }
  }

  .secondary-title {
    font-weight: bold;
    font-size: 24px;
    line-height: 110%;
    text-align: center;
    color: ${(props) => props.theme.colors.secondaryWhite};
    margin: 0 0 33px 0;
  }

  ${maxPhone(css`
    .input-container {
      label,
      input {
        font-size: 18px;
        width: auto;
      }

      input {
        text-align: left;
      }
    }
  `)}
`;

export default SendHeaderContainer;
