import styled from "styled-components";
import { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const NodeAppStatusContent = styled.div`
  width: 523px;
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
  `)}
`;

export default NodeAppStatusContent;
