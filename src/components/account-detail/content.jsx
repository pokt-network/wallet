import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const AccountContent = styled.div`
  max-width: 532px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .send-button {
    width: 220px;
    height: 48px;
    margin: 61px 0 63px 0;

    ${maxPhone(css`
      width: 280px;
      margin: 28px 0 59px 0;
    `)}
  }

  .copy-title {
    color: ${(props) => props.theme.colors.blue};
    font-weight: bold;
    font-size: 18px;
    line-height: 110%;
    margin-bottom: 9px;
    align-self: baseline;
  }

  .reveal-private-key {
    margin: 51px 0 0 0;
  }

  .staking-options {
    /* display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap; */
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(131px, 1fr));
    width: 100%;

    div {
      h3 {
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 110%;
        color: ${(props) => props.theme.colors.secondaryWhite};
      }

      p {
        font-family: Manrope;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 140%;
        color: ${(props) => props.theme.colors.white};
      }
    }

    &.node-options {
      margin: 0 0 31px 0;
    }
  }

  .separator {
    background: linear-gradient(to right, #27a9e0 0%, #06202e 100%);
    background-size: 100% 1px;
    width: 115%;
    height: 1px;
    margin: 31px 0;
  }

  ${maxPhone(css`
    .staking-options {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;

      &.node-options {
        margin: 0 0 28px 0;
      }

      .option-type {
        flex-basis: 100%;
        text-align: center;
        margin: 8px 0 0 0;
      }
    }

    .separator {
      width: 100%;
    }
  `)}
`;

export default AccountContent;
