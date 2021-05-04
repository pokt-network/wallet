import {Config} from "../config/config";

import { DataSource } from "./datasource"

const dataSourceConfig = {
  gatewayUrl: Config.GATEWAY_URL,
  http: {
    timeout: Config.HTTP_TIMEOUT,
    headers: Config.HTTP_HEADERS,
  }
}
export const getDataSource = () => new DataSource(dataSourceConfig);
