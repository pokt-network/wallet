import styled, { css } from "styled-components";
import { colors } from '../../../utils/colors';
import { maxPhone } from "../../../utils/media";

const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${colors.white};
  line-height: 1;
  text-align: center;
  ${maxPhone(css`
    font-size: 22px;
    line-height: 1.1;
    max-width: 70%;
    margin: 0 auto;
  `)};
`;

export default Title;