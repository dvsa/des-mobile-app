import {
  Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { ModalController } from '@ionic/angular';
import { MotInvalidModal } from '@pages/waiting-room-to-car/components/mot-invalid-modal/mot-invalid-modal';
import { MotErrorDisplay, MotStatus } from '@providers/vehicle-details-api/vehicle-details-api.service';

@Component({
  selector: 'vehicle-registration',
  templateUrl: 'vehicle-registration.html',
  styleUrls: ['vehicle-registration.scss'],
})
export class VehicleRegistrationComponent implements OnChanges {
  @Input()
  vehicleRegistration: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  isChecking: boolean = false;

  @Input()
  hasRequestedMOT: boolean = false;

  @Input()
  motStatus: string;

  @Input()
  make: string;

  @Input()
  model: string;

  @Input()
  testExpiryDate: string;

  @Input()
  showCheckMot: boolean = false;

  @Input()
  motError?: MotErrorDisplay;

  @Input()
  checkInvalidMotCount: number = 0;

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();

  @Output()
    // @TODO: Rename to checkMotClicked
  vehicleRegistrationBlur = new EventEmitter<string>();

  formControl: UntypedFormControl;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    private modalCtrl: ModalController,
  ) {
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl('vehicleRegistration', this.formControl);
    }

    this.formControl.updateValueAndValidity();
    this.formControl.patchValue(this.vehicleRegistration);

    if (
      this.hasRequestedMOT
      && (changes?.motStatus?.currentValue || this.motStatus) === MotStatus.NOT_VALID
      && changes?.checkInvalidMotCount?.currentValue <= 2
    ) {
      await this.createMotInvalidModal();
    }
  }

  vehicleRegistrationChanged(event: any): void {
    if (
      typeof event.target.value === 'string'
      && !this.registrationNumberValidator.pattern.test(event.target.value)
    ) {
      event.target.value = event.target.value?.replace(nonAlphaNumericValues, '');

      if (isEmpty(event.target.value)) {
        this.formControl.setErrors({ invalidValue: event.target.value });
      }
    }
    this.vehicleRegistrationChange.emit(event.target.value?.toUpperCase());
  }

  checkMotClicked = (vehicleRegistration: string): void => {
    this.vehicleRegistrationBlur.emit(vehicleRegistration);
  };

  createMotInvalidModal = async () => {
    if (await this.modalCtrl.getTop()) return;

    const modal = await this.modalCtrl.create({
      id: 'MotInvalidModal',
      component: MotInvalidModal,
      backdropDismiss: false,
      showBackdrop: true,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.vehicleRegistrationChange.emit(data);
      this.vehicleRegistrationBlur.emit(data);
    }
  };

}
