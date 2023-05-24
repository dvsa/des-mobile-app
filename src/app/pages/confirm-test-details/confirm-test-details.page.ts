import { Component } from '@angular/core';
import { merge, Observable, Subscription } from 'rxjs';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { getTests } from '@store/tests/tests.reducer';
import {
  getActivityCode,
  getCurrentTest,
  getCurrentTestSlotId,
  getJournalData,
  getTestOutcomeText,
} from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  getCandidateName,
  getUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  getTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  filter, map, take, tap, withLatestFrom,
} from 'rxjs/operators';
import {
  getTestStartDateTime,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { isProvisionalLicenseProvided } from '@store/tests/pass-completion/pass-completion.selector';
import { getGearboxCategory } from '@store/tests/vehicle-details/vehicle-details.selector';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { getD255 } from '@store/tests/test-summary/test-summary.selector';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import { VehicleDetailsByCategoryProvider } from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { TestOutcome } from '@store/tests/tests.constants';
import { SetTestStatusWriteUp } from '@store/tests/test-status/test-status.actions';
import { PersistTests } from '@store/tests/tests.actions';
import { getCode78 } from '@store/tests/pass-completion/cat-d/pass-completion.cat-d.selector';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { getLessonAndTheme } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import {
  getLessonThemes,
  getOther,
  getStudentLevel,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.selector';
import { lessonThemeValues, studentValues } from '@shared/constants/adi3-questions/lesson-theme.constants';
import { getLessonPlanning } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.reducer';
import { getLessonPlanningScore } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.selector';
import { getRiskManagement } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.reducer';
import { getRiskManagementScore } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.selector';
import {
  getTeachingLearningStrategies,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.reducer';
import {
  getTeachingLearningScore,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.selector';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { LessonTheme } from '@dvsa/mes-test-schema/categories/ADI3';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getGrade } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { ConfirmSubmitModal } from './components/confirm-submit-modal/confirm-submit-modal';
import { BackButtonClick, BackToDebrief, ConfirmTestDetailsViewDidEnter } from './confirm-test-details.actions';
import { TestFlowPageNames } from '../page-names.constants';

interface ConfirmTestDetailsPageState {
  candidateUntitledName$: Observable<string>;
  candidateName$: Observable<string>;
  startDateTime$: Observable<string>;
  testOutcomeText$: Observable<string>;
  activityCode$: Observable<ActivityCodeModel>;
  testCategory$: Observable<TestCategory>;
  provisionalLicense$?: Observable<boolean>;
  transmission$: Observable<GearboxCategory>;
  code78$?: Observable<boolean>;
  d255$: Observable<boolean>;
  slotId$: Observable<string>;
  testOutcomeFullResult$: Observable<string>;
  studentLevel$: Observable<string>;
  lessonTheme$: Observable<string>;
  lessonPlanningScore$: Observable<number>;
  riskManagementScore$: Observable<number>;
  teachingLearningStrategyScore$: Observable<number>;
  totalScore$: Observable<number>;
}

enum LicenceReceivedText {
  TRUE = 'Yes - Please retain the candidates licence',
  FALSE = 'No - Please ensure that the licence is kept by the candidate',
}

enum D255 {
  TRUE = 'Yes - Please complete a D255',
  FALSE = 'No',
}

@Component({
  selector: 'confirm-test-details-page',
  templateUrl: 'confirm-test-details.page.html',
  styleUrls: ['confirm-test-details.page.scss'],
})
export class ConfirmTestDetailsPage extends PracticeableBasePageComponent {

  pageState: ConfirmTestDetailsPageState;
  category: TestCategory;
  testOutcome: string;
  candidateName: string;
  subscription: Subscription;
  merged$: Observable<boolean | string>;
  slotId: string;
  idPrefix: string = 'confirm-test-details';

  constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    store$: Store<StoreModel>,
    public navController: NavController,
    public vehicleDetailsProvider: VehicleDetailsByCategoryProvider,
    public adi3AssessmentProvider: ADI3AssessmentProvider,
    private modalController: ModalController,
  ) {
    super(platform, authenticationProvider, router, store$, false);
  }

  ngOnInit(): void {
    super.ngOnInit();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    const category$ = currentTest$.pipe(
      select(getTestCategory),
      take(1),
    );

    this.pageState = {
      slotId$: this.store$.pipe(
        select(getTests),
        map(getCurrentTestSlotId),
        take(1),
      ),
      candidateUntitledName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getUntitledCandidateName),
        take(1),
      ),
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateName),
        take(1),
      ),
      startDateTime$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(getTestStartDateTime),
        take(1),
      ),
      testOutcomeText$: currentTest$.pipe(
        select(getTestOutcomeText),
        take(1),
      ),
      activityCode$: currentTest$.pipe(
        select(getActivityCode),
        take(1),
      ),
      testCategory$: category$.pipe(
        map((testCategory) => testCategory as TestCategory),
      ),
      transmission$: currentTest$.pipe(
        withLatestFrom(category$),
        map((
          [testResult, category],
        ) => this.vehicleDetailsProvider.getVehicleDetailsByCategoryCode(category)
          ?.vehicleDetails(testResult)),
        select(getGearboxCategory),
        take(1),
      ),
      d255$: currentTest$.pipe(
        select(getTestSummary),
        select(getD255),
        take(1),
      ),
      code78$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category !== TestCategory.ADI2),
        map(([testResult]) => testResult),
        select(getPassCompletion),
        select(getCode78),
        take(1),
      ),
      provisionalLicense$: currentTest$.pipe(
        withLatestFrom(category$),
        filter(([, category]) => category !== TestCategory.ADI2),
        map(([testResult]) => testResult),
        select(getPassCompletion),
        map(isProvisionalLicenseProvided),
        take(1),
      ),
      // ADI3 & SC additional fields
      testOutcomeFullResult$: currentTest$.pipe(
        withLatestFrom(category$),
        filter((
          [, category],
        ) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([testResult]) => testResult),
        select(getTestData),
        select(getReview),
        select(getGrade),
        map((grade) => `Passed - Grade ${grade}`),
        take(1),
      ),
      studentLevel$: currentTest$.pipe(
        withLatestFrom(category$),
        filter((
          [, category],
        ) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([testResult]) => testResult),
        select(getTestData),
        select(getLessonAndTheme),
        select(getStudentLevel),
        map((level) => studentValues[level]),
        take(1),
      ),
      lessonTheme$: currentTest$.pipe(
        withLatestFrom(category$),
        filter((
          [, category],
        ) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([testResult]) => testResult),
        select(getTestData),
        select(getLessonAndTheme),
        select(getLessonThemes),
        withLatestFrom(
          currentTest$.pipe(
            select(getTestData),
            select(getLessonAndTheme),
            select(getOther),
          ),
        ),
        map(([themes, otherReason]: [LessonTheme[], string]) => themes
          .map((theme) => lessonThemeValues[theme])
          .concat(otherReason || null)
          .filter((theme) => theme && theme !== 'Other')
          .join(', ')),
        take(1),
      ),
      lessonPlanningScore$: currentTest$.pipe(
        withLatestFrom(category$),
        filter((
          [, category],
        ) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([testResult]) => testResult),
        select(getTestData),
        select(getLessonPlanning),
        select(getLessonPlanningScore),
        take(1),
      ),
      riskManagementScore$: currentTest$.pipe(
        withLatestFrom(category$),
        filter((
          [, category],
        ) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([testResult]) => testResult),
        select(getTestData),
        select(getRiskManagement),
        select(getRiskManagementScore),
        take(1),
      ),
      teachingLearningStrategyScore$: currentTest$.pipe(
        withLatestFrom(category$),
        filter((
          [, category],
        ) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([testResult]) => testResult),
        select(getTestData),
        select(getTeachingLearningStrategies),
        select(getTeachingLearningScore),
        take(1),
      ),
      totalScore$: currentTest$.pipe(
        withLatestFrom(category$),
        filter((
          [, category],
        ) => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])),
        map(([testResult]) => testResult),
        select(getTestData),
        map((data) => this.adi3AssessmentProvider.getTotalAssessmentScore(data)),
        take(1),
      ),
    };
    const {
      testCategory$,
      testOutcomeText$,
      candidateUntitledName$,
      slotId$,
    } = this.pageState;

    this.merged$ = merge(
      testCategory$.pipe(map((value) => this.category = value)),
      testOutcomeText$.pipe(map((value) => this.testOutcome = value)),
      candidateUntitledName$.pipe(tap((value) => this.candidateName = value)),
      slotId$.pipe(map((slotId) => this.slotId = slotId)),
    );
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    return true;
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(ConfirmTestDetailsViewDidEnter());
    this.store$.dispatch(ClearCandidateLicenceData());
  }

  isADI3(category: TestCategory): boolean {
    return category === TestCategory.ADI3 || category === TestCategory.SC;
  }

  displayForCategory = (category: TestCategory): boolean => isAnyOf(category, [
    TestCategory.ADI2,
    TestCategory.ADI3,
    TestCategory.SC,
    TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
    TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
    TestCategory.CCPC, TestCategory.DCPC,
  ]);

  displayD255 = (category: TestCategory): boolean => isAnyOf(category, [
    TestCategory.ADI2,
    TestCategory.ADI3,
    TestCategory.SC,
    TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
    TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
    TestCategory.CCPC, TestCategory.DCPC,
  ]);

  async goBackToDebrief(): Promise<void> {
    this.store$.dispatch(BackToDebrief());
    await this.navController.navigateBack(TestFlowPageNames.DEBRIEF_PAGE);
  }

  isPassed(testResult: string): boolean {
    return testResult === TestOutcome.Passed;
  }

  getActivityCode(activityCodeModel: ActivityCodeModel): string {
    return `${activityCodeModel.activityCode} - ${activityCodeModel.description}`;
  }

  getProvisionalText(received: boolean): LicenceReceivedText {
    return received ? LicenceReceivedText.TRUE : LicenceReceivedText.FALSE;
  }

  getD255Text(d255: boolean): D255 {
    return d255 ? D255.TRUE : D255.FALSE;
  }

  async onSubmit() {
    await this.showConfirmTestDetailsModal();
  }

  async showConfirmTestDetailsModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'ConfirmSubmitModal',
      component: ConfirmSubmitModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        onTestDetailsConfirm: this.onTestDetailsConfirm,
        testOutcome: this.testOutcome,
        category: this.category,
        candidateName: this.candidateName,
      },
    });
    await modal.present();
  }

  onTestDetailsConfirm = async (): Promise<void> => {
    this.store$.dispatch(SetTestStatusWriteUp(this.slotId));
    this.store$.dispatch(PersistTests());
    await this.router.navigate([TestFlowPageNames.BACK_TO_OFFICE_PAGE], { replaceUrl: true });
  };

  backButtonClick = (): void => {
    this.store$.dispatch(BackButtonClick());
  };
}
