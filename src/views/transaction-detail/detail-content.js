import styled, {css} from "styled-components";
import { maxPhone } from "../../utils/media";

const DetailContent = styled.section`
  position: relative;
  max-width: 800px;
  margin: 80px auto;
  ${maxPhone(css`
    max-width: 100%;
  `)};
  h1 {
    background: ${(props) => props.theme.backgroundBorder};
    background-size: 100% 1px;
    margin-top: 0;
    padding-bottom: 33px;
    margin-bottom: 50px;
  }
`;

export default DetailContent;