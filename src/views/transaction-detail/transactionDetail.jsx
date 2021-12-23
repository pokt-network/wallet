import React, { useState, useCallback, useEffect } from "react";
import { Banner, IconCopy, Link } from "@pokt-foundation/ui";
import { useHistory, useLocation } from "react-router";

import Layout from "../../components/layout";
import TransactionDetailContent from "../../components/transaction-detail/content";
import { Config } from "../../config/config";
import { getDataSource } from "../../datasource";
import noneImg from "../../utils/images/none.png";
import successImg from "../../utils/images/check_green.png";
import failedImg from "../../utils/images/wrong_red.png";
import pocketService from "../../core/services/pocket-service";
import IconTXStatus from "../../icons/iconTxStatus";
import ButtonIcon from "@pokt-foundation/ui/dist/ButtonIcon";
import AnimatedLogo from "../../components/animated-logo/animatedLogo";

const dataSource = getDataSource();
const POKT_SCAN_BASE_URL = "https://poktscan.com/public/";

export default function TransactionDetail() {
  const location = useLocation();
  const history = useHistory();
  const [txHash, setTxHash] = useState(
    location && location.data ? location.data.txHash : undefined
  );
  const [tx, setTx] = useState(undefined);
  const [statusImg, setStatusImg] = useState();
  const [secondaryStatusImg, setSecondaryStatusImg] = useState();
  const [loading, setLoading] = useState(false);

  const updateTxInformation = useCallback(
    (txObj = undefined, tx = undefined) => {
      const transaction = txObj !== undefined ? txObj : tx;

      switch (transaction.status.toLowerCase()) {
        case "success":
          setStatusImg(successImg);
          setSecondaryStatusImg("success");
          break;
        case "failed":
          setStatusImg(failedImg);
          setSecondaryStatusImg("failed");
          break;
        default:
          setStatusImg(noneImg);
          setSecondaryStatusImg("load");
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
          sentAmount: txSummary.amount,
          hash: txSummary.hash,
          fee: Number(Config.TX_FEE) / 1000000,
          type: txSummary.type,
          fromAddress: txSummary.from,
          toAddress: txSummary.to,
          status: txSummary.status,
          sentStatus: "Sent",
          height: txSummary.height,
        });

        pocketService.saveTxInCache(
          txSummary.type,
          txSummary.from,
          txSummary.to,
          txSummary.amount,
          txSummary.hash,
          Number(Config.TX_FEE) / 1000000,
          txSummary.status,
          "sent",
          txSummary.height
        );

        updateTxInformation(undefined, {
          sentAmount: txSummary.amount,
          hash: txSummary.hash,
          fee: Number(Config.TX_FEE) / 1000000,
          type: txSummary.type,
          fromAddress: txSummary.from,
          toAddress: txSummary.to,
          status: txSummary.status,
          sentStatus: "Sent",
          height: txSummary.height,
        });
      } catch (error) {
        console.log(error);
        console.log("Failed to retrieve the transaction information.");
      }
    },
    [updateTxInformation, getTransactionData]
  );

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (txHash !== undefined) {
      if (location?.data?.comesFromSend) {
        const {
          fromAddress,
          height,
          sentAmount,
          sentStatus,
          status,
          toAddress,
          txFee,
          txHash,
          type,
        } = pocketService.getTxInfo();

        const transaction = {
          sentAmount: sentAmount,
          hash: txHash,
          fee: txFee,
          type: type,
          fromAddress,
          toAddress,
          status,
          sentStatus,
          height,
        };

        setTx(transaction);
        updateTxInformation(undefined, transaction);

        return;
      }

      getTx(txHash);
    } else {
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

        const transaction = {
          type,
          fromAddress,
          toAddress,
          sentAmount: sentAmountFormatted,
          hash: txHash,
          fee: txFee,
          status,
          sentStatus,
          height,
        };

        setTx(transaction);
        setTxHash(txHash);
        updateTxInformation(transaction);
      } else {
        localStorage.clear();
        history.push({
          pathname: "/",
        });
      }
    }
  }, [txHash, updateTxInformation, history, getTx, location]);

  useEffect(() => {
    if (txHash && tx && secondaryStatusImg && statusImg) {
      setLoading(false);
    }
  }, [tx, txHash, secondaryStatusImg, statusImg]);

  if (loading) return <AnimatedLogo />;

  return (
    <Layout title={<h1 className="title">Transaction Detail</h1>}>
      <TransactionDetailContent tx={tx}>
        {location?.data?.comesFromSend ? (
          <Banner mode="info" title="Transaction Status">
            Your tx will be confirmed on the next block, which is estimated to
            take 15 mins.
          </Banner>
        ) : null}

        <div className="details">
          <div className="tx-detail-row">
            <h2>Transaction hash</h2>

            <div className="hash-container">
              <Link
                href={`${POKT_SCAN_BASE_URL}/tx/${txHash}`}
                className="hash"
              >
                {txHash}
              </Link>

              <ButtonIcon
                className="copy-icon-button"
                onClick={() => navigator.clipboard.writeText(txHash)}
              >
                <IconCopy size="small" />
              </ButtonIcon>
            </div>
          </div>
          <div className="tx-detail-row">
            <h2>Status</h2>
            <div className="status-container">
              <p>
                <IconTXStatus
                  type={secondaryStatusImg}
                  color="white"
                  width="14px"
                  height="14px"
                  className="secondary-status-icon"
                />
                {tx?.sentStatus}
              </p>
              <p>
                {tx?.status} <img src={statusImg} alt="status" />
              </p>
            </div>
          </div>

          <div className="tx-detail-row">
            <h2>Amount</h2>
            <p>{tx?.sentAmount / 1000000} POKT</p>
          </div>

          <div className="tx-detail-row">
            <h2>TX fee</h2>
            <p>{tx?.fee} POKT</p>
          </div>

          <div className="tx-detail-row">
            <h2>TX type</h2>
            <p>{tx?.type}</p>
          </div>

          <div className="tx-detail-row">
            <h2>To address</h2>
            <Link
              href={`${POKT_SCAN_BASE_URL}/account/${tx?.toAddress}`}
              className="to-address"
            >
              {tx?.toAddress}
            </Link>
          </div>

          <div className="tx-detail-row">
            <h2>Block #</h2>
            <p className="block-height">
              {tx?.height ? tx.height : "Waiting for confirmation"}
            </p>
          </div>
        </div>
      </TransactionDetailContent>
    </Layout>
  );
}
