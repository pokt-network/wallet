const ConfigErrors = {
  RequiredParam: (paramName) => `DataSourceConfigError: ${paramName} is required, but none was configured`,
}

const GatewayClientErrors = {
  UnregistredQuery: (queryName) => `GatewayClientError: ${queryName} query is not registered`,
}
export default {
  ConfigErrors,
}
