import React from "react";
import Title from "../public/title/title";
import LayoutContainer from "./layout-connect-ledger";

export default function Layout({ children, title }) {
  return (
    <LayoutContainer>
      <div className="title-container">
        <Title className="title">{title}</Title>
      </div>
      {children}
    </LayoutContainer>
  );
}
