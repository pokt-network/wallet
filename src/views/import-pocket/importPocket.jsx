import React, { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { typeGuard } from "@pokt-network/pocket-js";
import { Banner, Button, TextInput } from "@pokt-foundation/ui";
import Layout from "../../components/layout";
import ImportPocketContent from "../../components/import-pocket/content";
import Accordion from "../../components/accordion";
import IconUpload from "../../icons/iconUpload";
import PasswordInput from "../../components/input/passwordInput";
import { getDataSource } from "../../datasource";
import Link from "../../components/link/link";
import IconWithLabel from "../../components/iconWithLabel/iconWithLabel";
import {
  validationError,
  VALIDATION_ERROR_TYPES,
} from "../../utils/validations";
import { useUser } from "../../context/userContext";
import LedgerIcon from "../../utils/images/ledger.png";
import useTransport from "../../hooks/useTransport";
import { LEDGER_CONFIG } from "../../utils/hardwareWallet";
import { getAddressFromPublicKey } from "../../utils/publicKeyToAddress";

const dataSource = getDataSource();

export default function ImportPocket() {
  const history = useHistory();
  const { updateUser } = useUser();
  const {
    onSelectDevice,
    setPocketApp,
    isHardwareWalletLoading,
    setIsHardwareWalletLoading,
  } = useTransport();
  const [fileName, setFileName] = useState("");
  const [ppk, setPpk] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [ppkError, setppkError] = useState("");
  const [privateKeyError, setPrivateKeyError] = useState("");
  const [ppkPassphraseError, setPpkPassphraseError] = useState("");
  const [privateKeyPassphraseError, setPrivateKeyPassphraseError] =
    useState("");
  const [filePassphrase, setFilePassphrase] = useState("");
  const [privKeyPassphrase, setPrivKeyPassphrase] = useState("");
  const [currentImportOption, setCurrentImportOption] = useState(undefined);
  const [ledgerError, setLedgerError] = useState("");

  const parseFileInputContent = async (input) => {
    if (input && input.files.length > 0) {
      const reader = new FileReader();
      const file = input.files[0];

      setFileName(file.name);

      return new Promise(function (resolve) {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          console.error(error);
          resolve(undefined);
        };
        reader.readAsText(file);
      });
    } else {
      return;
    }
  };

  const privKeyInputChange = async ({ target }) => {
    const privateKey = target.value;
    const isValidPrivateKey = dataSource.validatePrivateKey(privateKey);

    if (!isValidPrivateKey) {
      setPrivateKeyError("Invalid private key input.");
      return;
    }

    setPrivateKeyError("");
    setPrivateKey(privateKey);
  };

  const onFileUploadChange = async ({ target }) => {
    const fileInputValue = await parseFileInputContent(target);

    if (!fileInputValue) {
      setppkError("Error parsing PPK contents.");
      return;
    }

    setppkError("");
    setPpk(fileInputValue);
  };

  const importAccountFromFile = useCallback(async () => {
    if (filePassphrase.length === 0) {
      setPpkPassphraseError("Invalid Passphrase");
      return;
    }

    setPpkPassphraseError("");

    try {
      const account = await dataSource.importPortablePrivateKey(
        filePassphrase,
        ppk,
        filePassphrase
      );

      if (typeGuard(account, Error)) {
        setPpkPassphraseError(account.message);
        return false;
      }

      updateUser(
        account.addressHex,
        account.publicKey.toString("hex"),
        ppk.toString()
      );

      history.push({
        pathname: "/account",
        data: true,
      });
    } catch (error) {
      setppkError(
        "There was an error importing your Key File, please try again."
      );
      console.error(error);
    }
  }, [history, filePassphrase, ppk, updateUser]);

  const importAccountFromPrivateKey = useCallback(async () => {
    if (privKeyPassphrase.length === 0) {
      setPrivateKeyPassphraseError("Invalid Passphrase");
      return;
    }

    setPrivateKeyPassphraseError("");

    try {
      if (!dataSource.validatePrivateKey(privateKey)) {
        setPrivateKeyError("Your private key is invalid, please try again.");
        return false;
      }

      const account = await dataSource.importAccount(
        privateKey,
        privKeyPassphrase
      );

      if (typeGuard(account, Error)) {
        console.error(account);
        return false;
      }

      const ppk = await dataSource.exportPPK(privateKey, privKeyPassphrase);

      if (!ppk) {
        setPrivateKeyError(
          "There was an error decoding your private key, please try again."
        );
        console.error(account);
        return false;
      }

      updateUser(
        account.addressHex,
        account.publicKey.toString("hex"),
        ppk.toString()
      );

      history.push({
        pathname: "/account",
        data: true,
      });
    } catch (error) {
      setPrivateKeyError(
        "There was an error decoding your private key, please try again."
      );
      console.error(error);
      return false;
    }
  }, [history, privKeyPassphrase, privateKey, updateUser]);

  const importAccountFromLedger = useCallback(async () => {
    setIsHardwareWalletLoading(true);
    setLedgerError("");
    const [success, app] = await onSelectDevice();
    if (!success) {
      setLedgerError(`${app.name}: ${app.message}`);
      setIsHardwareWalletLoading(false);
      return;
    }

    setPocketApp(app);

    try {
      const { publicKey } = await app.getPublicKey(
        LEDGER_CONFIG.derivationPath
      );
      const address = await getAddressFromPublicKey(publicKey);

      updateUser(address, publicKey, "");
      setLedgerError("");
      setIsHardwareWalletLoading(false);
      history.push({
        pathname: "/account",
        data: true,
      });
    } catch (error) {
      console.error(error);
      setLedgerError(`${error.name}: ${error.message}`);
      setIsHardwareWalletLoading(false);
    }
  }, [
    onSelectDevice,
    setPocketApp,
    setIsHardwareWalletLoading,
    updateUser,
    history,
  ]);

  const passPhraseChange = useCallback((type, { target }) => {
    const { value } = target;

    if (type === "file") {
      setFilePassphrase(value);
    } else if (type === "private") {
      setPrivKeyPassphrase(value);
    }
  }, []);

  const onAccordionClick = useCallback(
    (option = -1) => {
      if (option === currentImportOption) {
        setCurrentImportOption(-1);
        return;
      }
      setCurrentImportOption(option);
    },
    [currentImportOption]
  );

  return (
    <Layout title={<h1 className="title">Import Account</h1>}>
      <ImportPocketContent hasFile={fileName ? true : false}>
        <p className="description">Select a method to access your account</p>

        <div className="nimport-container">
          <Accordion
            text="Key File"
            open={currentImportOption === 0}
            onClick={() => onAccordionClick(0)}
          >
            <div className="error-label-container">
              <label
                className="custom-file-input"
                style={
                  ppkError
                    ? validationError(VALIDATION_ERROR_TYPES.input)
                    : undefined
                }
              >
                {fileName ? fileName : "Select File"}
                <TextInput
                  adornment={<IconUpload color="white" />}
                  adornmentPosition="end"
                  type="file"
                  wide
                  className="upload-file-input"
                  onChange={onFileUploadChange}
                  accept=".json"
                />
              </label>
              <IconWithLabel message={ppkError} show={ppkError} type="error" />
            </div>

            <div className="error-label-container">
              <PasswordInput
                placeholder="Keyfile Passphrase"
                onChange={(e) => passPhraseChange("file", e)}
                style={
                  ppkPassphraseError
                    ? validationError(VALIDATION_ERROR_TYPES.input)
                    : undefined
                }
              />
              <IconWithLabel
                message={ppkPassphraseError}
                show={ppkPassphraseError}
                type="error"
              />
            </div>
            <Button
              mode="primary"
              className="import-button"
              onClick={importAccountFromFile}
            >
              Import
            </Button>
          </Accordion>

          <Accordion
            text="Private Key"
            open={currentImportOption === 1}
            onClick={() => onAccordionClick(1)}
          >
            <div className="error-label-container">
              <TextInput
                type="password"
                placeholder="Private Key"
                wide
                onChange={privKeyInputChange}
                style={
                  privateKeyError
                    ? validationError(VALIDATION_ERROR_TYPES.input)
                    : undefined
                }
              />
              <IconWithLabel
                message={privateKeyError}
                show={privateKeyError}
                type="error"
              />
            </div>
            <p className="temporary-passphrase">
              Please create a temporary passphrase to encrypt your Private key
              during this session. It will be required to confirm transactions.
            </p>

            <div className="error-label-container">
              <PasswordInput
                className="pk-passphrase"
                placeholder="Session Passphrase"
                onChange={(e) => passPhraseChange("private", e)}
                style={
                  privateKeyPassphraseError
                    ? validationError(VALIDATION_ERROR_TYPES.input)
                    : undefined
                }
              />
              <IconWithLabel
                message={privateKeyPassphraseError}
                show={privateKeyPassphraseError}
                type="error"
              />
            </div>
            <Button
              mode="primary"
              className="import-button"
              onClick={importAccountFromPrivateKey}
            >
              Import
            </Button>
          </Accordion>

          <Accordion
            text={
              <>
                {" "}
                Connect{" "}
                <img
                  src={LedgerIcon}
                  alt="Ledger wallet"
                  className="ledger-icon"
                />
              </>
            }
            open={currentImportOption === 2}
            onClick={() => onAccordionClick(2)}
          >
            {isHardwareWalletLoading && !ledgerError ? (
              <Banner title="Action Required" mode="info">
                Please confirm on your ledger device to complete the connection.
              </Banner>
            ) : null}

            <div className="error-label-container">
              <p className="ledger-description">
                Connect your hardware Wallet directly to your computer.
              </p>
              <IconWithLabel
                message={ledgerError}
                show={ledgerError}
                className="ledger-error"
                type="error"
              />
              <Button
                mode="primary"
                className="connect-button"
                onClick={importAccountFromLedger}
                disabled={isHardwareWalletLoading}
              >
                {isHardwareWalletLoading ? "Verifying" : "Connect"}
              </Button>
            </div>
          </Accordion>

          <p className="create-link">
            Don't have a wallet? <Link to="/create">Create Wallet</Link>{" "}
          </p>
        </div>
      </ImportPocketContent>
    </Layout>
  );
}
