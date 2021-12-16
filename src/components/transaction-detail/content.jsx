import styled, { css } from "styled-components";
import { maxPhone, phone } from "../../utils/media";

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
        background: transparent;
        height: 17px;
        font-size: 12px;

        input {
          padding-left: 0;
          font-size: 12px;
          color: ${(props) => props.theme.colors.green};
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 95%;
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

    ${phone(css`
      .tx-detail-row {
        .hash-button {
          input {
            padding: 0 38px 0 0;
          }
        }
      }
    `)}
  }
`;

export default TransactionDetailContent;
