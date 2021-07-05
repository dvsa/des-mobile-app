import { EnvironmentFile } from './models/environment.model';

export const environment: EnvironmentFile = {
  production: false,
  isRemote: true,
  configUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/configuration/dev',
  daysToCacheLogs: 7,
  enableDevTools: false,
  logoutClearsTestPersistence: true,
  logsPostApiKey: '',
  logsApiUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/logs',
  logsAutoSendInterval: 6000,
  authentication: {
    context: 'https://login.microsoftonline.com/6c448d90-4ca1-4caf-ab59-0a2aa67d7801',
    resourceUrl: '923b07d4-80ee-4524-8f38-c1230aefe151',
    clientId: '923b07d4-80ee-4524-8f38-c1230aefe151',
    redirectUrl: 'mesmobileappscheme://callback',
    logoutUrl: 'mesmobileappscheme://callback?logout=true',
    employeeIdKey: 'employeeid',
  },
  sentry: {
    dsn: null,
    environment: 'dev',
  },
};
