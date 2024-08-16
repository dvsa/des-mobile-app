import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CategoryCode, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import { VehicleChecksCatADIPart2Modal } from '@pages/waiting-room-to-car/cat-adi-part2/components/vehicle-checks-modal/vehicle-checks-modal.cat-adi-part2.page';
import { VehicleChecksCatCModal } from '@pages/waiting-room-to-car/cat-c/components/vehicle-checks-modal/vehicle-checks-modal.cat-c.page';
import { VehicleChecksCatDModal } from '@pages/waiting-room-to-car/cat-d/components/vehicle-checks-modal/vehicle-checks-modal.cat-d.page';
import { VehicleChecksCatHomeTestModal } from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { CatCVehicleChecks, CatDVehicleChecks, CatHomeTestVehicleChecks } from '@shared/unions/test-schema-unions';
import { get } from 'lodash-es';

interface VehicleCheckFormState {
  vehicleChecks: boolean;
}

@Component({
  selector: 'vehicle-checks-vocational',
  templateUrl: 'vehicle-checks.html',
  styleUrls: ['vehicle-checks.scss'],
})
export class VehicleChecksComponent implements OnChanges {
  @Input()
  fullLicenceHeld: boolean = null;

  @Input()
  vehicleChecksScore: VehicleChecksScore;

  @Input()
  safetyQuestionsScore: SafetyQuestionsScore;

  @Input()
  vehicleChecks: CatCVehicleChecks | CatDVehicleChecks | CatHomeTestVehicleChecks;

  @Input()
  safetyQuestions?: CatDUniqueTypes.SafetyQuestions = null;

  @Input()
  vehicleChecksSelectQuestions: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  category: TestCategory | CategoryCode;

  @Input()
  submitClicked: boolean;

  @Output()
  fullLicenceHeldChange = new EventEmitter<boolean>();

  @Output()
  onCloseVehicleChecksModal = new EventEmitter<void>();

  formControl: UntypedFormControl;

  constructor(
    private modalController: ModalController,
    private accessibilityService: AccessibilityService
  ) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(
        {
          value: 'Select questions',
          disabled: false,
        },
        [this.validateVehicleChecks.bind(this)]
      );
      this.formGroup.addControl('vehicleChecksSelectQuestions', this.formControl);
    }
    this.formControl.patchValue('Select questions');
  }

  async openVehicleChecksModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: this.getVehicleCheckModal(),
      componentProps: {
        category: this.category,
        submitClicked: this.submitClicked,
      },
      cssClass: `modal-fullscreen ${this.accessibilityService.getTextZoomClass()}`,
    });
    await modal.present();
    const didDismiss = await modal.onDidDismiss();

    if (didDismiss) {
      this.onCloseVehicleChecksModal.emit();
    }
  }

  getVehicleCheckModal = () => {
    switch (this.category) {
      case TestCategory.ADI2:
        return VehicleChecksCatADIPart2Modal;
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
        return VehicleChecksCatCModal;
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return VehicleChecksCatDModal;
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return VehicleChecksCatHomeTestModal;
      default:
        throw new Error(`Cannot getVehicleCheckModal for category ${this.category}`);
    }
  };

  private isCatD = (): boolean =>
    isAnyOf(this.category, [TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E]);

  everyQuestionHasOutcome(): boolean {
    const hasOutcome = (question: QuestionResult): boolean => {
      const outcome = get(question, 'outcome', undefined);
      return outcome !== undefined;
    };

    const showMeQuestions = this.fullLicenceHeld
      ? [this.vehicleChecks.showMeQuestions[0]]
      : this.vehicleChecks.showMeQuestions;
    const tellMeQuestions = this.fullLicenceHeld
      ? [this.vehicleChecks.tellMeQuestions[0]]
      : this.vehicleChecks.tellMeQuestions;
    const safetyQuestion: boolean = this.safetyQuestions
      ? this.safetyQuestions.questions.reduce((res, question) => res && hasOutcome(question), true)
      : true;

    return (
      showMeQuestions.reduce((res, question) => res && hasOutcome(question), true) &&
      tellMeQuestions.reduce((res, question) => res && hasOutcome(question), true) &&
      safetyQuestion
    );
  }

  hasSeriousFault(): boolean {
    return this.vehicleChecksScore.seriousFaults > 0;
  }

  hasDrivingFault(): boolean {
    if (this.isCatD()) {
      return this.vehicleChecksScore.drivingFaults > 0 || this.safetyQuestionsScore?.drivingFaults > 0;
    }
    return this.vehicleChecksScore.drivingFaults > 0;
  }

  incompleteVehicleChecks(): VehicleCheckFormState {
    return { vehicleChecks: false };
  }

  validateVehicleChecks(): null | VehicleCheckFormState {
    return this.everyQuestionHasOutcome() ? null : this.incompleteVehicleChecks();
  }

  drivingFaultsLabel(count: number): string {
    let label = 'driving fault';
    if (count > 1) {
      label = 'driving faults';
    }
    return label;
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
