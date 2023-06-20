import { IsomorphicProvider } from "@pokt-foundation/pocketjs-isomorphic-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { TransactionBuilder } from "@pokt-foundation/pocketjs-transaction-builder";

// Initializes and returns a provider that cannot be used for relays only for querying the network
export function createQueryProvider() {
  return new IsomorphicProvider({
    rpcUrl: import.meta.env.REACT_APP_GATEWAY_BASE_URL,
  });
}

// Initializes a signer from a PPK
export async function createPPKSigner(password, ppk) {
  console.log("CREATE SIGNER: ")
  console.log("password: ", password)
  console.log("ppk: ", ppk)
  const signer = await KeyManager.fromPPK({
    password: password,
    ppk: ppk,
  });
  console.log("signer: ", signer)
  return signer;
}

// Initializes a signer from a private key
export async function createPrivateKeySigner(pk) {
  console.log("createPrivateKeySigner")
  try {
    const signer = await KeyManager.fromPrivateKey(pk);
    console.log("signer: ", signer)
    return signer;
  } catch (e) {
    return [e, false];
  }
}

// Initializes a transaction builder to send transactions over the network
export function createTransactionBuilder(provider, signer) {
  console.log("func createTransactionBuilder: ", provider, signer)
  return new TransactionBuilder({
    chainID: import.meta.env.REACT_APP_CHAIN_ID,
    provider: provider,
    signer: signer,
  });
}
