import {
  browser,
} from 'protractor';
import { TEST_CONFIG } from '../test.config';

const {
  Then,
  When,
  setDefaultTimeout,
  After,
  Status,
  AfterAll,
} = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;
const fs = require('fs');

this.testCategory = 'b';

// We need this much timeout for the login process to complete
setDefaultTimeout(TEST_CONFIG.DEFAULT_TIMEOUT);

// Turn off syncronisation with Angular
browser.ignoreSynchronization = true;

let screenshotAlways = false;
browser.getProcessedConfig().then((config) => {
  screenshotAlways = config.screenshotAlways;
});

When('I launch the mobile app', () => {
  // Application is already launched by framework
});

Then('I should see the {string} page', (pageTitle) => {
  const dashboardTitle = '//ion-title[normalize-space(text()) = "My dashboard"]';
  return expect(dashboardTitle)
    .to.equal(`//ion-title[normalize-space(text()) = "${pageTitle}"]`);
});

When(/^I wait "([^"]*)" seconds?$/, { timeout: 2 * 5000 }, async (seconds) => {
  await browser.sleep(seconds * 1000);
});

/**
 * Take a screenshot of the page at the end of the scenario.
 */
After(function (testCase) {
  if (screenshotAlways || testCase.result.status === Status.FAILED) {
    return browser.driver.takeScreenshot().then((screenShot) => {
      this.attach(screenShot, 'image/png');
    });
  }
});

/**
 * Output the UI processed config so it may be included in the HTML report.
 */
AfterAll(() => {
  browser.getProcessedConfig().then((config) => {
    fs.writeFile('./test-reports/e2e-test-config.json', JSON.stringify(config), (err) => {
      if (err) {
        return console.log(err);
      }
    });
  });
});
