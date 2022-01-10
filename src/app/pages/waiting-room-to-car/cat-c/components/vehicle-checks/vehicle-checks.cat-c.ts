import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { get } from 'lodash';
import { CategoryCode, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AppComponent } from '@app/app.component';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { VehicleChecksCatCModal } from '../vehicle-checks-modal/vehicle-checks-modal.cat-c.page';

interface VehicleCheckFormState {
  vehicleChecks: boolean;
}

@Component({
  selector: 'vehicle-checks-cat-c',
  templateUrl: 'vehicle-checks.cat-c.html',
  styleUrls: ['vehicle-checks.cat-c.scss'],
})
export class VehicleChecksCatCComponent implements OnChanges {
  @Input()
  fullLicenceHeld: boolean = null;

  @Input()
  vehicleChecksScore: VehicleChecksScore;

  @Input()
  vehicleChecks: CatCUniqueTypes.VehicleChecks;

  @Input()
  vehicleChecksSelectQuestions: string;

  @Input()
  formGroup: FormGroup;

  @Input()
  category: TestCategory | CategoryCode;

  @Output()
  fullLicenceHeldChange = new EventEmitter<boolean>();

  @Output()
  onCloseVehicleChecksModal = new EventEmitter<void>();

  formControl: FormControl;

  constructor(
    private modalController: ModalController,
    private app: AppComponent,
  ) {
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl({
        value: 'Select questions',
        disabled: false,
      },
      [this.validateVehicleChecks.bind(this)]);
      this.formGroup.addControl('vehicleChecksSelectQuestions', this.formControl);
    }
    this.formControl.patchValue('Select questions');
  }

  async openVehicleChecksModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: VehicleChecksCatCModal,
      componentProps: { category: this.category },
      cssClass: `modal-fullscreen ${this.app.getTextZoomClass()}`,
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

    const showMeQuestions = (
      this.fullLicenceHeld ? [this.vehicleChecks.showMeQuestions[0]] : this.vehicleChecks.showMeQuestions
    );
    const tellMeQuestions = (
      this.fullLicenceHeld ? [this.vehicleChecks.tellMeQuestions[0]] : this.vehicleChecks.tellMeQuestions
    );

    return showMeQuestions.reduce((res, question) => res && hasOutcome(question), true)
      && tellMeQuestions.reduce((res, question) => res && hasOutcome(question), true);
  }

  hasSeriousFault(): boolean {
    return this.vehicleChecksScore.seriousFaults > 0;
  }

  hasDrivingFault(): boolean {
    return this.vehicleChecksScore.drivingFaults > 0;
  }

  incompleteVehicleChecks(): VehicleCheckFormState {
    return { vehicleChecks: false };
  }

  validateVehicleChecks(): null | VehicleCheckFormState {
    return this.everyQuestionHasOutcome() ? null : this.incompleteVehicleChecks();
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
