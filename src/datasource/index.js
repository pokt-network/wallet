import config from "../config/config.json";

import { DataSource } from "./datasource"

export const getDataSource = () => new DataSource(config);
