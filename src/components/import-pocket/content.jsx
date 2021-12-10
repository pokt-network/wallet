import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const ImportPocketContent = styled.section`
  .description {
    font-size: 16px;
    text-align: center;
    line-height: 140%;
    color: ${(props) => props.theme.colors.white};
    margin-bottom: 32px;
  }

  .nimport-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .temporary-passphrase {
      color: ${(props) => props.theme.colors.white};
      width: 100%;
      font-style: normal;
      font-weight: normal;
      line-height: 140%;
      margin: 40px 0 20px 0;

      ${maxPhone(css`
        width: 100%;
      `)}
    }

    .import-button {
      width: 220px;

      ${maxPhone(css`
        width: 100%;
      `)}
    }

    .custom-file-input {
      width: 100%;
      margin: 0 0 40px 0;
      border: 2px solid ${(props) => props.theme.surfaceInteractiveBorder};
      color: ${(props) => props.theme.placeholder};
      height: 56px;
      line-height: 56px;
      padding: 0 12px;
      position: relative;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: auto;

      div:first-of-type {
        position: absolute;
        left: 0;
        .upload-file-input {
          border: 2px solid ${(props) => props.theme.surfaceInteractiveBorder};
          color: ${(props) => props.theme.colors.white};
          opacity: 0;
        }

        svg {
          position: absolute;
          right: 0;
        }
      }

      &:hover {
        cursor: pointer;
      }
    }

    .create-link {
      text-align: center;
    }
  }
`;

export default ImportPocketContent;
