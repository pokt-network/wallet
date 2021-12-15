import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  align-items: center;

  .action-container {
    width: 100%;
    max-width: 488px;
    display: flex;
    flex-direction: column;
    align-items: center;

    > div {
      margin-bottom: 40px;
    }

    ${maxPhone(css`
      max-width: unset;
    `)}
  }

  ${maxPhone(css`
    width: 100%;
  `)}
`;

export default AccordionContainer;
