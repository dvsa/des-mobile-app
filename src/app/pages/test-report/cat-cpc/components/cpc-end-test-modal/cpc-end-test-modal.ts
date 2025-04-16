import { Component, Input } from '@angular/core';
import { ActivityCode, Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { ModalController } from '@ionic/angular';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TestOutcome } from '@store/tests/tests.constants';
import { ModalEvent } from '../../../test-report.constants';

@Component({
    selector: 'end-test-modal',
    templateUrl: 'cpc-end-test-modal.html',
    styleUrls: ['cpc-end-test-modal.scss'],
    standalone: false
})
export class CPCEndTestModal {
  @Input()
  cpcQuestions: (Question | Question5)[];
  @Input()
  totalPercentage: number;
  @Input()
  testResult: ActivityCode;

  constructor(private modalCtrl: ModalController) {}

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
    return this.testResult === ActivityCodes.PASS ? TestOutcome.Passed : TestOutcome.Failed;
  }

  getTestResultClass(): string {
    return this.testResult === ActivityCodes.PASS ? 'test-result-pass-label' : 'test-result-fail-label';
  }
}
