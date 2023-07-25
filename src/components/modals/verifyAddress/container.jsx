import styled from "styled-components";

const VerifyAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: 24px;
    text-align: center;
    font-weight: 700;
    color: ${(props) => props.theme.colors.secondaryWhite};
    margin: 16px 0;
  }

  h4 {
    font-size: 18px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.secondaryWhite};
    margin: 16px 0;
  }

  a {
    color: ${(props) => props.theme.colors.green};
  }

  p {
    max-width: 400px;
  }

  .confirm-verify-address-btn {
    width: 240px;
  }
`;

export default VerifyAddressContainer;
