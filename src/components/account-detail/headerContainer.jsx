import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const AccountHeaderContainer = styled.div`
  h1 {
    text-align: center;
    font-size: 50px;
    font-weight: bold;
    line-height: 110%;

    ${maxPhone(css`
      font-size: 36px;
    `)}
  }

  h2 {
    font-size: 24px;
    text-align: center;
    font-weight: bold;
    line-height: 110%;
    margin: 14px 0 35px 0;

    a,
    p {
      font-size: 14px;
      line-height: 140%;
      font-weight: normal;
      color: ${(props) => props.theme.colors.white};
    }

    p {
      display: inline-block;
    }

    ${maxPhone(css`
      font-size: 16px;
      font-weight: normal;
      line-height: 130%;
      a {
        display: none;
      }
    `)}
  }
`;

export default AccountHeaderContainer;
