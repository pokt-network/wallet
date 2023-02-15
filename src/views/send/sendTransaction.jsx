import { Button, TextInput } from "@pokt-foundation/ui";
import React, { useCallback } from "react";
import NumberFormat from "react-number-format";
import IconWithLabel from "../../components/iconWithLabel/iconWithLabel";
import Layout from "../../components/layout";
import SendContent from "../../components/send/content";
import SendHeaderContainer from "../../components/send/header";
import { UPOKT } from "../../utils/utils";
import {
  validationError,
  VALIDATION_ERROR_TYPES,
} from "../../utils/validations";

export default function SendTransaction({
  fees,
  handlePoktValueChange,
  poktAmount,
  updateDestinationAddress,
  amountError,
  addressError,
  memoText,
  setMemoText,
  destinationAddress,
  uDomain,
}) {
  const onSendClick = useCallback(
    (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const dAddr = formData.get("destinationAddress");
      const txMemo = formData.get("tx-memo");
      updateDestinationAddress(dAddr);
      setMemoText(txMemo);
    },
    [setMemoText, updateDestinationAddress]
  );

  return (
    <Layout
      title={
        <SendHeaderContainer>
          <h1 className="title">Send Transaction</h1>
          <div className="input-container">
            <NumberFormat
              placeholder="00.00"
              name="pokt"
              value={poktAmount}
              onValueChange={handlePoktValueChange}
              thousandSeparator
              decimalSeparator="."
              allowNegative={false}
            />
            <label htmlFor="pokt">POKT</label>
          </div>
        </SendHeaderContainer>
      }
    >
      <SendContent>
        <div className="amount-error-container">
          <IconWithLabel
            message={amountError}
            show={amountError}
            type="error"
          />
        </div>

        <form className="send-form" onSubmit={(e) => onSendClick(e)}>
          <TextInput
            name="destinationAddress"
            placeholder="Send to Address"
            defaultValue={uDomain ? uDomain : destinationAddress}
            style={
              addressError
                ? validationError(VALIDATION_ERROR_TYPES.input)
                : undefined
            }
          />
          <IconWithLabel
            message={addressError}
            show={addressError}
            type="error"
          />

          <label className="tx-memo-label" htmlFor="tx-memo">
            Tx Memo
          </label>
          <TextInput
            multiline
            placeholder="XXXXXXXXXXXXXXXXX (Optional)"
            className="tx-memo-area"
            name="tx-memo"
            maxLength={75}
            defaultValue={memoText}
          />
          <p className="tx-memo-counter">{memoText.length}/75</p>
          <p className="tx-fee">
            TX Fee {Number(fees / UPOKT).toLocaleString("en-US")} POKT
          </p>

          <Button mode="primary" type="submit">
            Send
          </Button>
        </form>
      </SendContent>
    </Layout>
  );
}
