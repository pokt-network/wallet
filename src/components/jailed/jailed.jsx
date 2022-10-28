import React from "react";
import { Button } from "@pokt-foundation/ui";
import JailedStatusContent from "./content";

export default function JailedStatus({
  nodeStakingStatus,
  setIsUnjailModalVisible,
}) {
  return (
    <React.Fragment>
      {nodeStakingStatus === "JAILED" && (
        <JailedStatusContent>
          <div className="unjail-description">
            <h2>Jailed Node</h2>
            <p>Currently not dispaching Data</p>
          </div>
          <Button
            className="unjail-button"
            onClick={() => setIsUnjailModalVisible(true)}
          >
            Unjail
          </Button>
        </JailedStatusContent>
      )}
    </React.Fragment>
  );
}
