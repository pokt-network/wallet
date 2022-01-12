import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const SendContent = styled.section`
  width: 448px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input {
    width: 448px;
    margin: 79px 0 15px 0;
  }

  button {
    width: 220px;
    margin: 79px 0 0 0;
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
    margin: 5px 0 20px 0;
  }

  ${maxPhone(css`
    width: 100%;

    input,
    button {
      width: 100%;
    }
  `)}
`;

export default SendContent;
