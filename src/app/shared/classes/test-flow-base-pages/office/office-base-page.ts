import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ActivityCodeModel, activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import {
  getActivityCode,
  getJournalData,
  getTestOutcome,
  getTestOutcomeText,
  isPassed,
  isTestOutcomeSet,
  selectCurrentTest,
} from '@store/tests/tests.selector';

import { Inject, Signal, computed, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Circuit } from '@dvsa/mes-test-schema/categories/AM1';
import {
  GearboxCategory,
  Identification,
  IndependentDriving,
  WeatherConditions,
} from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import {
  CompleteTest,
  OfficeValidationError,
  OfficeViewDidEnter,
  SavingWriteUpForLater,
  TestStartDateChanged,
} from '@pages/office/office.actions';
import {
  DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE,
  JOURNAL_PAGE,
  TestFlowPageNames,
  UNUPLOADED_TESTS_PAGE,
} from '@pages/page-names.constants';
import { DeviceProvider } from '@providers/device/device';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { WeatherConditionSelection } from '@providers/weather-conditions/weather-conditions.model';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { getNewTestStartTime } from '@shared/helpers/test-start-time';
import {
  InstructorAccompanimentToggled,
  InterpreterAccompanimentToggled,
  OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
} from '@store/tests/accompaniment/accompaniment.actions';
import { getAccompaniment } from '@store/tests/accompaniment/accompaniment.reducer';
import {
  getInstructorAccompaniment,
  getInterpreterAccompaniment,
  getOtherAccompaniment,
  getSupervisorAccompaniment,
} from '@store/tests/accompaniment/accompaniment.selector';
import {
  InterpreterAccompanimentToggledCPC,
  SupervisorAccompanimentToggledCPC,
} from '@store/tests/accompaniment/cat-cpc/accompaniment.cat-cpc.actions';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { getTestCategory } from '@store/tests/category/category.reducer';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { SetStartDate } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.actions';
import { getTestSlotAttributes } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import {
  getTestDate,
  getTestStartDateTime,
  getTestTime,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import {
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import { getPassCertificateNumber } from '@store/tests/pass-completion/pass-completion.selector';
import { HealthDeclarationAccepted } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { getPostTestDeclarations } from '@store/tests/post-test-declarations/post-test-declarations.reducer';
import { getHealthDeclarationStatus } from '@store/tests/post-test-declarations/post-test-declarations.selector';
import { SetRekeyDate } from '@store/tests/rekey-date/rekey-date.actions';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  ETAPhysicalOtherReasonUpdated,
  FootbrakeETAToggled,
  HandbrakeETAToggled,
  OtherETAToggled,
  SteeringControlETAToggled,
} from '@store/tests/test-data/common/eta/eta.actions';
import {
  getFootbrakeETAPhysicalType,
  getHandbrakeETAPhysicalType,
  getOtherETAPhysicalType,
  getOtherTextETAPhysicalType,
  getSteeringControlETAPhysicalType,
} from '@store/tests/test-data/common/eta/eta.selector';
import { getETA, getEco, getEcoFaultText } from '@store/tests/test-data/common/test-data.selector';
import { CircuitTypeChanged } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import {
  AdditionalInformationChanged,
  CandidateDescriptionChanged,
  D255No,
  D255Yes,
  DebriefUnWitnessed,
  DebriefWitnessed,
  IdentificationUsedChanged,
  IndependentDrivingTypeChanged,
  RouteNumberChanged,
  RouteNumberConfirmed,
  TrueLikenessToPhotoChanged,
  WeatherConditionsChanged,
} from '@store/tests/test-summary/test-summary.actions';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import {
  getAdditionalInformation,
  getCandidateDescription,
  getD255,
  getIdentification,
  getIndependentDriving,
  getRouteNumber,
  getTrueLikenessToPhoto,
  getWeatherConditions,
  isDebriefWitnessed,
} from '@store/tests/test-summary/test-summary.selector';
import { PersistTests, SendCurrentTest } from '@store/tests/tests.actions';
import { SetReasonForExitingApp } from '@store/tests/user-exited-app/user-exited-app.actions';
import { getUserExitedApp } from '@store/tests/user-exited-app/user-exited-app.reducer';
import { getReasonForExitingApp, getUserHasExitedApp } from '@store/tests/user-exited-app/user-exited-app.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.reducer';
import { getDualControls, getSchoolCar } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.selector';
import {
  DualControlsToggled,
  GearboxCategoryChanged,
  MotEvidenceChanged,
  SchoolBikeToggled,
  SchoolCarToggled,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  getMotEvidenceDescription,
  getMotEvidenceProvided,
  getMotStatus,
  getRegistrationNumber,
  getSearchedVRNListNoDuplicates,
  getTestExpiryDate,
  getVehicleMake,
  getVehicleModel,
} from '@store/tests/vehicle-details/vehicle-details.selector';

export function mapOfficeValue<T, R>(value: T, project: (value: T) => R): R {
  return project(value);
}

export abstract class OfficeBasePageComponent extends PracticeableBasePageComponent {
  public navController = inject(NavController);
  protected toastController = inject(ToastController);
  public modalController = inject(ModalController);
  protected outcomeBehaviourProvider = inject(OutcomeBehaviourMapProvider);
  protected weatherConditionProvider = inject(WeatherConditionProvider);
  protected faultSummaryProvider = inject(FaultSummaryProvider);
  public faultCountProvider = inject(FaultCountProvider);
  public deviceProvider = inject(DeviceProvider);

  steeringControlETA: Signal<boolean> = this.store$.selectSignal(getSteeringControlETAPhysicalType);
  handbrakeETA: Signal<boolean> = this.store$.selectSignal(getHandbrakeETAPhysicalType);
  footbrakeETA: Signal<boolean> = this.store$.selectSignal(getFootbrakeETAPhysicalType);
  otherETA: Signal<boolean> = this.store$.selectSignal(getOtherETAPhysicalType);
  otherTextETA: Signal<string> = this.store$.selectSignal(getOtherTextETAPhysicalType);

  protected officeCurrentTest = this.store$.selectSignal(selectCurrentTest);
  testCategory = computed(() =>
    mapOfficeValue(getTestCategory(this.officeCurrentTest()), (testCategory) => testCategory as TestCategory)
  );
  registrationNumber = computed(() =>
    getRegistrationNumber(getVehicleDetails(this.officeCurrentTest() as never) as never)
  );
  motStatus = computed(() => getMotStatus(getVehicleDetails(this.officeCurrentTest() as never) as never));
  motTestExpiryDate = computed(() => getTestExpiryDate(getVehicleDetails(this.officeCurrentTest() as never) as never));
  previouslySearchedVRNs = computed(() =>
    getSearchedVRNListNoDuplicates(getVehicleDetails(this.officeCurrentTest() as never) as never)
  );
  vehicleMake = computed(() => getVehicleMake(getVehicleDetails(this.officeCurrentTest() as never) as never));
  vehicleModel = computed(() => getVehicleModel(getVehicleDetails(this.officeCurrentTest() as never) as never));
  motAlternativeEvidenceProvided = computed(() =>
    getMotEvidenceProvided(getVehicleDetails(this.officeCurrentTest() as never) as never)
  );
  motAlternativeEvidenceDescription = computed(() =>
    getMotEvidenceDescription(getVehicleDetails(this.officeCurrentTest() as never) as never)
  );
  hasEnteredTeamsOnThisTest = computed(() =>
    getUserHasExitedApp(getUserExitedApp(this.officeCurrentTest() as never) as never)
  );
  reasonForEnteringTeams = computed(() =>
    getReasonForExitingApp(getUserExitedApp(this.officeCurrentTest() as never) as never)
  );
  activityCode = computed(() => getActivityCode(this.officeCurrentTest() as never));
  testOutcome = computed(() => getTestOutcome(this.officeCurrentTest() as never));
  testOutcomeText = computed(() => getTestOutcomeText(this.officeCurrentTest() as never));
  isPassed = computed(() => isPassed(this.officeCurrentTest() as never));
  isTestOutcomeSet = computed(() => isTestOutcomeSet(this.officeCurrentTest() as never));
  startTime = computed(() =>
    getTestTime(getTestSlotAttributes(getJournalData(this.officeCurrentTest() as never) as never) as never)
  );
  startDate = computed(() =>
    getTestDate(getTestSlotAttributes(getJournalData(this.officeCurrentTest() as never) as never) as never)
  );
  startDateTime = computed(() =>
    getTestStartDateTime(getTestSlotAttributes(getJournalData(this.officeCurrentTest() as never) as never) as never)
  );
  candidateName = computed(() =>
    getCandidateName(getCandidate(getJournalData(this.officeCurrentTest() as never) as never) as never)
  );
  candidateDriverNumber = computed(() =>
    mapOfficeValue(
      getCandidateDriverNumber(getCandidate(getJournalData(this.officeCurrentTest() as never) as never) as never),
      formatDriverNumber
    )
  );
  routeNumber = computed(() => getRouteNumber(getTestSummary(this.officeCurrentTest() as never) as never));
  displayRouteNumber = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getRouteNumber(getTestSummary(this.officeCurrentTest() as never) as never),
      ] as const,
      ([outcome, route]) => this.outcomeBehaviourProvider.isVisible(outcome, 'routeNumber', route)
    )
  );
  displayIndependentDriving = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getIndependentDriving(getTestSummary(this.officeCurrentTest() as never) as never),
      ] as const,
      ([outcome, independent]) => this.outcomeBehaviourProvider.isVisible(outcome, 'independentDriving', independent)
    )
  );
  displayCandidateDescription = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getCandidateDescription(getTestSummary(this.officeCurrentTest() as never) as never),
      ] as const,
      ([outcome, candidate]) => this.outcomeBehaviourProvider.isVisible(outcome, 'candidateDescription', candidate)
    )
  );
  displayIdentification = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getIdentification(getTestSummary(this.officeCurrentTest() as never) as never),
      ] as const,
      ([outcome, identification]) => this.outcomeBehaviourProvider.isVisible(outcome, 'identification', identification)
    )
  );
  trueLikenessToPhoto = computed(() =>
    getTrueLikenessToPhoto(getTestSummary(this.officeCurrentTest() as never) as never)
  );
  displayWeatherConditions = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getWeatherConditions(getTestSummary(this.officeCurrentTest() as never) as never),
      ] as const,
      ([outcome, weather]) => this.outcomeBehaviourProvider.isVisible(outcome, 'weatherConditions', weather)
    )
  );
  displayAdditionalInformation = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getAdditionalInformation(getTestSummary(this.officeCurrentTest() as never) as never),
      ] as const,
      ([outcome, additional]) => this.outcomeBehaviourProvider.isVisible(outcome, 'additionalInformation', additional)
    )
  );
  displayEco = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getEco(getTestData(this.officeCurrentTest() as never) as never),
      ] as const,
      ([outcome, eco]) => this.outcomeBehaviourProvider.isVisible(outcome, 'eco', eco)
    )
  );
  displayEta = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getETA(getTestData(this.officeCurrentTest() as never) as never),
      ] as const,
      ([outcome, eta]) => this.outcomeBehaviourProvider.isVisible(outcome, 'eta', eta)
    )
  );
  candidateDescription = computed(() =>
    getCandidateDescription(getTestSummary(this.officeCurrentTest() as never) as never)
  );
  independentDriving = computed(() =>
    getIndependentDriving(getTestSummary(this.officeCurrentTest() as never) as never)
  );
  identification = computed(() => getIdentification(getTestSummary(this.officeCurrentTest() as never) as never));
  additionalInformation = computed(() =>
    getAdditionalInformation(getTestSummary(this.officeCurrentTest() as never) as never)
  );
  selectedWeatherConditions = computed(() =>
    getWeatherConditions(getTestSummary(this.officeCurrentTest() as never) as never)
  );
  displayDrivingFault = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getTestData(this.officeCurrentTest() as never),
        getTestCategory(this.officeCurrentTest()),
      ] as const,
      ([outcome, testData, category]) =>
        this.outcomeBehaviourProvider.isVisible(
          outcome,
          'faultComment',
          this.faultSummaryProvider.getDrivingFaultsList(testData, category as TestCategory)
        )
    )
  );
  displaySeriousFault = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getTestData(this.officeCurrentTest() as never),
        getTestCategory(this.officeCurrentTest()),
      ] as const,
      ([outcome, testData, category]) =>
        this.outcomeBehaviourProvider.isVisible(
          outcome,
          'faultComment',
          this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)
        )
    )
  );
  displayDangerousFault = computed(() =>
    mapOfficeValue(
      [
        getTestOutcome(this.officeCurrentTest() as never),
        getTestData(this.officeCurrentTest() as never),
        getTestCategory(this.officeCurrentTest()),
      ] as const,
      ([outcome, testData, category]) =>
        this.outcomeBehaviourProvider.isVisible(
          outcome,
          'faultComment',
          this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)
        )
    )
  );
  dangerousFaults = computed(() =>
    mapOfficeValue(
      [getTestData(this.officeCurrentTest() as never), getTestCategory(this.officeCurrentTest())] as const,
      ([testData, category]) => this.faultSummaryProvider.getDangerousFaultsList(testData, category as TestCategory)
    )
  );
  seriousFaults = computed(() =>
    mapOfficeValue(
      [getTestData(this.officeCurrentTest() as never), getTestCategory(this.officeCurrentTest())] as const,
      ([testData, category]) => this.faultSummaryProvider.getSeriousFaultsList(testData, category as TestCategory)
    )
  );
  drivingFaults = computed(() =>
    mapOfficeValue(
      [getTestData(this.officeCurrentTest() as never), getTestCategory(this.officeCurrentTest())] as const,
      ([testData, category]) => this.faultSummaryProvider.getDrivingFaultsList(testData, category as TestCategory)
    )
  );
  drivingFaultCount = computed(() =>
    mapOfficeValue(
      [getTestData(this.officeCurrentTest() as never), getTestCategory(this.officeCurrentTest())] as const,
      ([testData, category]) => {
        return this.faultCountProvider.getDrivingFaultSumCount(category as TestCategory, testData);
      }
    )
  );
  seriousFaultCount = computed(() =>
    mapOfficeValue(
      [getTestData(this.officeCurrentTest() as never), getTestCategory(this.officeCurrentTest())] as const,
      ([data, category]) => this.faultCountProvider.getSeriousFaultSumCount(category as TestCategory, data)
    )
  );
  dangerousFaultCount = computed(() =>
    mapOfficeValue(
      [getTestData(this.officeCurrentTest() as never), getTestCategory(this.officeCurrentTest())] as const,
      ([data, category]) => this.faultCountProvider.getDangerousFaultSumCount(category as TestCategory, data)
    )
  );
  applicationNumber = computed(() =>
    getApplicationNumber(getApplicationReference(getJournalData(this.officeCurrentTest() as never) as never) as never)
  );
  healthDeclarationAccepted = computed(() =>
    getHealthDeclarationStatus(getPostTestDeclarations(this.officeCurrentTest() as never) as never)
  );
  d255 = computed(() => getD255(getTestSummary(this.officeCurrentTest() as never) as never));
  debriefWitnessed = computed(() => isDebriefWitnessed(getTestSummary(this.officeCurrentTest() as never) as never));
  passCertificateNumber = computed(() =>
    getPassCertificateNumber(getPassCompletion(this.officeCurrentTest() as never) as never)
  );
  etaFaults = computed(() => getETA(getTestData(this.officeCurrentTest() as never) as never));
  ecoFaults = computed(() => getEcoFaultText(getEco(getTestData(this.officeCurrentTest() as never) as never) as never));
  schoolCar = computed(() => getSchoolCar(getVehicleDetails(this.officeCurrentTest() as never) as never));
  dualControls = computed(() => getDualControls(getVehicleDetails(this.officeCurrentTest() as never) as never));
  instructorAccompaniment = computed(() =>
    getInstructorAccompaniment(getAccompaniment(this.officeCurrentTest() as never) as never)
  );
  supervisorAccompaniment = computed(() =>
    getSupervisorAccompaniment(getAccompaniment(this.officeCurrentTest() as never) as never)
  );
  otherAccompaniment = computed(() =>
    getOtherAccompaniment(getAccompaniment(this.officeCurrentTest() as never) as never)
  );
  interpreterAccompaniment = computed(() =>
    getInterpreterAccompaniment(getAccompaniment(this.officeCurrentTest() as never) as never)
  );
  form: UntypedFormGroup;
  toast: HTMLIonToastElement;
  hasNavigatedFromUnsubmitted = false;
  isValidStartDateTime = true;
  activityCodeOptions: ActivityCodeModel[];
  weatherConditions: WeatherConditionSelection[];
  finishTestModal: HTMLIonModalElement;

  hasIdentificationBeenUpdated = false;

  displayExitPracticeMode = false;

  protected constructor(@Inject(false) public loginRequired = false) {
    super(loginRequired);
    this.form = new UntypedFormGroup({});
    this.activityCodeOptions = activityCodeModelList;
    this.weatherConditions = this.weatherConditionProvider.getWeatherConditions();
    this.hasNavigatedFromUnsubmitted = this.router.getCurrentNavigation()?.extras?.state?.hasNavigatedFromUnsubmitted;
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(OfficeViewDidEnter());
  }

  onInitialisation(): void {
    super.ngOnInit();
  }

  ionViewDidLeave(): void {}

  async onSubmit(isDelegated = false) {
    if (await this.isFormValid()) {
      await this.showFinishTestModal(isDelegated);
    }
  }

  destroyTestSubs = (): void => {
    // At this point in a test, you can not go back at all in the journey - therefore shutdown any subscriptions
    // where takeUntil(wrtcDestroy$) or takeUntil(trDestroy$) has been piped onto.

    // Waiting room to car
    wrtcDestroy$.next(null);
    // Test report
    trDestroy$.next(null);
  };

  setIsValidStartDateTime(isValid: boolean) {
    this.isValidStartDateTime = isValid;
  }

  dateOfTestChanged(inputDate: string) {
    const startDateTime = this.startDateTime();
    const customStartDate = getNewTestStartTime(inputDate, startDateTime);
    this.store$.dispatch(TestStartDateChanged(startDateTime, customStartDate));
    this.store$.dispatch(SetStartDate(customStartDate));
  }

  categoryIncludesRouteNumber() {
    const categoriesWithRouteNumbers: TestCategory[] = [
      TestCategory.B,
      TestCategory.B1,
      TestCategory.BE,
      TestCategory.ADI2,
      TestCategory.C,
      TestCategory.C1,
      TestCategory.C1E,
      TestCategory.CE,
      TestCategory.D,
      TestCategory.D1,
      TestCategory.D1E,
      TestCategory.DE,
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAM2,
      TestCategory.EUAMM2,
    ];
    return categoriesWithRouteNumbers.includes(this.testCategory());
  }

  dispatchTestConfirmedActions() {
    if (this.categoryIncludesRouteNumber() && this.displayRouteNumber()) {
      this.store$.dispatch(RouteNumberConfirmed(this.routeNumber()));
    }
  }

  completeTest = async (): Promise<void> => {
    this.dispatchTestConfirmedActions();
    // If the identification has not been updated, dispatch the current identification for analytics purposes.
    if (!this.hasIdentificationBeenUpdated) {
      this.identificationChanged(this.form.value.identification);
    }
    if (!this.isEndToEndPracticeMode) {
      this.store$.dispatch(CompleteTest());
    }
    await this.finishTestModal.dismiss();
    await this.popToRoot();
  };

  completeTestDelegated = async (): Promise<void> => {
    this.dispatchTestConfirmedActions();
    this.store$.dispatch(SetRekeyDate());
    this.store$.dispatch(SendCurrentTest());
    await this.finishTestModal.dismiss();
    await this.router.navigate([DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE], { replaceUrl: true });
  };

  identificationChanged(identification: Identification): void {
    this.store$.dispatch(IdentificationUsedChanged(identification));
    this.hasIdentificationBeenUpdated = true;
  }

  trueLikenessToPhotoChanged(trueLikeness: boolean): void {
    this.store$.dispatch(TrueLikenessToPhotoChanged(trueLikeness, true));
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

  reasonForEnteringTeamsChanged(reasonForEnteringTeams: string): void {
    this.store$.dispatch(SetReasonForExitingApp(reasonForEnteringTeams));
  }

  footbrakeETAChanged(): void {
    this.store$.dispatch(FootbrakeETAToggled());
  }

  handbrakeETAChanged(): void {
    this.store$.dispatch(HandbrakeETAToggled());
  }

  otherETAChanged(): void {
    this.store$.dispatch(OtherETAToggled());
  }

  otherETAReasonChanged(newReason: string): void {
    this.store$.dispatch(ETAPhysicalOtherReasonUpdated(newReason));
  }

  steeringETAChanged(): void {
    this.store$.dispatch(SteeringControlETAToggled());
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
      isWelsh ? CandidateChoseToProceedWithTestInWelsh('Cymraeg') : CandidateChoseToProceedWithTestInEnglish('English')
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
        this.form.controls.showMeQuestion.setValue({});
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
      this.dispatchTestConfirmedActions();
      await this.router.navigate([TestFlowPageNames.REKEY_REASON_PAGE]);
    }
  }

  async defer() {
    if (this.hasNavigatedFromUnsubmitted) {
      await this.navController.navigateBack(UNUPLOADED_TESTS_PAGE);
    } else {
      await this.popToRoot();
    }
    this.store$.dispatch(SavingWriteUpForLater());
    this.store$.dispatch(PersistTests());
  }

  async isFormValid() {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (this.form.valid) {
      return true;
    }
    Object.keys(this.form.controls).forEach((controlName) => {
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
      buttons: [
        {
          text: 'X',
          role: 'cancel',
        },
      ],
    });
  };

  async showFinishTestModal(isDelegated = false) {
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

  alternativeMOTEvidenceDescriptionUpdated(evidence: string) {
    this.store$.dispatch(MotEvidenceChanged(evidence));
  }

  /**
   * Opens the exit practice mode row
   */
  onEndPracticeModeClicked() {
    this.displayExitPracticeMode = true;
  }

  /**
   * Closes the exit practice mode row
   */
  closeExitPracticeMode() {
    this.displayExitPracticeMode = false;
  }
}
