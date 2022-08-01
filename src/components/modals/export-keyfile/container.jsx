import { GU } from "@pokt-foundation/ui";
import styled, { css } from "styled-components";
import { maxPhone, tablet } from "../../../utils/media";

const ExportKeyfileContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: ${GU * 2}px;

  .title {
    font-size: ${GU * 3}px;
    font-weight: 700;
    margin: ${GU * 2}px;
  }

  .keyfile-passphrase-input,
  .private-key-input {
    margin: ${GU * 2}px;
  }

  .error {
    padding: 0 ${GU * 2}px;
    margin-top: -${GU}px;
  }

  .export-button-container {
    width: 100%;
    display: flex;
    justify-content: center;

    .export-button {
      width: ${GU * 28.5}px;
    }
  }

  ${tablet(css`
    .export-banner {
      h2,
      p {
        margin: 0;
      }
    }
  `)}

  ${maxPhone(css`
    .export-banner {
      > div {
        > div {
          > div {
            height: 16px;
          }
        }
      }
    }
  `)}
`;

export default ExportKeyfileContainer;
