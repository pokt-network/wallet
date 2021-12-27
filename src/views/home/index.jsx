import React from "react";
import { withRouter } from "react-router-dom";
import LandingContent from "../../components/landing/landing-content";
import Link from "../../components/link/button";

function Home() {
  return (
    <LandingContent>
      <div className="top">
        <h1>
          Welcome to <br /> Pocket Wallet
        </h1>
        <p className="description">
          This is an open-source interface to provide easy access and management
          of your POKT cryptocurrency.
        </p>
      </div>
      <div className="bottom">
        <h2>Do you have a Pocket account?</h2>
        <div className="btns">
          <Link to="/create" transparent="true">
            Create
          </Link>
          <Link to="/import">Import</Link>
        </div>
      </div>
    </LandingContent>
  );
}

export default withRouter(Home);
