const appPath = `${__dirname}/build/Debug-iphonesimulator/App.app`;

exports.config = {
  seleniumAddress: 'http://localhost:4723/wd/hub',
  allScriptsTimeout: 30000,
  capabilities: {
    platformName: 'iOS',
    platformVersion: '13.7',
    deviceName: 'iPad Pro (10.5-inch)',
    browserName: '',
    autoWebview: true,
    // fullReset: true,
    app: appPath,
    automationName: 'XCUITest',
    isHeadless: false,
    newCommandTimeout: 180,
  },
  specs: ['./test/e2e/features/*/*.feature'],
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    compiler: 'ts:ts-node/register',
    format: ['json:./test-reports/cucumber-report.json', 'node_modules/cucumber-pretty'],
    require: ['./test/e2e/step-definitions/*.ts'],
    'fail-fast': true,
  },
  baseUrl: '',
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'test/e2e/tsconfig.e2espec.json',
    });

    var fs = require('fs');
    var dir = './test-reports';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  },
  screenshotAlways: false,
};
