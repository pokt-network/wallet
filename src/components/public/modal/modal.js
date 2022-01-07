import styled, { css } from "styled-components";
import { maxPhone } from "../../../utils/media";

const ModalContainer = styled.div`
  > div {
    position: fixed;
    inset: 0px;
    z-index: 99999;
    transition: opacity 1s ease-in 0s;
    pointer-events: auto;
    overflow-y: auto;

    > div {
      width: 565px;
      height: 250px;
      position: relative;
      margin: 10% auto;
      padding: 5px 20px 13px;
      background: linear-gradient(180deg, #121c25 0%, #2c313c 100%);
      border-radius: 12px;
      color: ${(props) => props.theme.colors.white};

      ${maxPhone(css`
        width: 80%;
        top: 25vh;
      `)}
    }
  }
`;

export default ModalContainer;
