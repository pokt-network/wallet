import { css } from "styled-components";

export const phone = (inner) => css`
    @media only screen and (max-width: ${480 / 16}em) {
        ${inner}
    }
`;

export const tablet = (inner) => css`
    @media only screen and (min-width: ${768 / 16}em) {
        ${inner}
    }
`;

export const tabletLandscape = (inner) => css`
    @media only screen and (min-width: ${992 / 16}em) {
        ${inner}
    }
`;

export const desktop = (inner) => css`
    @media only screen and (min-width: ${1200 / 16}em) {
        ${inner}
    }
`;

export const maxPhone = (inner) => css`
    @media only screen and (max-width: ${767 / 16}em) {
        ${inner}
    }
`;

export const maxTablet = (inner) => css`
    @media only screen and (max-width: ${992 / 16}em) {
        ${inner}
    }
`;

export const maxTabletLandscape = (inner) => css`
    @media only screen and (max-width: ${1200 / 16}em) {
        ${inner}
    }
`;
