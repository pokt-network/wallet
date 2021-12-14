import React, { Component } from "react";
import Wrapper from '../wrapper';
import LandingContent from './landing-content';

class MaintenanceLanding extends Component {
  render () {
    return (
      <LandingContent>
          <Wrapper className="wide-block-wr">
            <div className="top">
              <div className="title">
                <h1><span> Pocket Wallet is under </span>
                Maintenance
                </h1>
              </div>
            </div>
          </Wrapper>
      </LandingContent>
    );
  }
}

export default MaintenanceLanding;