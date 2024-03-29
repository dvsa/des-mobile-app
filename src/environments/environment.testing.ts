import { TestersEnvironmentFile } from './models/environment.model';

export const environment: TestersEnvironmentFile = {
  production: false,
  isTest: true,
  isRemote: true,
  configUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/configuration/dev',
  sentry: {
    dsn: null,
    environment: null,
  },
  daysToCacheLogs: 7,
  enableDevTools: false,
  logoutClearsTestPersistence: true,
  logsPostApiKey: '',
  taxMotApiKey: '',
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
};
