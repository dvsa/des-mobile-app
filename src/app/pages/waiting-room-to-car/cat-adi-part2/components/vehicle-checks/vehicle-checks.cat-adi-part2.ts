import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ModalController } from '@ionic/angular';
import { AppComponent } from '@app/app.component';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { get } from 'lodash';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import {
  VehicleChecksCatADIPart2Modal,
} from
  '@pages/waiting-room-to-car/cat-adi-part2/components/vehicle-checks-modal/vehicle-checks-modal.cat-adi-part2.page';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'vehicle-checks-cat-adi-part-2',
  templateUrl: 'vehicle-checks.cat-adi-part2.html',
})
export class VehicleChecksCatADIPart2Component implements OnChanges {

  @Output()
  onCloseVehicleChecksModal = new EventEmitter<void>();

  @Input()
  vehicleChecksScore: VehicleChecksScore;

  @Input()
  vehicleChecks: CatADI2UniqueTypes.VehicleChecks;

  @Input()
  vehicleChecksSelectQuestions: string;

  @Input()
  formGroup: FormGroup;

  formControl: FormControl;

  constructor(
    private modalController: ModalController,
    private app: AppComponent,
  ) { }

  async openVehicleChecksModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: VehicleChecksCatADIPart2Modal,
      componentProps: { category: TestCategory.ADI2 },
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

    if (!this.vehicleChecks.tellMeQuestions) {
      return false;
    }
    return this.vehicleChecks.tellMeQuestions.reduce((res, question) => res && hasOutcome(question), true);
  }

  hasSeriousFault(): boolean {
    return this.vehicleChecksScore.seriousFaults > 0;
  }

  hasDrivingFault(): boolean {
    return this.vehicleChecksScore.drivingFaults > 0;
  }

  incompleteVehicleChecks(): { vehicleChecks: boolean } {
    return { vehicleChecks: false };
  }

  validateVehicleChecks(): null | { vehicleChecks: boolean } {
    return this.everyQuestionHasOutcome() ? null : this.incompleteVehicleChecks();
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

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
