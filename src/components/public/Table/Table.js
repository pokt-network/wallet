import styled, { css } from "styled-components";
import { colors } from '../../../utils/colors';
import { maxPhone, tablet, tabletLandscape, desktop } from "../../../utils/media";

const T = styled.table`
    position: relative;
    border-collapse: collapse;
    border-radius: 12px;
    box-shadow: 0 6px 25px -8px rgba(0, 0, 0, 0.23);
    background-color: ${colors.white};
    margin: 0 auto;
    .one-table-container & {
        width: 100%;
    }
    .one-table-container & {
        ${maxPhone(css`
            margin-top: 20px;
        `)};
    }
`;


export default T;