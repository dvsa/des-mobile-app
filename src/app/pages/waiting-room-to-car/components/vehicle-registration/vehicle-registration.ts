import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { VehicleDetails } from '@app/providers/vehicle-details-api/vehicle-details-api.model';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal.constants';
import { MotFailedModal } from '@pages/waiting-room-to-car/components/mot-components/mot-failed-modal/mot-failed-modal.component';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import {
  MotDataWithStatus,
  VehicleDetailsApiService,
} from '@providers/vehicle-details-api/vehicle-details-api.service';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { MotStatusCodes } from '@shared/models/mot-status-codes';
import { isEmpty } from 'lodash-es';
import {
  PracticeModeMOTModal, PracticeModeMOTType
} from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/mot-failed-modal.component';

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
  @Input()
  isPracticeMode: boolean;

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();
  @Output()
  vehicleRegistrationBlur = new EventEmitter<string>();
  @Output()
  alternateEvidenceChange = new EventEmitter<boolean>();
  @Output()
  alternativeEvidenceDescriptionUpdate = new EventEmitter<string>();
  @Output()
  vrnSearchListUpdate = new EventEmitter<string>();
  @Output()
  motDetailsUpdate = new EventEmitter<VehicleDetails>();

  formControl: UntypedFormControl;
  motData: MotDataWithStatus = null;
  modalData: string = null;
  hasCalledMOT = false;
  showSearchSpinner = false;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    public motApiService: VehicleDetailsApiService,
    public modalController: ModalController,
    protected networkState: NetworkStateProvider
  ) {}

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  clearData() {
    this.formGroup.removeControl('evidenceDescriptionCtrl');
    this.formGroup.removeControl('alternateEvidenceCtrl');
    this.alternateEvidenceChange.emit(undefined);
    this.alternativeEvidenceDescriptionUpdate.emit(undefined);
  }

  async getMOT(value: string) {
    this.clearData();
    this.hasCalledMOT = false;
    this.showSearchSpinner = true;

    if (!this.isPracticeMode) {

      const apiCall$ = this.motApiService.getVehicleByIdentifier(value)

      apiCall$.subscribe(async (val) => {
        this.motData = val;
        this.vrnSearchListUpdate.emit(value);
        // If the MOT is invalid, open the reconfirm modal
        if (this.motData?.data?.status === MotStatusCodes.NOT_VALID) {
          await this.loadFailedMOTModal();
          if (this.modalData === ModalEvent.CANCEL) {
            this.showSearchSpinner = false;
            return;
          }
          if (this.modalData !== this.motData.data.registration) {
            this.vrnSearchListUpdate.emit(this.modalData);
            this.motData = null;
          }
        }
        this.hasCalledMOT = true;
        this.showSearchSpinner = false;
        if (this.motData) {
          this.motDetailsUpdate.emit(this.motData?.data);
        }
      });
    } else {
      const fakeModalReturn = await this.loadPracticeModeModal();
      if (fakeModalReturn === ModalEvent.CANCEL) {
        this.motData = null;
        this.showSearchSpinner = false;
        return;
      }
      this.hasCalledMOT = true;
      this.showSearchSpinner = false;
      this.motApiService.getMockResultByIdentifier(fakeModalReturn as PracticeModeMOTType).subscribe((val: MotDataWithStatus) => {
        this.motData = val;
      });

    }
  }

  loadFailedMOTModal = async (): Promise<void> => {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: MotFailedModal,
      componentProps: { originalRegistration: this.vehicleRegistration },
      cssClass: 'mes-modal-alert',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<string>();
    this.modalData = data;
  };

  loadPracticeModeModal = async (): Promise<string> => {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: PracticeModeMOTModal,
      cssClass: 'mes-modal-alert',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss<string>();
    console.log(data)
    return data;
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
    this.clearData();
    this.hasCalledMOT = false;
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

  protected readonly ConnectionStatus = ConnectionStatus;
}
