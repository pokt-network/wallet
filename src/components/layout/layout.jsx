import styled from "styled-components";
import Wrapper from "../wrapper";

const Layout = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  margin: 80px auto;
  align-items: center;
  .title-container {
    background: ${(props) => props.theme.backgroundBorder};
    background-size: 100% 1px;
    margin-bottom: 60px;
    width: 95%;

    .title {
      text-transform: none;
      margin-bottom: 36px;
      color: ${(props) => props.theme.colors.blue};
      font-style: normal;
      font-weight: bold;
      font-size: 36px;
      line-height: 110%;
      text-align: center;
    }
  }
`;

export default Layout;
