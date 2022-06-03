import { GU } from "@pokt-foundation/ui";
import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const AccountContent = styled.div`
  max-width: 532px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;

  .actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .unstake-send-container {
    width: 100%;
    display: flex;
    justify-content: ${(props) =>
      props.isStaked ? "space-between" : "center"};
    flex-wrap: wrap;
    margin: 40px 0 40px 0;

    .send-button,
    .unstake-button {
      width: 220px;
      height: 48px;
    }
  }

  .copy-title {
    color: ${(props) => props.theme.colors.blue};
    font-weight: bold;
    font-size: 18px;
    line-height: 110%;
    margin-bottom: 9px;
    align-self: baseline;
  }

  .reveal-private-key,
  .export-keyfile {
    margin: ${GU * 2.5}px 0 0 0;
    width: ${GU * 25}px;
  }

  .staking-options {
    width: 100%;
    padding-left: 20px;
    display: flex;
    justify-content: space-evenly;

    svg {
      height: 12px;
      width: 12px;
    }

    div {
      h3 {
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 110%;
        color: ${(props) => props.theme.colors.secondaryWhite};
        text-transform: capitalize;
      }

      p {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 140%;
        color: ${(props) => props.theme.colors.white};

        &.p-near-icon {
          padding-left: 18px;
        }
      }
    }

    &.node-options {
      margin: 0 0 31px 0;
    }
  }

  .separator {
    background: linear-gradient(to right, #27a9e0 100%, #06202e 100%);
    background-size: 100% 1px;
    width: 115%;
    height: 1px;
    margin: 31px 0;
  }

  .unjail-container {
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
  }

  ${maxPhone(css`
    width: 100%;
    max-width: 100%;
    .staking-options {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
      padding-left: 0;

      &.node-options {
        margin: 0 0 28px 0;
      }

      .option-type,
      .option-status,
      .option-pokt {
        width: 140px;
      }
    }

    .separator {
      width: 100%;
    }

    .unjail-container {
      width: 100%;
      height: 154px;
    }

    .unstake-send-container {
      margin: 28px 0 59px 0;
      flex-direction: column;
      align-items: center;

      .send-button {
        width: 280px;
      }

      .unstake-button {
        margin-bottom: 39px;
      }
    }
  `)}
`;

export default AccountContent;
