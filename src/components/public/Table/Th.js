import styled, { css } from "styled-components";
import { colors } from '../../../utils/colors';
import { maxPhone, maxTablet } from "../../../utils/media";

const Th = styled.th`
    font-family: 'Open Sans', sans-serif;
    text-align: left;
    font-size: 12px;
    color: ${colors.darkBlue};
    font-weight: 900;
    text-transform: uppercase;
    padding: 25px 15px 15px 15px;
    ${maxPhone(css`
        padding: 15px 10px;
    `)};
    &:nth-child(2) {
        padding-left: 10px;
    }
`;

export default Th;