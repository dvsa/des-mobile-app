import Page from './page';

class BackToOfficePage extends Page {
  isCurrentPage() {
    // No page title so need to check something else exists that exists on the page
    this.getElementById('back-to-office-page');
  }

  clickContinueToWriteUpButton() {
    this.clickElementById('continue-to-write-up');
  }

  clickBackToJournalButton() {
    this.clickElementByXPath('//*[@id="back-to-office-page"]//div[3]/button/span');
  }
}

export default new BackToOfficePage();
