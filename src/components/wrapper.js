import styled, { css } from "styled-components";
import { maxPhone } from "../utils/media";

const Wrapper = styled.main`
  width: 100%;
  max-width: 96%;
  margin: 0 auto;
  display: flex;
  &.wide-block-wr {
    display: block;
  }
  ${maxPhone(css`
    &.footer-w {
      display: block;
    }
  `)};
  @media (min-width: 900px) {
    max-width: 870px;
  }
  @media (min-width: 1200px) {
    max-width: 1100px;
  }
  &.header {
    display: flex;
    align-items: center;
  }
`;

export default Wrapper;
