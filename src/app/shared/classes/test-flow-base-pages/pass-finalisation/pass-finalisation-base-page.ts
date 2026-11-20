import { Inject, Signal, computed, inject, signal } from '@angular/core';
import { ActivityCode, CategoryCode, GearboxCategory } from '@dvsa/mes-test-schema/categories/common';

import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { ActivityCodes } from '@shared/models/activity-codes';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { getTestCategory } from '@store/tests/category/category.reducer';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateName,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  Code78NotPresent,
  Code78Present,
  PassCertificateNumberChanged,
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import {
  getPassCertificateNumber,
  isProvisionalLicenseProvided,
} from '@store/tests/pass-completion/pass-completion.selector';
import { hasEyesightTestGotSeriousFault } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed } from '@store/tests/test-summary/test-summary.actions';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { getD255, isDebriefWitnessed } from '@store/tests/test-summary/test-summary.selector';
import { getTests } from '@store/tests/tests.reducer';
import {
  getAllPassCerts,
  getJournalData,
  getStartedTestsWithPassOutcome,
  getTestOutcome,
  getTestOutcomeText,
  selectCurrentTest,
} from '@store/tests/tests.selector';
import {
  AutomaticConfirmationChanged,
  GearboxCategoryChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getGearboxCategory, isAutomaticConfirmed } from '@store/tests/vehicle-details/vehicle-details.selector';

export abstract class PassFinalisationPageComponent extends PracticeableBasePageComponent {
  protected routeByCat = inject(RouteByCategoryProvider);
  protected outcomeBehaviourProvider = inject(OutcomeBehaviourMapProvider);

  isShowingEditBox = signal<boolean>(true);

  currentTest = this.store$.selectSignal(selectCurrentTest);
  tests = this.store$.selectSignal(getTests);

  candidateName: Signal<string> = computed(() => {
    const candidate = this.getCurrentCandidate();
    return candidate ? getCandidateName(candidate as never) : null;
  });

  candidateUntitledName: Signal<string> = computed(() => {
    const candidate = this.getCurrentCandidate();
    return candidate ? getUntitledCandidateName(candidate as never) : null;
  });

  candidateDriverNumber: Signal<string> = computed(() => {
    const candidate = this.getCurrentCandidate();
    return candidate ? formatDriverNumber(getCandidateDriverNumber(candidate as never)) : null;
  });

  testOutcomeText: Signal<string> = computed(() => {
    const currentTest = this.currentTest();
    return currentTest ? getTestOutcomeText(currentTest as never) : null;
  });

  testOutcomeCode: Signal<ActivityCode> = computed(() => {
    const currentTest = this.currentTest();
    return currentTest ? getTestOutcome(currentTest as never) : null;
  });

  applicationNumber: Signal<string> = computed(() => {
    const applicationReference = this.getCurrentApplicationReference();
    return applicationReference ? getApplicationNumber(applicationReference as never) : null;
  });

  provisionalLicense: Signal<boolean> = computed(() => {
    const passCompletion = this.getCurrentPassCompletion();
    return passCompletion ? isProvisionalLicenseProvided(passCompletion as never) : false;
  });

  passCertificateNumber: Signal<string> = computed(() => {
    const passCompletion = this.getCurrentPassCompletion();
    return passCompletion ? getPassCertificateNumber(passCompletion as never) : null;
  });

  transmissionSignal: Signal<GearboxCategory> = computed(() => {
    const vehicleDetails = this.getCurrentVehicleDetails();
    return vehicleDetails ? getGearboxCategory(vehicleDetails as never) : null;
  });

  isAutomaticConfirmed: Signal<boolean> = computed(() => {
    const vehicleDetails = this.getCurrentVehicleDetails();
    return vehicleDetails ? isAutomaticConfirmed(vehicleDetails as never) : false;
  });

  d255: Signal<boolean> = computed(() => {
    const testSummary = this.getCurrentTestSummary();
    return testSummary ? getD255(testSummary as never) : false;
  });

  debriefWitnessed: Signal<boolean> = computed(() => {
    const testSummary = this.getCurrentTestSummary();
    return testSummary ? isDebriefWitnessed(testSummary as never) : false;
  });

  conductedLanguage: Signal<string> = computed(() => {
    const communicationPreference = this.getCurrentCommunicationPreference();
    return communicationPreference ? getConductedLanguage(communicationPreference as never) : null;
  });

  eyesightTestFailed: Signal<boolean> = computed(() => {
    const testData = this.getCurrentTestData();
    return testData ? hasEyesightTestGotSeriousFault(testData as never) : false;
  });

  testCategorySignal: Signal<CategoryCode> = this.store$.selectSignal(getTestCategory);

  pastPassCerts: Signal<string[]> = computed(() => {
    const startedTestsWithPassOutcome = getStartedTestsWithPassOutcome(this.tests());
    return getAllPassCerts(startedTestsWithPassOutcome) || [];
  });

  testOutcome: ActivityCodes = ActivityCodes.PASS;

  protected constructor(@Inject(false) public loginRequired = false) {
    super(loginRequired);
  }

  private getCurrentCandidate() {
    const currentTest = this.currentTest();
    if (!currentTest) return null;
    return getCandidate(getJournalData(currentTest as never) as never);
  }

  private getCurrentVehicleDetails() {
    const currentTest = this.currentTest();
    return currentTest ? getVehicleDetails(currentTest as never) : null;
  }

  private getCurrentApplicationReference() {
    const currentTest = this.currentTest();
    return currentTest ? getApplicationReference(getJournalData(currentTest as never) as never) : null;
  }

  private getCurrentPassCompletion() {
    const currentTest = this.currentTest();
    return currentTest ? getPassCompletion(currentTest as never) : null;
  }

  private getCurrentCommunicationPreference() {
    const currentTest = this.currentTest();
    return currentTest ? getCommunicationPreference(currentTest as never) : null;
  }

  private getCurrentTestSummary() {
    const currentTest = this.currentTest();
    return currentTest ? getTestSummary(currentTest as never) : null;
  }

  private getCurrentTestData() {
    const currentTest = this.currentTest();
    return currentTest ? getTestData(currentTest as never) : null;
  }

  onInitialisation(): void {
    super.ngOnInit();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
  }

  ionViewWillEnter() {
    this.isShowingEditBox.set(true);
  }

  deactivateEdit() {
    this.isShowingEditBox.set(false);
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

  automaticConfirmationChanged(isConfirmed: boolean): void {
    this.store$.dispatch(AutomaticConfirmationChanged(isConfirmed));
  }

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.store$.dispatch(PassCertificateNumberChanged(passCertificateNumber));
  }

  categoryCodeChanged(category: CategoryCode): void {
    this.store$.dispatch(PopulateTestCategory(category));
  }

  d255Changed(d255: boolean): void {
    this.store$.dispatch(d255 ? D255Yes() : D255No());
  }

  debriefWitnessedChanged(debriefWitnessed: boolean) {
    this.store$.dispatch(debriefWitnessed ? DebriefWitnessed() : DebriefUnWitnessed());
  }

  onCode78Present(present: boolean): void {
    if (present) {
      this.store$.dispatch(Code78Present());
    } else {
      this.store$.dispatch(Code78NotPresent());
    }
  }

  isWelshChanged(isWelsh: boolean) {
    this.store$.dispatch(
      isWelsh ? CandidateChoseToProceedWithTestInWelsh('Cymraeg') : CandidateChoseToProceedWithTestInEnglish('English')
    );
  }
}
