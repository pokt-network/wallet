import styled from "styled-components";

const ErrorLabelContainer = styled.div`
  width: 100%;
  margin: 10px 0 0 0;
  display: grid;
  grid-template-columns: 5% 95%;

  .icon {
    margin: 0 10px 0 0;
    height: 14px;
    width: 14px;
    vertical-align: middle;
  }

  .message {
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.placeholder};
  }
`;

export default ErrorLabelContainer;
