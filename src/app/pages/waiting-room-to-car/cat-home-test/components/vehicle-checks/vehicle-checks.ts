import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { get } from 'lodash';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { AppComponent } from '@app/app.component';
import {
  VehicleChecksCatHomeTestModal,
} from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';

@Component({
  selector: 'vehicle-checks-cat-home-test',
  templateUrl: 'vehicle-checks.html',
  styleUrls: ['../../../components/vehicle-checks/vehicle-checks.scss'],
})
export class VehicleChecksCatHomeTestComponent implements OnChanges {

  @Input() vehicleChecksScore: VehicleChecksScore;
  @Input() vehicleChecks: CatFUniqueTypes.VehicleChecks;

  @Input()
  vehicleChecksSelectQuestions: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  onCloseVehicleChecksModal = new EventEmitter<void>();

  formControl: FormControl;

  constructor(
    private modalController: ModalController,
    private app: AppComponent,
  ) { }

  async openVehicleChecksModal() {
    const zoomClass = `modal-fullscreen ${this.app.getTextZoomClass()}`;
    const modal = await this.modalController.create(
      {
        component: VehicleChecksCatHomeTestModal,
        cssClass: zoomClass,
      },
    );
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

    return this.vehicleChecks.showMeQuestions.reduce((res, question) => res && hasOutcome(question), true)
      && this.vehicleChecks.tellMeQuestions.reduce((res, question) => res && hasOutcome(question), true);
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
