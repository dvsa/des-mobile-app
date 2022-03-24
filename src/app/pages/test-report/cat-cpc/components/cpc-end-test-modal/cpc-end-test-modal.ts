import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ActivityCode, Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TestOutcome } from '@store/tests/tests.constants';
import { ModalEvent } from '../../../test-report.constants';

@Component({
  selector: 'end-test-modal',
  templateUrl: 'cpc-end-test-modal.html',
  styleUrls: ['cpc-end-test-modal.scss'],
})
export class CPCEndTestModal implements OnInit {
  questions: (Question | Question5)[];
  totalPercentage: number;
  testResult: ActivityCode;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) {}

  ngOnInit(): void {
    this.questions = this.navParams.get('cpcQuestions');
    this.totalPercentage = this.navParams.get('totalPercentage');
    this.testResult = this.navParams.get('testResult');
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

  getTestResultLabel(): TestOutcome {
    return (this.testResult === ActivityCodes.PASS ? TestOutcome.Passed : TestOutcome.Failed);
  }

  getTestResultClass(): string {
    return (this.testResult === ActivityCodes.PASS ? 'test-result-pass-label' : 'test-result-fail-label');
  }

}
