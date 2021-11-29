import styled from "styled-components";

const ConfirmActionContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .exitIcon {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 15px;
    right: 20px;

    &:hover {
      cursor: pointer;
    }
  }

  .title {
    color: ${props => props.theme.colors.white};
    text-transform: none;
    margin-bottom: 36px;
    font-size: 24px;
  }

  .verifyButton {
    width: 220px;
    height: 48px;
  }
`;

export default ConfirmActionContainer;
