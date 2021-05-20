import Page from './page';
import { by, element } from 'protractor';
import { UI_TEST_DATA } from '../../test_data/ui_test_data';
import PageHelper from './pageHelper';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

class WaitingRoomToCarPage extends Page {
  eyeSightResultPass() {
    this.clickElementById('eyesight-pass');
  }

  orditTrainerResultPass() {
    this.clickElementByCss('label[for="ordit-trained-yes"]');
  }

  orditTrainerResultFail() {
    this.clickElementByCss('label[for="ordit-trained-no"]');
  }

  trainigRecordsPass() {
    this.clickElementByCss('label[for="training-record-yes"]');
  }

  trainigRecordsFail() {
    this.clickElementByCss('label[for="training-record-no"]');
  }

  eyeSightResultFail() {
    this.clickElementById('eyesight-fail');
  }

  selectTranmissionType(transmissionType:string) {
    if (transmissionType === 'Manual') {
      this.clickElementById('transmission-manual');
    }else {
      this.clickElementById('transmission-automatic');
    }
  }

  getEyesightFailureConfirmation() {
    return this.getElementById('eyesight-failure-confirmation');
  }

  clickEyesightFailureConfirmButton() {
    this.clickElementById('confirm-eyesight-failure');
  }

  clickTellMeSelector() {
    this.clickElementById('tell-me-selector');
  }

  clickTellMeQuestion(tellMeQuestion) {
    this.clickElementByXPath(`//button/span/div[normalize-space(text()) = "${tellMeQuestion}"]`);
  }

  clickSubmitButton() {
    this.clickElementByXPath('//button[span[text() = "Submit"]]');
  }

  selectTellMeQuestion (tellMeQuestion: string) {
    this.clickTellMeSelector();
    this.clickTellMeQuestion(tellMeQuestion);
    this.clickSubmitButton();
  }

  clickVehicleCheck(showMeQuestionsArray, index) {
    this.clickElementByXPath(`//button//div[normalize-space(text()) =  "${showMeQuestionsArray[0][index]}"]`);
  }

  clickVehicleAnswer(resultFromQuestions, index) {
    this.clickElementById(`${resultFromQuestions}_${index + 1}`);
  }

  getVehicleChecksQuestions(){
    return element.all(by.id('vehicle-checks-question-selector'));
  }

  showMeQuestionsForDifferentAnswers(questions, questionResult) {
    const showMeQuestionsArray = [questions, questionResult];
    const elements = this.getVehicleChecksQuestions();
    let count = 0;
    elements.each((element, index) => {
      this.clickElement(element);
      this.clickVehicleCheck(showMeQuestionsArray, index);
      // const submitDialog = TempPage.getAndAwaitElement(by.xpath('//ion-alert//button[span[text() =  "Submit"]]'));
      // TempPage.clickElement(submitDialog);
      this.clickSubmitButton();
      let resultFromQuestions;
      if (questionResult[count] === 'true') {
        resultFromQuestions = 'vehicleChecksCorrect';
      } else {
        resultFromQuestions = 'vehicleChecksFault';
      }
      this.clickVehicleAnswer(resultFromQuestions, index);
      count = count + 1;
    });
  }

  showMeQuestions(questions, questionResult) {
    const showMeQuestionsArray = [questions, questionResult];
    const elements = this.getVehicleChecksQuestions();
    let count = 0;
    elements.each((element, index) => {
      this.clickElement(element);
      this.clickVehicleCheck(showMeQuestionsArray, index);
      // const submitDialog = TempPage.getAndAwaitElement(by.xpath('//ion-alert//button[span[text() =  "Submit"]]'));
      // TempPage.clickElement(submitDialog);
      this.clickSubmitButton();
      let resultFromQuestions;
      if (questionResult === true || questionResult[count] === 'false') {
        resultFromQuestions = 'vehicleChecksCorrect';
      } else {
        resultFromQuestions = 'vehicleChecksFault';
      }
      count = count + 1;
      this.clickVehicleAnswer(resultFromQuestions, index);
    });
  }

  clickTellMeFault() {
    this.clickElementById('tellme-fault');
  }

  clickTellMeCorrect() {
    this.clickElementById('tellme-correct');
  }

  clickManualTransmission() {
    this.clickElementById('transmission-manual');
  }

  clickAutomaticTransmission() {
    this.clickElementById('transmission-automatic');
  }

  standardUserJourney(withDriverFault: boolean, manualTransmission: boolean, tellMeQuestion: string) {
    this.selectTellMeQuestion(tellMeQuestion);

    if (!withDriverFault) {
      this.clickTellMeFault();
    } else {
      this.clickTellMeCorrect();
    }

    if (manualTransmission) {
      this.clickManualTransmission();
    } else {
      this.clickAutomaticTransmission();
    }
  }

  getSelectQuestionsButton() {
    return this.getElementByCss('input[value="Select questions"]');
  }

  openSelectQuestionsOverlay() {
    const selectQuestionsButton = this.getSelectQuestionsButton();
    expect(selectQuestionsButton.isPresent()).to.eventually.be.true;
    this.clickElement(selectQuestionsButton);
  }

  submitVehicleChecksButton() {
    this.clickElementById('submit-vehicle-checks');
  }

  multiShowAndTell(questions, questionResult) {
    this.openSelectQuestionsOverlay();
    this.showMeQuestions(questions, questionResult);
    this.submitVehicleChecksButton();
  }

  // todo: kc is this similar to SearchPage?
  enterSearchTerm(searchTerm) {
    this.textFieldInputViaNativeMode(
      '//XCUIElementTypeOther[XCUIElementTypeOther[@name="Vehicle registration number"]]/' +
      'following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField', searchTerm);
  }

  submitWRTC() {
    this.clickElementByXPath('//button[span[h3[text()="Continue to test report"]]]');
  }

  completeWaitingRoomPage(testCategory, questionResult, manualTransmission: boolean, tellMeQuestion?: string) {
    if (testCategory === 'be') {
      this.eyeSightResultPass();
      this.multiShowAndTell(UI_TEST_DATA.testData.be, questionResult);
    } else if (testCategory === 'c' || testCategory === 'c1') {
      this.multiShowAndTell(UI_TEST_DATA.testData.c, questionResult);
    } else if (testCategory === 'd') {
      this.multiShowAndTell(UI_TEST_DATA.testData.c, questionResult);
      this.completeSafetyQuestions();
    } else if (testCategory === 'ce') {
      this.multiShowAndTell(UI_TEST_DATA.testData.ce, questionResult);
    } else if (testCategory === 'a-mod1') {
      this.modCatConfirmation(tellMeQuestion);
      const transmissionSelector = (manualTransmission) ? 'transmission-manual' : 'transmission-automatic';
      this.clickElementById(transmissionSelector);
    } else if (testCategory === 'a-mod2') {
      this.eyeSightResultPass();
      this.modCatConfirmation(tellMeQuestion);
      const transmissionSelector = (manualTransmission) ? 'transmission-manual' : 'transmission-automatic';
      this.clickElementById(transmissionSelector);
      // this is using for Selecting Safety and Balance Questions as well.
      this.multiShowAndTell(UI_TEST_DATA.testData.mod2, questionResult);
    } else {
      this.eyeSightResultPass();
      this.standardUserJourney(questionResult, manualTransmission, tellMeQuestion);
    }
    this.enterSearchTerm('AB12CDE');
    this.submitWRTC();
  }

  selectSafetyAndBalanceQuestions(table, pageTitle) {
    this.openSelectQuestionsOverlay();
    // Wait for the page title to exist
    PageHelper.getPageTitle(pageTitle);

    // Check that it is the last page title i.e. the displayed one
    expect(PageHelper.getDisplayedPageTitle().getText(), `Expected displayedPageTitle to equal ${pageTitle}`)
      .to.eventually.equal(pageTitle);
    this.showMeQuestionsForDifferentAnswers(table.raw()[0], table.raw()[1]);
    this.submitVehicleChecksButton();
  }

  enterRegistrationNumber(registrationNumber) {
    this.enterSearchTerm(registrationNumber);
  }

  selectTransmissionType(transmissionType) {
    const transmissionSelector = (transmissionType === 'Manual') ? 'transmission-manual' : 'transmission-automatic';
    this.clickElementById(transmissionSelector);
  }

  selectEyeSight(result) {
    if (result === 'Pass') {
      this.eyeSightResultPass();
    } else {
      this.eyeSightResultFail();
    }
  }

  selectOrditTrainerOutcome(result) {
    if (result === 'Pass') {
      this.orditTrainerResultPass();
    } else {
      this.orditTrainerResultFail();
    }
  }

  selectTrainningRecordOutcome(result) {
    if (result === 'Pass') {
      this.trainigRecordsPass();
    } else {
      this.trainigRecordsFail();
    }
  }

  modCatConfirmation(catType) {
    this.openConfirmCatType();
    this.selectCatType(catType);
    this.clickElementByXPath('//button[span[text() = "Confirm"]]');
  };

  openConfirmCatType() {
    this.clickElementByXPath(`//*[@id="category-type"]/ion-col[2]/ion-row[2]/ion-col/input`);
  }

  selectCatType(catType) {
    this.clickElementByXPath(`//span[contains(@class, 'bike-code') and
   normalize-space(text()) = '${catType}']`);
  }

  completeSafetyQuestions() {
    this.openSelectQuestionsOverlay();
    this.clickElementById('safetyQuestionsCorrect_14');
    this.clickElementById('safetyQuestionsCorrect_15');
    this.clickElementById('safetyQuestionsCorrect_16');
    this.submitVehicleChecksButton();
  }

  selectVehicleDetails() {
    this.clickElementById('configuration-rigid');
  }

  selectCombination(value) {
    this.clickElementByCss('button[ion-button="item-cover"]');
    //this.clickElementByXPath(`//ion-alert[contains(@class,'single-select-alert')]//div[contains(text(),'${value}')]/../..`);
    this.clickElementById(`alert-input-0-3`);
    //ion-alert[contains(@class,'single-select-alert')]//div[contains(text(),'L')]
    this.clickSubmitButton();
  }
}

export default new WaitingRoomToCarPage();
