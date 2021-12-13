import styled, { css } from "styled-components";
import { maxPhone, phone } from "../../utils/media";

const CopyButtonContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  height: 56px;
  width: ${(props) => props.width}px;
  margin: 0 0 20px 0;
  position: relative;

  .copy-button {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;

    input {
      background: transparent;
      /* font-size: 16px; */
    }
  }

  ${maxPhone(css`
    width: 100%;

    .copy-button {
      input {
        font-size: 12px;
      }
    }
  `)}

  ${phone(css`
    .copy-button {
      input {
        font-size: 11px;
      }
    }
  `)}
`;

export default CopyButtonContainer;
