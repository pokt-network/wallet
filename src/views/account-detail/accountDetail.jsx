import React, { useState } from "react";
import AccountHeaderContainer from "../../components/account-detail/headerContainer";
import Layout from "../../components/layout";
import { Button, Table } from "@pokt-foundation/ui";
import AccountContent from "../../components/account-detail/content";
import CopyButton from "../../components/copy/copy";
import { TransactionsMockData } from "../../utils/dummyData";
import AccountTableContainer from "../../components/account-detail/tableContainer";
import IconStatus from "../../icons/iconStatus";
import IconAccount from "../../icons/iconAccount";

export default function AccountDetail() {
  const [pokts, setPokts] = useState("345,789.403");
  const thunderheadPrice = "293,793.37";

  return (
    <Layout
      title={
        <AccountHeaderContainer>
          <h1>{pokts} POKT</h1>
          <h2>
            ${thunderheadPrice} USD <span>Price by Thunderhead</span>
          </h2>
        </AccountHeaderContainer>
      }
    >
      <AccountContent>
        <div className="staking-options node-options">
          <div className="option-pokt">
            <h3>15,000</h3>
            <p>POKT Staked</p>
          </div>
          <div className="option-status">
            <h3>
              <IconStatus type="staked" /> Staked
            </h3>
            <p>Staking Status</p>
          </div>
          <div className="option-type">
            <h3>
              <IconAccount type="node" /> Node
            </h3>
            <p>Account Type</p>
          </div>
        </div>

        <div className="separator"></div>

        <div className="staking-options app-options">
          <div className="option-pokt">
            <h3>25,000.00</h3>
            <p>POKT Staked</p>
          </div>
          <div className="option-status">
            <h3>
              <IconStatus type="unstaking" /> unstaking
            </h3>
            <p>Staking Status</p>
          </div>
          <div className="option-type">
            <h3>
              <IconAccount type="app" /> App
            </h3>
            <p>Account Type</p>
          </div>
        </div>

        <Button mode="primary" className="send-button">
          Send
        </Button>

        <h3 className="copy-title">Address</h3>

        <CopyButton
          text="2f4f511c11e5c9a751e158ef9313b50cb8acfd93"
          width={488}
        />

        <h3 className="copy-title">Public Key</h3>

        <CopyButton
          text="2f4f511c11e5c9a751e158ef9313b50cb8acfd93"
          width={488}
        />

        <Button className="reveal-private-key">Reveal Private Key</Button>

        <AccountTableContainer>
          <Table
            header={
              <>
                <tr>
                  <th className="table-title" colSpan={4}>
                    Latest Transactions
                  </th>
                </tr>
                <tr>
                  <th className="column-title"></th>
                  <th className="column-title">STATUS</th>
                  <th className="column-title">TIMESTAMP</th>
                  <th className="column-title">TX HASH</th>
                </tr>
              </>
            }
            noSideBorders
            noTopBorders
          >
            {TransactionsMockData.map((tx) => (
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
                  <button className="hash-button">{tx.hash}</button>
                </td>
              </tr>
            ))}
          </Table>
        </AccountTableContainer>
      </AccountContent>
    </Layout>
  );
}
