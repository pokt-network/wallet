import styled from "styled-components";

const UnjailUnstakeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-weight: bold;
    font-size: 24px;
    line-height: 110%;
    text-align: center;
    color: ${(props) => props.theme.colors.secondaryWhite};
    margin: 45px 0 60px 0;
  }

  .send-button {
    width: 220px;
    margin: 32px 0 65px 0;
  }

  .error-label {
    display: flex;
    justify-content: center;
  }
`;

export default UnjailUnstakeContainer;
