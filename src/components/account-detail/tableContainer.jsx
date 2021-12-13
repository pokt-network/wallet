import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";

const AccountTableContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  max-height: 548px;
  border-radius: 12px;
  margin: 50px 0 0 0;
  padding: 25px 9px;
  display: inline-block;
  overflow-y: auto;

  table {
    position: sticky;

    tbody {
      td {
        padding: 0 0 37px 0;
      }
    }
  }

  .table-title {
    font-size: 24px;
    text-align: center;
    color: ${(props) => props.theme.colors.secondaryWhite};
    line-height: 110%;
    font-weight: bold;
    text-align: center;
  }

  .column-title {
    font-size: 12px;
    line-height: 14px;
    letter-spacing: -0.33px;
    color: ${(props) => props.theme.colors.secondaryWhite};
    text-align: left;
    padding: 47px 0 27px 0;
  }

  .tx-icon {
    height: 21px;
    width: 21px;
  }

  .qty {
    font-size: 12px;
    line-height: 14px;
    letter-spacing: -0.33px;
    color: ${(props) => props.theme.colors.secondaryWhite};
  }

  .status {
    font-size: 10px;
    line-height: 12px;
    letter-spacing: -0.275px;
    color: ${(props) => props.theme.colors.secondaryWhite};
  }

  .timestamp {
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: -0.33px;
  }

  .hash-button {
    background: none;
    color: ${(props) => props.theme.colors.green};
    margin: 0;
    padding: 0;
    text-decoration: none;
    border: none;
    font-size: 12px;
    line-height: 14px;
    font-weight: bold;
    letter-spacing: -0.33px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 210px;

    :hover {
      cursor: pointer;
    }
  }

  ${maxPhone(css`
    height: 305px;

    .table-title {
      font-size: 18px;
    }

    .tx-icon {
      height: 15px;
      width: 15px;
    }

    .qty {
      font-size: 10px;
      line-height: 12px;
      letter-spacing: -0.275px;
    }

    .timestamp {
      font-weight: 300;
    }

    .hash-button {
      font-weight: 300;
      max-width: 75px;
    }
  `)}
`;

export default AccountTableContainer;
