import styled, { css } from "styled-components";
import { maxPhone } from "../../../utils/media";

const InputWithIconContainer = styled.div`
  position: relative;
  width: 90%;
  margin-bottom: 40px;

  img {
    position: absolute;
    top: 30%;
    right: 5px;
    width: 22px;

    &:hover {
      cursor: pointer;
    }
  }

  ${maxPhone(css`
    width: 100%;

    > input {
      padding: 0;
    }
  `)}
`;

export default InputWithIconContainer;
