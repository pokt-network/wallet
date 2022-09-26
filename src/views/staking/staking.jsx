import { Button, IconSearch, TextInput } from "@pokt-foundation/ui";
import React, { useEffect, useRef, useState } from "react";
import IconWithLabel from "../../components/iconWithLabel/iconWithLabel";
import Layout from "../../components/layout";
import { StakingContent } from "../../components/staking/content";
import { getDataSource } from "../../datasource";
import IconQuestion from "../../icons/iconQuestion";
import StakingModal from "./stakingModal";

const dataSource = getDataSource();

export default function Staking() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectChainsOpen, setIsSelectChainsOpen] = useState(false);
  const [supportedChains, setSupportedChains] = useState([]);
  const [selectedChains, setSelectedChains] = useState([]);
  const [chainsToRender, setChainsToRender] = useState(supportedChains);
  const [error, setError] = useState("");
  const stakeData = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (selectedChains.length === 0) {
      setError("At least one chain must be selected");
      return;
    }

    stakeData.current = data;
    setIsModalOpen(true);
    setError("");
  };

  const getSupportedChains = async () => {
    const supportedChains = await dataSource.getSupportedChains();
    if (!supportedChains) {
      setError("Error while fetching chains data.");
      return;
    }
    setError("");
    setSupportedChains(supportedChains);
    setChainsToRender(supportedChains);
  };

  const onChainChange = (e, chain) => {
    const {
      target: { checked },
    } = e;
    if (!checked) {
      setSelectedChains(
        selectedChains.filter((selectedChain) => selectedChain !== chain)
      );
      return;
    }

    if (selectedChains.length === 0) {
      setError("");
    }
    setSelectedChains((prev) => [...prev, chain]);
  };

  const onChainsSearch = (e) => {
    const {
      target: { value },
    } = e;

    if (value.length === 0) {
      setChainsToRender(supportedChains);
      return;
    }

    const tempChains = [];

    for (const chain of supportedChains) {
      if (chain.toLowerCase().includes(value.toLowerCase())) {
        tempChains.push(chain);
      }
    }

    setChainsToRender(tempChains);
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

          <div className="relay-chains-container">
            <TextInput
              placeholder="Select Chains IDs"
              name="relayChainIds"
              adornment={<IconSearch className="search-icon" />}
              adornmentPosition="end"
              readOnly
              required
              onClick={() =>
                setIsSelectChainsOpen((prev) => {
                  if (prev) {
                    setChainsToRender(supportedChains);
                  }
                  return !prev;
                })
              }
            />
            <IconQuestion />
            {isSelectChainsOpen && (
              <div className="dropdown">
                <TextInput
                  className="searchbar"
                  placeholder="Search Chains IDS"
                  name="relayChainIds"
                  adornment={<IconSearch className="search-icon" />}
                  adornmentPosition="end"
                  onChange={(e) => onChainsSearch(e)}
                />
                <div className="dropdown-container">
                  {chainsToRender.map((chain) => (
                    <>
                      <div className="dropdown-row" key={chain}>
                        <input
                          type="checkbox"
                          checked={
                            selectedChains.find((sc) => sc === chain)
                              ? true
                              : false
                          }
                          onChange={(e) => onChainChange(e, chain)}
                        />
                        <span>{chain}</span>
                      </div>
                      <div className="dropdown-spacer" />
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedChains.length > 0 ? (
            <div className="selected-chains-container">
              {selectedChains.map((selectedChain) => (
                <div className="selected-chain-tag">{selectedChain}</div>
              ))}
            </div>
          ) : (
            <p>Loading chains...</p>
          )}

          <IconWithLabel message={error} show={error} type="error" />
          <Button className="stake" mode="primary" type="submit">
            Stake Node
          </Button>
        </form>
      </StakingContent>

      <StakingModal
        isOpen={isModalOpen}
        selectedChains={selectedChains}
        setIsOpen={setIsModalOpen}
        stakeData={stakeData}
      />
    </Layout>
  );
}
