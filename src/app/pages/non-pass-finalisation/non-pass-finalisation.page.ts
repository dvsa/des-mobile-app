import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { merge, Observable, Subscription } from 'rxjs';
import { ActivityCodeModel, activityCodeModelList } from '@shared/constants/activity-code/activity-code.constants';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { FormGroup } from '@angular/forms';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import {
  getActivityCode,
  getCurrentTest,
  getJournalData,
  getTestOutcome,
  getTestOutcomeText,
  isTestOutcomeSet,
} from '@store/tests/tests.selector';
import { map, withLatestFrom } from 'rxjs/operators';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  formatDriverNumber,
  getCandidateDriverNumber,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getD255, isDebriefWitnessed } from '@store/tests/test-summary/test-summary.selector';
import { isWelshTest } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { getTestSlotAttributes }
  from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { hasEyesightTestGotSeriousFault } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import {
  NonPassFinalisationReportActivityCode,
  NonPassFinalisationValidationError,
  NonPassFinalisationViewDidEnter,
} from '@pages/non-pass-finalisation/non-pass-finalisation.actions';
import { ActivityCodeFinalisationProvider } from '@providers/activity-code-finalisation/activity-code-finalisation';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import {
  D255No,
  D255Yes,
  DebriefUnWitnessed,
  DebriefWitnessed,
} from '@store/tests/test-summary/test-summary.actions';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { getTestCategory } from '@store/tests/category/category.reducer';
import {
  TestFinalisationInvalidTestDataModal,
} from
  '@pages/test-report/components/test-finalisation-invalid-test-data-modal/test-finalisation-invalid-test-data-modal';

interface NonPassFinalisationPageState {
  candidateName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  isTestOutcomeSet$: Observable<boolean>;
  testOutcome$: Observable<string>;
  testOutcomeText$: Observable<string>;
  activityCode$: Observable<ActivityCodeModel>;
  displayDebriefWitnessed$: Observable<boolean>;
  debriefWitnessed$: Observable<boolean>;
  displayD255$: Observable<boolean>;
  d255$: Observable<boolean>;
  isWelshTest$: Observable<boolean>;
  testData$: Observable<CatBUniqueTypes.TestData>;
  slotId$: Observable<string>;
  eyesightTestFailed$: Observable<boolean>;
  testCategory$: Observable<CategoryCode>;
}

@Component({
  selector: 'app-non-pass-finalisation',
  templateUrl: './non-pass-finalisation.page.html',
  styleUrls: ['./non-pass-finalisation.page.scss'],
})
export class NonPassFinalisationPage extends PracticeableBasePageComponent implements OnInit {

  pageState: NonPassFinalisationPageState;
  form: FormGroup;
  activityCodeOptions: ActivityCodeModel[];
  slotId: string;
  testData: CatBUniqueTypes.TestData;
  activityCode: ActivityCodeModel;
  subscription: Subscription;
  invalidTestDataModal: HTMLIonModalElement;
  testCategory: CategoryCode;

  constructor(
    private navController: NavController,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
    public activityCodeFinalisationProvider: ActivityCodeFinalisationProvider,
    public modalController: ModalController,
    private route: ActivatedRoute,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new FormGroup({});
    const { behaviourMap } = this.route.snapshot.data;
    this.activityCodeOptions = activityCodeModelList;
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );
    this.pageState = {
      slotId$: this.store$.pipe(
        select(getTests),
        map((tests) => tests.currentTest.slotId),
      ),
      candidateName$: currentTest$.pipe(
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
      isTestOutcomeSet$: currentTest$.pipe(
        select(isTestOutcomeSet),
      ),
      testOutcome$: currentTest$.pipe(
        select(getTestOutcome),
      ),
      testOutcomeText$: currentTest$.pipe(
        select(getTestOutcomeText),
      ),
      activityCode$: currentTest$.pipe(
        select(getActivityCode),
      ),
      displayDebriefWitnessed$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(isDebriefWitnessed),
        )),
        map(([outcome, debrief]) =>
          this.outcomeBehaviourProvider.isVisible(outcome, 'debriefWitnessed', debrief)),
      ),
      debriefWitnessed$: currentTest$.pipe(
        select(getTestSummary),
        select(isDebriefWitnessed),
      ),
      displayD255$: currentTest$.pipe(
        select(getTestOutcome),
        withLatestFrom(currentTest$.pipe(
          select(getTestSummary),
          select(getD255),
        )),
        map(([outcome, d255]) => this.outcomeBehaviourProvider.isVisible(outcome, 'd255', d255)),
      ),
      d255$: currentTest$.pipe(
        select(getTestSummary),
        select(getD255),
      ),
      isWelshTest$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(isWelshTest),
      ),
      testData$: currentTest$.pipe(
        select(getTestData),
      ),
      eyesightTestFailed$: currentTest$.pipe(
        select(getTestData),
        select(hasEyesightTestGotSeriousFault),
      ),
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
      ),
    };

    const {
      testData$, slotId$, activityCode$, testCategory$,
    } = this.pageState;

    this.subscription = merge(
      slotId$.pipe(map((slotId) => this.slotId = slotId)),
      testData$.pipe(map((testData) => this.testData = testData)),
      activityCode$.pipe(map((activityCode) => this.activityCode = activityCode)),
      testCategory$.pipe(map((result) => this.testCategory = result)),
    ).subscribe();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(NonPassFinalisationViewDidEnter());
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openTestDataValidationModal = async (): Promise<void> => {
    this.invalidTestDataModal = await this.modalController.create({
      id: 'TestFinalisationInvalidTestDataModal',
      component: TestFinalisationInvalidTestDataModal,
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        onCancel: this.onCancel,
        onReturnToTestReport: this.onReturnToTestReport,
      },
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
    await this.invalidTestDataModal.present();
  };

  onCancel = async (): Promise<void> => {
    await this.invalidTestDataModal.dismiss();
  };

  onReturnToTestReport = async (): Promise<void> => {
    await this.invalidTestDataModal.dismiss();
    await this.routeByCat.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory as TestCategory);
  };

  async continue() {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (this.form.valid) {
      const testDataIsInvalid = await this.activityCodeFinalisationProvider
        .testDataIsInvalid(this.testCategory, this.activityCode.activityCode, this.testData);

      if (testDataIsInvalid) {
        await this.openTestDataValidationModal();
        return;
      }

      this.store$.dispatch(NonPassFinalisationReportActivityCode(this.activityCode.activityCode));
      await this.routeByCat.navigateToPage(TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE);
      return;
    }
    Object.keys(this.form.controls).forEach((controlName) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(NonPassFinalisationValidationError(`${controlName} is blank`));
      }
    });
  }

  activityCodeChanged(activityCodeModel: ActivityCodeModel) {
    this.activityCode = activityCodeModel;
    this.store$.dispatch(SetActivityCode(activityCodeModel.activityCode));
  }

  debriefWitnessedChanged(debriefWitnessed: boolean) {
    this.store$.dispatch(debriefWitnessed ? DebriefWitnessed() : DebriefUnWitnessed());
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
  async navigateToDebrief(): Promise<void> {
    await this.router.navigate([TestFlowPageNames.DEBRIEF_PAGE])
  }
}
