import React, { useState } from "react";
import {
  Banner,
  Button,
  ButtonBase,
  Link,
  TextInput,
} from "@pokt-foundation/ui";

import Layout from "../../components/layout";
import CreateContainer from "../../components/create/container";
import IconDownload from "../../icons/iconDownload";
import IconBack from "../../icons/iconBack";
import Title from "../../components/public/title/title";

function Create({ goNext, goBack }) {
  return (
    <Layout title={<Title className="title">Create Wallet</Title>}>
      <p>Create a passphrase to protect your wallet.</p>
      <CreateContainer>
        <div className="notification">
          <Banner mode="warning" title="Save your Passphrase">
            <p>
              You will need it to import the keyfile elsewhere, so please back
              it up securely. It can not be recovered if you lose it.
            </p>
          </Banner>
        </div>
        <TextInput
          className="passphrase-input"
          type="password"
          placeholder="Passphrase"
          wide
        />
        <TextInput
          className="passphrase-input"
          type="password"
          placeholder="Confirm Passphrase"
          wide
        />
        <p className="disclaimer">
          Make sure yout password has minimum 15 alphanumeric symbols, one
          capital letter, one lowercase, one special characters and one number.
        </p>

        <Button mode="primary" className="button">
          Create
        </Button>

        <p>
          Already have a wallet?{" "}
          <Link href="/import" external={false}>
            Import Wallet
          </Link>
        </p>
      </CreateContainer>
    </Layout>
  );
}

function Download({ goNext, goBack }) {
  return (
    <Layout title={<Title className="title">Download Key File</Title>}>
      <CreateContainer>
        <div className="notification">
          <Banner mode="warning" title="Save your Key File">
            <p>
              To import this wallet elsewhere, you will need the passphrase that
              you have just created, so please back it up securely.
            </p>
          </Banner>
        </div>

        <ButtonBase className="download-button">
          <span>cfd93.json</span>
          <IconDownload />
        </ButtonBase>

        <p className="disclaimer">
          If you lose the keyfile or passphrase, you should use the private key
          option instead.
        </p>

        <Button mode="primary" className="button">
          Continue
        </Button>

        <button className="backButton" onClick={goBack}>
          <IconBack />
          <span>Back</span>
        </button>
      </CreateContainer>
    </Layout>
  );
}

export default function CreateWallet() {
  const [step, setStep] = useState(0);

  const goNext = () => setStep((prevStep) => prevStep + 1);
  const goBack = () => setStep((prevStep) => prevStep - 1);

  return (
    <>
      {step === 0 ? (
        <Create goNext={goNext} goBack={goBack} />
      ) : (
        <Download goNext={goNext} goBack={goBack} />
      )}
    </>
  );
}
