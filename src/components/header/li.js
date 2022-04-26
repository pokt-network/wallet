import styled, { css } from "styled-components";
import { maxPhone, tablet } from "../../utils/media";
import { colors } from "../../utils/colors";
import arrow from "../../utils/images/down-arrow.png";

const StyledLi = styled.li`
  display: inline-block;
  text-align: center;
  padding: 15px 25px;

  .mobile-menu-icon {
    margin: 0 8px 4px 0;
    vertical-align: middle;
  }

  ${maxPhone(css`
    display: block;
    padding: 16px 20px;
    text-align: left;
    font-size: 14px;

    &:first-of-type {
      background: ${(props) => props.theme.backgroundBorder};
      background-size: 100% 1px;
    }
    &:last-of-type {
      a {
        color: ${colors.white};
      }
    }

    &.active {
      background: rgb(196, 196, 196, 0.1) !important;
      border-left: 2px solid ${(props) => props.theme.colors.green};
    }
  `)};
  a {
    position: relative;
    font-weight: 300;
    font-size: 14px;
    color: ${colors.white};
    text-decoration: none;
    ${maxPhone(css`
      display: block;
      text-align: left;
      color: ${colors.white};
      font-size: 22px;
      line-height: 1.5;
      display: initial;
      &.active {
        border-bottom: none !important;
        padding-bottom: 0 !important;
      }
      img {
        display: none;
      }
    `)};

    &:last-of-type {
      padding-right: 0;
      vertical-align: middle;
    }
    &.active {
      border-bottom: 1px solid ${colors.white};
      padding-bottom: 3px;
    }
  }
  &.sub_menu {
    font-weight: 700;
    color: ${colors.blue};
    img {
      width: 4px;
      transform: rotate(90deg);
      margin-left: 3px;
    }
  }
  ul {
    position: absolute;
    height: 110px;
    width: 250px;
    top: 52px;
    left: 0px;
    display: none;
    ${maxPhone(css`
      display: block;
      position: relative;
      top: initial;
      left: initial;
      list-style-type: none;
      padding-left: 15px;
      margin-top: 5px;
      li {
        text-align: left;
        padding: 15px 15px;
        a {
          text-decoration: none;
          font-size: 22px;
        }
      }
    `)};
  }
  ${tablet(css`
    &:hover {
      ul {
        display: block;
        right: 20px;
        left: initial;
        top: 40px;
        z-index: 99999;
        list-style-type: none;
        border: none;
        padding-left: 0;
        background-color: ${colors.white};
        border-radius: 8px;
        box-shadow: 0 6px 25px -8px rgba(0, 0, 0, 0.5);
        height: initial;
        width: initial;
        padding: 7px 0 6px 0;
        background-image: url(${arrow});
        background-repeat: no-repeat;
        background-size: 7px;
        background-position: 69px 30px;
        li {
          border-bottom: 1px solid ${colors.blue};
          padding-bottom: 3px;
          margin: 0 23px 5px 12px;
          text-align: left;
          &:hover {
            span {
              color: ${colors.white};
            }
          }
          a {
            text-decoration: none;
            color: ${colors.black};
            font-size: 14px;
            font-weight: 500;
            &.active {
              border-bottom: 1px solid ${colors.blue};
            }
            span {
              color: ${colors.blue};
              margin-right: 2px;
            }
          }
        }
      }
    }
  `)};
`;

export default StyledLi;
