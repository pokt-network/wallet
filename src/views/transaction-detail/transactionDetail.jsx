import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Banner } from "@pokt-foundation/ui";
import { useHistory, useLocation } from "react-router";
import CopyButton from "../../components/copy/copy";
import Layout from "../../components/layout";
import TransactionDetailContent from "../../components/transaction-detail/content";
import load from "../../utils/images/load.png";
import { Config } from "../../config/config";
import { getDataSource } from "../../datasource";
import noneImg from "../../utils/images/none.png";
import successImg from "../../utils/images/check_green.png";
import failedImg from "../../utils/images/wrong_red.png";
import pocketService from "../../core/services/pocket-service";

const dataSource = getDataSource();

export default function TransactionDetail() {
  let location = useLocation();
  let history = useHistory();
  const [txHash, setTxHash] = useState(
    location && location.data ? location.data.txHash : undefined
  );
  // const [loadFromCache, setLoadFromCache] = useState(location.loadFromCache);
  const [tx, setTx] = useState(undefined);
  const [statusImg, setStatusImg] = useState(noneImg);

  const txEplorerLink = useMemo(
    () => `${Config.BLOCK_EXPLORER_BASE_URL}/tx/${tx?.tx?.hash}`,
    [tx]
  );

  const openExplorer = useCallback((address) => {
    const url = `${Config.BLOCK_EXPLORER_BASE_URL}/account/${address}`;
    window.open(url);
  }, []);

  const updateTxInformation = useCallback(
    (txObj = undefined, tx = undefined) => {
      const transaction = txObj !== undefined ? txObj : tx;

      switch (transaction.status.toLowerCase()) {
        case "success":
          setStatusImg(successImg);
          break;
        case "failed":
          setStatusImg(failedImg);
          break;
        default:
          setStatusImg(noneImg);
          break;
      }
    },
    []
  );

  const getTransactionData = useCallback((stdTx) => {
    if (stdTx.msg.type === "pos/MsgUnjail") {
      return {
        type: "Unjail",
        from: stdTx.msg.value.address,
        to: stdTx.msg.value.address,
        amount: 0,
      };
    } else if (stdTx.msg.type === "pos/MsgBeginUnstake") {
      return {
        type: "Unstake",
        from: stdTx.msg.value.validator_address,
        to: stdTx.msg.value.validator_address,
        amount: 0,
      };
    } else if (stdTx.msg.type === "pos/MsgStake") {
      return {
        type: "Stake",
        from: "Myself",
        to: "Myself",
        amount: stdTx.msg.value.value,
      };
    } else {
      return {
        type: "TokenTransfer",
        from: stdTx.msg.value.from_address,
        to: stdTx.msg.value.to_address,
        amount: stdTx.msg.value.amount,
      };
    }
  }, []);

  const getTx = useCallback(
    async (txHash) => {
      try {
        const txResponse = await dataSource.getTx(txHash.toLowerCase());

        if (txResponse.stdTx === undefined) {
          console.log(
            "Couldn't retrieve the transaction using the provided tx hash"
          );
          return;
        }

        const {
          type: transactiontype,
          from: fromAddress,
          to: toAddress,
          amount,
        } = getTransactionData(txResponse.stdTx);

        // Update the UI with the retrieved tx
        const txSummary = {
          from: fromAddress,
          to: toAddress,
          amount: amount,
          status: txResponse.tx_result.code === 0 ? "Success" : "Failure",
          hash: txResponse.hash,
          type: transactiontype,
          height: txResponse.height,
        };

        setTx({
          tx: {
            sentAmount: txSummary.amount,
            hash: txSummary.hash,
            fee: Number(Config.TX_FEE) / 1000000,
            type: txSummary.type,
            fromAddress: txSummary.from,
            toAddress: txSummary.to,
            status: txSummary.status,
            sentStatus: "Sent",
            height: txSummary.height,
          },
        });

        pocketService.saveTxInCache(
          txSummary.type,
          txSummary.from,
          txSummary.to,
          txSummary.amount,
          txSummary.hash,
          Number(Config.TX_FEE) / 1000000,
          txSummary.status,
          "sent"
        );

        updateTxInformation(undefined, {
          tx: {
            sentAmount: txSummary.amount,
            hash: txSummary.hash,
            fee: Number(Config.TX_FEE) / 1000000,
            type: txSummary.type,
            fromAddress: txSummary.from,
            toAddress: txSummary.to,
            status: txSummary.status,
            sentStatus: "Sent",
            height: txSummary.height,
          },
        });
      } catch (error) {
        console.log(error);
        console.log("Failed to retrieve the transaction information.");
      }
    },
    [updateTxInformation, getTransactionData]
  );

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (txHash !== undefined) {
      // Retrieve the tx information from the network
      getTx(txHash);
    } else {
      // Retrieve the tx information from cached
      const {
        type,
        fromAddress,
        toAddress,
        sentAmount,
        txHash,
        txFee,
        status,
        sentStatus,
        height,
      } = pocketService.getTxInfo();
      // Check if values are set
      if (
        type &&
        fromAddress &&
        toAddress &&
        sentAmount !== undefined &&
        txHash &&
        txFee &&
        status
      ) {
        const sentAmountFormatted = sentAmount * 1000000;

        const obj = {
          tx: {
            type,
            fromAddress,
            toAddress,
            sentAmount: sentAmountFormatted,
            hash: txHash,
            fee: txFee,
            status,
            sentStatus,
            height,
          },
        };

        // Save information to the state
        setTx(obj);
        setTxHash(txHash);
        // this.setState(obj);
        // Update the tx information
        updateTxInformation(obj.tx);
      } else {
        // Clear before redirecting to the login page
        localStorage.clear();
        // Redirect to the home page
        history.push({
          pathname: "/",
        });
      }
    }
  }, [txHash, getTx, updateTxInformation, history]);

  return (
    <Layout title={<h1 className="title">Transaction Detail</h1>}>
      <TransactionDetailContent>
        <Banner mode="info" title="Transaction Status">
          Your tx will be confirmed on the next block, which is estimated to
          take [Insert Block time from Pocket Scan] mins.
        </Banner>

        <div className="details">
          <div className="tx-detail-row">
            <h2>Transaction hash</h2>
            <CopyButton width="100%" text={txHash} className="hash-button" />
          </div>
          <div className="tx-detail-row">
            <h2>Status</h2>
            <div className="status-container">
              <p>
                <img src={statusImg} alt="status" /> {tx?.tx?.status}
              </p>
              <p>
                pending <img src={load} alt="status" />
              </p>
            </div>
          </div>

          <div className="tx-detail-row">
            <h2>Timestamp</h2>
            <p>34 sec ago</p>
          </div>

          <div className="tx-detail-row">
            <h2>Amount</h2>
            <p>{tx?.tx?.sentAmount / 1000000} POKT</p>
          </div>

          <div className="tx-detail-row">
            <h2>TX fee</h2>
            <p>{tx?.tx?.fee} POKT</p>
          </div>

          <div className="tx-detail-row">
            <h2>TX type</h2>
            <p>{tx?.tx?.type}</p>
          </div>

          <div className="tx-detail-row">
            <h2>To address</h2>
            <p className="to-address">{tx?.tx?.toAddress}</p>
          </div>

          <div className="tx-detail-row">
            <h2>Balance before</h2>
            <p>454,758.987 POKT </p>
          </div>

          <div className="tx-detail-row">
            <h2>Balance after</h2>
            <p>454,758.987 POKT </p>
          </div>

          <div className="tx-detail-row">
            <h2>Block #</h2>
            <p>{tx?.tx?.height}</p>
          </div>
        </div>
      </TransactionDetailContent>
    </Layout>
  );
}
