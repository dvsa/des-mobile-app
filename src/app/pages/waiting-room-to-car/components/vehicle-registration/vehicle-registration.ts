import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import {
  MotDataWithStatus,
  VehicleDetailsApiService,
} from '@providers/vehicle-details-api/vehicle-details-api.service';
import { ModalController } from '@ionic/angular';
import { MotFailedModal } from '@pages/waiting-room-to-car/components/mot-failed-modal/mot-failed-modal.component';
import { isEmpty } from 'lodash-es';

@Component({
  selector: 'vehicle-registration',
  styleUrls: ['vehicle-registration.scss'],
  templateUrl: './vehicle-registration.html',
})

export class VehicleRegistrationComponent implements OnChanges {
  @Input()
  vehicleRegistration: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();

  @Output()
  vehicleRegistrationBlur = new EventEmitter<string>();

  formControl: UntypedFormControl;

  motData: MotDataWithStatus = null;

  modalData: string = null;

  hasCalledMOT: boolean = false;

  showSearchSpinner: boolean = false;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    private motApiService: VehicleDetailsApiService,
    public modalController: ModalController,
  ) {
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  getMOT(value: string) {
    this.hasCalledMOT = false;
    this.showSearchSpinner = true;
    this.motApiService.getVehicleByIdentifier(value).subscribe(async (val) => {
      this.motData = val;
      // If the MOT is invalid, open the reconfirm modal
      if (this.motData?.data?.status === 'Not valid') {
        await this.loadModal();
        if (this.modalData !== this.motData.data.registration) {
          // Call the MOT service again if the new registration is different.
          this.vehicleRegistration = this.modalData;
          this.getMOT(this.modalData);
          return;
        }
      }
      this.hasCalledMOT = true;
      this.showSearchSpinner = false;
    });
  }

  loadModal = async (): Promise<void> => {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: MotFailedModal,
      cssClass: 'mes-modal-alert',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<string>();
    this.modalData = data;
  };

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl('vehicleRegistration', this.formControl);

      // if vehicleRegistration already set using VRN early modal and not interacted with here,
      // we trick the component into dispatching the emission
      if (this.vehicleRegistration != null) {
        this.onBlurEvent(this.vehicleRegistration);
      }
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  vehicleRegistrationChanged(event: any): void {
    if (typeof event.target.value === 'string' && !this.registrationNumberValidator.pattern.test(event.target.value)) {
      event.target.value = event.target.value?.replace(nonAlphaNumericValues, '');

      if (isEmpty(event.target.value)) {
        this.formControl.setErrors({ invalidValue: event.target.value });
      }
    }
    this.vehicleRegistration = event.target.value?.toUpperCase();
    this.vehicleRegistrationChange.emit(event.target.value?.toUpperCase());
  }

  onBlurEvent = (vehicleRegistration: string): void => {
    this.vehicleRegistrationBlur.emit(vehicleRegistration);
  };
}
