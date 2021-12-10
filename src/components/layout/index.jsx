import React from "react";
import LayoutContainer from "./layout";

export default function Layout({ children, title }) {
  return (
    <LayoutContainer>
      {title ? <div className="title-container">{title}</div> : null}
      {children}
    </LayoutContainer>
  );
}
