import styled, { css } from "styled-components";
import { maxPhone, phone } from "../../utils/media";

const LandingContent = styled.section`
  position: relative;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 120px 0 130px 0;

  ${maxPhone(css`
    padding: 60px 0 150px 0;
  `)};

  .top {
    padding-bottom: 60px;
    background: ${(props) => props.theme.backgroundBorder};
    background-size: 100% 1px;

    h1 {
      margin: 0 0 15px 0;
      font-size: 50px;
      font-weight: bold;
      color: ${(props) => props.theme.colors.blue};
      line-height: 110%;

      img {
        max-width: 45px;

        ${maxPhone(css`
          max-width: 27px;
        `)};
      }

      ${phone(css`
        font-size: 36px;
      `)}
    }

    .description {
      font-size: 16px;
      line-height: 140%;
      color: ${(props) => props.theme.colors.white};
      font-weight: normal;
      margin-bottom: 9px;
      max-width: 490px;
      margin: 0 auto;

      ${phone(css`
        line-height: 130%;
      `)}
    }
  }

  .bottom {
    margin-top: 55px;

    ${maxPhone(css`
      margin-top: 42px;
    `)};

    .btns {
      margin-top: 27px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      a {
        width: 220px;
        height: 48px;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        ${maxPhone(css`
          margin-bottom: 20px;
        `)};

        ${phone(css`
          width: 100%;
        `)}
      }
    }

    h2 {
      color: ${(props) => props.theme.colors.white};
      font-size: 24px;
      font-weight: bold;
      line-height: 110%;

      ${phone(css`
        font-size: 20px;
        line-height: 120%;
      `)}
    }
  }
`;

export default LandingContent;
