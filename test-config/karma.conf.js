// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      // eslint-disable-next-line global-require
      require('karma-jasmine'),
      // eslint-disable-next-line global-require
      require('karma-chrome-launcher'),
      // eslint-disable-next-line global-require
      require('karma-jasmine-html-reporter'),
      // eslint-disable-next-line global-require
      require('karma-coverage-istanbul-reporter'),
      // eslint-disable-next-line global-require
      require('@angular-devkit/build-angular/plugins/karma'),
      // eslint-disable-next-line global-require
      require('karma-spec-reporter'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
      }
    },
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true,
    },
    coverageIstanbulReporter: {
      // eslint-disable-next-line global-require
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['spec', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
        ],
      },
    },
    specReporter: {
      suppressSkipped: true,
    },
    singleRun: false,
  });
};
