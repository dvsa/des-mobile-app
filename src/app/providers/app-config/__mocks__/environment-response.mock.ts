export const environmentResponseMock = {
  googleAnalyticsId: 'TEST-GA-ID',
  approvedDeviceIdentifiers: ['iPad7,4'],
  journal: {
    journalUrl: 'remote-journal-url',
    autoRefreshInterval: 5000,
    numberOfDaysToView: 7,
    allowTests: true,
    allowedTestCategories: ['B'],
    enableTestReportPracticeMode: true,
    enableEndToEndPracticeMode: true,
    enableLogoutButton: true,
  },
  tests: {
    testSubmissionUrl: 'https://example.com/api/v1/test-result',
    autoSendInterval: 900000,
  },
  logs: {
    url: 'https://example.com/api/v1/logs',
    autoSendInterval: 60000,
  },
  user: {
    findUser: 'https://www.example.com/api/v1/users/12345',
  },
};
