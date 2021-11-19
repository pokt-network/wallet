import React, { useCallback, useEffect, useMemo, useState } from "react";
import { walletMockData } from "../../utils/dummyData";
import Input from "../public/input/input";
import MessageALert from "../public/messageAlert/messageAlert";
import Button from "../public/secondaryButton/button";
import SelectWalletContent from "./select-wallet-container";
import ReactPaginate from "react-paginate";
import ConfirmSelectModal from "./confirm-action";

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
                <MessageALert
                  className={wallet.publicKey === messageID ? "active" : ""}
                >
                  Copied!
                </MessageALert>
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

export default function SelectWallet() {
  const [items, setItems] = useState([]);
  const pageCount = useMemo(
    () => Math.ceil(walletMockData.length / ITEMS_PER_PAGE),
    []
  );
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + ITEMS_PER_PAGE;
    setItems(walletMockData.slice(itemOffset, endOffset));
  }, [itemOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE) % walletMockData.length;
    setItemOffset(newOffset);
  };

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
