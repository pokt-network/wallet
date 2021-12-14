import React, { Component } from "react";
import Wrapper from '../wrapper';
import Description from './description';
import LandingContent from './landing-content';

class MaintenanceLanding extends Component {
  render () {
    return (
      <LandingContent>
          <Wrapper className="wide-block-wr">
            <div className="top">
              <div className="title">
                <h1><span> Pocket Wallet is under </span>
                Temporary Maintenance
                </h1>
                <Description>
                  We will be back soon
                </Description>
              </div>
            </div>
          </Wrapper>
      </LandingContent>
    );
  }
}

export default MaintenanceLanding;