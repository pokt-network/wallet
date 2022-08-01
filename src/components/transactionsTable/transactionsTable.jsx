import React from "react";
import { Table } from "@pokt-foundation/ui";
import AccountTableContainer from "../account-detail/tableContainer";

export default function TransactionsTable({ txList }) {
  return (
    <AccountTableContainer isEmpty={txList.length < 1}>
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
            <tr key={tx.hash}>
              <td width="10%">
                <img
                  src={tx.imageSrc}
                  alt={tx.type.toLowerCase()}
                  className="tx-icon"
                />
              </td>
              <td width="30%">
                <p className="qty">{tx.amount} POKT</p>
                <p className="status">{tx.type.toLowerCase()}</p>
              </td>
              <td className="timestamp" width="30%">
                {tx.height}
              </td>
              <td width="30%">
                <button className="hash-button" onClick={onClick}>
                  {tx.hash}
                </button>
              </td>
            </tr>
          ))}
      </Table>
    </AccountTableContainer>
  );
}
