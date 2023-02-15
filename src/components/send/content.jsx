import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const SendContent = styled.section`
  width: 448px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .send-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .amount-error-container {
    width: 100%;
    margin-top: -35px;
  }

  input {
    width: 448px;
    margin: 64px 0 0 0;
  }

  button {
    width: 220px;
    margin: 24px 0 0 0;
  }

  p {
    margin-right: auto;
    font-weight: normal;
    color: ${(props) => props.theme.colors.secondaryWhite};

    &.tx-fee {
      color: ${(props) => props.theme.colors.gray};
      font-size: 16px;
      line-height: 140%;
      text-align: center;
    }
  }

  .tx-memo-label {
    text-align: left;
    padding: 0;
    margin: 20px 0 5px 0;
    width: 100%;
    font-weight: bold;
    font-size: 16px;
    line-height: 18px;
    color: ${(props) => props.theme.colors.secondaryWhite};
  }

  .tx-memo-area {
    width: 100%;
    height: 100px;
    padding: 15px;
  }

  .tx-memo-counter {
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    text-align: right;
    color: ${(props) => props.theme.colors.white};
    width: 98%;
    margin: 4px 0;
  }

  ${maxPhone(css`
    width: 95%;

    input,
    button {
      width: 100%;
    }
  `)}
`;

export default SendContent;
