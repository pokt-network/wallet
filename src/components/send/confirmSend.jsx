import styled from "styled-components";

export const SendTransactionModalContainer = styled.div`
  width: 488px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .back-button {
    width: backButton;
    background: transparent;
    border: none;

    svg {
      vertical-align: middle;
      margin-right: 8px;
    }

    :hover {
      cursor: pointer;
    }

    :focus-visible {
      outline: none;
    }
  }

  .title {
    margin: 17px 0 0 0;
    font-weight: bold;
    font-size: 24px;
    line-height: 110%;
    text-align: center;
    color: ${(props) => props.theme.colors.white};
  }

  .password-input-container {
    margin: 28px 0 45px 0;
    width: 100%;
  }

  .sending-container {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .you-are-sending {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: baseline;

      h2 {
        font-weight: normal;
        font-size: 16px;
        line-height: 140%;
        text-align: center;
        color: ${(props) => props.theme.secondaryWhite};
      }

      p {
        font-weight: bold;
        font-size: 18px;
        line-height: 110%;
        color: ${(props) => props.theme.secondaryWhite};
      }
    }
  }

  .send-button {
    width: 220px;
    margin: 45px 0 25px 0;
  }
`;
