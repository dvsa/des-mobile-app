import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  ModalEvent,
  MotFailedModal,
} from '@pages/waiting-room-to-car/components/mot-components/mot-failed-modal/mot-failed-modal.component';
import {
  PracticeModeMOTModal,
  PracticeModeMOTType,
} from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/practice-mode-mot-modal.component';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { MotHistoryApiService, MotHistoryWithStatus } from '@providers/mot-history-api/mot-history-api.service';
import { MotHistory, MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import {
  FieldValidators,
  getRegistrationNumberValidator,
  nonAlphaNumericValues,
} from '@shared/constants/field-validators/field-validators';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { isEmpty } from 'lodash-es';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

export enum MOTAbortedMethod {
  VRN_CHANGED = 'vrnChanged',
  END_TEST = 'endTest',
  NAVIGATION = 'navigation',
}

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
  @Input()
  abortSubject: Subject<void> = new Subject<void>();

  @Output()
  vehicleRegistrationChanged = new EventEmitter<{
    VRN: string;
    isAmended: boolean;
  }>();
  @Output()
  motFailedModalToggled = new EventEmitter<boolean>();
  @Output()
  motSearchingStatusChange = new EventEmitter<boolean>();
  @Output()
  alternateEvidenceChange = new EventEmitter<boolean>();
  @Output()
  vrnSearchListUpdate = new EventEmitter<string>();
  @Output()
  motDetailsUpdate = new EventEmitter<MotHistory>();
  @Output()
  motButtonPressed = new EventEmitter<void>();
  @Output()
  failedMOTModalOutcome = new EventEmitter<ModalEvent>();
  @Output()
  motCallAborted = new EventEmitter<MOTAbortedMethod>();
  @Output()
  motServiceUnavailable = new EventEmitter<HttpStatusCodes>();
  @Output()
  noMotData = new EventEmitter<boolean>();

  formControl: UntypedFormControl;
  motData: MotHistoryWithStatus = null;
  modalData: string = null;
  hasCalledMOT = false;
  isSearchingForMOT = false;
  isVRNAmended = false;
  practiceModeModalIsActive = false;

  readonly registrationNumberValidator: FieldValidators = getRegistrationNumberValidator();

  constructor(
    public motApiService: MotHistoryApiService,
    public modalController: ModalController,
    protected networkState: NetworkStateProvider,
    protected accessibilityService: AccessibilityService
  ) {}

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  clearData() {
    this.formGroup.removeControl('altEvidenceDetailsCtrl');
    this.formGroup.removeControl('alternateEvidenceCtrl');
    this.alternateEvidenceChange.emit(undefined);
    this.motDetailsUpdate.emit(undefined);
  }

  async getMOT(value: string) {
    this.motButtonPressed.emit();
    this.clearData();
    this.hasCalledMOT = false;
    this.updateIsSearchingForMOT(true);

    if (!this.isPracticeMode) {
      const apiCall$ = this.motApiService.getMotHistoryByIdentifier(value);

      apiCall$
        .pipe(
          takeUntil(this.abortSubject),
          finalize(() => {
            // Stop the search spinner
            this.updateIsSearchingForMOT(false);
          })
        )
        .subscribe(async (val) => {
          if (+val.status === HttpStatusCodes.NO_CONTENT) {
            this.noMotData.emit(true);
          }
          // Assign the API response to the motData property
          this.motData = val;
          // Emit the vehicle registration number to update the search list
          this.vrnSearchListUpdate.emit(value);

          // If the MOT status is not valid, open the reconfirm modal
          if (this.motData?.data?.status === MotStatusCodes.NOT_VALID) {
            await this.loadFailedMOTModal();
            // If the modal was cancelled, stop the spinner and return
            if (this.modalData === ModalEvent.CANCEL) {
              this.failedMOTModalOutcome.emit(ModalEvent.CANCEL);
              this.updateIsSearchingForMOT(false);
              return;
            }
            this.failedMOTModalOutcome.emit(ModalEvent.CONFIRM);
          }
          // Set the flag indicating that the MOT call has been made
          this.hasCalledMOT = true;
          // Stop the search spinner
          this.updateIsSearchingForMOT(false);
          // If motData is not null, emit the vehicle details
          if (this.motData) {
            this.motDetailsUpdate.emit(this.motData?.data);
          }
        });
    } else {
      this.practiceModeModalIsActive = true;
      // Load the practice mode modal and wait for the user's response
      const fakeModalReturn = await this.loadPracticeModeModal();
      this.practiceModeModalIsActive = false;

      // If the user indicates that the MOT failed, load the failed MOT modal
      if (fakeModalReturn === PracticeModeMOTType.FAILED) {
        await this.loadFailedMOTModal();
        // If the modal was cancelled, stop the spinner and return
        if (this.modalData === ModalEvent.CANCEL) {
          this.updateIsSearchingForMOT(false);
          return;
        }
      }

      // If the user cancelled the practice mode modal, reset motData and stop the spinner
      if (fakeModalReturn === ModalEvent.CANCEL) {
        this.updateIsSearchingForMOT(false);
        this.motData = null;
        return;
      }

      // Set the flag indicating that the MOT call has been made
      this.hasCalledMOT = true;

      // Make a mock API call to get the MOT result based on the practice mode response
      this.motApiService
        .getMockResultByIdentifier(value, fakeModalReturn as PracticeModeMOTType)
        .pipe(
          takeUntil(this.abortSubject),
          finalize(() => {
            // Stop the search spinner
            this.updateIsSearchingForMOT(false);
          })
        )
        .subscribe((val: MotHistoryWithStatus) => {
          // Assign the mock API response to the motData property
          this.motData = val;
        });

      if (this.motData) {
        this.motDetailsUpdate.emit(this.motData?.data);
        if (this.isSearchFailed()) {
          const statusCode = HttpStatusCodes[this.motData.status];
          this.motServiceUnavailable.emit(statusCode);
        }
      }
    }
  }

  updateIsSearchingForMOT(isSearching: boolean) {
    this.isSearchingForMOT = isSearching;
    this.motSearchingStatusChange.emit(this.isSearchingForMOT);
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
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  /**
   * Handles the input event for the vehicle registration field.
   *
   * This method clears existing data, aborts any ongoing MOT call if a search is in progress,
   * and validates the input value. If the input value contains non-alphanumeric characters,
   * they are removed. If the resulting value is empty, an error is set on the form control.
   * Finally, the vehicle registration value is updated and converted to uppercase.
   *
   * @param {any} event - The input event containing the new value for the vehicle registration field.
   */
  registrationInput(event: any): void {
    this.clearData();
    if (this.isSearchingForMOT) {
      this.abortMOTCall(MOTAbortedMethod.VRN_CHANGED);
    }
    this.hasCalledMOT = false;
    if (typeof event.target.value === 'string' && !this.registrationNumberValidator.pattern.test(event.target.value)) {
      event.target.value = event.target.value?.replace(nonAlphaNumericValues, '');

      if (isEmpty(event.target.value)) {
        this.formControl.setErrors({ invalidValue: event.target.value });
      }
    }
    this.vehicleRegistration = event.target.value?.toUpperCase();
  }

  isMOTNotValid() {
    return this.motData?.data?.status !== MotStatusCodes.NOT_VALID;
  }

  getMOTButtonColSize(zoomClass: string) {
    switch (zoomClass) {
      case 'text-zoom-x-large':
        return 37;
      case 'text-zoom-large':
        return 33;
      default:
        return 30;
    }
  }

  /**
   * Determines whether the MOT button should be disabled.
   *
   * The button is disabled if:
   * - The search spinner is currently shown.
   * - The form control is not valid.
   * - The network state is offline and it is not practice mode.
   *
   * @returns {boolean} - Returns true if the MOT button should be disabled, otherwise false.
   */
  shouldDisableMOTButton(): boolean {
    return !(
      !this.isSearchingForMOT &&
      this.formControl.valid &&
      (this.networkState.getNetworkState() === ConnectionStatus.ONLINE || this.isPracticeMode)
    );
  }

  /**
   * Aborts the ongoing MOT call.
   *
   * This method emits the `motCallAborted` event to notify that the MOT call has been aborted.
   */
  abortMOTCall(method: MOTAbortedMethod): void {
    this.motCallAborted.emit(method);
  }

  VRNChanged() {
    this.vehicleRegistrationChanged.emit({
      VRN: this.vehicleRegistration,
      isAmended: this.isVRNAmended,
    });
    if (!this.isVRNAmended) {
      this.isVRNAmended = true;
    }
  }

  isSearchFailed(): boolean {
    return (
      +this.motData.status === HttpStatusCodes.UNDEFINED ||
      +this.motData.status === HttpStatusCodes.INTERNAL_SERVER_ERROR ||
      +this.motData.status === HttpStatusCodes.BAD_GATEWAY ||
      +this.motData.status === HttpStatusCodes.SERVICE_UNAVAILABLE ||
      +this.motData.status === HttpStatusCodes.GATEWAY_TIMEOUT
    );
  }

  protected readonly ConnectionStatus = ConnectionStatus;
}
