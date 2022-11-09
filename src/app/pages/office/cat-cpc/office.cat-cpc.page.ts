import { Component, OnInit } from '@angular/core';
import {
  ModalController, NavController, Platform, ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { WeatherConditionProvider } from '@providers/weather-conditions/weather-condition';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-cpc';
import { ActivityCodeModel, getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { merge, Observable, Subscription } from 'rxjs';
import { CombinationCodes, Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { Combination, questionCombinations } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { TestOutcome } from '@shared/models/test-outcome';
import { AssessmentReportChanged } from '@store/tests/test-summary/cat-cpc/test-summary.cat-cpc.actions';
import { PassCertificateNumberChanged } from '@store/tests/pass-completion/pass-completion.actions';
import { PassCertificateNumberReceived } from '@store/tests/post-test-declarations/post-test-declarations.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestSummary } from '@store/tests/test-summary/cat-cpc/test-summary.cat-cpc.reducer';
import {
  getCombination,
  getQuestion1,
  getQuestion2,
  getQuestion3, getQuestion4, getQuestion5,
  getTotalPercent,
} from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.selector';
import { getTestData } from '@store/tests/test-data/cat-cpc/test-data.cat-cpc.reducer';
import { getAssessmentReport } from '@store/tests/test-summary/cat-cpc/test-summary.cat-cpc.selector';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getReceiptDeclarationStatus } from '@store/tests/post-test-declarations/post-test-declarations.selector';
import { getPostTestDeclarations } from '@store/tests/post-test-declarations/post-test-declarations.reducer';
import { map } from 'rxjs/operators';
import { UntypedFormGroup } from '@angular/forms';
import { DeviceProvider } from '@providers/device/device';
import { getTestOutcome as getTestOutcomeDebrief } from '../../debrief/debrief.selector';

interface CatCPCOfficePageState {
  testResult$: Observable<string>;
  delegatedTest$: Observable<boolean>;
  assessmentReport$: Observable<string>;
  overallScore$: Observable<number>;
  question1$: Observable<Question>;
  question2$: Observable<Question>;
  question3$: Observable<Question>;
  question4$: Observable<Question>;
  question5$: Observable<Question5>;
  combination$: Observable<CombinationCodes>;
  passCertificateNumberReceived$: Observable<boolean>;
}
type OfficePageState = CommonOfficePageState & CatCPCOfficePageState;

@Component({
  selector: '.office-cat-cpc-page',
  templateUrl: './office.cat-cpc.page.html',
  styleUrls: ['../office.page.scss'],
})
export class OfficeCatCPCPage extends OfficeBasePageComponent implements OnInit {

  pageState: OfficePageState;
  pageSubscription: Subscription;
  form: UntypedFormGroup;
  isDelegated: boolean;
  testOutcome: string;
  public outcome: TestOutcome;
  activityCodeOptions: ActivityCodeModel[];

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    navController: NavController,
    toastController: ToastController,
    modalController: ModalController,
    outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    weatherConditionProvider: WeatherConditionProvider,
    faultSummaryProvider: FaultSummaryProvider,
    faultCountProvider: FaultCountProvider,
    private appConfig: AppConfigProvider,
    public deviceProvider: DeviceProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      navController,
      toastController,
      modalController,
      outcomeBehaviourProvider,
      weatherConditionProvider,
      faultSummaryProvider,
      faultCountProvider,
    );
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
    this.activityCodeOptions = getActivityCodeOptions(this.appConfig.getAppConfig().role === ExaminerRole.DLG);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      testResult$: currentTest$.pipe(
        select(getTestOutcomeDebrief),
      ),
      delegatedTest$: currentTest$.pipe(
        select(getDelegatedTestIndicator),
        select(isDelegatedTest),
      ),
      assessmentReport$: currentTest$.pipe(
        select(getTestSummary),
        select(getAssessmentReport),
      ),
      overallScore$: currentTest$.pipe(
        select(getTestData),
        select(getTotalPercent),
      ),
      question1$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion1),
      ),
      question2$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion2),
      ),
      question3$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion3),
      ),
      question4$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion4),
      ),
      question5$: currentTest$.pipe(
        select(getTestData),
        select(getQuestion5),
      ),
      combination$: currentTest$.pipe(
        select(getTestData),
        select(getCombination),
      ),
      passCertificateNumberReceived$: currentTest$.pipe(
        select(getPostTestDeclarations),
        select(getReceiptDeclarationStatus),
      ),
    };
    this.setupSubscription();
  }

  setupSubscription() {
    super.setupSubscriptions();

    const {
      testResult$,
      delegatedTest$,
      testOutcome$,
    } = this.pageState;

    this.pageSubscription = merge(
      testResult$.pipe(map((result) => this.outcome = result as TestOutcome)),
      testOutcome$.pipe(map((result) => this.testOutcome = result)),
      delegatedTest$.pipe(map((result) => this.isDelegated = result)),
    ).subscribe();
  }

  async ionViewWillEnter() {
    super.ionViewWillEnter();

    if (!this.isPracticeMode && super.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();

    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }

  assessmentReportChanged(assessmentReport: string): void {
    this.store$.dispatch(AssessmentReportChanged(assessmentReport));
  }

  getCombinationAdditionalText(combinationCodes: CombinationCodes): string {
    const question: Combination = questionCombinations.find(({ code }) => code === combinationCodes);

    return question?.additionalText || null;
  }

  passCertificateNumberChanged(passCertificateNumber: string): void {
    this.store$.dispatch(PassCertificateNumberChanged(passCertificateNumber));

    if (!this.isDelegated) {
      this.store$.dispatch(PassCertificateNumberReceived(this.form.get('passCertificateNumberCtrl').valid));
    }
  }

  passCertificateDeclarationChanged(passCertificateSigned: boolean): void {
    this.store$.dispatch(PassCertificateNumberReceived(passCertificateSigned));
  }

  isFail(): boolean {
    return this.outcome === TestOutcome.FAIL;
  }

  isPass(): boolean {
    return this.outcome === TestOutcome.PASS;
  }

}
