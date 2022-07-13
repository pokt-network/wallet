import React, { useCallback, useState } from "react";
import { Button, TextInput } from "@pokt-foundation/ui";
import Layout from "../../components/layout";
import {
  DetailContent,
  ValidateContent,
} from "../../components/non-custodial/content";
import { getDataSource } from "../../datasource";
import JailedStatus from "../../components/jailed/jailed";
import CopyButton from "../../components/copy/copy";
import NodeAppStatus from "../../components/NodeAppStatus/nodeAppStatus";

const dataSource = getDataSource();

function Validate({
  setNodeStakedTokens,
  setNodeStakingStatus,
  setAddress,
  address,
  goNext,
}) {
  const addNode = useCallback(
    (node) => {
      let obj = {
        stakingStatus: "UNSTAKED",
        stakedTokens: 0,
      };

      if (node === undefined) {
        setNodeStakedTokens(obj.stakedTokens);
        setNodeStakingStatus(obj.stakingStatus);
        return false;
      }

      const isUnjailing = localStorage.getItem("unjailing");

      if (node?.tokens) {
        obj.stakedTokens = (Number(node.tokens.toString()) / 1000000).toFixed(
          3
        );
      }

      if (node?.status === 1) {
        obj.stakingStatus = "UNSTAKING";
      } else if (node?.status === 2) {
        obj.stakingStatus = "STAKED";
      }

      if (node?.jailed) {
        if (isUnjailing) {
          obj.stakingStatus = "UNJAILING";
        } else {
          obj.stakingStatus = "JAILED";
        }
      } else {
        localStorage.setItem("unjailing", false);
      }

      setNodeStakedTokens(obj.stakedTokens);
      setNodeStakingStatus(obj.stakingStatus);
      return true;
    },
    [setNodeStakedTokens, setNodeStakingStatus]
  );

  const validate = useCallback(async () => {
    const nodeOrError = await dataSource.getNode(address);
    if (nodeOrError === undefined) {
      // SOME ERROR MESSAGE
      return;
    }

    const wasNodeAdded = addNode(nodeOrError);
    if (!wasNodeAdded) {
      // SOME ERROR MESSAGE
      return;
    }

    goNext();
  }, [addNode, address, goNext]);

  return (
    <Layout title={<h1 className="title">Validate Access</h1>}>
      <ValidateContent>
        <p>What is the address you want to interact with</p>
        <TextInput
          onChange={({ target }) => setAddress(target.value)}
          placeholder="Address"
        />
        <Button mode="primary" onClick={validate}>
          Validate
        </Button>
      </ValidateContent>
    </Layout>
  );
}

function Detail({ nodeStakingStatus, nodeStakedTokens, address, goPrevious }) {
  return (
    <Layout title={<h1 className="title">Delegated Account</h1>}>
      <DetailContent>
        <JailedStatus nodeStakingStatus={nodeStakingStatus} />
        <h3 className="copy-title">Address</h3>
        <CopyButton text={address} width={488} />
        <NodeAppStatus
          nodeStakingStatus={nodeStakingStatus}
          nodeStakedTokens={nodeStakedTokens}
        />
        <Button className="unstake-btn" mode="primary">
          Unstake
        </Button>
      </DetailContent>
    </Layout>
  );
}

export default function NonCustodial() {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [nodeStakedTokens, setNodeStakedTokens] = useState(0);
  const [nodeStakingStatus, setNodeStakingStatus] = useState("UNSTAKED");

  const goNext = () => setStep((prevStep) => prevStep + 1);
  const goPrevious = () =>
    setStep((prevStep) => (prevStep === 0 ? prevStep : prevStep - 1));

  return (
    <React.Fragment>
      {step === 0 ? (
        <Validate
          setNodeStakedTokens={setNodeStakedTokens}
          setNodeStakingStatus={setNodeStakingStatus}
          setAddress={setAddress}
          address={address}
          goNext={goNext}
        />
      ) : (
        <Detail
          nodeStakingStatus={nodeStakingStatus}
          nodeStakedTokens={nodeStakedTokens}
          address={address}
          goPrevious={goPrevious}
        />
      )}
    </React.Fragment>
  );
}
