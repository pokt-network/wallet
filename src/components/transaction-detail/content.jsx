import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const TransactionDetailContent = styled.section`
  max-width: 532px;

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

      .hash-button {
        color: ${(props) => props.theme.colors.green};
        background: transparent;
        height: 17px;
        font-size: 12px;

        svg {
          margin: 0 0 0 12px;
        }

        span {
          margin: 0;
        }
      }

      h2 {
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 140%;
        color: ${(props) => props.theme.colors.secondaryWhite};
      }

      p {
        font-size: 12px;
        line-height: 140%;

        &.to-address {
          color: ${(props) => props.theme.colors.green};
        }
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
