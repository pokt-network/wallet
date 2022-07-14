import styled from "styled-components";

const IconWithLabelContainer = styled.div`
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

    &.error {
      color: ${(props) => props.theme.colors.error};
    }

    &.loading {
      color: #e8e6f8;
    }
  }
`;

export default IconWithLabelContainer;
