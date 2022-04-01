// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const webpackTestConfig = require('./webpack.test.js');
const puppeteer = require('puppeteer');
const os = require('os');
process.env.CHROME_BIN = puppeteer.executablePath();

const DEFAULT_PROCESSES_TO_SHARD = 2;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['parallel', 'jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-parallel'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-spec-reporter')
    ],
    webpack: webpackTestConfig,
    webpackMiddleware: { stats: 'errors-only' },
    webpackServer: { noInfo: true },
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
        timeoutInterval: 15000,
      },
    },
    jasmineHtmlReporter: {
      suppressAll: false // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ngv'),
      subdir: '.',
      instrumenterOptions: {
        istanbul: { noCompact: true }
      },
      reporters: [
        { type: 'html' },
        { type: 'lcovonly' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['kjhtml', 'spec'],
    port: 9876,
    colors: true,
    hostname: '0.0.0.0',
    logLevel: config.LOG_INFO,
    autoWatch: true,
    specReporter: {
      suppressSkipped: true,
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    singleRun: true,
    parallelOptions: {
      executors: os ? Math.ceil(os.cpus().length / 2) : DEFAULT_PROCESSES_TO_SHARD,
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
          '--no-sandbox',
        ],
      },
    },
    browserNoActivityTimeout: 120000,
    browserSocketTimeout: 60000,
    browserDisconnectTimeout: 200000,
    captureTimeout: 240000,
  });
};
