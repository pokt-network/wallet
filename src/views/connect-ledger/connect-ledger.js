import styled, { css } from "styled-components";
import { colors } from "../../utils/colors";
import { phone } from "../../utils/media";

const ConnectLedgerContent = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .connect-description {
    color: ${colors.white};
    margin: 2rem 0 4rem 0;
    text-align: center;

    img {
      width: 64px;
      height: 26px;
      margin: 0 0.3rem;
      vertical-align: middle;
    }

    ${phone(css`
      width: 80%;
    `)}
  }
`;

export default ConnectLedgerContent;
