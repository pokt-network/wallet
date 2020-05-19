import styled, { css } from "styled-components";

const ContainerToggle = styled.div`
  display: block;
  width: 100%;
  opacity: 1;
  transition: all 0.5s ease-in-out;
  ${props =>
    props.isVisible ||
      css`
      display: none;
      opacity: 0;
    `};
`;

export default ContainerToggle;