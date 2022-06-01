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
import { DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE, JOURNAL_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { PersistTests, SendCurrentTest } from '@store/tests/tests.actions';
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
import { map, withLatestFrom } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { getNewTestStartTime } from '@shared/helpers/test-start-time';
import { SetStartDate } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.actions';
import {
  GearboxCategory,
  Identification,
  IndependentDriving,
  WeatherConditions,
} from '@dvsa/mes-test-schema/categories/common';
import {
  AdditionalInformationChanged,
  CandidateDescriptionChanged, D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed,
  IdentificationUsedChanged,
  IndependentDrivingTypeChanged,
  RouteNumberChanged, TrueLikenessToPhotoChanged,
  WeatherConditionsChanged,
} from '@store/tests/test-summary/test-summary.actions';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import {
  getAdditionalInformation,
  getCandidateDescription, getD255, getIdentification,
  getIndependentDriving,
  getRouteNumber, getTrueLikenessToPhoto, getWeatherConditions, isDebriefWitnessed,
} from '@store/tests/test-summary/test-summary.selector';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  getEco, getEcoFaultText, getETA, getETAFaultText,
} from '@store/tests/test-data/common/test-data.selector';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { WeatherConditionSelection } from '@providers/weather-conditions/weather-conditions.model';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import {
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import {
  DualControlsToggled,
  GearboxCategoryChanged,
  SchoolBikeToggled,
  SchoolCarToggled,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { HealthDeclarationAccepted } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { getPostTestDeclarations } from '@store/tests/post-test-declarations/post-test-declarations.reducer';
import { getHealthDeclarationStatus } from '@store/tests/post-test-declarations/post-test-declarations.selector';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import { getPassCertificateNumber } from '@store/tests/pass-completion/pass-completion.selector';
import { TestOutcome } from '@store/tests/tests.constants';
import {
  InstructorAccompanimentToggled, InterpreterAccompanimentToggled, OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
} from '@store/tests/accompaniment/accompaniment.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.reducer';
import { getDualControls, getSchoolCar } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.selector';
import { getAccompaniment } from '@store/tests/accompaniment/accompaniment.reducer';
import {
  getInstructorAccompaniment, getInterpreterAccompaniment, getOtherAccompaniment,
  getSupervisorAccompaniment,
} from '@store/tests/accompaniment/accompaniment.selector';
import { Circuit } from '@dvsa/mes-test-schema/categories/AM1';
import { CircuitTypeChanged } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import {
  InterpreterAccompanimentToggledCPC,
  SupervisorAccompanimentToggledCPC,
} from '@store/tests/accompaniment/cat-cpc/accompaniment.cat-cpc.actions';
import { SetRekeyDate } from '@store/tests/rekey-date/rekey-date.actions';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';

export interface CommonOfficePageState {
  activityCode$: Observable<ActivityCodeModel>;
  isRekey$: Observable<boolean>;
  startTime$: Observable<string>;
  startDate$: Observable<string>;
  startDateTime$: Observable<string>;
  testOutcome$: Observable<string>;
  testOutcomeText$: Observable<TestOutcome>;
  isPassed$: Observable<boolean>;
  isTestOutcomeSet$: Observable<boolean>;
  candidateName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  routeNumber$: Observable<number>;
  displayRouteNumber$: Observable<boolean>;
  displayIndependentDriving$: Observable<boolean>;
  displayCandidateDescription$: Observable<boolean>;
  displayIdentification$: Observable<boolean>;
  weatherConditions$: Observable<WeatherConditions[]>;
  displayAdditionalInformation$: Observable<boolean>;
  displayEco$: Observable<boolean>;
  displayEta$: Observable<boolean>;
  candidateDescription$: Observable<string>;
  independentDriving$: Observable<IndependentDriving>;
  identification$: Observable<Identification>;
  trueLikenessToPhoto$: Observable<boolean>;
  additionalInformation$: Observable<string>;
  displayWeatherConditions$: Observable<boolean>;
  displayDrivingFault$: Observable<boolean>;
  displaySeriousFault$: Observable<boolean>;
  displayDangerousFault$: Observable<boolean>;
  drivingFaults$: Observable<FaultSummary[]>;
  drivingFaultCount$: Observable<number>;
  dangerousFaults$: Observable<FaultSummary[]>;
  seriousFaults$: Observable<FaultSummary[]>;
  applicationNumber$: Observable<string>;
  healthDeclarationAccepted$: Observable<boolean>;
  d255$: Observable<boolean>;
  debriefWitnessed$: Observable<boolean>;
  passCertificateNumber$: Observable<string>;
  etaFaults$: Observable<string>;
  ecoFaults$: Observable<string>;
  seriousFaultCount$: Observable<number>;
  dangerousFaultCount$: Observable<number>;
  schoolCar$: Observable<boolean>;
  dualControls$: Observable<boolean>;
  instructorAccompaniment$: Observable<boolean>;
  supervisorAccompaniment$: Observable<boolean>;
  otherAccompaniment$: Observable<boolean>;
  interpreterAccompaniment$: Observable<boolean>;
}

export abstract class OfficeBasePageComponent extends PracticeableBasePageComponent {

  commonPageState: CommonOfficePageState;
  form: FormGroup;
  toast: HTMLIonToastElement;
  subscription: Subscription;
  startDateTime: string;
  isValidStartDateTime: boolean = true;
  activityCodeOptions: ActivityCodeModel[];
  weatherConditions: WeatherConditionSelection[];
  finishTestModal: HTMLIonModalElement;

  protected constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public navController: NavController,
    public toastController: ToastController,
    public modalController: ModalController,
    public outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    public weatherConditionProvider: WeatherConditionProvider,
    public faultSummaryProvider: FaultSummaryProvider,
    public faultCountProvider: FaultCountProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new FormGroup({});
    this.activityCodeOptions = activityCodeModelList;
    this.weatherConditions = this.weatherConditionProvider.getWeatherConditions();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(OfficeViewDidEnter());
  }

  onInitialisation(): void {
    super.ngOnInit();
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );
    const category$ = currentTest$.pipe(
      select(getTestCategory),
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
      routeNumber$: currentTest$.pipe(
        select(getTestSummary),
        select(getRouteNumber),
      ),
      displayRouteNumber$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getRouteNumber),
        )),
        map(([outcome, route]) => this.outcomeBehaviourProvider.isVisible(outcome, 'routeNumber', route)),
      ),
      displayIndependentDriving$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getIndependentDriving),
        )),
        map(([outcome, independent]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'independentDriving', independent)),
      ),
      displayCandidateDescription$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getCandidateDescription),
        )),
        map(([outcome, candidate]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'candidateDescription', candidate)),
      ),
      displayIdentification$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getIdentification),
        )),
        map(([outcome, identification]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'identification', identification)),
      ),
      trueLikenessToPhoto$: currentTest$.pipe(
        select(getTestSummary),
        select(getTrueLikenessToPhoto),
      ),
      displayWeatherConditions$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getWeatherConditions),
        )),
        map(([outcome, weather]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'weatherConditions', weather)),
      ),
      displayAdditionalInformation$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getAdditionalInformation),
        )),
        map(([outcome, additional]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'additionalInformation', additional)),
      ),
      displayEco$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestData),
          select(getEco),
        )),
        map(([outcome, eco]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'eco', eco)),
      ),
      displayEta$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestData),
          select(getETA),
        )),
        map(([outcome, eta]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'eta', eta)),
      ),
      candidateDescription$: currentTest$.pipe(
        select(getTestSummary),
        select(getCandidateDescription),
      ),
      independentDriving$: currentTest$.pipe(
        select(getTestSummary),
        select(getIndependentDriving),
      ),
      identification$: currentTest$.pipe(
        select(getTestSummary),
        select(getIdentification),
      ),
      additionalInformation$: currentTest$.pipe(
        select(getTestSummary),
        select(getAdditionalInformation),
      ),
      weatherConditions$: currentTest$.pipe(
        select(getTestSummary),
        select(getWeatherConditions),
      ),
      displayDrivingFault$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(
          currentTest$.pipe(select(getTestData)),
          category$,
        ),
        map(([outcome, testData, category]) =>
          this.outcomeBehaviourProvider.isVisible(
            outcome,
            'faultComment',
            this.faultSummaryProvider.getDrivingFaultsList(testData, category as TestCategory),
          )),
      ),
      displaySeriousFault$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(
          currentTest$.pipe(select(getTestData)),
          category$,
        ),
        map(([outcome, testData, category]) =>
          this.outcomeBehaviourProvider.isVisible(
            outcome,
            'faultComment',
            this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory),
          )),
      ),
      displayDangerousFault$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(
          currentTest$.pipe(select(getTestData)),
          category$,
        ),
        map(([outcome, testData, category]) =>
          this.outcomeBehaviourProvider.isVisible(
            outcome,
            'faultComment',
            this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory),
          )),
      ),
      dangerousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) =>
          this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)),
      ),
      seriousFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) =>
          this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)),
      ),
      drivingFaults$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) =>
          this.faultSummaryProvider.getDrivingFaultsList(testData, category as TestCategory)),
      ),
      drivingFaultCount$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) => {
          return this.faultCountProvider.getDrivingFaultSumCount(category as TestCategory, testData);
        }),
      ),
      seriousFaultCount$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([data, category]) =>
          this.faultCountProvider.getSeriousFaultSumCount(category as TestCategory, data)),
      ),
      dangerousFaultCount$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([data, category]) => this.faultCountProvider.getDangerousFaultSumCount(category as TestCategory, data)),
      ),
      applicationNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getApplicationReference),
        select(getApplicationNumber),
      ),
      healthDeclarationAccepted$: currentTest$.pipe(
        select(getPostTestDeclarations),
        select(getHealthDeclarationStatus),
      ),
      d255$: currentTest$.pipe(
        select(getTestSummary),
        select(getD255),
      ),
      debriefWitnessed$: currentTest$.pipe(
        select(getTestSummary),
        select(isDebriefWitnessed),
      ),
      passCertificateNumber$: currentTest$.pipe(
        select(getPassCompletion),
        select(getPassCertificateNumber),
      ),
      etaFaults$: currentTest$.pipe(
        select(getTestData),
        select(getETA),
        select(getETAFaultText),
      ),
      ecoFaults$: currentTest$.pipe(
        select(getTestData),
        select(getEco),
        select(getEcoFaultText),
      ),
      schoolCar$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getSchoolCar),
      ),
      dualControls$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getDualControls),
      ),
      instructorAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getInstructorAccompaniment),
      ),
      supervisorAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getSupervisorAccompaniment),
      ),
      otherAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getOtherAccompaniment),
      ),
      interpreterAccompaniment$: currentTest$.pipe(
        select(getAccompaniment),
        select(getInterpreterAccompaniment),
      ),
    };
  }

  setupSubscriptions() {
    const {
      startDateTime$,
    } = this.commonPageState;

    this.subscription = merge(
      startDateTime$.pipe(map((value) => this.startDateTime = value)),
    ).subscribe();
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onSubmit(isDelegated: boolean = false) {
    if (await this.isFormValid()) {
      await this.showFinishTestModal(isDelegated);
    }
  }

  destroyTestSubs = (): void => {
    // At this point in a test, you can not go back at all in the journey - therefore shutdown any subscriptions
    // where takeUntil(wrtcDestroy$) or takeUntil(trDestroy$) has been piped onto.

    // Waiting room to car
    wrtcDestroy$.next();
    wrtcDestroy$.complete();
    // Test report
    trDestroy$.next();
    trDestroy$.complete();
  };

  setIsValidStartDateTime(isValid: boolean) {
    this.isValidStartDateTime = isValid;
  }

  dateOfTestChanged(inputDate: string) {
    const customStartDate = getNewTestStartTime(inputDate, this.startDateTime);
    this.store$.dispatch(TestStartDateChanged(this.startDateTime, customStartDate));
    this.store$.dispatch(SetStartDate(customStartDate));
  }

  completeTest = async (): Promise<void> => {
    if (!this.isEndToEndPracticeMode) {
      this.store$.dispatch(CompleteTest());
    }
    await this.finishTestModal.dismiss();
    await this.popToRoot();
  };

  completeTestDelegated = async (): Promise<void> => {
    this.store$.dispatch(SetRekeyDate());
    this.store$.dispatch(SendCurrentTest());
    await this.finishTestModal.dismiss();
    await this.router.navigate([DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE], { replaceUrl: true });
  };

  identificationChanged(identification: Identification): void {
    this.store$.dispatch(IdentificationUsedChanged(identification));
  }

  trueLikenessToPhotoChanged(trueLikeness: boolean): void {
    this.store$.dispatch(TrueLikenessToPhotoChanged(trueLikeness));
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

  provisionalLicenseReceived(): void {
    this.store$.dispatch(ProvisionalLicenseReceived());
  }

  provisionalLicenseNotReceived(): void {
    this.store$.dispatch(ProvisionalLicenseNotReceived());
  }

  transmissionChanged(transmission: GearboxCategory): void {
    this.store$.dispatch(GearboxCategoryChanged(transmission));
  }

  healthDeclarationChanged(healthSigned: boolean): void {
    this.store$.dispatch(HealthDeclarationAccepted(healthSigned));
  }

  d255Changed(d255: boolean): void {
    this.store$.dispatch(d255 ? D255Yes() : D255No());
  }

  isWelshChanged(isWelsh: boolean) {
    this.store$.dispatch(
      isWelsh
        ? CandidateChoseToProceedWithTestInWelsh('Cymraeg')
        : CandidateChoseToProceedWithTestInEnglish('English'),
    );
  }

  supervisorAccompanimentToggledCPC(): void {
    this.store$.dispatch(SupervisorAccompanimentToggledCPC());
  }

  interpreterAccompanimentToggledCPC(): void {
    this.store$.dispatch(InterpreterAccompanimentToggledCPC());
  }

  instructorAccompanimentToggled(): void {
    this.store$.dispatch(InstructorAccompanimentToggled());
  }

  supervisorAccompanimentToggled(): void {
    this.store$.dispatch(SupervisorAccompanimentToggled());
  }

  interpreterAccompanimentToggled(): void {
    this.store$.dispatch(InterpreterAccompanimentToggled());
  }

  schoolBikeToggled(): void {
    this.store$.dispatch(SchoolBikeToggled());
  }

  otherAccompanimentToggled(): void {
    this.store$.dispatch(OtherAccompanimentToggled());
  }

  dualControlsToggled(): void {
    this.store$.dispatch(DualControlsToggled());
  }

  schoolCarToggled(): void {
    this.store$.dispatch(SchoolCarToggled());
  }

  circuitChanged(circuit: Circuit): void {
    this.store$.dispatch(CircuitTypeChanged(circuit));
  }

  debriefWitnessedChanged(debriefWitnessed: boolean) {
    this.store$.dispatch(debriefWitnessed ? DebriefWitnessed() : DebriefUnWitnessed());
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

  async popToRoot(): Promise<void> {
    if (this.isEndToEndPracticeMode) {
      await this.exitPracticeMode();
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

  async showFinishTestModal(isDelegated: boolean = false) {
    this.finishTestModal = await this.modalController.create({
      id: 'FinishTestModal',
      component: FinishTestModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        completeTest: isDelegated ? this.completeTestDelegated : this.completeTest,
        destroyTestSubs: this.destroyTestSubs,
      },
    });
    await this.finishTestModal.present();
  }

}
