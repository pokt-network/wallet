import { DataSource } from "./datasource";
import { readFileSync } from "fs";

const testConfig = {
  "gatewayUrl": "http://localhost:3000/v1/60676c9f7cbbfe002f0b9cbe",
  "http": {
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json",
      "Blockchain-Subdomain": "mainnet",
    }
  },
  "ppkFilePath": `${__dirname}/ppk.json`,
  "passphrase": "L0c4ld3v3l0pment!",
  "chainId": "mainnet",
  "blockTime": 900000,
  "txFee": 10000,
  "useLegacyCodec": true,
}

describe('DataSource', () => {
  const variables = {
    height: 22788,
    address: "04c56dfc51c3ec68d90a08a2efaa4b9d3db32b3b",
    validatorAddress: "000a52a2b942166942bfdc3f15f4a0ca7f976c3d",
    applictionAddress: "f0ff6a854af933e6a837b0bec885b0089313607f",
    txHash: "E4A3EDE68171473996E68549C5CFC3C06B4865C35D194B8BDDA08908B4D394A6",
    received: false,
    txSendAmount: 1000,
    ppk: '', // is filled from beforeAll
    recipientAddress: "0547fcf1f664df7e697db5a5514d3555c897d6f5",
  }

  const context = {
    datasource: null,
    args: {
      getBalance: [variables.address],
      getTx: [variables.txHash],
      getApp: [variables.applictionAddress], 
      getNode: [variables.validatorAddress],
      sendTransaction: () => [variables.ppk, testConfig.passphrase, variables.recipientAddress, variables.txSendAmount],
      getAllTransactions: [variables.address],
      getTxs: [variables.address, variables.received],
    }
  };

  beforeAll(
    () => {
      jest.setTimeout(100000);
      variables.ppk = readFileSync(testConfig.ppkFilePath, 'utf-8')
    }
  )

  test.only('it instantiates properly', () => {
    expect(
      () => {
        context.datasource = new DataSource(testConfig);
      }
    ).not.toThrow();
  })

  describe('DataSource#getBalance', () => {
    test('responds with a number as balance', async () => {
      const balance = await context.datasource.getBalance(...context.args.getBalance);

      expect(balance).toBeDefined();
      expect(typeof balance).toBe('number');
    })

    test.todo('responds with undefined on error')
  })


  describe('DataSource#getTx', () => {
    test('responds with a tx object', async () => {
      const tx = await context.datasource.getTx(...context.args.getTx);

      expect(tx).toBeDefined();
      expect(tx).toHaveProperty('hash');
      expect(tx).toHaveProperty('height');
      expect(tx).toHaveProperty('index');
      expect(tx).toHaveProperty('proof');
      expect(tx).toHaveProperty('tx_result');
      expect(tx).toHaveProperty('tx');
    })

    test.todo('responds with undefined on error')
  })

  describe('DataSource#getApp', () => {
    test('responds with an app as an object', async () => {
      const app = await context.datasource.getApp(...context.args.getApp);

      expect(app).toBeDefined();
        
      expect(app).toHaveProperty('address');
      expect(app).toHaveProperty('chains');
      expect(app).toHaveProperty('jailed');
      expect(app).toHaveProperty('max_relays');
      expect(app).toHaveProperty('public_key');
      expect(app).toHaveProperty('staked_tokens');
      expect(app).toHaveProperty('status');
      expect(app).toHaveProperty('unstaking_time');
    })

    test.todo('responds with undefined on error')
  })


  describe('DataSource#getNode', () => {
    test('responds with a node as an object', async () => {
      const node = await context.datasource.getNode(...context.args.getNode);

      expect(node).toBeDefined();
        
      expect(node).toHaveProperty('address');
      expect(node).toHaveProperty('chains');
      expect(node).toHaveProperty('jailed');
      expect(node).toHaveProperty('service_url');
      expect(node).toHaveProperty('public_key');
      expect(node).toHaveProperty('status');
      expect(node).toHaveProperty('unstaking_time');
    })

    test.todo('responds with undefined on error')
  })

  describe('DataSource#getTxs', () => {
    test('responds with a txs as an array', async () => {
      const txs = await context.datasource.getTxs(...context.args.getTxs);

      expect(txs).toBeDefined();
      expect(txs).toHaveProperty('total_count');
      expect(txs).toHaveProperty('txs');
      expect(
        Array.isArray(txs.txs)
      ).toBe(true);
    })

    test.todo('responds with undefined on error')
  })

  describe('DataSource#getAllTransactions', () => {
    test('responds with a txs as an array', async () => {
      const txs = await context.datasource.getAllTransactions(...context.args.getAllTransactions);

      expect(txs).toBeDefined();
      expect(Array.isArray(txs)).toBe(true);
      expect(txs.length).toBeGreaterThan(0);

      const types = txs.map(({ type }) => type)

      expect(
        types.some(
          (t) => ['Received', 'Sent'].includes(t)
        )
      ).toBe(true)
    })

    test.todo('responds with undefined on error')
  })

  describe.only('DataSource#sendTransaction', () => {
    test('responds with a txhash and a log resuming the transaction', async () => {
      const response = await context.datasource.sendTransaction(...context.args.sendTransaction());

      console.log({ response })
      expect(response).toBeDefined();

      expect(response).toHaveProperty('txhash');
      expect(response).toHaveProperty('log');
    })

    test.todo('responds with undefined on error')
  })
});
