import Page from './page';
import { browser, by, element } from 'protractor';
import {TEST_CONFIG} from '../test.config';

const buttonPadding = 30;
const request = require('request');

class TestReportPage extends Page {
  public ETA: ETA;
  public driverFaults: DriverFaults;
  public reversingDiagramModal: ReversingDiagramModal;
  public legalRequirements: LegalRequirements;
  public competency: Competency;
  public bikeControlStops: BikeControlStops;

  constructor() {
    super();
    this.ETA = new ETA();
    this.driverFaults = new DriverFaults();
    this.reversingDiagramModal = new ReversingDiagramModal();
    this.legalRequirements = new LegalRequirements();
    this.competency = new Competency();
    this.bikeControlStops = new BikeControlStops();

  }

  clickCPCModuleAssessmentCheckBox(resultNumber) {
    const checkBox = this.getElementById(`answer${resultNumber}`);
    checkBox.click();
  }
  clickNextQuestion() {
    const nextButton = this.getElementById(`next-page-button`);
    nextButton.click();
  }

  clickViewTestSummary() {
    const viewTestSummary = this.getElementById(`view-summary-button`);
    viewTestSummary.click();
  }

  completeUncoupleRecouple() {
    this.longPressElementByXPath('//competency-button[contains(@class, "uncouple-recouple-tick")]');
  }

  completeHomeTestCodeSafety() {
    this.longPressElementByCss('.highway-code-safety-tick');
  }

  completeAdi2SMTM() {
    this.longPressElementByXPath('//competency-button[contains(@class, "show-me-question-tick")]');
  }

  completeHomeTestControlledStop() {
    this.longPressElementByCss('.controlled-stop-tick');
  }


  addUncoupleRecoupleFault() {
    this.longPressElementByXPath('//uncouple-recouple//competency-button/div/div[1]');
  }

  completeManouveure(testCategory) {
    if (testCategory === 'be' || testCategory === 'c' || testCategory === 'c1' || testCategory === 'ce' || testCategory === 'd' || testCategory === 'home-test') {
      this.longPressElementByXPath('//competency-button[contains(@class, "reverse-left-tick")]');
    } else if (testCategory === 'adi-part2') {
      this.clickManoeuvresButtonForAdi2();
      this.clickReverseRightRadioAdi2();
      this.clickReverseParkRadio();
      this.clickManoeuvresButtonForAdi2();
    }else {
      this.clickManoeuvresButton();
      this.clickReverseRightRadio();
      this.clickManoeuvresButton();
    }
  }

  clickReverseRightRadio() {
    this.clickElementById('manoeuvres-reverse-right-radio');
  }

  clickReverseRightRadioAdi2() {
    this.clickElementById('manoeuvres-reverse-right-radio1');
  }

  clickReverseParkRadio() {
    this.clickElementById('manoeuvres-reverse-park-road-radio2');
  }

  clickManoeuvresButton() {
    this.clickElementByXPath('//manoeuvres/button');
  }

  clickManoeuvresButtonForAdi2() {
    this.clickElementByCss('ion-icon[name="md-arrow-dropright"]');
  }

  clickSeriousMode() {
    this.clickElementById('serious-button');
  }

  clickRemove() {
    this.clickElementById('remove-button');
  }

  reverseDropDown() {
    this.clickElementByXPath('//*[@id="reverse-left-label"]');
  }

  completeControlledStop() {
    this.longPressElementByXPath('//competency-button[contains(@class, "controlled-stop-tick")]');
  }

  completeShowMe() {
    this.longPressElementByXPath('//competency-button[contains(@class, "show-me-question-tick")]');
  }

  completeEco() {
    this.longPressElementByXPath('//competency-button[contains(@class, "eco-tick")]');
  }

  getSummaryCountField() {
    return this.getElementById('summary-count');
  }

  getControlledStopTick() {
    return this.getElementByCss('.controlled-stop-tick.checked');
  }

  clickEndTestButton() {
    this.clickElementById('end-test-button');
  }

  clickEndTestButtonSpeedRequirements() {
    this.clickElementByClassName('end-test-button');
  }

  clickLastEndTestButton() {
    const lastEndTestButton = element.all(by.xpath('//end-test-link/button/span[text() = "End test"]')).last();
    this.clickElement(lastEndTestButton);
  }

  clickLastExitPracticeButton() {
    const lastExitPracticeButton = element.all(by.className('exit-text')).last();
    this.clickElement(lastExitPracticeButton);
  }

  clickTerminateTestButton() {
    this.clickElementByXPath('//button/span[text() = "Terminate test"]');
  }

  clickReturnToTestButton() {
    this.clickElementByXPath('//div/legal-requirements-modal//modal-return-button//span');
  }

  clickDangerousButton() {
    this.clickElementById('dangerous-button');
  }

  waitForTerminateButton() {
    this.getElementByXPath('//button/span[contains(text(),"Terminate test")]');
    browser.driver.sleep(TEST_CONFIG.ACTION_WAIT);
  }

  clickContinueToDebriefbutton() {
    this.getElementByXPath('//button[span[h3[text() = "Continue to debrief"]]]');
    this.clickElementByXPath('//button[span[h3[text() = "Continue to debrief"]]]');
  }

  getPracticeModeBanner() {
    return this.getElementByClassName('practice-mode-top-banner');
  }

  emergencyStopClick() {
    const emergencyStop = this.getElementByXPath('/html/body/ion-app/ng-component/ion-nav/div[2]/ion-content/' +
      'div[2]/ion-grid/speed-check[1]/ion-row[1]/ion-col[2]/input[1]');
    emergencyStop.sendKeys('55');
  }

  avoidenceStopClick(){
    const avoidencyStop = this.getElementByXPath('/html/body/ion-app/ng-component/ion-nav/div[2]/ion-content/' +
      'div[2]/ion-grid/speed-check[2]/ion-row[1]/ion-col[2]/input[1]');
    avoidencyStop.sendKeys('66');
  }
}

class ETA extends Page {
  getETAModalTitle() {
    return this.getElementByClassName('modal-alert-header');
  }

  closeETAModal() {
    this.clickElementByClassName('modal-return-button');
  }

  longPressETAButton(etaText) {
    this.longPressElementByXPath(`//competency-button/div/div/span[text() = '${etaText}']`);
  }
}

class DriverFaults extends Page {
  markDriverFault(faultName) {
    this.longPressElementByXPath(`//manoeuvre-competency/div/span[text() = '${faultName}']`);
  }

  getDrivingFaults(driverBadge) {
    return driverBadge.getAttribute('ng-reflect-count');
  }

  addShowMeTellMeDriverFault() {
    this.longPressElementByClassName('vehicle-check-competency');
  }

  addControlledStopDriverFault() {
    this.longPressElementByClassName('controlled-stop-competency');
  }

  getSeriousFaultBadgeForVehicleChecks() {
    return this.getElementByXPath('//vehicle-checks//serious-fault-badge//span');
  }

  getSeriousFaultBadge(competency) {
    return this.getElementByXPath(`//competency-button[div/*[@class = 'competency-label'
  and text() = '${competency}']]/div/div/serious-fault-badge//span[@class = 'label']`);
  }

  getSeriousFaultBadgeByTagName(button) {
    return button.element(by.tagName('serious-fault-badge'));
  }

  getDangerousFaultBadge(competency) {
    return this.getElementByXPath(`//competency-button[div/*[@class = 'competency-label'
  and text() = '${competency}']]/div/div/dangerous-fault-badge//span[@class = 'label']`);
  }

  getCompetencyCountField(competency) {
    return this.getElementByXPath(`//competency-button[div/*[@class = 'competency-label'
  and text() = '${competency}']]/div/driving-faults-badge//span[@class = 'count']`);
  }

  getCompetencyCountFieldForSMTM(competency) {
    return this.getElementByXPath(`//competency-button[div/*[@class = 'show-me-tell-me-label'
  and text() = '${competency}']]/div/driving-faults-badge//span[@class = 'count']`);
  }

  getDriverBadge(competency) {
    return this.getElementByXPath(`//competency-button[div/*[@class = 'competency-label'
  and text() = '${competency}']]/div/driving-faults-badge`);
  }
}

class ReversingDiagramModal extends Page {
  getReversingDiagramModalTitle() {
    return this.getElementByXPath('//reverse-diagram-modal//div[2]');
  }

  closeReversingDialogModal() {
    this.clickElementByXPath('//*[@id="closeReverseDiagramModal"]/span/ion-icon');
  }

  openReversingDiagramModal() {
    this.clickElementByXPath('//*[@id="reverse-diagram-link"]/span');
  }
}

class LegalRequirements extends Page {

  getLegalRequrementsPopup() {
    return this.getElementByXPath('//div/legal-requirements-modal');
  }

  getLegalRequirement(legalRequirement) {
    return this.getElementByXPath(`//legal-requirements-modal//div//ul/li[text() = '${legalRequirement}']`);
  }

  getLegalRequirements() {
    return element.all(by.xpath('//legal-requirement/competency-button[@class="legal-button"]'));
  }

  completeLegalRequirements() {
    const legalRequirements = this.getLegalRequirements();
    legalRequirements.each((legalRequirement) => {
      this.longPressButton(legalRequirement);
    });
  }
  completeLegalRequirementsForCategoryD() {
    this.longPressButton(this.getElementById('BS'));
    this.longPressButton(this.getElementById('BS'));
    this.longPressButton(this.getElementById('NS'));
    this.longPressButton(this.getElementById('NS'));
    this.completeLegalRequirements();
  }
}

class Competency extends Page {
  /**
   * Clicks the competency to add a fault or remove where the relevant S/D/Remove has been selected in advance.
   * Note: not for use with driver faults as this requires a long press
   * @param competency The competency to add the fault to
   */
  clickCompetency(competency) {
    browser.getProcessedConfig().then((config) => {
      browser.driver.getSession().then((session) => {
        const competencyButton = this.getCompetencyButton(competency);
        competencyButton.getLocation().then((buttonLocation) => {
          request.post(`${config.seleniumAddress}/session/${session.getId()}/touch/perform`, {
            json: {
              actions: [
                {
                  action: 'tap',
                  options: {
                    x: Math.ceil(buttonLocation.x) + buttonPadding,
                    y: Math.ceil(buttonLocation.y) + buttonPadding,
                  },
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

  getCompetencyButton(competency: string) {
    return this.getElementByXPath(`//competency-button/div/span[text() = '${competency}']`);
  }

  longPressCompetency (competency: string) {
    const competencyButton = this.getCompetencyButton(competency);
    this.longPressButton(competencyButton);
  }
}
class BikeControlStops extends Page {

  enterEmergencyStopFirstValue(firstValue) {
    const firstElement = this.getElementById('speedCheckEmergencyFirstAttempt');
    firstElement.sendKeys(firstValue);
  }

  enterEmergencyStopSecondValue(secondValue) {
    const secondElement = this.getElementById('speedCheckEmergencySecondAttempt');
    secondElement.sendKeys(secondValue);
  }

  getCompetencyButton(competency: string) {
    return this.getElementByXPath(`//competency-button/div/span[@id='${competency}']`);
  }

  enterAvoidanceStopFirstValue(firstValue) {
    const firstElement = this.getElementById('speedCheckAvoidanceFirstAttempt');
    firstElement.sendKeys(firstValue);
  }

  enterAvoidanceStopSecondValue(secondValue) {
    const secondElement = this.getElementById('speedCheckAvoidanceSecondAttempt');
    secondElement.sendKeys(secondValue);
  }

  clickAvoidanceMetCondition() {
    const competencyButton = this.getElementByXPath(`//span[@id="speedCheckAvoidanceMet"]`);
    competencyButton.click();
  }
}
export default new TestReportPage();
