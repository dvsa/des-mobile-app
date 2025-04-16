import { Component, Input } from '@angular/core';
import { TestData } from '@dvsa/mes-test-schema/categories/ADI3';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { ModalController } from '@ionic/angular';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ModalEvent } from '../../../test-report.constants';

@Component({
    selector: 'adi-3end-test-modal',
    templateUrl: 'adi3-end-test-modal.html',
    styleUrls: ['adi3-end-test-modal.scss'],
    standalone: false
})
export class Adi3EndTestModal {
  testState: number;

  @Input()
  testData: TestData;
  @Input()
  testResult: { activityCode?: ActivityCode; grade?: string } = {};
  @Input()
  totalScore: number;
  @Input()
  feedback: string;
  @Input()
  isValidDashboard: boolean;
  @Input()
  isTestReportPopulated: boolean;
  @Input()
  riskToPublicSafety: boolean;

  constructor(
    public modalCtrl: ModalController,
    public adi3AssessmentProvider: ADI3AssessmentProvider
  ) {}

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
      return 'No result';
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
    return !this.isTestReportPopulated || this.riskToPublicSafety === true
      ? 'test-result-terminated-label'
      : this.testResult.activityCode === ActivityCodes.FAIL
        ? 'test-result-fail-label'
        : 'test-result-pass-label';
  }

  getOutcomeIcon(): string {
    const passImage = 'assets/imgs/greenCorrectAnswer.png';
    const failImage = 'assets/imgs/redWrongAnswer.png';
    return this.testResult.activityCode === ActivityCodes.FAIL ? failImage : passImage;
  }
}
