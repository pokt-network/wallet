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

  .error-label-container {
    width: 100%;
    max-width: 488px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 30px !important;
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
      margin: 0 0 30px 0;

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
      border: 2px solid ${(props) => props.theme.surfaceInteractiveBorder};
      color: ${(props) =>
        props.hasFile ? props.theme.colors.white : props.theme.placeholder};
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
