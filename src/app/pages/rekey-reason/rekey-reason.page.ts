import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  Platform,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, merge, Subscription } from 'rxjs';
import { IpadIssue, Transfer, Other } from '@dvsa/mes-test-schema/categories/common';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { UntypedFormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import {
  map,
  withLatestFrom,
} from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { LoadingOptions } from '@ionic/core';

import { JOURNAL_PAGE, REKEY_SEARCH_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { UploadRekeyModalEvent } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal.constants';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { BasePageComponent } from '@shared/classes/base-page';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import {
  getReasonForRekey,
  getRekeyIpadIssue,
  getRekeyOther,
  getRekeyTransfer, getUploadStatus,
} from '@store/tests/rekey-reason/rekey-reason.selector';
import { getExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.reducer';
import { getExaminerKeyed } from '@store/tests/examiner-keyed/examiner-keyed.reducer';
import { SetRekeyDate } from '@store/tests/rekey-date/rekey-date.actions';
import { SendCurrentTest } from '@store/tests/tests.actions';
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
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';
import { EndRekey } from '@store/tests/rekey/rekey.actions';
import { getRekeyReasonState } from '@pages/rekey-reason/rekey-reason.reducer';
import { UploadRekeyModal } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal';
import { ExitRekeyModal } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal';
import { getRekeySearchState } from '@pages/rekey-search/rekey-search.reducer';
import { getBookedTestSlot } from '@pages/rekey-search/rekey-search.selector';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { LoadingProvider } from '@providers/loader/loader';
import { ExitRekeyModalEvent } from './components/exit-rekey-modal/exit-rekey-modal.constants';
import { RekeyReasonUploadModel } from './rekey-reason.model';
import {
  ValidateTransferRekey,
  RekeyReasonViewDidEnter,
  ResetStaffNumberValidationError,
  RekeyUploadTest,
} from './rekey-reason.actions';

interface RekeyReasonPageState {
  uploadStatus$: Observable<RekeyReasonUploadModel>;
  ipadIssue$: Observable<IpadIssue>;
  transfer$: Observable<Transfer>;
  other$: Observable<Other>;
  examinerConducted$: Observable<number>;
  examinerKeyed$: Observable<number>;
  fromRekeySearch$: Observable<boolean>;
}

@Component({
  selector: '.rekey-reason-page',
  templateUrl: './rekey-reason.page.html',
  styleUrls: ['./rekey-reason.page.scss'],
})
export class RekeyReasonPage extends BasePageComponent implements OnInit {

  private static loadingOpts: LoadingOptions = { spinner: 'circles', message: 'Uploading...' };
  formGroup: UntypedFormGroup;
  pageState: RekeyReasonPageState;
  subscription: Subscription = Subscription.EMPTY;
  isStaffNumberInvalid: boolean = false;
  isTransferSelected: boolean = false;
  examinerConducted: number = null;
  examinerKeyed: number = null;
  fromRekeySearch: boolean = false;
  merged$: Observable<any>;

  constructor(
    public router: Router,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public store$: Store<StoreModel>,
    private modalController: ModalController,
    private loaderService: LoadingProvider,
  ) {
    super(platform, authenticationProvider, router);
    this.formGroup = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      uploadStatus$: this.store$.pipe(
        select(getRekeyReasonState),
        select(getUploadStatus),
      ),
      ipadIssue$: currentTest$.pipe(
        select(getReasonForRekey),
        select(getRekeyIpadIssue),
      ),
      transfer$: currentTest$.pipe(
        select(getReasonForRekey),
        select(getRekeyTransfer),
      ),
      other$: currentTest$.pipe(
        select(getReasonForRekey),
        select(getRekeyOther),
      ),
      examinerConducted$: currentTest$.pipe(
        select(getExaminerConducted),
      ),
      examinerKeyed$: currentTest$.pipe(
        select(getExaminerKeyed),
      ),
      // experimental! used to work out if the test you are testing is the one you searched for
      // navCtrl no longer has getViews method so cant use DES3 approach
      fromRekeySearch$: this.store$.pipe(
        select(getRekeySearchState),
        map(getBookedTestSlot),
        withLatestFrom(currentTest$.pipe(
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        )),
        map(([testSlot, appRef]: [TestSlot, string]) => {
          if (isEmpty(testSlot)) {
            return false;
          }
          return formatApplicationReference(testSlot?.booking?.application) === appRef;
        }),
      ),
    };

    const {
      uploadStatus$, examinerConducted$, examinerKeyed$, transfer$, fromRekeySearch$,
    } = this.pageState;

    this.merged$ = merge(
      uploadStatus$.pipe(map(this.handleUploadOutcome)),
      examinerConducted$.pipe(map((val) => this.examinerConducted = val)),
      examinerKeyed$.pipe(map((val) => this.examinerKeyed = val)),
      transfer$.pipe(map((transfer) => this.isTransferSelected = transfer.selected)),
      fromRekeySearch$.pipe(map((val) => this.fromRekeySearch = val)),
    );
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    return true;
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(RekeyReasonViewDidEnter());
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onUploadPressed = async (): Promise<void> => {
    if (this.isFormValid()) {
      await this.onShowUploadRekeyModal();
    }
  };

  onShowUploadRekeyModal = async (retryMode: boolean = false): Promise<void> => {
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
        this.store$.dispatch(SetRekeyDate());
        if (this.isTransferSelected) {
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

    if (uploadStatus.hasUploadSucceeded || uploadStatus.isDuplicate) {
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
      this.store$.dispatch(SetExaminerConducted(this.examinerKeyed)); // reset to current user
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
    if (this.fromRekeySearch) {
      await this.router.navigate([REKEY_SEARCH_PAGE]);
    } else {
      await this.router.navigate([JOURNAL_PAGE]);
    }
    this.store$.dispatch(EndRekey());
  };

  canClickUploadRekeyTest = (
    ipadIssue: IpadIssue,
    transfer: Transfer,
    other: Other,
  ): boolean => !!(ipadIssue?.selected || transfer?.selected || other?.selected);

}
