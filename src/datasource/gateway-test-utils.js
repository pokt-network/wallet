const { Pocket, CoinDenom, Configuration, typeGuard, RpcError } = require('@pokt-network/pocket-js');


/**
 * Processes and outputs the processed raw tx. Requires 0 connectivity to the pocket network
 * Just makes use of the keybase functions and rpc codecs for the transactions
 */
export const processTx = async ({
  toAddress,
  amount,
  ppk,
  passphrase,
  chainId,
  defaultFee,
  memo // "Pocket Wallet"
}) => {
  const pocketClientConfiguration = new Configuration(
    1,
    1000,
    0,
    20000,
    undefined,
    undefined,
    Number(900000),
    undefined,
    false,
    false,
    true,
  );

  const pocket = new Pocket([
    "http://localhost:8081" // just a placeholder really, ignore
  ], undefined, pocketClientConfiguration);

  const accountOrUndefined = await pocket.keybase.importPPKFromJSON(
    passphrase,
    ppk,
    passphrase
  );

  if (typeGuard(accountOrUndefined, Error)) {
    throw new Error("Failed to import account due to wrong passphrase provided");
  };

  const transactionSenderOrError = await pocket.withImportedAccount(
    accountOrUndefined.address,
    passphrase
  );

  if (typeGuard(transactionSenderOrError, RpcError)) {
    console.log(transactionSenderOrError);
    throw new Error(transactionSenderOrError.message);
  };

  const rawTxPayloadOrError = await transactionSenderOrError
    .send(accountOrUndefined.addressHex, toAddress, amount.toString())
    .createTransaction(chainId, defaultFee.toString(), CoinDenom.Upokt, memo);

  return {
    address: rawTxPayloadOrError.address.toString('hex'),
    raw_hex_bytes: rawTxPayloadOrError.txHex.toString('hex'),
  }
}
