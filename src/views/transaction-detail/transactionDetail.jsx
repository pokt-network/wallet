import { Banner } from "@pokt-foundation/ui";
import React from "react";
import CopyButton from "../../components/copy/copy";
import Layout from "../../components/layout";
import TransactionDetailContent from "../../components/transaction-detail/content";
import load from "../../utils/images/load.png";

export default function TransactionDetail() {
  return (
    <Layout title={<h1 className="title">Transaction Detail</h1>}>
      <TransactionDetailContent>
        <Banner mode="info" title="Transaction Status">
          Your tx will be confirmed on the next block, which is estimated to
          take [Insert Block time from Pocket Scan] mins.
        </Banner>

        <div className="details">
          <div className="tx-detail-row">
            <h2>transaction hash</h2>
            <CopyButton
              width="100%"
              text="94691343T5cbd87abd8864bd87abd87a9974f1R34"
              className="hash-button"
            />
          </div>
          <div className="tx-detail-row">
            <h2>status</h2>
            <div className="status-container">
              <p>
                <img src={load} alt="status" /> Sending
              </p>
              <p>
                pending <img src={load} alt="status" />
              </p>
            </div>
          </div>

          <div className="tx-detail-row">
            <h2>timestamp</h2>
            <p>34 sec ago</p>
          </div>

          <div className="tx-detail-row">
            <h2>amount</h2>
            <p>2222222 POKT</p>
          </div>

          <div className="tx-detail-row">
            <h2>tx fee</h2>
            <p>2222 POKT</p>
          </div>

          <div className="tx-detail-row">
            <h2>tx type</h2>
            <p>DAOTransfer</p>
          </div>

          <div className="tx-detail-row">
            <h2>to address</h2>
            <p className="to-address">
              9L69144c864bd87a92e9a969144c864bd87a92e9
            </p>
          </div>

          <div className="tx-detail-row">
            <h2>balance before</h2>
            <p>454,758.987 POKT </p>
          </div>

          <div className="tx-detail-row">
            <h2>balance after</h2>
            <p>454,758.987 POKT </p>
          </div>

          <div className="tx-detail-row">
            <h2>block #</h2>
            <p>343T5</p>
          </div>
        </div>
      </TransactionDetailContent>
    </Layout>
  );
}
