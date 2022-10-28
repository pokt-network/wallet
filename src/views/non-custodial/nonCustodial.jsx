import React, { useCallback, useState } from "react";
import { Banner, Button, Link, TextInput } from "@pokt-foundation/ui";
import Layout from "../../components/layout";
import {
  DetailContent,
  ValidateContent,
} from "../../components/non-custodial/content";
import { getDataSource } from "../../datasource";
import JailedStatus from "../../components/jailed/jailed";
import CopyButton from "../../components/copy/copy";
import NodeAppStatus from "../../components/NodeAppStatus/nodeAppStatus";
import IconWithLabel from "../../components/iconWithLabel/iconWithLabel";
import { useUser } from "../../context/userContext";
import UnjailUnstake from "../../components/modals/unjail-unstake/unjailUnstake";
import { useHistory } from "react-router-dom";
import useTransport from "../../hooks/useTransport";
import { UPOKT } from "../../utils/utils";

const dataSource = getDataSource();

function Validate({
  setNodeStakedTokens,
  setNodeStakingStatus,
  setAddress,
  address,
  goNext,
  user,
  setNode,
}) {
  const [validateStatus, setValidateStatus] = useState("");
  const validateStatusMessage =
    validateStatus === "error"
      ? "Sorry, your account is neither the operator or output address for the given node."
      : validateStatus === "loading"
      ? "loading"
      : "";

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
        obj.stakedTokens = (Number(node.tokens.toString()) / UPOKT).toFixed(3);
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
      setNode(node);
      return true;
    },
    [setNodeStakedTokens, setNodeStakingStatus, setNode]
  );

  const validate = useCallback(async () => {
    setValidateStatus("loading");
    const nodeOrError = await dataSource.getNode(address);
    if (nodeOrError === undefined) {
      setValidateStatus("error");
      return;
    }

    if (nodeOrError.output_address !== user.user.addressHex) {
      setValidateStatus("error");
      return;
    }

    const wasNodeAdded = addNode(nodeOrError);
    if (!wasNodeAdded) {
      setValidateStatus("error");
      return;
    }

    setValidateStatus("");
    goNext();
  }, [addNode, address, goNext, user.user]);

  return (
    <Layout title={<h1 className="title">Verify Node Access</h1>}>
      <ValidateContent>
        <p className="description">
          Please enter the operator address of the node. Note, that your account
          must either be the operator or output account associated with the node
          to either view, or manage the node.
        </p>
        <TextInput
          onChange={({ target }) => setAddress(target.value)}
          placeholder="Custodial Node Address"
        />
        <IconWithLabel
          className="status"
          message={validateStatusMessage}
          type={validateStatus}
          show={validateStatus}
        />
        <Button mode="primary" onClick={validate}>
          Validate
        </Button>
      </ValidateContent>
    </Layout>
  );
}

function Detail({ nodeStakingStatus, nodeStakedTokens, address, user, node }) {
  const history = useHistory();
  const {
    user: { ppk, addressHex, publicKeyHex },
  } = user;
  const { isUsingHardwareWallet } = useTransport();
  const [isUnjailModalVisible, setIsUnjailModalVisible] = useState(false);
  const [isUnstakeModalVisible, setIsUnstakeModalVisible] = useState(false);
  const isUnstakeDisabled = node.status !== 2;

  const pushToTxDetail = useCallback(
    (txHash) => {
      if (!isUsingHardwareWallet && (!addressHex || !publicKeyHex || !ppk)) {
        console.error(
          "No account available, please create or import an account"
        );
        return;
      }

      if (txHash) {
        history.push({
          pathname: "/transaction-detail",
          data: { txHash, comesFromSend: true },
          loadFromCache: true,
        });
      }
    },
    [history, addressHex, publicKeyHex, ppk, isUsingHardwareWallet]
  );

  return (
    <Layout title={<h1 className="title">Manage Non-Custodial Nodes</h1>}>
      <DetailContent>
        {nodeStakingStatus === "UNSTAKING" && (
          <Banner mode="info" title="Node Unstake In Progress">
            This node is currently being unstaked. After this is complete, the
            POKT balance from this node will be available in the account of the
            output address.
          </Banner>
        )}
        {/* user.address === node.outputAddress && user.pubKey === node.operatorPubKey */}
        <p className="description">
          Your account is the a custodial owner of the below node. Through this
          interface. you can only view and unstake the node. Running the unstake
          command measns that the currently staked tokens will be available on
          this account after the unstaking period is over. For more information
          and additional commands, please see the{" "}
          <Link href="https://docs.pokt.network/core/specs/cli/node">
            documentation.
          </Link>
        </p>
        {/* user.address === node.outputAddress */}
        <p className="description">
          Your account is the a output for the below node. Through this
          interface. you can only view and unstake the node. Running the unstake
          command measns that the currently staked tokens will be available on
          this account after the unstaking period is over. For more information
          and additional commands, please see the{" "}
          <Link href="https://docs.pokt.network/core/specs/cli/node">
            documentation.
          </Link>
        </p>
        {/*  user.pubKey === node.operatorPubKey */}
        <p className="description">
          Your account is the output account for the below node. Through this
          interface. you can only view and unstake the node. Running the unstake
          command measns that the currently staked tokens will be available on
          the output account [OUTPUT ADDRESS HERE] after the unstaking period is
          over. The unstaked tokens will not be available from on this account
          once unstaking has occurred. For more information and additional
          commands, please see the{" "}
          <Link href="https://docs.pokt.network/core/specs/cli/node">
            documentation.
          </Link>
        </p>
        <JailedStatus
          nodeStakingStatus={nodeStakingStatus}
          setIsUnjailModalVisible={setIsUnjailModalVisible}
        />
        <h3 className="copy-title">Operator Address</h3>
        <CopyButton className="address-input" text={address} width={488} />
        <NodeAppStatus
          nodeStakingStatus={nodeStakingStatus}
          nodeStakedTokens={nodeStakedTokens}
        />
        <Button
          className="unstake-btn"
          mode="primary"
          onClick={() => setIsUnstakeModalVisible(true)}
          disabled={isUnstakeDisabled}
        >
          Unstake
        </Button>

        <UnjailUnstake
          type="unjail"
          ppk={ppk}
          visible={isUnjailModalVisible}
          onClose={() => setIsUnjailModalVisible(false)}
          pushToTxDetail={pushToTxDetail}
          nodeAddress={address}
        />

        <UnjailUnstake
          type="unstake"
          ppk={ppk}
          visible={isUnstakeModalVisible}
          onClose={() => setIsUnstakeModalVisible(false)}
          pushToTxDetail={pushToTxDetail}
          nodeAddress={address}
        />
      </DetailContent>
    </Layout>
  );
}

export default function NonCustodial() {
  const user = useUser();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [node, setNode] = useState("");
  const [nodeStakedTokens, setNodeStakedTokens] = useState(0);
  const [nodeStakingStatus, setNodeStakingStatus] = useState("UNSTAKED");

  const goNext = () => setStep((prevStep) => prevStep + 1);

  return (
    <React.Fragment>
      {step === 0 ? (
        <Validate
          setNodeStakedTokens={setNodeStakedTokens}
          setNodeStakingStatus={setNodeStakingStatus}
          setAddress={setAddress}
          address={address}
          goNext={goNext}
          user={user}
          setNode={setNode}
        />
      ) : (
        <Detail
          nodeStakingStatus={nodeStakingStatus}
          nodeStakedTokens={nodeStakedTokens}
          address={address}
          user={user}
          node={node}
        />
      )}
    </React.Fragment>
  );
}
