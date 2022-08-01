import styled, { css } from "styled-components";
import { maxPhone, tablet } from "../../utils/media";

const CreateContainer = styled.div`
  max-width: 491px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .download-button-container {
    width: 100%;
  }

  .notification {
    margin: 32px 0;

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

  .passphrase-input-container {
    width: 100%;
    margin-bottom: 26px;
  }

  .button {
    width: 220px;
    margin: 28px 0 38px 0;

    ${maxPhone(css`
      width: 100%;
    `)}
  }

  .download-button {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;

    span {
      display: inline-block;
    }

    svg {
      display: inline-block;
      color: ${(props) => props.theme.colors.blue};
    }
  }

  .disclaimer {
    margin: 36px 0 0 0;
    text-align: center;
  }

  .backButton {
    width: backButton;
    background: transparent;
    border: none;

    svg {
      vertical-align: middle;
      margin-right: 8px;
    }

    :hover {
      cursor: pointer;
    }

    :focus-visible {
      outline: none;
    }
  }
`;

export default CreateContainer;
