import styled from "styled-components";

export const ValidateContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -40px;

  input {
    width: 488px;
    margin: 40px 0 0 0;
  }

  button {
    width: 220px;
    height: 48px;
    margin: 40px 0 0 0;
  }

  .description {
    max-width: 500px;
    text-align: center;
  }

  .status {
    max-width: 500px;
  }
`;

export const DetailContent = styled.div`
  width: 527px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -40px;

  .unstake-btn {
    width: 220px;
    height: 48px;
    margin-top: 60px;
  }

  .copy-title {
    color: #1d8aed;
    font-size: 18px;
    font-weight: 700;
    align-self: baseline;
  }

  .address-input {
    width: 100%;
    margin-bottom: 48px;
  }

  .description {
    max-width: 536px;
    text-align: center;
    margin: 48px 0 32px 0;
  }
`;
