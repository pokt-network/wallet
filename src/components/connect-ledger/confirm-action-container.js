import styled from "styled-components";
import { colors } from "../../utils/colors";

const ConfirmActionContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .exitIcon {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 5px;
    right: 5px;

    &:hover {
      cursor: pointer;
    }
  }

  .title {
    color: ${colors.darkBlue};
    text-transform: none;
  }
`;

export default ConfirmActionContainer;
