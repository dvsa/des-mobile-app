import {
  browser, ExpectedConditions, element, by,
} from 'protractor';
// import { TEST_CONFIG } from '../e2e/test.config';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

export const waitForOverlay = (elementName: string) => {
  browser.wait(ExpectedConditions.stalenessOf(element(by.className(elementName))));
};

// eslint-disable-next-line @typescript-eslint/no-shadow
export const waitForPresenceOfElement = (element) => {
  browser.wait(ExpectedConditions.presenceOf(element));
};

// todo : where is this called in develop?  Is this to replace resetApp?
// export const resetTestDataState = (username) => {
//   waitForOverlay('click-block-active');
//   JournalPage.clickBackButton();
//   LoginPage.logout();
//   LoginPage.logInToApplication(TEST_CONFIG.users[username].username, TEST_CONFIG.users[username].password);
//   LandingPage.loadApplication().then(() => {
//     browser.driver.sleep(TEST_CONFIG.ACTION_WAIT);
//   });
// };
