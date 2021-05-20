import Page from './page';

class WaitingRoomPage extends Page {
  clickNewEmailRadioButton() {
    this.clickElementById('newEmail');
  }

  getNewEmailInput() {
    return this.getElementById('newEmailInput');
  }

  enterNewEmail(email) {
    const newEmailAddressField = this.getNewEmailInput();
    newEmailAddressField.sendKeys(email);
  }

  clickPostalAddressRadioButton() {
    this.clickElementById('postalAddress');
  }

  candidateConfirmsDeclaration(testCategory) {
    const pageType = `waiting-room-cat-${testCategory}-page`;
    this.clickCandidateConfirmation(pageType);
  }

  candidateConfirmsCommunicationPreference(testCategory) {
    const pageType = `communication-cat-${testCategory}-page`;
    this.clickCandidateConfirmation(pageType);
  }

  private clickCandidateConfirmation(pageType) {
    this.clickElementByXPath(
      `//div[contains(@class, '${pageType}')]//button[@id = 'continue-button']`);
  }

  checkInsuranceDeclaration() {
    this.clickElementById('insurance-declaration-checkbox');
  }

  checkResidencyDeclaration() {
    this.clickElementById('residency-declaration-checkbox');
  }

  clickSignaturePad() {
    this.clickElementByXPath('//signature-pad/canvas');
  }

  clickContinueButton(testCategory) {
    this.clickElementByXPath(
      `//div[contains(@class, "communication-cat-${testCategory}-page")]//button[@id = "continue-button"]`);
  }

  getProvidedEmailRadioButton() {
    return this.getElementById('providedEmail');
  }

  getProvidedEmailValue() {
    return this.getElementById('providedEmailInput');
  }
}

export default new WaitingRoomPage();
