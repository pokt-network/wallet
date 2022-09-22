import { Button, Modal, TextInput } from "@pokt-foundation/ui";
import { typeGuard } from "@pokt-network/pocket-js";
import React, { useEffect, useRef, useState } from "react";
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
  const [isSelectChainsOpen, setIsSelectChainsOpen] = useState(false);
  const [supportedChains, setSupportedChains] = useState([]);
  const [selectedChains, setSelectedChains] = useState([]);
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
    const { serviceURI, amount, operatorPublicKey, outputAddress } =
      stakeData.current;

    const url = new URL(serviceURI);

    if (!isAddress(outputAddress)) {
      setError("Invalid Output Address");
      return;
    }

    const operatorAddress = await getAddressFromPublicKey(operatorPublicKey);

    if (!isAddress(operatorAddress)) {
      setError("Invalid Operator Public Key");
      return;
    }

    if (selectedChains.length === 0) {
      setError("At least one chain must be selected");
      return;
    }

    const request = await dataSource.stakeNode(
      ppk,
      passphrase,
      operatorPublicKey,
      outputAddress,
      selectedChains,
      (Number(amount) * UPOKT).toString(),
      url
    );

    if (typeGuard(request, Error)) {
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

  const getSupportedChains = async () => {
    const supportedChains = await dataSource.getSupportedChains();
    if (!supportedChains) {
      return;
    }
    setSupportedChains(supportedChains);
  };

  useEffect(() => {
    getSupportedChains();
  }, []);

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
            readOnly
            required
            onClick={() => setIsSelectChainsOpen((prev) => !prev)}
          />
          <IconQuestion />

          {isSelectChainsOpen && (
            <div className="dropdown">
              <div className="dropdown-container">
                {supportedChains.map((chain) => (
                  <>
                    <div className="dropdown-row" key={chain}>
                      <input
                        type="checkbox"
                        checked={
                          selectedChains.find((sc) => sc === chain)
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          const {
                            target: { checked },
                          } = e;
                          if (!checked) {
                            setSelectedChains(
                              selectedChains.filter(
                                (selectedChain) => selectedChain !== chain
                              )
                            );
                            return;
                          }
                          setSelectedChains((prev) => [...prev, chain]);
                        }}
                      />
                      <span>{chain}</span>
                    </div>
                    <div className="dropdown-spacer" />
                  </>
                ))}
              </div>
            </div>
          )}

          {selectedChains.length > 0 && (
            <div className="selected-chains-container">
              {selectedChains.map((selectedChain) => (
                <div className="selected-chain-tag">{selectedChain}</div>
              ))}
            </div>
          )}
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
