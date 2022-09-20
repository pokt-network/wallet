import styled from "styled-components";

export const StakingContent = styled.section`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    margin-bottom: 8px;
    width: 488px;
  }

  .adornment {
    color: #ffffff;
  }

  button.stake {
    width: 220px;
  }

  svg {
    width: 16px;
    height: 16px;
    margin: 0 0 16px auto;
    color: ${(props) => props.theme.colors.blue};
  }

  .activate-non-custodial {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-bottom: 16px;

    p {
      margin-right: 12px;
    }

    input {
      width: auto;
      margin: 0;
    }
  }
`;

export const StakingModalContent = styled.div`
  .modal-title {
    margin: 16px 0;
    font-weight: bold;
    font-size: 24px;
    line-height: 110%;
    text-align: center;
    color: ${(props) => props.theme.colors.white};
  }

  input,
  button {
    margin-bottom: 16px;
  }
`;
