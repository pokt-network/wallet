import React from "react";
import StakingOption from "../account-detail/stakingOption";
import NodeAppStatusContent from "./content";

export default function NodeAppStatus({
  nodeStakingStatus = "UNSTAKED",
  nodeStakedTokens = 0,
  appStakingStatus = "UNSTAKED",
  appStakedTokens = 0,
}) {
  return (
    <NodeAppStatusContent>
      {nodeStakingStatus === "UNSTAKED" && appStakingStatus === "UNSTAKED" ? (
        <StakingOption
          className="none-options"
          token="00.00"
          status="Unstaked"
          accountType="None"
        />
      ) : (
        <>
          {nodeStakingStatus !== "UNSTAKED" ? (
            <StakingOption
              className="node-options"
              token={nodeStakedTokens}
              status={nodeStakingStatus}
              accountType="Node"
            />
          ) : null}

          {nodeStakingStatus !== "UNSTAKED" &&
          appStakingStatus !== "UNSTAKED" ? (
            <div className="separator"></div>
          ) : null}

          {appStakingStatus !== "UNSTAKED" ? (
            <StakingOption
              className="app-options"
              token={appStakedTokens}
              status={appStakingStatus}
              accountType="App"
            />
          ) : null}
        </>
      )}
    </NodeAppStatusContent>
  );
}
