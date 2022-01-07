import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";

const Link = styled(RouterLink)`
  color: ${(props) => props.theme.accent};
  text-decoration: none;
  font-size: inherit;
  &:hover {
    text-decoration: underline;
  }

  ${(props) => props}
`;

export default Link;
