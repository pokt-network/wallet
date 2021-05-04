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
  'REACT_APP_GATEWAY_URL',
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
const loadConfig = () => {
  const env = loadEnvFromList(configEnvVars);
  return env;
}

export const Config = loadConfig();
