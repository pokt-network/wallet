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
import { UPOKT } from "../../utils/utils";
import { ROUTES } from "../../utils/routes";

const dataSource = getDataSource();

export default function Staking() {
  let history = useHistory();
  const {
    user: { ppk, addressHex },
  } = useUser();
  const { updateTx } = useTx();
  const [isNonCustodial, setIsNonCustodial] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stakeData = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    stakeData.current = data;
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { passphrase = "" } = Object.fromEntries(formData);
    const {
      serviceURI,
      amount,
      fromAddress = "",
      operatorPublicKey = "",
      outputAddress = "",
      relayChainIds,
    } = stakeData.current;

    const fmtRelayChainsIds = relayChainIds.split(",");
    const url = new URL(serviceURI);

    const request = await dataSource.stakeNode(
      ppk,
      passphrase,
      fromAddress ?? operatorPublicKey,
      outputAddress,
      fmtRelayChainsIds,
      amount * UPOKT,
      url
    );

    if (typeGuard(request, Error)) {
      // Display some error
      console.error(request);
      return;
    }

    const { txHash } = request;
    console.log(request);
    updateTx(
      "Node Stake",
      addressHex,
      operatorPublicKey,
      amount,
      txHash,
      Number(Config.TX_FEE) / UPOKT,
      "Pending",
      "Pending",
      undefined,
      "Pocket wallet"
    );

    history.push({
      pathname: ROUTES.txDetail,
      data: { txHash, comesFromSend: true },
      loadFromCache: true,
    });
    return;
  };

  return (
    <Layout title={<h1 className="title">Node Stake</h1>}>
      <StakingContent>
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextInput placeholder="Service URI" name="serviceURI" required />
          <IconQuestion />
          <TextInput
            placeholder="Amount"
            name="amount"
            adornment={<span className="adornment">POKT</span>}
            adornmentPosition="end"
            type="number"
            required
          />
          <IconQuestion />

          {!isNonCustodial ? (
            <>
              <TextInput
                key="fromAddress"
                placeholder="From Address"
                name="fromAddress"
                required
              />
              <IconQuestion />
            </>
          ) : (
            <>
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
            </>
          )}

          <TextInput
            placeholder="Relay Chain IDs"
            name="relayChainIds"
            required
          />
          <IconQuestion />

          <div className="activate-non-custodial">
            <p>Activate non-custodial?</p>
            <input
              className="checkbox"
              checked={isNonCustodial}
              onChange={() => setIsNonCustodial((prevChecked) => !prevChecked)}
              type="checkbox"
            />
          </div>
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
            </div>
            <Button mode="primary" type="submit">
              Confirm Stake Node
            </Button>
          </form>
        </StakingModalContent>
      </Modal>
    </Layout>
  );
}
