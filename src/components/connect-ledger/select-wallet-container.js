import styled from "styled-components";
import { colors } from "../../utils/colors";
import copy from "../../utils/images/copy.png";

const SelectWalletContent = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  width: 100%;

  .container-row {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
  }

  .row {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .copy-button {
    background: url(${copy}) 50% no-repeat;
    background-position: 61% 45%;
    border-radius: 6px;
    height: 20px;
    width: 19px;
    background-size: 19px 20px;
    position: relative;
    margin: 0 0 0 25px;
    outline: 0;
  }

  .radio {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    border: 1px solid ${colors.darkGray};
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    border-radius: 50%;
    padding: 0;
    display: grid;
    place-content: center;

    &::before {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em ${colors.darkBlue};
    }

    &:checked {
      border: 1px solid ${colors.darkBlue};
    }

    &:checked::before {
      transform: scale(1);
    }
  }

  .pokts {
    color: ${colors.white};
  }

  .public-key {
    color: ${colors.darkBlue};
  }

  .pagination {
    display: flex;
    justify-content: center;
    width: 80%;
    list-style: none;
    margin-top: 20px;

    .previous,
    .next {
      display: none;
    }

    li {
      font-weight: normal;
      font-size: 12px;
      text-align: center;
      color: ${colors.white};
      width: 24px;
      height: 24px;
      vertical-align: middle;
      line-height: 160%;
      margin-right: 20px;
      
      &:hover {
        cursor: pointer;
      }

      &.selected {
        border-radius: 4px;
        background: ${colors.blue};
      }
    }
  }
`;

export default SelectWalletContent;
