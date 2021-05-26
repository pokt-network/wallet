import {Config} from "../config/config";

import { DataSource } from "./datasource"

const dataSourceConfig = {
  gatewayUrl: Config.GATEWAY_BASE_URL,
  http: {
    timeout: Config.HTTP_TIMEOUT,
    headers: Config.HTTP_HEADERS !== "" ? JSON.parse(Config.HTTP_HEADERS) : {},
  },
  chainId: Config.CHAIN_ID,
  txFee: Config.TX_FEE,
  maxTransactionListCount: Config.MAX_TRANSACTION_LIST_COUNT
}

export const getDataSource = () => new DataSource(dataSourceConfig);
