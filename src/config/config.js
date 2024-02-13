const validators = {
  GATEWAY_BASE_URL: (value, config) => {
    const isEmpty = value === "";

    if (isEmpty) {
      throw new Error(
        "Required configuration environment variable GATEWAY_BASE_URL, received none"
      );
    }

    const isLocalhostUrl = value.includes("localhost");

    if (isLocalhostUrl) {
      return value;
    }

    const isOfficialDomainUrl = value.includes("rpc.grove.city");
    const hasChainIdSubdomain =
      !value.includes("http://rpc/grove") &&
      !value.includes("https://rpc.grove");

    if (isOfficialDomainUrl && !hasChainIdSubdomain) {
      console.warn(
        "Expecting configuration environment variable GATEWAY_BASE_URL to respect the following format: `https://{CHAIN_ID}.{GATEWAY_DOMAIN}`, but received invalid URL"
      );
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
      throw new Error(
        "Required configuration environment variable CHAIN_ID, received none"
      );
    }

    return value;
  },
};

const configEnvVars = [
  "VITE_CHAIN_ID",
  "VITE_GATEWAY_BASE_URL",
  "VITE_TX_FEE",
  "VITE_MAX_TRANSACTION_LIST_COUNT",
  "VITE_MIN_TRANSACTION_LIST_COUNT",
  "VITE_BLOCK_EXPLORER_BASE_URL",
  "VITE_BUY_POKT_BASE_URL",
  "VITE_POKT_USD_VALUE",
  "VITE_HTTP_TIMEOUT",
  "VITE_HTTP_HEADERS",
  "VITE_USE_LEGACY_CODEC",
];

const loadEnvFromList = (list) =>
  list.reduce((cfg, k) => {
    return { ...cfg, [k.replace(/VITE_/g, "")]: import.meta.env[k] };
  }, {});

/**
 * For now the config is literraly = env variables
 * keep this piece of code if we want to do config gymnastics
 * */
const loadConfigFromEnv = () => {
  const configObj = loadEnvFromList(configEnvVars);

  // order of values matters!
  const validatedEnvVars = ["CHAIN_ID", "GATEWAY_BASE_URL"];

  validatedEnvVars.forEach((envVarKey) => {
    console.log({ envVarKey, envVarVal: configObj[envVarKey] });
    const v = validators[envVarKey](configObj[envVarKey], configObj); // as long as it does not through we are good
    configObj[envVarKey] = v;
  });

  return configObj;
};

export const Config = loadConfigFromEnv();
