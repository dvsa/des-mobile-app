import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { TestData } from '@dvsa/mes-test-schema/categories/ADI3';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { ModalEvent } from '../../../test-report.constants';

@Component({
  selector: 'adi-3end-test-modal',
  templateUrl: 'adi3-end-test-modal.html',
  styleUrls: ['adi3-end-test-modal.scss'],
})
export class Adi3EndTestModal implements OnInit {
  testState: number;
  testData: TestData;
  testResult: { activityCode?: ActivityCode; grade?: string; } = {};
  totalScore: number;
  feedback: string;
  isValidDashboard: boolean;
  isTestReportPopulated: boolean;
  riskToPublicSafety: boolean;

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    public adi3AssessmentProvider: ADI3AssessmentProvider,
  ) {
  }

  ngOnInit(): void {
    this.testData = this.navParams.get('testData');
    this.testResult = this.navParams.get('testResult');
    this.totalScore = this.navParams.get('totalScore');
    this.feedback = this.navParams.get('feedback');
    this.isValidDashboard = this.navParams.get('isValidDashboard');
    this.isTestReportPopulated = this.navParams.get('isTestReportPopulated');
    this.riskToPublicSafety = this.navParams.get('riskToPublicSafety');
  }

  async onCancel(): Promise<void> {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  }

  async onContinue(): Promise<void> {
    await this.modalCtrl.dismiss(ModalEvent.CONTINUE);
  }

  async onTerminate(): Promise<void> {
    await this.modalCtrl.dismiss(ModalEvent.TERMINATE);
  }

  getTestResultLabel(): string {
    if (!this.isTestReportPopulated) {
      return 'No Result';
    }
    if (this.riskToPublicSafety === true) {
      return 'Terminated';
    }
    if (this.testResult.activityCode === ActivityCodes.FAIL) {
      return 'Unsuccessful';
    }
    return `Passed - Grade ${this.testResult.grade === 'A' ? 'A' : 'B'}`;
  }

  getTestResultClass(): string {
    return (!this.isTestReportPopulated || this.riskToPublicSafety === true
      ? 'test-result-terminated-label'
      : this.testResult.activityCode === ActivityCodes.FAIL
        ? 'test-result-fail-label'
        : 'test-result-pass-label');
  }

  getOutcomeIcon(): string {
    const passImage = 'assets/imgs/greenCorrectAnswer.png';
    const failImage = 'assets/imgs/redWrongAnswer.png';
    return (this.testResult.activityCode === ActivityCodes.FAIL ? failImage : passImage);
  }
}
