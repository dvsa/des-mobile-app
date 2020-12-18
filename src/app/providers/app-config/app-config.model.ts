export type AppConfig = {
  configUrl: string
  logoutClearsTestPersistence?: boolean;
  logsPostApiKey: string;
  logsApiUrl: string;
  logsAutoSendInterval: number;
  timeTravelDate?: string,
  authentication: {
    context: string,
    resourceUrl: string,
    clientId: string,
    redirectUrl: string,
    logoutUrl: string,
    employeeIdKey: string,
    employeeNameKey: string,
  },
};
