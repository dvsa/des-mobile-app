import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal.constants';
import { MotFailedModal } from '@pages/waiting-room-to-car/components/mot-components/mot-failed-modal/mot-failed-modal.component';
import {
  PracticeModeMOTModal,
  PracticeModeMOTType,
} from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/practice-mode-mot-modal.component';
import { MotHistoryApiService, MotHistoryWithStatus } from '@providers/mot-history-api/mot-history-api.service';
import { MotHistory, MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
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
  @Input()
  isPracticeMode: boolean;
  @Input()
  isRekeyMode: boolean;

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();
  @Output()
  motFailedModalToggled = new EventEmitter<boolean>();
  @Output()
  vehicleRegistrationBlur = new EventEmitter<string>();
  @Output()
  alternateEvidenceChange = new EventEmitter<boolean>();
  @Output()
  vrnSearchListUpdate = new EventEmitter<string>();
  @Output()
  motDetailsUpdate = new EventEmitter<MotHistory>();

  formControl: UntypedFormControl;
  motData: MotHistoryWithStatus = null;
  modalData: string = null;
  hasCalledMOT = false;
  showSearchSpinner = false;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    public motApiService: MotHistoryApiService,
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
    this.motDetailsUpdate.emit(undefined);
  }

  async getMOT(value: string) {
    this.clearData();
    this.hasCalledMOT = false;
    this.showSearchSpinner = true;

    if (!this.isPracticeMode) {
      const apiCall$ = this.motApiService.getMotHistoryByIdentifier(value);

      apiCall$.subscribe(async (val) => {
        // Assign the API response to the motData property
        this.motData = val;
        // Emit the vehicle registration number to update the search list
        this.vrnSearchListUpdate.emit(value);

        // If the MOT status is not valid, open the reconfirm modal
        if (this.motData?.data?.status === MotStatusCodes.NOT_VALID) {
          await this.loadFailedMOTModal();
          // If the modal was cancelled, stop the spinner and return
          if (this.modalData === ModalEvent.CANCEL) {
            this.showSearchSpinner = false;
            return;
          }
        }

        // Set the flag indicating that the MOT call has been made
        this.hasCalledMOT = true;
        // Stop the search spinner
        this.showSearchSpinner = false;
        // If motData is not null, emit the vehicle details
        if (this.motData) {
          this.motDetailsUpdate.emit(this.motData?.data);
        }
      });
    } else {
      // Load the practice mode modal and wait for the user's response
      const fakeModalReturn = await this.loadPracticeModeModal();

      // If the user indicates that the MOT failed, load the failed MOT modal
      if (fakeModalReturn === PracticeModeMOTType.FAILED) {
        await this.loadFailedMOTModal();
        // If the modal was cancelled, stop the spinner and return
        if (this.modalData === ModalEvent.CANCEL) {
          this.showSearchSpinner = false;
          return;
        }
      }

      // If the user cancelled the practice mode modal, reset motData and stop the spinner
      if (fakeModalReturn === ModalEvent.CANCEL) {
        this.motData = null;
        this.showSearchSpinner = false;
        return;
      }

      // Set the flag indicating that the MOT call has been made
      this.hasCalledMOT = true;
      // Stop the search spinner
      this.showSearchSpinner = false;

      // Make a mock API call to get the MOT result based on the practice mode response
      this.motApiService
        .getMockResultByIdentifier(value, fakeModalReturn as PracticeModeMOTType)
        .subscribe((val: MotHistoryWithStatus) => {
          // Assign the mock API response to the motData property
          this.motData = val;
        });

      if (this.motData) {
        this.motDetailsUpdate.emit(this.motData?.data);
      }
    }
  }

  loadFailedMOTModal = async (): Promise<void> => {
    this.motFailedModalToggled.emit(true);
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: MotFailedModal,
      componentProps: { originalRegistration: this.vehicleRegistration },
      cssClass: 'blackout-modal mes-modal-alert',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<string>();
    this.motFailedModalToggled.emit(false);

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

  isMOTNotValid() {
    return this.motData?.data?.status !== MotStatusCodes.NOT_VALID;
  }
}
