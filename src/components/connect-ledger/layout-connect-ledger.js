import styled from "styled-components";
import Wrapper from "../wrapper";

const Layout = styled(Wrapper)`
  min-height: calc(100vh - (80px + 277px));
  display: flex;
  flex-direction: column;
  margin: 80px auto;
  align-items: center;

  .title-container {
    background: ${(props) => props.theme.backgroundBorder};
    background-size: 100% 1px;
    margin-bottom: 32px;
    width: 95%;

    .title {
     text-transform: none;
     margin-bottom: 32px;
     color: ${props => props.theme.colors.blue}
    }
  }
`;

export default Layout;
