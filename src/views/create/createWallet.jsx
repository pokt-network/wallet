import React, { useCallback, useEffect, useState } from "react";
import { Banner, Button, ButtonBase, TextInput } from "@pokt-foundation/ui";
import { useHistory } from "react-router";
import Link from "../../components/link/link";
import Layout from "../../components/layout";
import CreateContainer from "../../components/create/container";
import IconDownload from "../../icons/iconDownload";
import IconBack from "../../icons/iconBack";
import Title from "../../components/public/title/title";
import { getDataSource } from "../../datasource";
import pocketService from "../../core/services/pocket-service";
import { isPassphraseValid } from "../../utils/validations";
import ErrorLabel from "../../components/error-label/error";
import ConfirmActionModal from "../../components/modals/confirm-action/confirmAction";

const dataSource = getDataSource();

function Create({
  goNext,
  passphrase,
  setPassphrase,
  confirmPassphrase,
  setConfirmPassphrase,
  setAddressHex,
  setPublicKeyHex,
  setPpk,
}) {
  const [passPhraseError, setPassPhraseError] = useState(undefined);
  const [confirmPassphraseError, setConfirmPassphraseError] =
    useState(undefined);
  const [isCreateDisabled, setIsCreateDisabled] = useState(true);

  const onPassphraseChange = useCallback(
    ({ value }) => {
      if (value) {
        setPassphrase(value);

        if (!isPassphraseValid(value)) {
          setPassPhraseError(
            "Passphrase must be minimum 15 characters, 1 min uppercase letter and 1 special character."
          );
        } else {
          setPassPhraseError(undefined);
        }
      }
    },
    [setPassphrase]
  );

  const onConfirmPassphraseChange = useCallback(
    ({ value }) => {
      if (value) {
        setConfirmPassphrase(value);

        if (passphrase !== value) {
          setConfirmPassphraseError(
            "Passphrase and Confirm passphrase are not identical."
          );
        } else {
          setConfirmPassphraseError(undefined);
        }
      }
    },
    [passphrase, setConfirmPassphrase]
  );

  const handleCreateAccount = useCallback(async () => {
    if (passphrase === confirmPassphrase) {
      const account = await dataSource.createAccount(passphrase);
      const ppkOrError = await dataSource.exportPPKFromAccount(
        account,
        passphrase
      );

      if (dataSource.typeGuard(ppkOrError, Error)) {
        console.error("Failed to create an account");
      } else {
        setAddressHex(account.addressHex);
        setPublicKeyHex(account.publicKey.toString("hex"));
        setPpk(ppkOrError.toString());

        pocketService.saveUserInCache(
          account.addressHex,
          account.publicKey.toString("hex"),
          ppkOrError.toString()
        );

        goNext();
      }
    } else {
      setConfirmPassphraseError("The passphrase does not fit the requirements");
    }
  }, [
    confirmPassphrase,
    passphrase,
    goNext,
    setAddressHex,
    setPpk,
    setPublicKeyHex,
  ]);

  useEffect(() => {
    if (passphrase && confirmPassphrase) {
      if (!confirmPassphraseError && !passPhraseError) {
        setIsCreateDisabled(false);
        return;
      }
    }

    setIsCreateDisabled(true);
  }, [passphrase, confirmPassphrase, confirmPassphraseError, passPhraseError]);

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

        <div className="passphrase-input-container">
          <TextInput
            className="passphrase-input"
            type="password"
            placeholder="Passphrase"
            wide
            onChange={({ target }) => onPassphraseChange(target)}
          />
          <ErrorLabel message={passPhraseError} show={passPhraseError} />
        </div>

        <div className="passphrase-input-container">
          <TextInput
            className="passphrase-input"
            type="password"
            placeholder="Confirm Passphrase"
            wide
            onChange={({ target }) => onConfirmPassphraseChange(target)}
          />
          <ErrorLabel
            message={confirmPassphraseError}
            show={confirmPassphraseError}
          />
        </div>

        <p className="disclaimer">
          Make sure your passphrase has minimum 15 alphanumeric symbols, one
          capital letter, one lowercase, one special character and one number.
        </p>

        <Button
          mode="primary"
          className="button"
          disabled={isCreateDisabled}
          onClick={handleCreateAccount}
        >
          Create
        </Button>

        <p>
          Already have a wallet? <Link to="/import">Import Wallet</Link>
        </p>
      </CreateContainer>
    </Layout>
  );
}

function Download({
  goBack,
  ppk,
  setKeyFileDownloaded,
  keyFileDownloaded,
  addressHex,
  publicKeyHex,
}) {
  const history = useHistory();
  const [downloadError, setDownloadError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(true);

  const handleDownload = useCallback(async () => {
    if (!ppk) {
      setDownloadError("Can't download if no account was created.");
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(ppk);
    const downloadAnchorNode = document.createElement("a");

    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "keyfile.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    setKeyFileDownloaded(true);
  }, [ppk, setKeyFileDownloaded]);

  const pushToAccountDetail = useCallback(() => {
    if (!keyFileDownloaded) {
      setDownloadError("Please download your key file before proceeding.");
      return;
    }

    if (
      addressHex.length === 0 ||
      publicKeyHex.length === 0 ||
      ppk.length === 0
    ) {
      setDownloadError("No account available, please create an account");
      return;
    }

    setDownloadError("");
    history.push({
      pathname: "/account",
    });
  }, [addressHex, keyFileDownloaded, ppk, publicKeyHex, history]);

  return (
    <Layout title={<Title className="title">Download Key File</Title>}>
      <CreateContainer>
        <div className="notification">
          <Banner mode="warning" title="Save your Key File">
            <p>
              To import this wallet elsewhere, you will need this key file and
              the passphrase that you have just created, so please back it up
              securely.
            </p>
          </Banner>
        </div>

        <div className="download-button-container">
          <ButtonBase className="download-button" onClick={handleDownload}>
            <span>keyfile.json</span>
            <IconDownload />
          </ButtonBase>
          <ErrorLabel message={downloadError} show={downloadError} />
        </div>

        <p className="disclaimer">
          If you lose the key file or passphrase, your only other method of
          accessing the wallet will be to use the private key. Be sure to Reveal
          Private Key on the next page and save it securely.
        </p>

        <Button
          mode="primary"
          className="button"
          disabled={!keyFileDownloaded}
          onClick={pushToAccountDetail}
        >
          Continue
        </Button>

        <button className="backButton" onClick={goBack}>
          <IconBack />
          <span>Back</span>
        </button>

        <ConfirmActionModal
          visible={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onContinue={goBack}
          onCancel={() => setConfirmOpen(false)}
        />
      </CreateContainer>
    </Layout>
  );
}

export default function CreateWallet() {
  const [step, setStep] = useState(1);
  const [addressHex, setAddressHex] = useState("");
  const [publicKeyHex, setPublicKeyHex] = useState("");
  const [ppk, setPpk] = useState("");
  const [keyFileDownloaded, setKeyFileDownloaded] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");

  const goNext = () => setStep((prevStep) => prevStep + 1);
  const goBack = () => setStep((prevStep) => prevStep - 1);

  return (
    <>
      {step === 0 ? (
        <Create
          goNext={goNext}
          passphrase={passphrase}
          setPassphrase={setPassphrase}
          confirmPassphrase={confirmPassphrase}
          setConfirmPassphrase={setConfirmPassphrase}
          setAddressHex={setAddressHex}
          setPublicKeyHex={setPublicKeyHex}
          setPpk={setPpk}
        />
      ) : (
        <Download
          goBack={goBack}
          ppk={ppk}
          setKeyFileDownloaded={setKeyFileDownloaded}
          keyFileDownloaded={keyFileDownloaded}
          addressHex={addressHex}
          publicKeyHex={publicKeyHex}
        />
      )}
    </>
  );
}
