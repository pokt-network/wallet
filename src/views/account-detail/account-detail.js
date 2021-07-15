import styled, { css } from "styled-components";
import { maxPhone } from "../../utils/media";
import { colors } from "../../utils/colors";

const AccountLContent = styled.section`
    position: relative;
    max-width: 800px;
    margin: 80px auto;
    .passphrase-label {
        text-align: left;
        margin: 31px 0px 0px 87px;
        color: #06202e;
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        display: block;
    }
    .alert {
        position: relative;
        max-width: 100%;
        margin: 30px 0px -13px 0px;
        background-color: ${colors.footerBg};
        border-radius: 10px;
        box-shadow: 0 6px 25px -8px rgba(6, 32, 46, 0.1);
        .cont-alert {
            padding: 30px 20px 30px 60px;
            text-align: left;
            .title {
                h3 {
                    margin-top: 0;
                    text-transform: uppercase;
                    color: ${colors.alert};
                    font-size: 18px;
                    font-weight: 800;
                }
            }
            p {
                color: ${colors.white};
                font-size: 14px;
                margin-bottom: 0;
            }
        }
        img {
            position: absolute;
            max-width: 36px;
            left: 15px;
            top: 26px;
            ${maxPhone(css`
                top: 34px;
            `)};
        }
    }
    .close {
        background-color: transparent;
        border-style: none;
        position: absolute;
        display: block;
        right: 10px;
        top: 10px;
        padding: 0 !important;
        margin-top: 0 !important;
        ${maxPhone(css`
            width: initial !important;
        `)}
        img {
            max-width: 16px;
            width: 16px;
        }
    }
    tr {
        display: block;
    }
    .block-align {
        text-align: center;
    }
    .table-scroll {
        overflow: scroll;
        display: block;
        height: 482px;
    }
    ${maxPhone(css`
        max-width: 100%;
    `)};
    .quantitypokt {
        text-align: center;
        padding-bottom: 35px;
        margin-bottom: 50px;
        background: linear-gradient(to right, #fff 27%, #27a9e0 100%) right
            bottom no-repeat;
        background-size: 100% 1px;
        ${maxPhone(css`
            margin-bottom: 20px;
        `)};
        .container {
            max-width: 535px;
            margin: 0 auto;
            h1 {
                font-size: 55px;
                color: ${colors.white};
                margin-top: 0;
                margin-bottom: 10px;
                ${maxPhone(css`
                    font-size: 33px;
                `)};
            }
            .stats {
                display: flex;
                justify-content: space-between;
                padding: 0 22px;
                .stat {
                    &:first-of-type {
                        img {
                            max-width: 17px;
                            margin-right: 5px;
                            ${maxPhone(css`
                                max-width: 12px;
                                margin-right: 3px;
                            `)};
                        }
                    }
                    &:last-of-type {
                        img {
                            max-width: 19px;
                            margin-left: 10px;
                            ${maxPhone(css`
                                max-width: 13px;
                                margin-left: 5px;
                            `)};
                        }
                    }
                    span {
                        font-size: 28px;
                        font-weight: 300;
                        color: ${colors.white};
                        text-transform: uppercase;
                        ${maxPhone(css`
                            font-size: 20px;
                        `)};
                    }
                    img {
                    }
                }
            }
        }
    }
    .pokt-options {
        max-width: 489px;
        padding: 55px 22px 40px 24px;
        margin: 0 auto;
        margin-top: 25px;
        text-align: center;
        background-image: linear-gradient(to bottom, #fbfbfb, #f5f5f5);
        border-radius: 12px;
        box-shadow: 0 43px 39px -40px rgba(0, 0, 0, 0.5);
        .container {
            display: flex;
            flex-wrap: wrap;
            .option {
                flex-grow: 1;
                .heading {
                    h2 {
                        margin: 0;
                        font-family: "Open Sans", sans-serif;
                        font-weight: 800;
                        font-size: 20px;
                        color: ${colors.darkBlue};
                        letter-spacing: -0.5px;
                        ${maxPhone(css`
                            font-size: 20px;
                        `)};
                        img {
                            margin-right: 0px;
                            ${maxPhone(css`
                                margin-right: -5px;
                            `)};
                        }
                        span {
                            font-size: 10px;
                            margin-left: -8px;
                            ${maxPhone(css`
                                font-size: 20px;
                                margin-left: 0.1px;
                            `)};
                        }
                    }
                }
                &:first-of-type {
                    img {
                        max-width: 17px;
                        ${maxPhone(css`
                            max-width: 13px;
                        `)};
                    }
                }
                &:nth-child(2) {
                    img {
                        max-width: 21px;
                        ${maxPhone(css`
                            max-width: 17px;
                        `)};
                    }
                }
                &:last-of-type {
                    img {
                        max-width: 21px;
                        ${maxPhone(css`
                            max-width: 17px;
                        `)};
                    }
                    ${maxPhone(css`
                        margin-top: 8px;
                    `)};
                }
                .title {
                    font-size: 14px;
                    font-weight: 300;
                    color: ${colors.gray};
                }
            }
        }
        .btn-subm {
            margin: 45px 0 0;
            ${maxPhone(css`
                margin-top: 20px;
            `)};
            a {
                max-width: 110px;
                margin: 0 20px;
                ${maxPhone(css`
                    max-width: 100%;
                    margin: 0;
                `)};
                &:first-of-type {
                    padding: 9px 27px;
                    ${maxPhone(css`
                        margin-bottom: 20px;
                    `)};
                }
                &:last-of-type {
                    padding: 9px 41px;
                }
            }
        }
    }
    .pass-pk {
        max-width: 535px;
        margin: 38px auto 40px auto;
        text-align: center;
        ${maxPhone(css`
            padding: 10px 0 35px 0;
            max-width: 100%;
        `)};
        .cont-input {
            &.second {
                margin-top: 22px;
            }
            &.third {
                margin-top: 34px;
            }
            input {
                background-color: #f5f5f5;
                border: none;
                border-radius: 23px;
                padding: 15px 18px;
                &#prk {
                }
            }
            label {
                text-transform: uppercase;
                font-size: 18px;
                font-weight: 700;
                color: ${colors.white};
                display: block;
                text-align: left;
                margin-bottom: 10px;
            }
        }
        .btn-subm {
            margin-top: 55px;
            a {
                padding: 9px 31px;
                ${maxPhone(css`
                    margin: 0;
                `)};
            }
        }
    }
    .toggle-btn {
        text-align: center;
    }
`;

export default AccountLContent;
