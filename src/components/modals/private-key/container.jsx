import styled from "styled-components";

const PrivateKeyContainer = styled.div`
  width: 100%;
  height: 100%;

  .save-banner {
    margin: 35px 0 30px 0;
  }

  .label {
    font-weight: bold;
    font-size: 18px;
    line-height: 110%;
    color: ${(props) => props.theme.colors.blue};
  }

  .reveal-button {
    margin: 30px 0 10px 0;
  }

  .private-key-container {
    margin: 30px 0;
  }
`;

export default PrivateKeyContainer;
