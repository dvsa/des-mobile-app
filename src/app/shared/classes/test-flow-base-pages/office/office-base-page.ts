import { select, Store } from '@ngrx/store';
import { merge, Observable, Subscription } from 'rxjs';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import {
  getCurrentTest,
  getActivityCode,
  getTestOutcome,
  getTestOutcomeText,
  isPassed, isTestOutcomeSet, getJournalData,
} from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import {
  CompleteTest,
  OfficeValidationError,
  SavingWriteUpForLater,
  TestStartDateChanged,
} from '@pages/office/office.actions';
import { JOURNAL_PAGE } from '@pages/page-names.constants';
import { PersistTests } from '@store/tests/tests.actions';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { getTestSlotAttributes }
  from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import {
  getTestDate, getTestStartDateTime,
  getTestTime,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { getNewTestStartTime } from '@shared/helpers/test-start-time';
import { SetStartDate } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.actions';

export interface CommonOfficePageState {
  activityCode$: Observable<ActivityCodeModel>;
  isRekey$: Observable<boolean>;
  startTime$: Observable<string>;
  startDate$: Observable<string>;
  startDateTime$: Observable<string>;
  testOutcome$: Observable<string>;
  testOutcomeText$: Observable<string>;
  isPassed$: Observable<boolean>;
  isTestOutcomeSet$: Observable<boolean>;
  candidateName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
}

export abstract class OfficeBasePageComponent extends PracticeableBasePageComponent {

  commonPageState: CommonOfficePageState;
  form: FormGroup;
  toast: any;
  subscription: Subscription;
  startDateTime: string;
  isValidStartDateTime: boolean = true;

  protected constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public navController: NavController,
    public toastController: ToastController,
  ) {
    super(platform, authenticationProvider, router, store$);
  }

  onInitialisation(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.commonPageState = {
      activityCode$: currentTest$.pipe(
        select(getActivityCode),
      ),
      isRekey$: currentTest$.pipe(
        select(getRekeyIndicator),
        select(isRekey),
      ),
      testOutcome$: currentTest$.pipe(
        select(getTestOutcome),
      ),
      testOutcomeText$: currentTest$.pipe(
        select(getTestOutcomeText),
      ),
      isPassed$: currentTest$.pipe(
        select(isPassed),
      ),
      isTestOutcomeSet$: currentTest$.pipe(
        select(isTestOutcomeSet),
      ),
      startTime$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(getTestTime),
      ),
      startDate$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(getTestDate),
      ),
      startDateTime$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(getTestStartDateTime),
      ),
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateName),
      ),
      candidateDriverNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
        map(formatDriverNumber),
      ),
    };
  }

  setupSubscriptions() {
    const {
      startDateTime$,
    } = this.commonPageState;
    this.subscription = merge(
      startDateTime$.pipe(map((value) => this.startDateTime = value)),
    )
      .subscribe();
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setIsValidStartDateTime(isValid: boolean) {
    this.isValidStartDateTime = isValid;
  }

  dateOfTestChanged(inputDate: string) {
    const customStartDate = getNewTestStartTime(inputDate, this.startDateTime);
    this.store$.dispatch(TestStartDateChanged(this.startDateTime, customStartDate));
    this.store$.dispatch(SetStartDate(customStartDate));
  }

  async completeTest() {
    if (!this.isPracticeMode) {
      this.store$.dispatch(CompleteTest());
    }
    await this.popToRoot();
  }

  async popToRoot() {
    if (this.isPracticeMode) {
      this.exitPracticeMode();
      return;
    }
    await this.navController.navigateBack(JOURNAL_PAGE);
  }

  async defer() {
    await this.popToRoot();
    this.store$.dispatch(SavingWriteUpForLater());
    this.store$.dispatch(PersistTests());
  }

  async isFormValid() {
    Object.keys(this.form.controls)
      .forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (this.form.valid) {
      return true;
    }
    Object.keys(this.form.controls)
      .forEach((controlName) => {
        if (this.form.controls[controlName].invalid) {
          this.store$.dispatch(OfficeValidationError(`${controlName} is blank`));
        }
      });
    await this.createToast('Fill all mandatory fields');
    this.toast.present();
    return false;
  }

  private createToast = async (errorMessage: string) => {
    this.toast = await this.toastController.create({
      message: errorMessage,
      position: 'top',
      cssClass: 'mes-toast-message-error',
      duration: 5000,
      buttons: [{
        text: 'X',
        role: 'cancel',
      }],
    });
  };

}
