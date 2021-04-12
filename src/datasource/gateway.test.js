import { readFileSync } from 'fs';
import {
  getGatewayClient
} from "./gateway";
import { 
  processTx
} from "./gateway-test-utils";

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
  "txFee": 10000,
}

describe("GatewayClient", () => {
  const context = {
    client: null,
  };

  const variables = {
    height: 22788,
    address: "04c56dfc51c3ec68d90a08a2efaa4b9d3db32b3b",
    applictionAddress: "f0ff6a854af933e6a837b0bec885b0089313607f",
    txHash: "E4A3EDE68171473996E68549C5CFC3C06B4865C35D194B8BDDA08908B4D394A6",
    page: 1,
    per_page: 1,
    prove: false,
    received: false,
    blockchain: "",
    stakingStatus: 2,
    jailingStatus: 2,
    addressHex: "",
    encodedTxBytes: "",
    txSendAmount: 1000,
    recipientAddress: "0547fcf1f664df7e697db5a5514d3555c897d6f5",
  }

  const testCases = [
    {
      queryName: 'getBalance',
      responseProperties: {
        onSuccess: ['balance'],
        onFailure: [''],
      },
      args: [variables.address, variables.height],
    },
    {
      queryName: 'getTransaction',
      responseProperties: {
        onSuccess: [
          'hash',
          'height',
          'index',
          'proof',
          'tx',
          'tx_result',
        ],
        onFailure: [''],
      },
      args: [variables.txHash],
    },
    {
      queryName: 'getApp',
      responseProperties: {
        onSuccess: [
          'address',
          'chains',
          'jailed',
          'max_relays',
          'public_key',
          'staked_tokens',
          'status',
          'unstaking_time',
        ],
        onFailure: [''],
      },
      args: [variables.applictionAddress, variables.height],
    },
    {
      queryName: 'getNode',
      responseProperties: {
        onSuccess: [
          'address',
          'chains',
          'jailed',
          'public_key',
          'service_url',
          'status',
          'tokens',
          'unstaking_time',
        ],
        onFailure: [''],
      },
      args: [variables.address, variables.height],
    },
    {
      queryName: 'getAccountTxs',
      responseProperties: {
        onSuccess: [
          'total_count'
          ['txs', 'tx_result', 'tx', 'stdTx', 'proof', 'hash', 'height', 'index']
        ],
        onFailure: [''],
    },
      args: [
        variables.address,
        variables.prove,
        variables.received,
        variables.page,
        variables.per_page,
      ],
    },
    {
      queryName: 'sendRawTx',
      responseProperties: {
        onSuccess: [
          'logs',
          'txhash',
        ],
        onFailure: [''],
      },
      args: null, // if null, the getArgs will be used. For references with dynamic values
      getArgs: () => [variables.addressHex, variables.encodedTxBytes]
    },
  ];

  beforeAll(
    async () => {
      jest.setTimeout(100000);

      // process a raw transaction and prepare it for the sendRawTx test case
      const ppk = readFileSync(testConfig.ppkFilePath, 'utf-8')
      const passphrase = testConfig.passphrase;
      const chainId = testConfig.chainId;
      const defaultFee = testConfig.txFee;

      const toAddress = variables.recipientAddress;
      const amount = variables.txSendAmount;

      console.log({
        ppk,
        passphrase,
      });

      await processTx({
        toAddress,
        amount,
        ppk,
        passphrase,
        chainId,
        defaultFee,
        memo: "Pocket Wallet"
      }).then(
        (processedTxPayload) => {
          variables.addressHex = processedTxPayload.address;
          variables.encodedTxBytes = processedTxPayload.raw_hex_bytes;
        }
      ).catch(
        (err) => {
          console.error(err);
          process.exit(1);
        }
      )
    }
  )

  test('instantiates properly', () => {
    expect(
      () => {
        context.client = getGatewayClient(
          testConfig.gatewayUrl,
          testConfig.http
        );
      }
    ).not.toThrow();

    expect(
        context
        .client
        .config
        .baseUrl
      )
      .toEqual(
        testConfig.gatewayUrl
      );

    expect(
        context
        .client
        .config
        .headers
      )
      .toEqual(
        testConfig
        .http
        .headers
      );
  });

  

  const whitelistedTestCases = [
    'getBalance',
    'getTransaction',
    'getApp',
    'getNode',
    'getAccountTxs',
  ];

  const runOnlyWhitelistedTestCases = (queryAnnotation) => whitelistedTestCases
    .includes(
      queryAnnotation.queryName
    )

  const testQuery = ({ queryName, responseProperties, args, getArgs }) => {

    describe(`GatewayClient.${queryName}`, () => {
      
      test('is functional', async () => {
        const _args = args !== null ? args : getArgs();
        await expect(context.client.makeQuery(queryName, ..._args)).resolves.not.toThrow();
      })

      test('returns proper response format on success', async () => {
        const _args = args !== null ? args : getArgs();
        const response = await context.client.makeQuery(queryName, ..._args);

        responseProperties.onSuccess.forEach(
          (prop) => {
            if (typeof prop === 'string') {
              expect(response).toHaveProperty(prop);
            } else if (Array.isArray(prop)) {

              const parentProp = prop.shift();
              const nestedProps = prop;

              expect(response)
                .toHaveProperty(parentProp)

              nestedProps.forEach(
                (nestedProp) => {
                  expect(response[parentProp][0]).toHaveProperty(nestedProp)
                }
              )

            }
          }
        )
      })

      test.skip('returns proper response format on error', async () => {
        const response = await context.client[queryName]();
        responseProperties.onFailure.forEach(
          (prop) => {
            expect(response).toHaveProperty(prop);
          }
        )
      })
    })

  }

  testCases
    .filter(runOnlyWhitelistedTestCases)
    .forEach(testQuery);

  // Why?
  // Because running the request twice (_and as fast as jest does_)
  // triggers the following error:"broadcast_tx_sync: RPC error -32603 - Internal error: tx already exists in cache",
  // means this is too fast
  describe('GatewayClient.sendRawTx', () => {
    test('is functional and returns proper response format on success', async () => {
      const {
        queryName,
        args,
        getArgs,
        responseProperties,
      } = testCases.filter((queryAnnotation) => queryAnnotation.queryName === 'sendRawTx')[0]
      
      const _args = args !== null ? args : getArgs();
      const response = await context.client.makeQuery(queryName, ..._args);

      responseProperties.onSuccess.forEach(
        (prop) => {
          if (typeof prop === 'string') {
            expect(response).toHaveProperty(prop);
          } else if (Array.isArray(prop)) {

            const parentProp = prop.shift();
            const nestedProps = prop;

            expect(response)
              .toHaveProperty(parentProp)

            nestedProps.forEach(
              (nestedProp) => {
                expect(response[parentProp][0]).toHaveProperty(nestedProp)
              }
            )

          }
        }
      )
    })
  })
})