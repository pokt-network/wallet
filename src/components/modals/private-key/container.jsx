import styled, { css } from "styled-components";
import { maxPhone, tablet } from "../../../utils/media";

const PrivateKeyContainer = styled.div`
  width: 100%;
  height: 100%;

  .save-banner {
    margin: 35px 0 30px 0;

    ${tablet(css`
      h2,
      p {
        margin: 0;
      }
    `)}

    ${maxPhone(css`
      > div {
        > div {
          > div {
            height: 16px;
          }
        }
      }
    `)}
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

  .custom-pk-container {
    display: flex;
    width: 100%;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    padding: 12px;
    justify-content: space-between;
    position: relative;

    span.active {
      top: -40px;
      right: 0;
    }

    p {
      word-break: break-all;
      width: 90%;
      font-size: 12px;
    }

    svg {
      color: ${(props) => props.theme.colors.blue};

      :hover {
        cursor: pointer;
      }
    }
  }

  ${maxPhone(css`
    .reveal-button {
      width: 100% !important;
    }
  `)}
`;

export default PrivateKeyContainer;
