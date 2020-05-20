import styled, { css } from "styled-components";
import { colors } from '../../../utils/colors';
import { maxPhone, tablet, maxTablet } from "../../../utils/media";

const Td = styled.td`
    text-align: left;
    color: ${colors.darkBlue};
    font-weight: 700;
    font-size: 12px;
    padding: 8px 15px;
    ${maxPhone(css`
        font-size: 14px;
        padding: 15px 8px;
    `)};
    a {
        color: ${colors.blueLink};
        text-decoration: none;
        font-weight: 300;
    }
    .l-tx & {
        &:first-child {
            padding-left: 30px;
            padding-right: 0;
            ${maxPhone(css`
                max-width: 120px;
                background-position: 10px 13px;
                padding-left: 10px;
            `)};
        }
        &:nth-of-type(2) {
            padding-left: 10px;
            .qty {
                font-family: 'Open Sans', sans-serif;
                color: ${colors.darkBlue};
                font-weight: 900;
                font-size: 12px;
                ${maxPhone(css`
                    font-size: 10px;
                `)};
            }
            span {
                font-size: 10px;
            }
            .status {
                font-size: 10px;
                font-weight: 300;
                color: ${colors.gray};
            }
        }
        &:nth-of-type(3) {
            color: ${colors.gray};
            font-weight: 300;
            ${maxPhone(css`
                text-align: center;
                font-size: 12px;
            `)};
        }
        &:nth-child(4) {
            max-width: 190px;
            padding-right: 27px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: ${colors.blueLink};
            ${maxPhone(css`
                max-width: 100px;
                padding-right: 0;
            `)};
            a {
                color: ${colors.blueLink};
                font-weight: 300;
                font-size: 12px;
            }
        }
        img {
            max-width: 20px;
        }
    }
    tr:first-of-type & {
        .details & {
            font-size: 12px;
            color: ${colors.darkBlue};
            font-weight: 900;
            text-transform: uppercase;
        }
    }
    tr:nth-of-type(2) & {
        .details & {
            color: ${colors.gray};
            font-weight: 300;
            ${maxPhone(css`
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `)};
        }
    }
    tr:nth-of-type(3) & {
        .details & {
            color: ${colors.gray};
            font-weight: 300;
        }
    }
    tr:nth-of-type(4) & {
        .details & {
            font-family: 'Open Sans', sans-serif;
            color: ${colors.blueLink};
            font-weight: 900;
            font-size: 11px;
        }
    }
`;

export default Td;