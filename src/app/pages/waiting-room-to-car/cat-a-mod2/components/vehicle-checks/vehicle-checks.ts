import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SafetyAndBalanceQuestions } from '@dvsa/mes-test-schema/categories/AM2';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { ModalController } from '@ionic/angular';
import { VehicleChecksCatAMod2Modal } from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.page';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { get } from 'lodash-es';

@Component({
  selector: 'vehicle-checks-cat-a-mod2',
  templateUrl: 'vehicle-checks.html',
  styleUrls: ['./vehicle-checks.scss'],
})
export class VehicleChecksCatAMod2Component implements OnChanges {
  @Output()
  onCloseVehicleChecksModal = new EventEmitter();

  @Input() safetyAndBalanceQuestionsScore: SafetyQuestionsScore;

  @Input() safetyAndBalanceQuestions: SafetyAndBalanceQuestions;

  @Input()
  safetyAndBalanceSelectQuestions: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  submitClicked: boolean;

  formControl: UntypedFormControl;

  constructor(
    private modalController: ModalController,
    private accessibilityService: AccessibilityService
  ) {}

  async openVehicleChecksModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: VehicleChecksCatAMod2Modal,
      componentProps: { submitClicked: this.submitClicked },
      cssClass: `modal-fullscreen ${this.accessibilityService.getTextZoomClass()}`,
    });
    await modal.present();
    const didDismiss = await modal.onDidDismiss();

    if (didDismiss) {
      this.onCloseVehicleChecksModal.emit();
    }
  }

  everyQuestionHasOutcome(): boolean {
    const hasOutcome = (question: QuestionResult): boolean => {
      const outcome = get(question, 'outcome', undefined);
      return outcome !== undefined;
    };
    return (
      this.safetyAndBalanceQuestions?.safetyQuestions.reduce((res, question) => res && hasOutcome(question), true) &&
      this.safetyAndBalanceQuestions?.balanceQuestions.reduce((res, question) => res && hasOutcome(question), true)
    );
  }

  hasDrivingFault(): boolean {
    return this.safetyAndBalanceQuestionsScore.drivingFaults > 0;
  }

  incompleteVehicleChecks(): { vehicleChecks: boolean } {
    return { vehicleChecks: false };
  }

  validateVehicleChecks(): null | { vehicleChecks: boolean } {
    return this.everyQuestionHasOutcome() ? null : this.incompleteVehicleChecks();
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(
        {
          value: 'Select questions',
          disabled: false,
        },
        [this.validateVehicleChecks.bind(this)]
      );
      this.formGroup.addControl('safetyAndBalanceSelectQuestions', this.formControl);
    }
    this.formControl.patchValue('Select questions');
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
