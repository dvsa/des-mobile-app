import { browser, ExpectedConditions, element, by } from 'protractor';
import { TEST_CONFIG } from '../test.config';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const buttonPadding = 30;
const request = require('request');

export default class Page {
  /**
   * A framework safe click method.
   * @param fieldElement the element to click
   */
// todo: check what type fieldElement is
  clickElement(fieldElement) {
    browser.wait(ExpectedConditions.elementToBeClickable(fieldElement));
    fieldElement.click().then((promise) => {
      return this.isReady(promise);
    });
  }

  clickElementById(elementId) {
    const element = this.getElementById(elementId);
    this.clickElement(element);
  }

  clickElementByXPath(xpath) {
    const element = this.getElementByXPath(xpath);
    this.clickElement(element);
  }

  clickElementByClassName(className) {
    const element = this.getElementByClassName(className);
    this.clickElement(element);
  }

  clickElementByCss(css) {
    const element = this.getElementByCss(css);
    this.clickElement(element);
  }

  clickButtonByCssId(buttonId) {
    this.clickElementByCss(`#${buttonId}`);
  }

  getElementByXPath(xpath, waitForPresenceOfElement = true) {
    const elementBy = element(by.xpath(xpath));

    if (waitForPresenceOfElement) {
      this.waitForPresenceOfElement(elementBy);
    }

    return elementBy;
  }

  getElementById(elementId, waitForPresenceOfElement = true) {
    const elementBy = element(by.id(elementId));

    if (waitForPresenceOfElement) {
      this.waitForPresenceOfElement(elementBy);
    }

    return elementBy;
  }

  getElementByClassName(elementClassName, waitForPresenceOfElement = true) {
    const elementBy = element(by.className(elementClassName));

    if (waitForPresenceOfElement) {
      this.waitForPresenceOfElement(elementBy);
    }

    return elementBy;
  }

  getElementByCss(css, waitForPresenceOfElement = true) {
    const elementBy = element(by.css(css));

    if (waitForPresenceOfElement) {
      this.waitForPresenceOfElement(elementBy);
    }

    return elementBy;
  }

  getElementByCssId(cssId) {
    return this.getElementByCss(`#${cssId}`);
  }

  /**
   * Checks whether the page is ready to be interacted with.
   * Ionic adds an overlay preventing clicking until the page is ready so we need to wait for that to disappear.
   * @param promise the promise to return when the page is ready
   */
  isReady(promise) {
    // There is a 200ms transition duration we have to account for
    browser.sleep(TEST_CONFIG.ACTION_WAIT);
    // Then wait for the page to become active again
    browser.wait(ExpectedConditions.stalenessOf(element(by.className('click-block-active'))));
    // Then return the original promise
    return promise;
  }

  getParentContext(currentContext: string) {
    return `${currentContext.substring(0, currentContext.indexOf('.'))}.1`;
  }

  textFieldInputViaNativeMode(xpathString: string, searchTerm) {
    browser.driver.getCurrentContext().then((webviewContext) => {
      // Switch to NATIVE context
      browser.driver.selectContext('NATIVE_APP').then(() => {
        const nativeField = element(by.xpath(xpathString));
        nativeField.sendKeys(searchTerm);
        // Switch back to WEBVIEW context
        browser.driver.selectContext(this.getParentContext(webviewContext)).then(() => {
          browser.driver.sleep(TEST_CONFIG.ACTION_WAIT);
        });
      });
    });
  }

  getPageTitle(pageTitle) {
    return this.getElementByXPath(
      `//div[contains(@class, 'toolbar-title')][normalize-space(text()) = '${pageTitle}']`);
  }

  /**
   *  Get the last page title i.e. the displayed one
   */
  getDisplayedPageTitle() {
    return element.all(by.className('toolbar-title')).last();
  }

  scrollToElement(element) {
    browser.executeScript('arguments[0].scrollIntoView(true);', element).then(() => {
      expect(element.isPresent(), `Expected element ${element} to be present`).to.eventually.be.true;
    });
  }

  // todo: kc how to keep default timeout
  waitForPresenceOfElement(element) {
    browser.wait(ExpectedConditions.presenceOf(element));
  }

  waitForAngularToFinishRendering() {
    browser.waitForAngular();
  }

  /**
   * Performs the long press action on the competency to add a driver fault.
   * The long press does not appear to have been implemented so calling appiums touch perform action directly.
   * @param button The button to longpress
   */
  longPressButton(button) {
    browser.getProcessedConfig().then((config) => {
      browser.driver.getSession().then((session) => {
        button.getLocation().then((buttonLocation) => {
          request.post(`${config.seleniumAddress}/session/${session.getId()}/touch/perform`, {
            json: {
              actions: [
                {
                  action: 'longPress',
                  options: {
                    x: Math.ceil(buttonLocation.x) + buttonPadding,
                    y: Math.ceil(buttonLocation.y) + buttonPadding,
                  },
                },
                {
                  action: 'release',
                },
              ],
            },
          }, (error) => {
            if (error) {
              console.error(error);
              return;
            }
          });
        });
      });
    });
  }

  longPressElementByXPath(xpath) {
    const element = this.getElementByXPath(xpath);
    this.longPressButton(element);
  }

  longPressElementByClassName(className) {
    const element = this.getElementByClassName(className);
    this.longPressButton(element);
  }

  longPressElementByCss(css) {
    const element = this.getElementByCss(css);
    this.longPressButton(element);
  }

  /**
   * Small wait to make sure the action has initiated
   */
  waitForActionToInitiate() {
    browser.driver.sleep(TEST_CONFIG.ACTION_WAIT);
  }

  getCandidateNameElement(pageName, testCategory) {
    return this.getElementByXPath(
      `//div[contains(@class, '${this.getPageType(pageName, testCategory)}')]//h2[@id = 'candidate-name']`);
  }

  getCandidateDriveNumberElement(pageName, testCategory) {
    return this.getElementByXPath(
      `//div[contains(@class, '${this.getPageType(pageName, testCategory)}')]//h3[@id = 'candidate-driver-number']`);
  }

  getPageType(pageName : string, testCategory : string) {
    switch (pageName) {
      case 'communication page':
        return `communication-cat-${testCategory}-page`;
      case 'debrief':
        return `pass-finalisation-cat-${testCategory}-page`;
      case 'health declaration':
        return `health-declaration-cat-${testCategory}-page`;
      default:
        return `waiting-room-cat-${testCategory}-page`;
    }
  }

  waitForOverlay(elementName: string)  {
    browser.wait(ExpectedConditions.stalenessOf(element(by.className(elementName))));
  }
}
