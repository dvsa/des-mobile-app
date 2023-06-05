import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { UntypedFormGroup } from '@angular/forms';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import {
  combineLatest, merge, Observable, Subscription,
} from 'rxjs';
import { ActivityCode, CategoryCode, GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { getTests } from '@store/tests/tests.reducer';
import {
  getAllPassCerts,
  getCurrentTest,
  getJournalData,
  getStartedTestsWithPassOutcome,
  getTestOutcome,
  getTestOutcomeText,
} from '@store/tests/tests.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getCandidateName,
  getCandidatePrn,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  filter, map, take, withLatestFrom,
} from 'rxjs/operators';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import {
  getPassCertificateNumber,
  isProvisionalLicenseProvided,
} from '@store/tests/pass-completion/pass-completion.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { getGearboxCategory } from '@store/tests/vehicle-details/vehicle-details.selector';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { getD255, isDebriefWitnessed } from '@store/tests/test-summary/test-summary.selector';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { hasEyesightTestGotSeriousFault } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getJournalState } from '@store/journal/journal.reducer';
import { getCompletedPassCerts } from '@store/journal/journal.selector';
import {
  Code78NotPresent,
  Code78Present,
  PassCertificateNumberChanged,
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import { GearboxCategoryChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import {
  D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed,
} from '@store/tests/test-summary/test-summary.actions';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { PersistTests } from '@store/tests/tests.actions';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  PASS_CERTIFICATE_NUMBER_CTRL,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { TransmissionType } from '@shared/models/transmission-type';
import { getCode78 } from '@store/tests/pass-completion/cat-c/pass-completion.cat-c.selector';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import {
  getFurtherDevelopment,
  getGrade,
  getReasonForNoAdviceGiven,
} from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getTestStartTime } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.selector';
import * as moment from 'moment/moment';
import { getTestEndTime } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.selector';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { BikeTestType } from '@providers/bike-category-detail/bike-category-detail.model';

interface PassFinalisationPageState {
  candidateName$: Observable<string>;
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  testOutcomeText$: Observable<string>;
  testOutcome$: Observable<ActivityCode>;
  applicationNumber$: Observable<string>;
  provisionalLicense$: Observable<boolean>;
  passCertificateNumber$: Observable<string>;
  transmission$: Observable<GearboxCategory>;
  d255$: Observable<boolean>;
  debriefWitnessed$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
  eyesightTestFailed$: Observable<boolean>;
  testCategory$: Observable<CategoryCode>;
  pastPassCerts$: Observable<string[]>;
  showADI2Banner$: Observable<boolean>;
  showD255$: Observable<boolean>;
  showPassCert$: Observable<boolean>;
  showPassCertMod1$: Observable<boolean>;
  showTransmission$: Observable<boolean>;
  showCode78$: Observable<boolean>;
  showLicenceProvided$: Observable<boolean>;
  code78$: Observable<boolean>;
  isBike$: Observable<boolean>;
  bikeTestType$: Observable<BikeTestType>;
  displayFurtherDevelopment$: Observable<boolean>;
  furtherDevelopment$: Observable<boolean>;
  displayAdviceReasonGiven$: Observable<boolean>;
  adviceReason$: Observable<string>;
  testOutcomeGrade$: Observable<string>;
  prn$: Observable<number>;
  isStandardsCheck$: Observable<boolean>;
  testStartTime$: Observable<string>;
  testEndTime$: Observable<string>;
}

@Component({
  selector: 'app-pass-finalisation',
  templateUrl: './pass-finalisation.page.html',
  styleUrls: ['./pass-finalisation.page.scss'],
})
export class PassFinalisationPage extends PracticeableBasePageComponent implements OnInit {
  pageState: PassFinalisationPageState;
  form: UntypedFormGroup;
  merged$: Observable<any>;
  subscription: Subscription;
  activityCodeOptions: ActivityCodeModel[];
  transmission: GearboxCategory;
  candidateDriverNumber: string;
  testCategory: CategoryCode;
  provisionalLicenseIsReceived: boolean;
  code78Present: boolean;
  testOutcome = ActivityCodes.PASS;
  manualMessage: string = 'A <strong><em>manual</em></strong> licence will be issued';
  automaticMessage: string = 'An <strong><em>automatic</em></strong> licence will be issued';
  askCandidateLicenseMessage: string = 'Check that the candidate doesn\'t need their driving licence (e.g CPC Mod4)';
  niMessage: string = 'This candidate holds a Northern Irish licence and must retain it. Do not collect '
    + 'it from the candidate.';

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    private testDataByCategoryProvider: TestDataByCategoryProvider,
    private route: ActivatedRoute,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new UntypedFormGroup({});
    const { passData } = this.route.snapshot.data;
    const [behaviourMap, activityCodeList] = passData;
    this.activityCodeOptions = activityCodeList;
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    const category$ = currentTest$.pipe(select(getTestCategory));

    this.pageState = {
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateName),
      ),
      candidateUntitledName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
      ),
      candidateDriverNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateDriverNumber),
        map(formatDriverNumber),
      ),
      testOutcomeText$: currentTest$.pipe(
        select(getTestOutcomeText),
      ),
      testOutcome$: currentTest$.pipe(
        select(getTestOutcome),
      ),
      applicationNumber$: currentTest$.pipe(
        select(getJournalData),
        select(getApplicationReference),
        select(getApplicationNumber),
      ),
      provisionalLicense$: currentTest$.pipe(
        select(getPassCompletion),
        map(isProvisionalLicenseProvided),
      ),
      passCertificateNumber$: currentTest$.pipe(
        select(getPassCompletion),
        select(getPassCertificateNumber),
      ),
      transmission$: currentTest$.pipe(
        select(getVehicleDetails),
        select(getGearboxCategory),
      ),
      debriefWitnessed$: currentTest$.pipe(
        select(getTestSummary),
        select(isDebriefWitnessed),
      ),
      d255$: currentTest$.pipe(
        select(getTestSummary),
        select(getD255),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
      eyesightTestFailed$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => isAnyOf(category, [
          TestCategory.B,
          TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K, // Cat Home
          TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, // Cat Mod1
          TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2, // Cat Mod2
        ])),
        map(([testResult]) => testResult),
        select(getTestData),
        select(hasEyesightTestGotSeriousFault),
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
      ),
      pastPassCerts$: combineLatest([
        this.store$.pipe(
          select(getTests),
          select(getStartedTestsWithPassOutcome),
          select(getAllPassCerts),
          take(1),
        ),
        this.store$.pipe(
          select(getJournalState),
          select(getCompletedPassCerts),
          take(1),
        ),
      ])
        .pipe(
          map(([testPassCerts, journalPassCerts]) => ([
            // pass certs from started tests
            ...(testPassCerts || []),
            // pass certs from completed test payload
            ...(journalPassCerts || []),
          ])),
        ),
      showD255$: category$.pipe(
        map((category) => !isAnyOf(category, [
          TestCategory.ADI2,
          TestCategory.CCPC, TestCategory.DCPC, // Cat CPC
          TestCategory.CM, TestCategory.CEM, TestCategory.C1M, TestCategory.C1EM, // Cat C manoeuvres
          TestCategory.DM, TestCategory.DEM, TestCategory.D1M, TestCategory.D1EM, // Cat D manoeuvres
        ])),
      ),
      showLicenceProvided$: category$.pipe(
        map((category) => !isAnyOf(category, [
          TestCategory.CCPC, TestCategory.DCPC, //  Cat CPC
          TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1, // Cat Mod1
          TestCategory.CM, TestCategory.CEM, TestCategory.C1M, TestCategory.C1EM, // Cat C manoeuvres
          TestCategory.DM, TestCategory.DEM, TestCategory.D1M, TestCategory.D1EM, // Cat D manoeuvres
        ])),
      ),
      showTransmission$: category$.pipe(
        map((category) => !isAnyOf(category, [
          TestCategory.ADI2,
          TestCategory.CCPC, TestCategory.DCPC, // Cat CPC
          TestCategory.CM, TestCategory.CEM, TestCategory.C1M, TestCategory.C1EM, // Cat C manoeuvres
          TestCategory.DM, TestCategory.DEM, TestCategory.D1M, TestCategory.D1EM, // Cat D manoeuvres
        ])),
      ),
      showCode78$: category$.pipe(
        map((category) => isAnyOf(category, [
          TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E, // Cat C
          TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E, // Cat D
        ])),
      ),
      showPassCert$: category$.pipe(
        map((category) => !isAnyOf(category, [
          TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1, // Cat Mod1
          TestCategory.ADI2,
        ])),
      ),
      showPassCertMod1$: category$.pipe(
        map((category) => isAnyOf(category, [
          TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1, // Cat Mod1
        ])),
      ),
      showADI2Banner$: category$.pipe(
        map((category) => isAnyOf(category, [
          TestCategory.ADI2,
        ])),
      ),
      code78$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => isAnyOf(category, [
          TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E, // Cat C
          TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E, // Cat D
        ])),
        map(([testResult]) => testResult),
        select(getPassCompletion),
        select(getCode78),
      ),
      displayFurtherDevelopment$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          withLatestFrom(category$),
          filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
          map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
          select(getReview),
          select(getFurtherDevelopment),
        )),
        map(([outcome, furtherDevelopment]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'furtherDevelopment', furtherDevelopment)),
      ),
      furtherDevelopment$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getFurtherDevelopment),
      ),
      displayAdviceReasonGiven$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          withLatestFrom(category$),
          filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
          map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
          select(getReview),
          select(getReasonForNoAdviceGiven),
        )),
        map(([outcome, noAdviceGivenReason]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'reasonGiven', noAdviceGivenReason)),
      ),
      adviceReason$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getReasonForNoAdviceGiven),
      ),
      testOutcomeGrade$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getReview),
        select(getGrade),
      ),
      prn$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidatePrn),
      ),
      isStandardsCheck$: category$.pipe(
        map((category) => isAnyOf(category, [TestCategory.SC])),
      ),
      testStartTime$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getTestStartTime),
        map((time: string) => time || moment()
          .toISOString()),
      ),
      testEndTime$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category === TestCategory.ADI3 || category === TestCategory.SC),
        map(([data, category]) => this.testDataByCategoryProvider.getTestDataByCategoryCode(category)(data)),
        select(getTestEndTime),
        map((time: string) => time || moment()
          .add(1, 'hour')
          .toISOString()),
      ),
      isBike$: category$.pipe(
        map((category) => isAnyOf(category, [
          TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1, // Cat Mod1
          TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2, // Cat Mod2
        ])),
      ),
      bikeTestType$: category$.pipe(
        map((category) => {
          if (isAnyOf(category, [TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1])) {
            return BikeTestType.MOD1;
          }
          if (isAnyOf(category, [TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2])) {
            return BikeTestType.MOD2;
          }
          return null;
        }),
      ),
    };

    const {
      code78$,
      provisionalLicense$,
      transmission$,
      candidateDriverNumber$,
    } = this.pageState;

    this.merged$ = merge(
      code78$.pipe(map((value) => this.code78Present = value)),
      category$.pipe(map((value) => this.testCategory = value)),
      transmission$.pipe(map((value) => this.transmission = value)),
      candidateDriverNumber$.pipe(map((value) => this.candidateDriverNumber = value)),
      provisionalLicense$.pipe(map((value) => this.provisionalLicenseIsReceived = value)),
    );
    this.subscription = this.merged$?.subscribe();
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(PassFinalisationViewDidEnter());

    if (this.subscription.closed && this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
  }

  displayTransmissionBanner(): boolean {
    if (!isAnyOf(this.testCategory, [
      TestCategory.B,
      TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1, // Cat Mod1
      TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2, // Cat Mod2
    ])) {
      return false;
    }
    const isPristine = this.form.get('transmissionCtrl')?.pristine;
    return !isPristine && this.transmission === TransmissionType.Automatic;
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
      isWelsh
        ? CandidateChoseToProceedWithTestInWelsh('Cymraeg')
        : CandidateChoseToProceedWithTestInEnglish('English'),
    );
  }

  furtherDevelopmentChanged(furtherDevelopment: boolean) {
    this.store$.dispatch(SeekFurtherDevelopmentChanged(furtherDevelopment));
  }

  adviceReasonChanged(adviceReason: string) {
    this.store$.dispatch(ReasonForNoAdviceGivenChanged(adviceReason));
  }

  testStartTimeChanged(startTime: string): void {
    this.store$.dispatch(StartTimeChanged(startTime));
  }

  testEndTimeChanged(endTime: string): void {
    this.store$.dispatch(EndTimeChanged(endTime));
  }

  isNorthernIreland(driverNumber: string): boolean {
    // Disregard licence format check if not cat B;
    if (!isAnyOf(this.testCategory, [TestCategory.B])) {
      return false;
    }

    driverNumber = driverNumber?.replace(/\s/g, '');
    return /^\d+$/.test(driverNumber);
  }

  shouldShowCandidateDoesntNeedLicenseBanner(): boolean {
    if (isAnyOf(this.testCategory, [
      TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
      TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E])
    ) {
      return this.provisionalLicenseIsReceived;
    }
    return false;
  }

  shouldShowCode78Banner(): boolean {
    if (isAnyOf(this.testCategory, [
      TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
      TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E])
    ) {
      return this.code78Present !== null && this.transmission !== null;
    }
    return false;
  }

  shouldShowManualBanner(): boolean {
    if (this.shouldShowCode78Banner()) {
      return (
        this.transmission === TransmissionType.Manual
        || (this.transmission === TransmissionType.Automatic && !this.code78Present)
      );
    }
    return false;
  }

  shouldShowAutomaticBanner(): boolean {
    if (this.shouldShowCode78Banner()) {
      return this.code78Present && this.transmission === TransmissionType.Automatic;
    }
    return false;
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls)
      .forEach((controlName) => this.form.controls[controlName].markAsDirty());

    if (this.isNorthernIreland(this.candidateDriverNumber)) {
      this.store$.dispatch(ProvisionalLicenseNotReceived());
    }

    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
      this.store$.dispatch(PassFinalisationReportActivityCode(ActivityCodes.PASS));
      await this.router.navigate([TestFlowPageNames.HEALTH_DECLARATION_PAGE]);
      return;
    }

    Object.keys(this.form.controls)
      .forEach((controlName) => {
        if (this.form.controls[controlName].invalid) {
          if (controlName === PASS_CERTIFICATE_NUMBER_CTRL) {
            this.store$.dispatch(PassFinalisationValidationError(`${controlName} is invalid`));
          }
          this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
        }
      });
  }

}
