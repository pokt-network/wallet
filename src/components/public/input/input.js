import styled from "styled-components";

const Input = styled.input`
  border: 1px solid ${(props) => props.theme.colors.secondaryWhite};
  border-radius: 4px;
  height: 56px;
  background-color: ${(props) => props.theme.colors.transparent};
  color: ${(props) => props.theme.colors.secondaryWhite};
  width: 100%;
  padding-left: 20px;

  &::placeholder {
    color: ${(props) => props.theme.colors.secondaryGray};
  }
`;

export default Input;
