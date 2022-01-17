import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const TransactionDetailContent = styled.section`
  max-width: 532px;
  width: 100%;

  .details {
    width: 100%;
    padding: 20px 20px;

    .tx-detail-row {
      width: 100%;
      margin: 20px 0;
      height: 17px;
      display: grid;
      grid-template-columns: 99px calc(100% - 130px);
      grid-gap: 30px;

      h2 {
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 140%;
        color: ${(props) => props.theme.colors.secondaryWhite};
        white-space: nowrap;
      }

      p,
      .to-address,
      .hash {
        font-size: 12px;
        line-height: 140%;
      }

      .block-height {
        color: ${(props) => (props.tx?.height ? "inherit" : "#C50DB")};
      }

      .to-address,
      .hash {
        color: ${(props) => props.theme.colors.green};
        text-align: left;
      }

      .hash-container {
        display: flex;
        align-items: center;

        .hash {
          display: block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 90%;
        }

        .copy-icon-button {
          height: 17px;
          svg {
            color: ${(props) => props.theme.colors.blue};
            vertical-align: middle;
          }
        }
      }

      .secondary-status-icon {
        margin: 0 13px 0 0;
        vertical-align: middle;
      }

      img {
        height: 15px;
        width: 15px;
      }

      .status-container {
        display: flex;
        justify-content: space-between;

        p {
          display: inline-block;

          img {
            vertical-align: middle;
          }
        }
      }

      .tx-memo {
        color: ${(props) => props.theme.placeholder};
      }
    }

    ${maxPhone(css`
      display: block;

      .tx-detail-row {
        display: block;
        margin: 25px 0;
        h2 {
          display: block;
        }
      }
    `)}
  }
`;

export default TransactionDetailContent;
