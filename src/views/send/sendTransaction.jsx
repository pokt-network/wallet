import { Button, TextInput } from "@pokt-foundation/ui";
import React, { useCallback } from "react";
import NumberFormat from "react-number-format";
import ErrorLabel from "../../components/error-label/error";
import Layout from "../../components/layout";
import SendContent from "../../components/send/content";
import SendHeaderContainer from "../../components/send/header";
import {
  validationError,
  VALIDATION_ERROR_TYPES,
} from "../../utils/validations";

export default function SendTransaction({
  fees,
  handlePoktValueChange,
  poktAmount,
  updateDestinationAddress,
  validate,
  setStep,
  amountError,
  addressError,
  destinationAddress,
  memoText,
  setMemoText,
}) {
  const onSendClick = useCallback(() => {
    const isValid = validate();

    if (!isValid) {
      return;
    }

    setStep(1);
  }, [validate, setStep]);

  const onMemoChange = useCallback(
    ({ target }) => {
      const { value } = target;
      setMemoText(value);
    },
    [setMemoText]
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
          <ErrorLabel message={amountError} show={amountError} />
        </div>
        <TextInput
          placeholder="Send to Address"
          onChange={updateDestinationAddress}
          value={destinationAddress}
          style={
            addressError
              ? validationError(VALIDATION_ERROR_TYPES.input)
              : undefined
          }
        />
        <ErrorLabel message={addressError} show={addressError} />

        <label className="tx-memo-label" htmlFor="tx-memo">
          Tx Memo
        </label>
        <TextInput
          multiline
          placeholder="XXXXXXXXXXXXXXXXX (Optional)"
          className="tx-memo-area"
          name="tx-memo"
          maxLength={75}
          onChange={onMemoChange}
        />
        <p className="tx-memo-counter">{memoText.length}/75</p>
        <p className="tx-fee">
          TX Fee {Number(fees / 1000000).toLocaleString("en-US")} POKT
        </p>

        <Button mode="primary" onClick={onSendClick}>
          Send
        </Button>
      </SendContent>
    </Layout>
  );
}
