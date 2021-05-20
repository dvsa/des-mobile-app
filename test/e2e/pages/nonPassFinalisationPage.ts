import Page from './page';

class NonPassFinalisationPage extends Page {
  selectActivityCode(activityCodeDesc) {
    this.clickActivityCodeSelector();
    this.clickActivityItem(activityCodeDesc);
    this.submitDialog();
  }

  // 2 getTestOutcomes - one is in debriefPage.ts.
  getTestOutcome() {
    return this.getElementById('office-page-test-outcome');
  }

  getActivityCodeSelector() {
    return this.getElementById('activity-code-selector');
  }

  clickActivityCodeSelector() {
    this.clickElement(this.getActivityCodeSelector());
  }

  clickActivityItem(activityCodeDesc) {
    this.clickElementByXPath(`//button/span/div[@class='alert-radio-label']
  [normalize-space(text()) = '${activityCodeDesc}']`);
  }

  submitDialog() {
    this.clickElementByXPath('//button/span[contains(text(), "Submit")]');
  }

  selectAutomaticTransmission() {
    this.clickElementById('transmission-automatic');
  }

  selectManualTransmission() {
    this.clickElementById('transmission-manual');
  }

  // todo: kc also on debriefPage.
  getD255Yes() {
    return this.getElementById('d255-yes');
  }

  // todo: kc also on debriefPage.
  clickD255Yes() {
    this.clickElement(this.getD255Yes());
  }

  clickContinueToBackOfficeButton(testCategory) {
    this.clickElementByXPath(
      `//div[contains(@class, "non-pass-finalisation-cat-${testCategory}-page")]//button[@id = "continue-button"]`);
  }
}

export default new NonPassFinalisationPage();
