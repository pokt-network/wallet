import React, { useCallback, useEffect, useMemo, useState } from "react";
import { walletMockData } from "../../utils/dummyData";
import Input from "../public/input/input";
import Button from "../public/secondaryButton/button";
import SelectWalletContent from "./select-wallet-container";
import ReactPaginate from "react-paginate";
import ConfirmSelectModal from "./confirm-action";
import AppPokt from "hw-app-pokt";
import MessageAlert from "../messageAlert/messageAlert";

const ITEMS_PER_PAGE = 6;

function Items({ data }) {
  const [messageID, setMessageID] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const onCopyClick = useCallback((publicKey) => {
    navigator.clipboard.writeText(publicKey);
    setMessageID(publicKey);
  }, []);

  const onRadioClick = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageID("");
    }, 500);

    return () => clearTimeout(timer);
  }, [messageID]);

  return (
    <>
      {data.map((wallet) => (
        <div className="container-row" key={wallet.publicKey}>
          <div className="column">
            <div className="row">
              <Input
                type="radio"
                name="public-key"
                className="radio"
                onClick={onRadioClick}
              />
              <p className="public-key">{wallet.publicKey}</p>
              <Button
                className="copy-button"
                onClick={() => onCopyClick(wallet.publicKey)}
              >
                <MessageAlert
                  className={wallet.publicKey === messageID ? "active" : ""}
                >
                  Copied!
                </MessageAlert>
              </Button>
            </div>
          </div>
          <div className="column">
            <p className="pokts">{wallet.pokts} POKT</p>
          </div>
        </div>
      ))}

      <ConfirmSelectModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
      />
    </>
  );
}

export default function SelectWallet({ transport }) {
  const [items, setItems] = useState([]);
  const pageCount = useMemo(
    () => Math.ceil(walletMockData.length / ITEMS_PER_PAGE),
    []
  );
  const [itemOffset, setItemOffset] = useState(0);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE) % walletMockData.length;
    setItemOffset(newOffset);
  };

  const fetchAddress = useCallback(async () => {
    try {
      const pokt = new AppPokt(transport);
      const pk = await pokt.getPublicKey("0");
      console.log(pk);
      return true;
    } catch (error) {
      return false;
    }
  }, [transport]);

  useEffect(() => {
    const r = fetchAddress();
    r.then((x) => console.log(x));
  }, [fetchAddress]);

  useEffect(() => {
    const endOffset = itemOffset + ITEMS_PER_PAGE;
    setItems(walletMockData.slice(itemOffset, endOffset));
  }, [itemOffset]);

  return (
    <SelectWalletContent>
      <Items data={items} />
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        containerClassName="pagination"
      />
    </SelectWalletContent>
  );
}
