import React, { useCallback, useEffect, useState } from "react";
import { Button, Link, Table } from "@pokt-foundation/ui";
import { useHistory } from "react-router";

import AccountHeaderContainer from "../../components/account-detail/headerContainer";
import Layout from "../../components/layout";
import AccountContent from "../../components/account-detail/content";
import CopyButton from "../../components/copy/copy";
import AccountTableContainer from "../../components/account-detail/tableContainer";
import { Config } from "../../config/config";
import { getDataSource } from "../../datasource";
import loadIcon from "../../utils/images/icons/load.svg";
import sentReceivedIcon from "../../utils/images/icons/sentReceived.svg";
import pocketService from "../../core/services/pocket-service";
import StakingOption from "../../components/account-detail/stakingOption";
import RevealPrivateKey from "../../components/modals/private-key/RevealPrivateKey";

const dataSource = getDataSource();

export default function AccountDetail() {
  let history = useHistory();

  // const [app, setApp] = useState(undefined);
  // const [node, setNode] = useState(undefined);
  const [addressHex, setAddressHex] = useState("");
  const [publicKeyHex, setPublicKeyHex] = useState("");
  const [ppk, setPpk] = useState("");
  const [poktsBalance, setPoktsBalance] = useState(0);
  const [, setUsdBalance] = useState(0);
  // const [noTransactions, setNoTransactions] = useState(true);
  const [appStakedTokens, setAppStakedTokens] = useState(0);
  const [nodeStakedTokens, setNodeStakedTokens] = useState(0);
  const [appStakingStatus, setAppStakingStatus] = useState("UNSTAKED");
  const [nodeStakingStatus, setNodeStakingStatus] = useState("UNSTAKED");
  const [isPkRevealModalVisible, setIsPkRevealModalVisible] = useState(true);
  // const [isUnjailModalVisible, setIsUnjailModalVisible] = useState(false);
  // const [isUnstakeModalVisible, setIsUnstakeModalVisible] = useState(false);
  const [maxTxListCount, setMaxTxListCount] = useState(
    Number(Config.MIN_TRANSACTION_LIST_COUNT)
  );
  const [txList, setTxList] = useState([]);
  // const [passphraseInput, setPassphraseInput] = useState("");
  const [price, setPrice] = useState(0);

  const increaseMaxTxListCount = useCallback(() => {
    if (maxTxListCount < Number(Config.MAX_TRANSACTION_LIST_COUNT)) {
      setMaxTxListCount((prevMax) => prevMax + 50);
    }
  }, [maxTxListCount]);

  // const maxListCountExceeded = () => {
  //   return maxTxListCount > Number(Config.MAX_TRANSACTION_LIST_COUNT);
  // };

  const pushToTxDetail = useCallback(
    (txHash, useCache) => {
      if (!addressHex || !publicKeyHex || !ppk) {
        console.error(
          "No account available, please create or import an account"
        );
        return;
      }

      if (txHash) {
        history.push({
          pathname: "/transaction-detail",
          data: { txHash },
          loadFromCache: useCache,
        });
      }
    },
    [history, addressHex, ppk, publicKeyHex]
  );

  const pushToSend = useCallback(() => {
    if (!addressHex || !publicKeyHex || !ppk) {
      console.error("No account available, please create an account");
      return;
    }

    history.push({
      pathname: "/send",
    });
  }, [addressHex, history, ppk, publicKeyHex]);

  const getTransactionData = useCallback((stdTx) => {
    if (stdTx.msg.type === "pos/MsgUnjail") {
      return { type: "unjail", amount: 0 };
    } else if (stdTx.msg.type === "pos/MsgBeginUnstake") {
      return { type: "unstake", amount: 0 };
    } else if (stdTx.msg.type === "pos/MsgStake") {
      const value = stdTx.msg.value.value / 1000000;
      return { type: "stake", amount: value };
    } else if (stdTx.msg.type === "pos/Send") {
      const amount = stdTx.msg.value.amount / 1000000;
      return { type: "sent", amount: amount };
    } else {
      const sendAmount = Object.keys(stdTx.msg).includes("amount")
        ? stdTx.msg.amount / 1000000
        : stdTx.msg.value.amount / 1000000;
      return { type: "sent", amount: sendAmount };
    }
  }, []);

  const updateTransactionList = useCallback(
    (txs) => {
      try {
        const rTxs = txs.reverse();
        const sentImgSrc = sentReceivedIcon;
        const loadingImgSrc = loadIcon;

        const renderTxs = (tx) => {
          if (!tx.stdTx.msg.amount && !tx.stdTx.msg.value) {
            return;
          }

          const { type: transactionType, amount } = getTransactionData(
            tx.stdTx
          );

          return {
            hash: tx.hash,
            imageSrc:
              transactionType.toLowerCase() === "sent"
                ? sentImgSrc
                : loadingImgSrc,
            amount: amount ? amount : 0,
            type: tx.type === "Received" ? tx.type : transactionType,
            height: tx.height,
            options: {
              onClick: () => pushToTxDetail(tx.hash, false),
            },
          };
        };
        const renderedTxs = rTxs.map(renderTxs).filter((i) => i);
        setTxList(renderedTxs);

        // this.enableLoaderIndicatory(false);
      } catch (error) {
        console.log(error);
        // this.enableLoaderIndicatory(false);
      }
    },
    [getTransactionData, pushToTxDetail]
  );

  const getTransactions = useCallback(async () => {
    const allTxs = await dataSource.getAllTransactions(
      addressHex,
      maxTxListCount
    );

    if (allTxs !== undefined) {
      // setVisibility(true);
      // setNoTransactions(false);
      updateTransactionList(allTxs);
    } else {
      // setVisibility(false);
      // setNoTransactions(true);
      // this.enableLoaderIndicatory(false);
    }
  }, [addressHex, maxTxListCount, updateTransactionList]);

  const getBalance = useCallback(async (addressHex) => {
    if (addressHex) {
      const balance = await dataSource.getBalance(addressHex);
      const poktBalance = balance.toFixed(2);
      const usdBalance = (balance * Number(Config.POKT_USD_VALUE)).toFixed(2);

      setPoktsBalance(poktBalance);
      setUsdBalance(usdBalance);
    }
  }, []);

  const getPrice = useCallback(async () => {
    const price = await dataSource.getPrice();
    setPrice(price);
  }, []);

  const addNode = useCallback((node) => {
    let obj = {
      stakingStatus: "UNSTAKED",
      stakedTokens: 0,
    };

    if (node !== undefined) {
      const isUnjailing = localStorage.getItem("unjailing");

      // Update the staked amount
      if (node.tokens) {
        obj.stakedTokens = (Number(node.tokens.toString()) / 1000000).toFixed(
          3
        );
      }

      if (node.status === 1) {
        obj.stakingStatus = "UNSTAKING";
      } else if (node.status === 2) {
        obj.stakingStatus = "STAKED";
      }

      if (node.jailed) {
        if (isUnjailing) {
          obj.stakingStatus = "UNJAILING";
        } else {
          obj.stakingStatus = "JAILED";
        }
      } else {
        localStorage.setItem("unjailing", false);
      }
    }

    setNodeStakedTokens(obj.stakedTokens);
    setNodeStakingStatus(obj.stakingStatus);
  }, []);

  const addApp = useCallback((app) => {
    let obj = {
      stakingStatus: "UNSTAKED",
      stakedTokens: 0,
    };

    if (app !== undefined) {
      // Update the staked amount
      if (app.staked_tokens) {
        obj.stakedTokens = (
          Number(app.staked_tokens.toString()) / 1000000
        ).toFixed(3);
      }

      if (app.status === 1) {
        obj.stakingStatus = "UNSTAKING";
      } else if (app.status === 2) {
        obj.stakingStatus = "STAKED";
      }
    }

    setAppStakedTokens(obj.stakedTokens);
    setAppStakingStatus(obj.stakingStatus);
  }, []);

  const getAccountType = useCallback(
    async (addressHex) => {
      const appOrError = await dataSource.getApp(addressHex);

      if (appOrError !== undefined) {
        // setApp(appOrError);
        addApp(appOrError);
      }

      // Try to get the node information
      const nodeOrError = await dataSource.getNode(addressHex);

      if (nodeOrError !== undefined) {
        // setNode(nodeOrError);
        addNode(nodeOrError);
      }

      // If not and app or node, load normal account
      if (appOrError === undefined && nodeOrError === undefined) {
        // Account type, amount staked and staking status
        // this.setState({ displayNormalAccount: true });
      }
    },
    [addApp, addNode]
  );

  const refreshView = useCallback(
    (addressHex, loadMore = false) => {
      // enableLoaderIndicatory(true);
      getBalance(addressHex);
      getPrice();
      getAccountType(addressHex);

      if (loadMore) {
        increaseMaxTxListCount();
      }
      getTransactions(addressHex, maxTxListCount);
    },
    [
      getAccountType,
      getBalance,
      getPrice,
      getTransactions,
      increaseMaxTxListCount,
      maxTxListCount,
    ]
  );

  useEffect(() => {
    const { addressHex, publicKeyHex, ppk } = pocketService.getUserInfo();

    if (addressHex && publicKeyHex && ppk) {
      setAddressHex(addressHex);
      setPublicKeyHex(publicKeyHex);
      setPpk(ppk);
      refreshView(addressHex);
    } else {
      localStorage.clear();
      history.push({
        pathname: "/",
      });
    }
  }, [refreshView, history]);

  if (addressHex === undefined || publicKeyHex === undefined) {
    localStorage.clear();
    history.push({
      pathname: "/",
    });
  }

  return (
    <Layout
      title={
        <AccountHeaderContainer>
          <h1>{poktsBalance} POKT</h1>
          <h2>
            ${parseFloat(price * poktsBalance).toFixed(2)} USD{" "}
            <Link href="https://thunderheadotc.com">Price by Thunderhead</Link>
          </h2>
        </AccountHeaderContainer>
      }
    >
      <AccountContent>
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

        <Button mode="primary" className="send-button" onClick={pushToSend}>
          Send
        </Button>

        <h3 className="copy-title">Address</h3>

        <CopyButton text={addressHex} width={488} />

        <h3 className="copy-title">Public Key</h3>

        <CopyButton text={publicKeyHex} width={488} />

        <Button
          className="reveal-private-key"
          onClick={() => setIsPkRevealModalVisible(true)}
        >
          Reveal Private Key
        </Button>

        <AccountTableContainer>
          <Table
            header={
              <>
                {txList.length < 1 ? (
                  <tr>
                    <th className="table-title" colSpan={4}>
                      No transactions
                    </th>
                  </tr>
                ) : (
                  <>
                    <tr>
                      <th className="table-title" colSpan={4}>
                        Latest Transactions
                      </th>
                    </tr>
                    <tr>
                      <th className="column-title"></th>
                      <th className="column-title">STATUS</th>
                      <th className="column-title">BLOCK HEIGHT</th>
                      <th className="column-title">TX HASH</th>
                    </tr>
                  </>
                )}
              </>
            }
            noSideBorders
            noTopBorders
          >
            {txList &&
              txList.map(({ options: { onClick }, ...tx }) => (
                <tr>
                  <td>
                    <img
                      src={tx.imageSrc}
                      alt={tx.type.toLowerCase()}
                      className="tx-icon"
                    />
                  </td>
                  <td>
                    <p className="qty">{tx.amount} POKT</p>
                    <p className="status">{tx.type.toLowerCase()}</p>
                  </td>
                  <td className="timestamp">{tx.height}</td>
                  <td>
                    <button className="hash-button" onClick={onClick}>
                      {tx.hash}
                    </button>
                  </td>
                </tr>
              ))}
          </Table>
        </AccountTableContainer>

        <RevealPrivateKey
          ppk={ppk}
          visible={isPkRevealModalVisible}
          onClose={() => setIsPkRevealModalVisible(false)}
        />
      </AccountContent>
    </Layout>
  );
}
