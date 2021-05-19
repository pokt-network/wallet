const validators = {
  GATEWAY_BASE_URL: (value, config) => {
    const isEmpty = value === "";

    if (isEmpty) {
      throw new Error("Required configuration environment variable GATEWAY_BASE_URL, received none");
    }

    const isLocalhostUrl = value.includes("localhost");

    if (isLocalhostUrl) {
      return value;
    }

    const isOfficialDomainUrl = value.includes("gateway.pokt.network");
    const hasChainIdSubdomain = !value.includes("http://gateway.pokt") && !value.includes("https://gateway.pokt");

    if (isOfficialDomainUrl && !hasChainIdSubdomain) {
      console.warn("Expecting configuration environment variable GATEWAY_BASE_URL to respect the following format: `https://{CHAIN_ID}.{GATEWAY_DOMAIN}`, but received invalid URL");
      console.warn("Constructing proper URL...");

      const gatewayDomainUrl = value.split("://")[1];
      console.log(gatewayDomainUrl);
      const constructedGatewayUrl = `https://${config.CHAIN_ID}.${gatewayDomainUrl}`;

      console.log("constructed:", constructedGatewayUrl);

      return constructedGatewayUrl;
    }

    return value;
  },
  CHAIN_ID: (value) => {
    const isEmpty = value === "";

    if (isEmpty) {
      throw new Error("Required configuration environment variable CHAIN_ID, received none");
    }

    return value;
  }
}


const configEnvVars = [
  'REACT_APP_CLIENT_PASSPHRASE',
  'REACT_APP_CLIENT_PUBLIC_KEY',
  'REACT_APP_CLIENT_PRIVATE_KEY',
  'REACT_APP_WALLET_APP_PUBLIC_KEY',
  'REACT_APP_WALLET_APP_AAT_SIGNATURE',
  'REACT_APP_POKT_USD_VALUE',
  'REACT_APP_SECURE_LS_ENCRYPTION_SECRET',
  'REACT_APP_SECURE_LS_ENCODING_TYPE',
  'REACT_APP_SECURE_LS_IS_COMPRESSION',
  'REACT_APP_DISPATCHERS',
  'REACT_APP_HTTP_PROVIDER',
  'REACT_APP_AAT_VERSION',
  'REACT_APP_MAX_DISPATCHERS',
  'REACT_APP_PROVIDER_TYPE',
  'REACT_APP_BLOCK_EXPLORER_BASE_URL',
  'REACT_APP_DASHBOARD_BASE_URL',
  'REACT_APP_BUY_POKT_BASE_URL',
  'REACT_APP_CHAIN',
  'REACT_APP_CHAIN_ID',
  'REACT_APP_BLOCK_TIME',
  'REACT_APP_MAX_TRANSACTION_LIST_COUNT',
  'REACT_APP_TX_FEE',
  'REACT_APP_SESSION_LENGTH',
  'REACT_APP_GATEWAY_BASE_URL',
  'REACT_APP_HTTP_TIMEOUT',
  'REACT_APP_HTTP_HEADERS',
  'REACT_APP_USE_LEGACY_CODEC'
]

const loadEnvFromList = (list) => list.reduce(
  (cfg, k) => {
     return { ...cfg, [k.replace(/REACT_APP_/g, '')]: process.env[k] }
  },
  {},
)

/**
 * For now the config is literraly = env variables
 * keep this piece of code if we want to do config gymnastics
 * */
const loadConfigFromEnv = () => {
  const configObj = loadEnvFromList(configEnvVars);

  // order of values matters!
  const validatedEnvVars = ['CHAIN_ID', 'GATEWAY_BASE_URL']

  validatedEnvVars.forEach(
    (envVarKey) => {
      console.log({ envVarKey, envVarVal: configObj[envVarKey] })
      const v = validators[envVarKey](configObj[envVarKey], configObj); // as long as it does not through we are good
      configObj[envVarKey] = v;
    }
  );

  return configObj;
}

export const Config = loadConfigFromEnv();
