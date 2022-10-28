import styled from "styled-components";
import { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const JailedStatusContent = styled.section`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  width: 100%;
  height: 91px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin: 0 0 47px 0;

  .unjail-description {
    h2 {
      font-weight: bold;
      font-size: 24px;
      line-height: 110%;
      color: ${(props) => props.theme.colors.secondaryWhite};
    }

    p {
      font-weight: normal;
      font-size: 12px;
      line-height: 140%;
      text-align: center;
      color: ${(props) => props.theme.colors.secondaryWhite};
    }
  }

  .unjail-button {
    width: 228px;
  }

  ${maxPhone(css`
    width: 100%;
    height: 154px;
  `)}
`;

export default JailedStatusContent;
