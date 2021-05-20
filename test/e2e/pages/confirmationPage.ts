import Page from './page';

class ConfirmationPage extends Page {
  completeConfrimationPage() {
    this.clickElementByXPath('//button[contains(normalize-space(.), "Submit test results")]');
    this.clickElementByXPath('//ion-alert//button[contains(normalize-space(.), "Submit")]');
  }
}

export default new ConfirmationPage();
