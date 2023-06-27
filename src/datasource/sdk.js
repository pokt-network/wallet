import { IsomorphicProvider } from "@pokt-foundation/pocketjs-isomorphic-provider";
import { KeyManager } from "@pokt-foundation/pocketjs-signer";
import { TransactionBuilder } from "@pokt-foundation/pocketjs-transaction-builder";

// Initializes and returns a provider that cannot be used for relays only for querying the network
export function createQueryProvider() {
  return new IsomorphicProvider({
    rpcUrl: import.meta.env.VITE_GATEWAY_BASE_URL,
  });
}

// Initializes a signer from a PPK
export async function createPPKSigner(password, ppk) {
  const signer = await KeyManager.fromPPK({
    password: password,
    ppk: ppk,
  });
  return signer;
}

// Initializes a transaction builder to send transactions over the network
export function createTransactionBuilder(provider, signer) {
  return new TransactionBuilder({
    chainID: import.meta.env.VITE_CHAIN_ID,
    provider: provider,
    signer: signer,
  });
}
