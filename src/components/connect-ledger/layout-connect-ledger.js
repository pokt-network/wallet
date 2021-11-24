import styled from "styled-components";
import Wrapper from "../wrapper";

const Layout = styled(Wrapper)`
  min-height: calc(100vh - (80px + 277px));
  display: flex;
  flex-direction: column;
  margin: 80px auto;
  align-items: center;

  .title-container {
    background: linear-gradient(to right, #fff 27%, #27a9e0 100%) right bottom
      no-repeat;
    background-size: 100% 1px;
    /* display: flex;
    justify-content: center; */
    margin-bottom: 32px;
    width: 95%;

    .title {
     text-transform: none;
     margin-bottom: 32px;
    }
  }
`;

export default Layout;
