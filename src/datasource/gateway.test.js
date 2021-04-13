import {
  getGatewayClient
} from "./gateway";

const testConfig = {
  "gatewayUrl": "http://localhost:3000/v1/60676c9f7cbbfe002f0b9cbe",
  // "gatewayUrl": "https://mainnet.gateway.pokt.network/v1/60676c9f7cbbfe002f0b9cbe",
  "http": {
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json",
      "Blockchain-Subdomain": "mainnet",
    }
  },
}

describe("GatewayClient", () => {
  const context = {
    client: null,
  };

  beforeAll(
    () => {
      jest.setTimeout(100000);
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

  const testCases = [
    {
      queryName: 'getBalance',
      responseProperties: {
        onSuccess: [''],
        onFailure: [''],
      },
      args: [variables.address, variables.height],
    },
    {
      queryName: 'getTransaction',
      responseProperties: {
        onSuccess: [''],
        onFailure: [''],
      },
      args: [variables.txHash],
    },
    {
      queryName: 'getApp',
      responseProperties: {
        onSuccess: [''],
        onFailure: [''],
      },
      args: [variables.address, variables.height],
    },
    {
      queryName: 'getNode',
      responseProperties: {
        onSuccess: [''],
        onFailure: [''],
      },
      args: [variables.address, variables.height],
    },
    {
      queryName: 'getAccountTxs',
      responseProperties: {
        onSuccess: [''],
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
        onSuccess: [''],
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
  ];

  const whitelistedTestCases = [
    'getBalance',
    'getTransaction',
    'getApp',
    'getNode',
    'getAccountTxs',
    'sendRawTx',
  ];

  runOnlyWhitelistedTestCases = (queryAnnotation) => whitelistedTestCases
    .includes(
      queryAnnotation.queryName
    )

  testCases
    .filter(runOnlyWhitelistedTestCases)
    .forEach( ({ queryName, responseProperties, args }) => {

        describe(`GatewayClient.${queryName}`, () => {
          
          test('is functional', async () => {
            await expect(context.client[queryName](...args)).resolves.not.toThrow();
          })

          test('returns proper response format on success', async () => {
            const response = await context.client[queryName](...args);

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

          test.todo('returns proper response format on error', async () => {
            const response = await context.client[queryName]();
            responseProperties.onFailure.forEach(
              (prop) => {
                expect(response).toHaveProperty(prop);
              }
            )
          })
        })
      }
    )
})