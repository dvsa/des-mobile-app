import Page from './page';

class PostDebriefHoldingPage extends Page {
  /**
   * No page title so need to check something else exists that exists on the page
   * @param testCategory
   */
  isCurrentPage(testCategory) {
    return this.getElementById(`post-debrief-holding-cat-${testCategory}-page`);
  }

  clickContinueToNonPassFinalisationButton() {
    this.clickElementById('continue-to-non-pass-finalisation');
  }
}

export default new PostDebriefHoldingPage();
