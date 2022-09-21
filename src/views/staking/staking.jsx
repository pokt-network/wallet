import { Button, Modal, TextInput } from "@pokt-foundation/ui";
import { typeGuard } from "@pokt-network/pocket-js";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import PasswordInput from "../../components/input/passwordInput";
import Layout from "../../components/layout";
import {
  StakingContent,
  StakingModalContent,
} from "../../components/staking/content";
import { Config } from "../../config/config";
import { useTx } from "../../context/txContext";
import { useUser } from "../../context/userContext";
import { getDataSource } from "../../datasource";
import IconQuestion from "../../icons/iconQuestion";
import { getAddressFromPublicKey, UPOKT } from "../../utils/utils";
import { ROUTES } from "../../utils/routes";
import IconWithLabel from "../../components/iconWithLabel/iconWithLabel";
import { isAddress } from "../../utils/isAddress";

const dataSource = getDataSource();

export default function Staking() {
  let history = useHistory();
  const {
    user: { ppk },
  } = useUser();
  const { updateTx } = useTx();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const stakeData = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    stakeData.current = data;
    setIsModalOpen(true);
    setError("");
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { passphrase } = Object.fromEntries(formData);
    const {
      serviceURI,
      amount,
      operatorPublicKey,
      outputAddress,
      relayChainIds,
    } = stakeData.current;

    const fmtRelayChainsIds = relayChainIds.split(",");
    const url = new URL(serviceURI);

    // Ledger staking
    // Add get chains
    // Chains UI
    // Test staking again
    if (!isAddress(outputAddress)) {
      setError("Invalid Output Address");
      return;
    }

    if (!isAddress(getAddressFromPublicKey(operatorPublicKey))) {
      setError("Invalid Operator Public Key");
      return;
    }

    const request = await dataSource.stakeNode(
      ppk,
      passphrase,
      operatorPublicKey,
      outputAddress,
      fmtRelayChainsIds,
      (Number(amount) * UPOKT).toString(),
      url
    );

    if (typeGuard(request, Error)) {
      // Display some error
      setError(`${request}`);
      console.error(request);
      return;
    }

    setError("");
    const { txhash } = request;
    updateTx(
      "Node Stake",
      outputAddress,
      operatorPublicKey,
      amount,
      txhash,
      Number(Config.TX_FEE) / UPOKT,
      "Pending",
      "Pending",
      undefined,
      "Pocket wallet"
    );

    history.push({
      pathname: ROUTES.txDetail,
      data: { txhash, comesFromSend: true },
      loadFromCache: true,
    });
    return;
  };

  return (
    <Layout title={<h1 className="title">Node Stake</h1>}>
      <StakingContent>
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextInput
            placeholder="Service URI"
            name="serviceURI"
            type="url"
            pattern="https://.*"
            required
          />
          <IconQuestion />
          <TextInput
            placeholder="Amount"
            name="amount"
            adornment={<span className="adornment">POKT</span>}
            adornmentPosition="end"
            required
          />
          <IconQuestion />

          <TextInput
            key="operatorPublicKey"
            placeholder="Operator Public Key"
            name="operatorPublicKey"
            required
          />
          <IconQuestion />
          <TextInput
            key="outputAddress"
            placeholder="Output Address"
            name="outputAddress"
            required
          />
          <IconQuestion />

          <TextInput
            placeholder="Relay Chain IDs"
            name="relayChainIds"
            required
          />
          <IconQuestion />
          <Button className="stake" mode="primary" type="submit">
            Stake Node
          </Button>
        </form>
      </StakingContent>

      <Modal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="pocket-modal"
      >
        <StakingModalContent>
          <form onSubmit={(e) => handleConfirmSubmit(e)}>
            <h1 className="modal-title">
              Confirm your passphrase to complete the transaction
            </h1>
            <div>
              <PasswordInput
                placeholder="Passphrase"
                name="passphrase"
                required
              />
              <IconWithLabel message={error} show={error} type="error" />
            </div>
            <div className="confirm-container">
              <Button mode="primary" type="submit">
                Confirm Stake Node
              </Button>
            </div>
          </form>
        </StakingModalContent>
      </Modal>
    </Layout>
  );
}
