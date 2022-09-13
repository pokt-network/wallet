import { Button, DataView } from "@pokt-foundation/ui";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AnimatedLogo from "../../components/animated-logo/animatedLogo";
import Layout from "../../components/layout";
import SelectAccountContent from "../../components/select-account/content";
import { useUser } from "../../context/userContext";
import { getDataSource } from "../../datasource";
import useTransport from "../../hooks/useTransport";
import { LEDGER_CONFIG } from "../../utils/hardwareWallet";
import { ROUTES } from "../../utils/routes";
import { getAddressFromPublicKey } from "../../utils/utils";

const dataSource = getDataSource();
const ITEMS_PER_PAGE = 5;

// Gets the next ITEMS_PER_PAGE accounts
async function getAccounts(idx, pocketApp) {
  if (!pocketApp) return [];

  const tempAccounts = [];
  for (let i = idx; i < idx + ITEMS_PER_PAGE; i++) {
    const { publicKey } = await pocketApp.getPublicKey(
      LEDGER_CONFIG.generateDerivationPath(i)
    );
    const address = await getAddressFromPublicKey(publicKey);
    const balance = await dataSource.getBalance(address);
    tempAccounts.push({ index: i, address, balance, publicKey });
  }

  return tempAccounts;
}

export default function SelectAccount() {
  let history = useHistory();
  const { pocketApp } = useTransport();
  const { updateUser } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [selectedIndx, setSelectedIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [accountIdx, setAccountIdx] = useState(null);
  // 1 based. This makes it easier to correctly get the firstIdx,
  // also since slice doesn't include the end
  // this makes sure the data we are getting from the array is correct.
  const lastIdxPos = (selectedIndx + 1) * ITEMS_PER_PAGE;
  // 0 based
  const firstIdxPos = Math.abs(lastIdxPos - ITEMS_PER_PAGE);
  const accountsToRender = accounts.slice(firstIdxPos, lastIdxPos);

  const fillAccounts = useCallback(async () => {
    setIsLoading(true);
    const i = accounts.length > 0 ? accounts[accounts.length - 1].index + 1 : 0;
    const newAccounts = await getAccounts(i, pocketApp);
    setAccounts((prevAccounts) => [...prevAccounts, ...newAccounts]);
    setIsLoading(false);
    setAccountIdx(null);
  }, [accounts, pocketApp]);

  const prev = () => {
    if (selectedIndx === 0) return;
    setSelectedIdx((prevSelectedIdx) => prevSelectedIdx - 1);
  };

  const next = async () => {
    const nextLastIdxPos = (selectedIndx + 2) * ITEMS_PER_PAGE;
    if (nextLastIdxPos <= accounts.length) {
      setSelectedIdx((prevSelectedIdx) => prevSelectedIdx + 1);
      return;
    }

    await fillAccounts();
    setSelectedIdx((prevSelectedIdx) => prevSelectedIdx + 1);
  };

  const unlockAccount = () => {
    const account = accounts[accountIdx];
    updateUser(account.address, account.publicKey, "");
    history.push({
      pathname: ROUTES.account,
      data: true,
    });
  };

  useEffect(() => {
    getAccounts(0, pocketApp).then((account) => setAccounts(account));
  }, [pocketApp]);

  if (!pocketApp) {
    history.push({
      pathname: ROUTES.import,
      data: false,
    });
  }

  return (
    <Layout title={<h1 className="title">Select an Account</h1>}>
      <SelectAccountContent>
        <AnimatedLogo loading={accounts.length === 0 || isLoading} />
        <DataView
          fields={[
            {
              label: <></>,
            },
            {
              label: <div className="header">Index</div>,
            },
            {
              label: <div className="header">Address</div>,
            },
            {
              label: <div className="header">Balance</div>,
            },
          ]}
          entries={accountsToRender}
          renderEntry={({ index, address, balance }) => [
            <input
              className="account"
              type="radio"
              name="account"
              onChange={() => setAccountIdx(index)}
              checked={index === accountIdx}
            />,
            <p>{index}</p>,
            <p>{address}</p>,
            <p>{balance}</p>,
          ]}
        />

        <div className="pagination">
          <Button className="prev" onClick={() => prev()}>
            Prev
          </Button>
          <Button className="next" mode="primary" onClick={() => next()}>
            Next
          </Button>
        </div>

        <Button
          className="unlock"
          mode="primary"
          onClick={() => unlockAccount()}
          disabled={accountIdx === null}
        >
          Unlock
        </Button>
      </SelectAccountContent>
    </Layout>
  );
}
