import { Component, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { IpadIssue, Other, Transfer } from '@dvsa/mes-test-schema/categories/common';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { JOURNAL_PAGE, REKEY_SEARCH_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { ExitRekeyModal } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal';
import { UploadRekeyModal } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal';
import { UploadRekeyModalEvent } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal.constants';
import { getRekeyReasonState } from '@pages/rekey-reason/rekey-reason.reducer';
import { selectIsCurrentTestFromRekeySearch } from '@pages/rekey-search/rekey-search.selector';
import { LoadingProvider } from '@providers/loader/loader';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';
import { getExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.reducer';
import { getExaminerKeyed } from '@store/tests/examiner-keyed/examiner-keyed.reducer';
import { SetRekeyDate } from '@store/tests/rekey-date/rekey-date.actions';
import {
  IpadIssueBrokenSelected,
  IpadIssueLostSelected,
  IpadIssueSelected,
  IpadIssueStolenSelected,
  IpadIssueTechFaultSelected,
  OtherReasonUpdated,
  OtherSelected,
  TransferSelected,
} from '@store/tests/rekey-reason/rekey-reason.actions';
import {
  getRekeyIpadIssue,
  getRekeyOther,
  getRekeyTransfer,
  getUploadStatus,
} from '@store/tests/rekey-reason/rekey-reason.selector';
import { EndRekey } from '@store/tests/rekey/rekey.actions';
import { SendCurrentTest } from '@store/tests/tests.actions';
import { selectCurrentTest } from '@store/tests/tests.selector';
import { ExitRekeyModalEvent } from './components/exit-rekey-modal/exit-rekey-modal.constants';
import { IpadIssueComponent } from './components/ipad-issue/ipad-issue';
import { OtherReasonComponent } from './components/other-reason/other-reason';
import { TransferComponent } from './components/transfer/transfer';
import {
  RekeyReasonViewDidEnter,
  RekeyUploadTest,
  ResetStaffNumberValidationError,
  ValidateTransferRekey,
} from './rekey-reason.actions';
import { RekeyReasonUploadModel } from './rekey-reason.model';

@Component({
  selector: '.rekey-reason-page',
  templateUrl: './rekey-reason.page.html',
  styleUrls: ['./rekey-reason.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonContent,
    IonCard,
    IonCardHeader,
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    IpadIssueComponent,
    TransferComponent,
    OtherReasonComponent,
    IonFooter,
    IonRow,
    IonCol,
    IonText,
  ],
})
export class RekeyReasonPage extends BasePageComponent {
  private static loadingOpts: LoadingOptions = {
    spinner: 'circles',
    message: 'Uploading...',
  };
  formGroup: UntypedFormGroup;
  subscription: Subscription = Subscription.EMPTY;
  isStaffNumberInvalid = false;
  uploadButtonPressed = false;
  private readonly currentTest = this.store$.selectSignal(selectCurrentTest);
  private readonly reasonForRekey = computed(() => this.currentTest().rekeyReason);
  readonly ipadIssue = computed(() => getRekeyIpadIssue(this.reasonForRekey()));
  readonly transfer = computed(() => getRekeyTransfer(this.reasonForRekey()));
  readonly other = computed(() => getRekeyOther(this.reasonForRekey()));
  isTransferSelected = computed(() => this.transfer().selected);
  readonly examinerConducted = computed(() => getExaminerConducted(this.currentTest()));
  readonly examinerKeyed = computed(() => getExaminerKeyed(this.currentTest()));
  fromRekeySearch = this.store$.selectSignal(selectIsCurrentTestFromRekeySearch);

  constructor(
    public store$: Store<StoreModel>,
    private modalController: ModalController,
    private loaderService: LoadingProvider
  ) {
    super();
    this.formGroup = new UntypedFormGroup({});
  }

  ionViewWillEnter(): boolean {
    this.uploadButtonPressed = false;
    this.subscription.unsubscribe();
    this.subscription = this.store$
      .pipe(select(getRekeyReasonState), select(getUploadStatus))
      .subscribe(this.handleUploadOutcome);
    return true;
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(RekeyReasonViewDidEnter());
  }

  ionViewDidLeave(): void {
    this.uploadButtonPressed = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onUploadPressed = async (): Promise<void> => {
    if (this.isFormValid()) {
      await this.onShowUploadRekeyModal();
    }
  };

  onShowUploadRekeyModal = async (retryMode = false): Promise<void> => {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: UploadRekeyModal,
      componentProps: { retryMode },
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await modal.present();

    const { data } = await modal.onDidDismiss<UploadRekeyModalEvent>();
    this.onUploadRekeyModalDismiss(data);
  };

  onUploadRekeyModalDismiss = (event: UploadRekeyModalEvent): void => {
    switch (event) {
      case UploadRekeyModalEvent.UPLOAD:
        this.uploadButtonPressed = true;
        this.store$.dispatch(SetRekeyDate());
        if (this.isTransferSelected()) {
          this.store$.dispatch(ValidateTransferRekey());
        } else {
          this.store$.dispatch(RekeyUploadTest());
          this.store$.dispatch(SendCurrentTest());
        }
        break;
      default:
    }
  };

  handleUploadOutcome = async (uploadStatus: RekeyReasonUploadModel) => {
    await this.loaderService.handleUILoading(uploadStatus.isUploading, RekeyReasonPage.loadingOpts);
    this.isStaffNumberInvalid = uploadStatus.hasStaffNumberFailedValidation;

    if (!this.uploadButtonPressed) {
      return null;
    }

    if (uploadStatus.hasUploadSucceeded || uploadStatus.isDuplicate) {
      this.uploadButtonPressed = false;
      await this.router.navigate([TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE]);
      return;
    }
    if (uploadStatus.hasUploadFailed) {
      await this.onShowUploadRekeyModal(true);
    }
    return null;
  };

  isFormValid(): boolean {
    this.markSpecificControlsAsDirty();
    return this.formGroup.valid;
  }

  markSpecificControlsAsDirty(): void {
    // based upon what is selected, only mark controls dirty in the specific component
    if (this.formGroup.get('ipadIssueSelected').value) {
      this.formGroup.get('ipadIssueTechnicalFault').markAsDirty();
      this.formGroup.get('ipadIssueLost').markAsDirty();
      this.formGroup.get('ipadIssueStolen').markAsDirty();
      this.formGroup.get('ipadIssueBroken').markAsDirty();
    }

    if (this.formGroup.get('transferSelected').value) {
      this.formGroup.get('staffNumber').markAsDirty();
    }

    if (this.formGroup.get('otherSelected').value) {
      this.formGroup.get('reason').markAsDirty();
    }
  }

  ipadIssueSelected(checked: boolean): void {
    this.store$.dispatch(IpadIssueSelected(checked));
  }

  ipadIssueTechnicalFaultChanged(): void {
    this.store$.dispatch(IpadIssueTechFaultSelected());
  }

  ipadIssueLostChanged(): void {
    this.store$.dispatch(IpadIssueLostSelected());
  }

  ipadIssueStolenChanged(): void {
    this.store$.dispatch(IpadIssueStolenSelected());
  }

  ipadIssueBrokenChanged(): void {
    this.store$.dispatch(IpadIssueBrokenSelected());
  }

  otherSelected(checked: boolean): void {
    this.store$.dispatch(OtherSelected(checked));
  }

  otherReasonChanged(reason: string): void {
    this.store$.dispatch(OtherReasonUpdated(reason));
  }

  transferSelected(isChecked: boolean): void {
    this.store$.dispatch(TransferSelected(isChecked));

    if (isChecked) {
      this.store$.dispatch(SetExaminerConducted(null));
    } else {
      this.store$.dispatch(SetExaminerConducted(this.examinerKeyed())); // reset to current user
      this.store$.dispatch(ResetStaffNumberValidationError());
    }
  }

  staffNumberChanged(staffNumber: number): void {
    if (this.isStaffNumberInvalid) {
      this.store$.dispatch(ResetStaffNumberValidationError());
    }
    this.store$.dispatch(SetExaminerConducted(staffNumber));
  }

  async onExitRekeyPressed(): Promise<void> {
    await this.showExitRekeyModal();
  }

  async showExitRekeyModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: ExitRekeyModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    await this.onExitRekeyModalDismiss(data);
  }

  onExitRekeyModalDismiss = async (event: ExitRekeyModalEvent): Promise<void> => {
    switch (event) {
      case ExitRekeyModalEvent.EXIT_REKEY:
        await this.exitRekey();
        break;
      default:
    }
  };

  exitRekey = async (): Promise<void> => {
    if (this.fromRekeySearch()) {
      await this.router.navigate([REKEY_SEARCH_PAGE]);
    } else {
      await this.router.navigate([JOURNAL_PAGE]);
    }
    this.store$.dispatch(EndRekey());
  };

  canClickUploadRekeyTest = (ipadIssue: IpadIssue, transfer: Transfer, other: Other): boolean =>
    !!(ipadIssue?.selected || transfer?.selected || other?.selected);
}
