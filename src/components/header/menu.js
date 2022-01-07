import React from "react";
import styled, { css } from "styled-components";
import { tablet, maxPhone } from "../../utils/media";

const MenuWrapper = styled.nav`
  overflow: hidden;
  display: none;

  ${maxPhone(css`
    background: ${(props) =>
      `linear-gradient(126.96deg, ${props.theme.backgroundGradient1} -5.41%, ${props.theme.backgroundGradient2} 1001.86%)`};
    padding-bottom: 30px;

    .separator {
      background: ${(props) => props.theme.backgroundBorder};
      height: 2px;
      width: 100%;
      margin: 35px 0 0 0;
    }

    li,
    button,
    a {
      font-weight: 500 !important;
      font-size: 22px !important;
      line-height: 26px !important;
      color: ${(props) => props.theme.colors.white} !important;
    }

    .nav-button {
      padding: 0;
    }

    li:first-of-type {
      background: transparent;
    }
  `)};

  ${tablet(css`
    display: block;
    text-align: right;
    overflow: visible;
  `)};

  ${(props) =>
    maxPhone(
      props.isHidden ||
        css`
          display: block;
          width: 100%;
          top: 0;
          padding-top: 50px;
          position: fixed;
          left: 0;
          z-index: 9999;
          height: 100vh;
        `
    )};
`;

function Menu(props) {
  const children = props.children;

  return (
    <MenuWrapper isHidden={props.isHidden}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isHidden: props.isHidden })
      )}
    </MenuWrapper>
  );
}

export default Menu;
