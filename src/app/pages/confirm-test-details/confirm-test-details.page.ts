import { Component, OnInit, Signal, computed, effect } from '@angular/core';
import { LessonTheme } from '@dvsa/mes-test-schema/categories/ADI3';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController, NavController, ViewDidEnter, ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { VehicleDetailsByCategoryProvider } from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { lessonThemeValues, studentValues } from '@shared/constants/adi3-questions/lesson-theme.constants';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import {
  selectCandidateName,
  selectUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { selectTestStartDateTime } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { getCode78 } from '@store/tests/pass-completion/cat-d/pass-completion.cat-d.selector';
import { getPassCompletion } from '@store/tests/pass-completion/pass-completion.reducer';
import { isProvisionalLicenseProvided } from '@store/tests/pass-completion/pass-completion.selector';
import { getLessonAndTheme } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import {
  getLessonThemes,
  getOther,
  getStudentLevel,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.selector';
import { getLessonPlanning } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.reducer';
import { getLessonPlanningScore } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.selector';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getGrade } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getRiskManagement } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.reducer';
import { getRiskManagementScore } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.selector';
import { getTeachingLearningStrategies } from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.reducer';
import { getTeachingLearningScore } from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { SetTestStatusWriteUp } from '@store/tests/test-status/test-status.actions';
import { getTestSummary } from '@store/tests/test-summary/test-summary.reducer';
import { getD255 } from '@store/tests/test-summary/test-summary.selector';
import { PersistTests } from '@store/tests/tests.actions';
import { TestOutcome } from '@store/tests/tests.constants';
import {
  getActivityCode,
  getCurrentTestSlotId,
  getTestOutcomeText,
  selectCurrentTest,
  selectTests,
} from '@store/tests/tests.selector';
import { getGearboxCategory } from '@store/tests/vehicle-details/vehicle-details.selector';
import { TestFlowPageNames } from '../page-names.constants';
import { ConfirmSubmitModal } from './components/confirm-submit-modal/confirm-submit-modal';
import { BackButtonClick, BackToDebrief, ConfirmTestDetailsViewDidEnter } from './confirm-test-details.actions';

enum LicenceReceivedText {
  TRUE = 'Yes - Please retain the candidates licence.',
  FALSE = 'No - Please ensure that the licence is kept by the candidate.',
}

enum D255 {
  TRUE = 'Yes - Please complete a D255.',
  FALSE = 'No',
}

@Component({
  selector: 'confirm-test-details-page',
  templateUrl: 'confirm-test-details.page.html',
  styleUrls: ['confirm-test-details.page.scss'],
  standalone: false,
})
export class ConfirmTestDetailsPage
  extends PracticeableBasePageComponent
  implements OnInit, ViewWillEnter, ViewDidLeave, ViewDidEnter
{
  category: TestCategory;
  testOutcome: string;
  candidateName: string;
  slotId: string;
  idPrefix = 'confirm-test-details';

  tests = this.store$.selectSignal(selectTests);
  currentTest = this.store$.selectSignal(selectCurrentTest);
  categorySignal: Signal<TestCategory> = this.store$.selectSignal(selectTestCategory) as Signal<TestCategory>;
  slotIdSignal = computed(() => getCurrentTestSlotId(this.tests()));
  candidateUntitledName = this.store$.selectSignal(selectUntitledCandidateName);
  candidateNameSignal = this.store$.selectSignal(selectCandidateName);
  startDateTime = this.store$.selectSignal(selectTestStartDateTime);

  testOutcomeText = computed(() => {
    const test = this.currentTest();
    return test ? getTestOutcomeText(test) : null;
  });

  activityCodeSignal = computed(() => {
    const test = this.currentTest();
    return test ? getActivityCode(test as never) : null;
  });

  transmission = computed(() => {
    const test = this.currentTest();
    const category = this.categorySignal();
    if (!test || !category) {
      return null;
    }
    const vehicleDetails = this.vehicleDetailsProvider.getVehicleDetailsByCategoryCode(category)?.vehicleDetails(test);
    return vehicleDetails ? getGearboxCategory(vehicleDetails) : null;
  });

  d255 = computed(() => {
    const test = this.currentTest();
    return test ? getD255(getTestSummary(test as never)) : null;
  });

  passCompletion = computed(() => {
    const test = this.currentTest();
    return test ? getPassCompletion(test as never) : null;
  });

  code78 = computed(() => {
    if (this.categorySignal() === TestCategory.ADI2) {
      return null;
    }
    return getCode78(this.passCompletion() as never);
  });

  provisionalLicense = computed(() => {
    if (this.categorySignal() === TestCategory.ADI2) {
      return null;
    }
    return isProvisionalLicenseProvided(this.passCompletion() as never);
  });

  adi3TestData = computed(() => {
    const test = this.currentTest();
    if (!test || !isAnyOf(this.categorySignal(), [TestCategory.ADI3, TestCategory.SC])) {
      return null;
    }
    return getTestData(test as never);
  });

  lessonAndTheme = computed(() => {
    const testData = this.adi3TestData();
    return testData ? getLessonAndTheme(testData as never) : null;
  });

  review = computed(() => {
    const testData = this.adi3TestData();
    return testData ? getReview(testData as never) : null;
  });

  testOutcomeFullResult = computed(() => {
    const review = this.review();
    if (!review) {
      return null;
    }
    return `Passed - Grade ${getGrade(review)}`;
  });

  studentLevel = computed(() => {
    const lessonAndTheme = this.lessonAndTheme();
    return lessonAndTheme ? studentValues[getStudentLevel(lessonAndTheme)] : null;
  });

  lessonTheme = computed(() => {
    const lessonAndTheme = this.lessonAndTheme();
    if (!lessonAndTheme) {
      return [];
    }
    const themes = getLessonThemes(lessonAndTheme as never);
    const otherReason = getOther(lessonAndTheme as never);
    return themes
      .map((theme: LessonTheme) => lessonThemeValues[theme])
      .filter((theme) => theme !== lessonThemeValues.other)
      .concat(otherReason || null)
      .filter((theme) => theme);
  });

  lessonPlanningScore = computed(() => {
    const testData = this.adi3TestData();
    return testData ? getLessonPlanningScore(getLessonPlanning(testData as never)) : null;
  });

  riskManagementScore = computed(() => {
    const testData = this.adi3TestData();
    return testData ? getRiskManagementScore(getRiskManagement(testData as never)) : null;
  });

  teachingLearningStrategyScore = computed(() => {
    const testData = this.adi3TestData();
    return testData ? getTeachingLearningScore(getTeachingLearningStrategies(testData as never)) : null;
  });

  totalScore = computed(() => {
    const testData = this.adi3TestData();
    return testData ? this.adi3AssessmentProvider.getTotalAssessmentScore(testData) : null;
  });

  constructor(
    public navController: NavController,
    public vehicleDetailsProvider: VehicleDetailsByCategoryProvider,
    public adi3AssessmentProvider: ADI3AssessmentProvider,
    private modalController: ModalController
  ) {
    super(false);

    effect(() => {
      this.category = this.categorySignal();
    });

    effect(() => {
      this.testOutcome = this.testOutcomeText();
    });

    effect(() => {
      this.candidateName = this.candidateUntitledName();
    });

    effect(() => {
      this.slotId = this.slotIdSignal();
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ionViewWillEnter(): boolean {
    return true;
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(ConfirmTestDetailsViewDidEnter());
    this.store$.dispatch(ClearCandidateLicenceData());
  }

  isADI3 = (category: TestCategory): boolean => isAnyOf(category, [TestCategory.ADI3, TestCategory.SC]);

  displayForCategory = (category: TestCategory): boolean =>
    isAnyOf(category, [
      TestCategory.ADI2,
      TestCategory.ADI3,
      TestCategory.SC,
      TestCategory.CM,
      TestCategory.C1M,
      TestCategory.CEM,
      TestCategory.C1EM,
      TestCategory.DM,
      TestCategory.D1M,
      TestCategory.DEM,
      TestCategory.D1EM,
      TestCategory.CCPC,
      TestCategory.DCPC,
    ]);

  displayD255 = (category: TestCategory): boolean =>
    isAnyOf(category, [
      TestCategory.ADI2,
      TestCategory.ADI3,
      TestCategory.SC,
      TestCategory.CM,
      TestCategory.C1M,
      TestCategory.CEM,
      TestCategory.C1EM,
      TestCategory.DM,
      TestCategory.D1M,
      TestCategory.DEM,
      TestCategory.D1EM,
      TestCategory.CCPC,
      TestCategory.DCPC,
    ]);

  async goBackToDebrief(): Promise<void> {
    this.store$.dispatch(BackToDebrief());
    await this.navController.navigateBack(TestFlowPageNames.DEBRIEF_PAGE);
  }

  isPassed(testResult: string): boolean {
    return testResult === TestOutcome.Passed;
  }

  getActivityCode(activityCodeModel: ActivityCodeModel | null): string {
    if (!activityCodeModel) {
      return '';
    }
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
