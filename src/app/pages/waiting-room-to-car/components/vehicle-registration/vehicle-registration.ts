import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal.constants';
import { MotFailedModal } from '@pages/waiting-room-to-car/components/mot-components/mot-failed-modal/mot-failed-modal.component';
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
import { isEmpty } from 'lodash-es';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

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
  didAbortMotCall = false;
  @Input()
  abortSubject: Subject<void> = new Subject<void>();

  @Output()
  vehicleRegistrationChange = new EventEmitter<string>();
  @Output()
  motFailedModalToggled = new EventEmitter<boolean>();
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
  isSearchingForMOT = false;

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
    this.formGroup.removeControl('evidenceDescriptionCtrl');
    this.formGroup.removeControl('alternateEvidenceCtrl');
    this.alternateEvidenceChange.emit(undefined);
    this.motDetailsUpdate.emit(undefined);
  }

  async getMOT(value: string) {
    this.clearData();
    this.hasCalledMOT = false;
    this.isSearchingForMOT = true;

    if (!this.isPracticeMode) {
      this.didAbortMotCall = false;
      const apiCall$ = this.motApiService.getMotHistoryByIdentifier(value);

      apiCall$
        .pipe(
          takeUntil(this.abortSubject),
          finalize(() => {
            // Code to run after takeUntil activates or the observable completes
            if (this.didAbortMotCall) {
              // Stop the search spinner
              this.isSearchingForMOT = false;
            }
          })
        )
        .subscribe(async (val) => {
          // Assign the API response to the motData property
          this.motData = val;
          // Emit the vehicle registration number to update the search list
          this.vrnSearchListUpdate.emit(value);

          // If the MOT status is not valid, open the reconfirm modal
          if (this.motData?.data?.status === MotStatusCodes.NOT_VALID) {
            await this.loadFailedMOTModal();
            // If the modal was cancelled, stop the spinner and return
            if (this.modalData === ModalEvent.CANCEL) {
              this.isSearchingForMOT = false;
              return;
            }
          }

          // Set the flag indicating that the MOT call has been made
          this.hasCalledMOT = true;
          // Stop the search spinner
          this.isSearchingForMOT = false;
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
          this.isSearchingForMOT = false;
          return;
        }
      }

      // If the user cancelled the practice mode modal, reset motData and stop the spinner
      if (fakeModalReturn === ModalEvent.CANCEL) {
        this.motData = null;
        this.isSearchingForMOT = false;
        return;
      }

      // Set the flag indicating that the MOT call has been made
      this.hasCalledMOT = true;
      // Stop the search spinner
      this.isSearchingForMOT = false;

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
    }
    this.formControl.patchValue(this.vehicleRegistration);
  }

  vehicleRegistrationChanged(event: any): void {
    this.clearData();
    if (this.isSearchingForMOT) {
      this.abortMOTCall();
    }
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

  protected readonly ConnectionStatus = ConnectionStatus;

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
      (this.networkState.getNetworkState() == ConnectionStatus.ONLINE || this.isPracticeMode)
    );
  }

  /**
   * Aborts the ongoing MOT call.
   *
   * This method sets the `didAbortMotCall` flag to true and emits a value from the `abortSubject`,
   * which is used to signal the abortion of the ongoing HTTP request.
   */
  abortMOTCall() {
    this.didAbortMotCall = true;
    this.abortSubject.next();
  }
}
