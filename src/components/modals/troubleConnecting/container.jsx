import styled from "styled-components";

const TroubleConnectingContainer = styled.div`
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

  a {
    color: ${(props) => props.theme.colors.green};
  }

  p {
    max-width: 400px;
  }
`;

export default TroubleConnectingContainer;
