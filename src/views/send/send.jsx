import React from "react";
import { Button, TextInput } from "@pokt-foundation/ui";

import Layout from "../../components/layout";
import SendHeaderContainer from "../../components/send/header";
import SendContent from "../../components/send/content";

export default function Send() {
  return (
    <Layout
      title={
        <SendHeaderContainer>
          <h1 className="title">Send Transaction</h1>
          <div className="input-container">
            <TextInput
              type="number"
              placeholder="00.00"
              step="0.01"
              name="pokt"
              min={0}
            />
            <label htmlFor="pokt">POKT</label>
          </div>
        </SendHeaderContainer>
      }
    >
      <SendContent>
        <TextInput placeholder="Send to Address" />
        <p>TX Fee 100,000POKT</p>
        <Button mode="primary">Send</Button>
      </SendContent>
    </Layout>
  );
}
