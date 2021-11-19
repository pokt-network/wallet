import styled from "styled-components";
import Wrapper from "../wrapper";

const Layout = styled(Wrapper)`
  min-height: calc(100vh - (80px + 277px));
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .title-container {
    background: linear-gradient(to right, #fff 27%, #27a9e0 100%) right bottom
      no-repeat;
    padding-bottom: 20px;
    background-size: 100% 1px;
    display: flex;
    justify-content: center;

    .title {
     text-transform: none;
    }
  }
`;

export default Layout;
