import React, { useState, useCallback, useEffect } from "react";
import { Banner, IconCopy, Link } from "@pokt-foundation/ui";
import { useLocation } from "react-router";
import ButtonIcon from "@pokt-foundation/ui/dist/ButtonIcon";
import Layout from "../../components/layout";
import TransactionDetailContent from "../../components/transaction-detail/content";
import { Config } from "../../config/config";
import { getDataSource } from "../../datasource";
import noneImg from "../../utils/images/none.png";
import successImg from "../../utils/images/check_green.png";
import failedImg from "../../utils/images/wrong_red.png";
import pendingImg from "../../utils/images/pending.png";
import IconTXStatus from "../../icons/iconTxStatus";
import AnimatedLogo from "../../components/animated-logo/animatedLogo";
import { useTx } from "../../context/txContext";
import { STDX_MSG_TYPES } from "../../utils/validations";
import { UPOKT } from "../../utils/utils";

const dataSource = getDataSource();
const EXPLORER_BASE_URL = "https://poktscan.com";

export default function TransactionDetail() {
  const location = useLocation();
  const { updateTx, tx } = useTx();
  const [statusImg, setStatusImg] = useState();
  const [secondaryStatusImg, setSecondaryStatusImg] = useState();
  const [loading, setLoading] = useState(false);
  const [getTxWasCalled, setGetTxWasCalled] = useState(false);

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
        case "pending":
          setStatusImg(pendingImg);
          setSecondaryStatusImg("load");
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
    if (
      stdTx.msg.type === STDX_MSG_TYPES.unjail ||
      stdTx.msg.type === STDX_MSG_TYPES.unjail8
    ) {
      return {
        type: "Unjail",
        from: stdTx.msg.value.address,
        to: stdTx.msg.value.address,
        amount: 0,
      };
    } else if (
      stdTx.msg.type === STDX_MSG_TYPES.unstake ||
      stdTx.msg.type === STDX_MSG_TYPES.unstake8
    ) {
      return {
        type: "Unstake",
        from: stdTx.msg.value.validator_address,
        to: stdTx.msg.value.validator_address,
        amount: 0,
      };
    } else if (stdTx.msg.type === STDX_MSG_TYPES.stake) {
      return {
        type: "Stake",
        from: "Myself",
        to: "Myself",
        amount: stdTx.msg.value.value,
      };
    } else if (stdTx.msg.type === STDX_MSG_TYPES.stake8) {
      return {
        type: "Stake",
        outputAddress: stdTx.msg.value.output_address,
        operatorPublicKey: stdTx.msg.value.public_key.value,
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
          operatorPublicKey = "",
          outputAddress = "",
        } = getTransactionData(txResponse.stdTx);

        const txSummary = {
          from: fromAddress,
          to: toAddress,
          amount: amount,
          status: txResponse.tx_result.code === 0 ? "Success" : "Failed",
          hash: txResponse.hash,
          type: transactiontype,
          height: txResponse.height,
          memo: txResponse.stdTx.memo,
          operatorPublicKey,
          outputAddress,
        };

        updateTx(
          txSummary.type,
          txSummary.from,
          txSummary.to,
          txSummary.amount,
          txSummary.hash,
          Number(Config.TX_FEE) / UPOKT,
          txSummary.status,
          "sent",
          txSummary.height,
          txSummary.memo,
          txSummary.operatorPublicKey,
          txSummary.outputAddress
        );

        updateTxInformation(undefined, {
          sentAmount: txSummary.amount,
          hash: txSummary.hash,
          fee: Number(Config.TX_FEE) / UPOKT,
          type: txSummary.type,
          fromAddress: txSummary.from,
          toAddress: txSummary.to,
          status: txSummary.status,
          sentStatus: "Sent",
          height: txSummary.height,
          memo: txSummary.memo,
          operatorPublicKey: txSummary.operatorPublicKey,
          outputAddress: txSummary.outputAddress,
        });

        setGetTxWasCalled(true);
      } catch (error) {
        console.log(error);
        console.log("Failed to retrieve the transaction information.");
      }
    },
    [updateTxInformation, getTransactionData, updateTx]
  );

  useEffect(() => {
    if (tx?.txHash && secondaryStatusImg && statusImg) {
      setLoading(false);
    }
  }, [secondaryStatusImg, statusImg, tx]);

  useEffect(() => {
    if (getTxWasCalled) return;

    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (location?.data?.comesFromSend) {
      updateTxInformation(undefined, tx);
      return;
    }

    if (location && location.data && location.data.txHash) {
      getTx(location.data.txHash);
    }
  }, [getTx, location, tx, updateTxInformation, getTxWasCalled]);

  if (loading) return <AnimatedLogo />;

  return (
    <Layout title={<h1 className="title">Transaction Detail</h1>}>
      <TransactionDetailContent tx={tx}>
        {location?.data?.comesFromSend || statusImg === pendingImg ? (
          <Banner mode="info" title="Transaction Status">
            Your tx will be confirmed on the next block, which is estimated to
            take 15 mins.
          </Banner>
        ) : null}

        <div className="details">
          <div className="tx-detail-row">
            <h2 className="tx-hash">Transaction hash</h2>

            <div className="hash-container">
              <Link
                href={`${EXPLORER_BASE_URL}/tx/${tx?.txHash}`}
                className="hash"
              >
                {tx?.txHash}
              </Link>

              <ButtonIcon
                className="copy-icon-button"
                onClick={() => navigator.clipboard.writeText(tx?.txHash)}
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
            <p>
              {location?.data?.comesFromSend
                ? tx?.sentAmount
                : tx?.sentAmount / UPOKT}
              &nbsp; POKT
            </p>
          </div>

          <div className="tx-detail-row">
            <h2>TX fee</h2>
            <p>{tx?.txFee} POKT</p>
          </div>

          <div className="tx-detail-row">
            <h2>TX type</h2>
            <p>{tx?.type}</p>
          </div>

          {tx?.toAddress && (
            <div className="tx-detail-row">
              <h2>To address</h2>
              <Link
                href={`${EXPLORER_BASE_URL}/account/${tx?.toAddress}`}
                className="to-address"
              >
                {tx?.toAddress}
              </Link>
            </div>
          )}

          {tx?.outputAddress && (
            <div className="tx-detail-row">
              <h2>Output Address</h2>
              <Link
                href={`${EXPLORER_BASE_URL}/account/${tx?.outputAddress}`}
                className="to-address"
              >
                {tx?.outputAddress}
              </Link>
            </div>
          )}

          {tx?.operatorPublicKey && (
            <div className="tx-detail-row">
              <h2 className="overflow">Operator Public Key</h2>
              <p className="overflow">{tx?.operatorPublicKey}</p>
            </div>
          )}

          <div className="tx-detail-row">
            <h2>Block #</h2>
            <p className="block-height">
              {tx?.height ? tx.height : "Waiting for confirmation"}
            </p>
          </div>
          <div className="tx-detail-row">
            <h2>Tx Memo</h2>
            <p className="tx-memo">{tx?.memo}</p>
          </div>
        </div>
      </TransactionDetailContent>
    </Layout>
  );
}
