import { select, Store } from '@ngrx/store';
import { merge, Observable, Subscription } from 'rxjs';
import {
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
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
import { ActivityCodeModel, activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import {
  CompleteTest,
  OfficeValidationError, OfficeViewDidEnter,
  SavingWriteUpForLater,
  TestStartDateChanged,
} from '@pages/office/office.actions';
import { JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
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
import { Identification, IndependentDriving, WeatherConditions } from '@dvsa/mes-test-schema/categories/common';
import {
  AdditionalInformationChanged,
  CandidateDescriptionChanged,
  IdentificationUsedChanged,
  IndependentDrivingTypeChanged, RouteNumberChanged, WeatherConditionsChanged,
} from '@store/tests/test-summary/test-summary.actions';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';

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
  activityCodeOptions: ActivityCodeModel[];

  protected constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public navController: NavController,
    public toastController: ToastController,
    public modalController: ModalController,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new FormGroup({});
    this.activityCodeOptions = activityCodeModelList;
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(OfficeViewDidEnter());
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

  async onSubmit() {
    if (await this.isFormValid()) {
      await this.showFinishTestModal();
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

  identificationChanged(identification: Identification): void {
    this.store$.dispatch(IdentificationUsedChanged(identification));
  }

  independentDrivingChanged(independentDriving: IndependentDriving): void {
    this.store$.dispatch(IndependentDrivingTypeChanged(independentDriving));
  }

  weatherConditionsChanged(weatherConditions: WeatherConditions[]): void {
    this.store$.dispatch(WeatherConditionsChanged(weatherConditions));
  }

  routeNumberChanged(routeNumber: number) {
    this.store$.dispatch(RouteNumberChanged(routeNumber));
  }

  candidateDescriptionChanged(candidateDescription: string) {
    this.store$.dispatch(CandidateDescriptionChanged(candidateDescription));
  }

  additionalInformationChanged(additionalInformation: string): void {
    this.store$.dispatch(AdditionalInformationChanged(additionalInformation));
  }

  activityCodeChanged(activityCodeModel: ActivityCodeModel) {
    const { showMeQuestion } = this.form.controls;
    if (showMeQuestion) {
      if (showMeQuestion.value && showMeQuestion.value.code === 'N/A') {
        this.form.controls['showMeQuestion'].setValue({});
      }
    }
    this.store$.dispatch(SetActivityCode(activityCodeModel.activityCode));
  }

  async popToRoot() {
    if (this.isPracticeMode) {
      this.exitPracticeMode();
      return;
    }
    await this.navController.navigateBack(JOURNAL_PAGE);
  }

  async goToReasonForRekey() {
    if (await this.isFormValid()) {
      await this.router.navigate([TestFlowPageNames.REKEY_REASON_PAGE]);
    }
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

  async showFinishTestModal() {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: FinishTestModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      componentProps: {},
    });
    await modal.present();
  }

}
