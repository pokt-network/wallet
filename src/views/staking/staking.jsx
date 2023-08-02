import { Button, IconSearch, TextInput } from "@pokt-foundation/ui";
import React, { useEffect, useRef, useState } from "react";
import IconWithLabel from "../../components/iconWithLabel/iconWithLabel";
import Layout from "../../components/layout";
import { StakingContent } from "../../components/staking/content";
import { useUser } from "../../context/userContext";
import { getDataSource } from "../../datasource";
import IconQuestion from "../../icons/iconQuestion";
import StakingModal from "./stakingModal";

const dataSource = getDataSource();

export default function Staking() {
  const user = useUser();
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

    if (selectedChains.length > 15) {
      // TODO: We need to have this value pulled from the "pos/MaximumChains" param instead of hardcoding
      setError("Only a maximum of 15 chains can be selected.");
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
    const parsedSupportedChains =
      typeof supportedChains === "string"
        ? JSON.parse(supportedChains)
        : supportedChains;
    setError("");
    setSupportedChains(parsedSupportedChains);
    setChainsToRender(parsedSupportedChains);
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
    <Layout title={<h1 className="title">Stake Node</h1>}>
      <StakingContent>
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextInput
            placeholder="Amount"
            name="amount"
            adornment={<span className="adornment">POKT</span>}
            adornmentPosition="end"
            required
          />
          <IconQuestion />

          <p className="description">
            The Operator Public Key is the Public Key associated with the
            account that will be located on the node signing transactions. If
            Staking Non-Custodially, this value needs to be provided by your
            operator.
          </p>
          <TextInput
            key="operatorPublicKey"
            placeholder="Operator Public Key"
            name="operatorPublicKey"
            required
          />
          <IconQuestion />

          <p className="description">
            The Output Address is the address that rewards will be sent to. You
            should only change this if you want rewards to go to a wallet that
            is different from this one.
          </p>
          <TextInput
            key="outputAddress"
            placeholder="Output Address"
            name="outputAddress"
            required
            defaultValue={user.user.addressHex}
          />
          <IconQuestion />

          <p className="description">
            The Service URI is the URL that the node is advertised as available
            for service at. If Staking Non-Custodially, this value needs to be
            provided by your operator. NOTE: The Ledger Nano S model service URL
            is limited to 64 bytes. The Ledger Nano S Plus and Nano X service
            URLs have a 256 byte limit.
          </p>
          <TextInput
            placeholder="Service URI"
            name="serviceURI"
            type="url"
            pattern="https://.*"
            required
          />
          <IconQuestion />

          <p className="description">
            These are the relay chains that the operator will be providing
            service for. If Staking Non-Custodially, these values need to be
            provided by your operator. NOTE: The Ledger Nano S model supports
            non-custodial staking for up to 4 chains. The Ledger Nano S Plus and
            Nano X models suport non-custodial staking for up to 50 chains.
          </p>
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
                  {chainsToRender.length > 0 ? (
                    chainsToRender.map((chain) => (
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
                        <div
                          className="dropdown-spacer"
                          key={`spacer-${chain}`}
                        />
                      </>
                    ))
                  ) : (
                    <p>Loading chains...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedChains.length > 0 && (
            <div className="selected-chains-container">
              {selectedChains.map((selectedChain) => (
                <div
                  className="selected-chain-tag"
                  key={`selected-${selectedChain}`}
                >
                  {selectedChain}
                </div>
              ))}
            </div>
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
