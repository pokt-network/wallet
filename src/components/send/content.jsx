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
    margin: 39px 0 0 0;
  }

  p {
    margin-right: auto;
    font-weight: normal;
    color: ${(props) => props.theme.colors.secondaryWhite};
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
