import styled, { css } from "styled-components";
import { maxPhone, phone } from "../../utils/media";

const CopyButtonContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  height: 56px;
  width: ${(props) => props.width}px;
  margin: 0 0 20px 0;

  .copy-button {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    svg {
      color: ${(props) => props.theme.colors.blue};
      margin-right: 12px;
    }

    span {
      margin-left: 12px;
    }
  }

  ${maxPhone(css`
    width: 100%;

    .copy-button {
      span {
        font-size: 12px;
      }
    }
  `)}

  ${phone(css`
    .copy-button {
      span {
        font-size: 11px;
      }
    }
  `)}
`;

export default CopyButtonContainer;
