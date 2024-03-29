import { IsomorphicProvider } from "@pokt-foundation/pocketjs-isomorphic-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { TransactionBuilder } from "@pokt-foundation/pocketjs-transaction-builder";
import { Config } from "../config/config";

// Initializes and returns a provider that cannot be used for relays only for querying the network
export function createQueryProvider() {
  return new IsomorphicProvider({
    rpcUrl: Config.GATEWAY_BASE_URL,
  });
}

// Initializes a signer from a PPK
export async function createPPKSigner(password, ppk) {
  try {
    const signer = await KeyManager.fromPPK({
      password: password,
      ppk: ppk,
    });

    return signer;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// Initializes a transaction builder to send transactions over the network
export function createTransactionBuilder(provider, signer) {
  try {
    const tb = new TransactionBuilder({
      chainID: import.meta.env.VITE_CHAIN_ID,
      provider: provider,
      signer: signer,
    });

    return tb;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
