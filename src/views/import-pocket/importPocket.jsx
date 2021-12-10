import React, { useCallback, useState } from "react";
import Layout from "../../components/layout";
import ImportPocketContent from "../../components/import-pocket/content";
import Accordion from "../../components/accordion";
import { Button, Link, TextInput } from "@pokt-foundation/ui";
import IconUpload from "../../icons/iconUpload";
import PasswordInput from "../../components/input/passwordInput";
import { getDataSource } from "../../datasource";
import { typeGuard } from "@pokt-network/pocket-js";
import PocketService from "../../core/services/pocket-service";
import { useHistory } from "react-router";

const dataSource = getDataSource();

export default function ImportPocket() {
  let history = useHistory();
  const [fileName, setFileName] = useState("");
  const [ppk, setPpk] = useState();
  const [privateKey, setPrivateKey] = useState();
  const [ppkError, setppkError] = useState();
  const [privateKeyError, setPrivateKeyError] = useState();
  const [buttonError, setButtonError] = useState();
  const [filePassphrase, setFilePassphrase] = useState();
  const [privKeyPassphrase, setPrivKeyPassphrase] = useState();

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
      // Some error handling
      return;
    }

    setPrivateKey(privateKey);
  };

  const onFileUploadChange = async ({ target }) => {
    const fileInputValue = await parseFileInputContent(target);

    if (!fileInputValue) {
      console.error("Error parsing file");
      return;
    }

    setPpk(fileInputValue);
  };

  const importAccountFromFile = useCallback(async () => {
    if (filePassphrase.length === 0) return;

    try {
      const account = await dataSource.importPortablePrivateKey(
        filePassphrase,
        ppk,
        filePassphrase
      );

      if (typeGuard(account, Error)) {
        console.error(account);
        return false;
      }

      PocketService.saveUserInCache(
        account.addressHex,
        account.publicKey.toString("hex"),
        ppk.toString()
      );

      history.push({
        pathname: "/account",
        data: true,
      });
    } catch (error) {
      console.error(error);
    }
  }, [history, filePassphrase, ppk]);

  const importAccountFromPrivateKey = useCallback(async () => {
    if (privKeyPassphrase.length === 0) return;

    try {
      if (!dataSource.validatePrivateKey(privateKey)) {
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
        console.error(account);
        return false;
      }

      PocketService.saveUserInCache(
        account.addressHex,
        account.publicKey.toString("hex"),
        ppk.toString()
      );

      history.push({
        pathname: "/account",
        data: true,
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [history, privKeyPassphrase, privateKey]);

  const passPhraseChange = useCallback((type, { target }) => {
    const { value } = target;

    if (type === "file") {
      setFilePassphrase(value);
    } else if (type === "private") {
      setPrivKeyPassphrase(value);
    }
  }, []);

  return (
    <Layout title={<h1 className="title">Import Account</h1>}>
      <ImportPocketContent>
        <p className="description">Select a method to access your account</p>

        <div className="nimport-container">
          <Accordion text="Key File">
            <label className="custom-file-input">
              {fileName ? fileName : "Select File"}
              <TextInput
                adornment={<IconUpload color="white" />}
                adornmentPosition="end"
                type="file"
                wide
                className="upload-file-input"
                onChange={onFileUploadChange}
              />
            </label>
            <PasswordInput
              placeholder="Keyfile Passphrase"
              onChange={(e) => passPhraseChange("file", e)}
            />
            <Button
              mode="primary"
              className="import-button"
              onClick={importAccountFromFile}
            >
              Import
            </Button>
          </Accordion>

          <Accordion text="Private Key">
            <TextInput
              type="password"
              placeholder="•••••••••••••••••••••"
              wide
              onChange={privKeyInputChange}
            />
            <p className="temporary-passphrase">
              Please create a temporary passphrase to encrypt your Private key
              during this session. It will be required to confirm transactions.
            </p>
            <PasswordInput
              placeholder="Private Key Session Passphrase"
              onChange={(e) => passPhraseChange("private", e)}
            />
            <Button
              mode="primary"
              className="import-button"
              onClick={importAccountFromPrivateKey}
            >
              Import
            </Button>
          </Accordion>

          <p className="create-link">
            Don't have a wallet?{" "}
            <Link href="/create" external={false}>
              Create Wallet
            </Link>{" "}
          </p>
        </div>
      </ImportPocketContent>
    </Layout>
  );
}
