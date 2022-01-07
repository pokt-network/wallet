import styled, { css } from "styled-components";
import { maxPhone } from "../../../utils/media";

const PrivateKeyContainer = styled.div`
  width: 100%;
  height: 100%;

  .save-banner {
    margin: 35px 0 30px 0;
  }

  .label {
    font-weight: bold;
    font-size: 18px;
    line-height: 110%;
    color: ${(props) => props.theme.colors.blue};
  }

  .reveal-button-container {
    width: 100%;
    display: flex;
    justify-content: center;

    .reveal-button {
      margin: 30px 0 10px 0;
      width: 228px;
    }
  }

  .private-key-container {
    margin: 30px 0;
  }

  ${maxPhone(css`
    .reveal-button {
      width: 100% !important;
    }
  `)}
`;

export default PrivateKeyContainer;
