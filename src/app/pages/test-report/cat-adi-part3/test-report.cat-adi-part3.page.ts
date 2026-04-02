import { Component, OnInit, computed } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TestData as CatADI3TestData, LessonTheme, StudentLevel } from '@dvsa/mes-test-schema/categories/ADI3';
import { NavController } from '@ionic/angular';
import { AssessmentOverallScoreChanged } from '@pages/test-report/cat-adi-part3/test-report.cat-adi-part3.actions';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import {
  LessonThemeAdded,
  LessonThemeChanged,
  LessonThemeRemoved,
  OtherChanged,
  StudentLevelChanged,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.actions';
import {
  selectLessonThemes,
  selectOther,
  selectStudentLevel,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.selector';
import { LessonPlanningQuestionScoreChanged } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.actions';
import { selectLessonPlanning } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.selector';
import { RiskManagementQuestionScoreChanged } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.actions';
import { selectRiskManagement } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.selector';
import { TeachingLearningStrategiesQuestionScoreChanged } from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.actions';
import { selectTeachingLearningScore } from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.selector';

@Component({
  selector: 'app-test-report-cat-adi3',
  templateUrl: './test-report.cat-adi-part3.page.html',
  styleUrls: ['./test-report.cat-adi-part3.page.scss'],
  standalone: false,
})
export class TestReportCatADI3Page extends TestReportBasePageComponent implements OnInit {
  form: UntypedFormGroup;
  page: 'lessonTheme' | 'testReport' = null;
  showMissing = false;

  studentLevel = this.store$.selectSignal(selectStudentLevel);
  lessonThemes = this.store$.selectSignal(selectLessonThemes);
  otherReason = this.store$.selectSignal(selectOther);
  lessonPlanning = this.store$.selectSignal(selectLessonPlanning);
  riskManagement = this.store$.selectSignal(selectRiskManagement);
  teachingLearningStrategies = this.store$.selectSignal(selectTeachingLearningScore);
  totalScore = computed(() => this.adi3AssessmentProvider.getTotalAssessmentScore(this.testData() as CatADI3TestData));

  constructor(
    public navController: NavController,
    public adi3AssessmentProvider: ADI3AssessmentProvider
  ) {
    super();
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    this.page = this.router.getCurrentNavigation()?.extras?.state?.page;
    this.showMissing = this.router.getCurrentNavigation()?.extras?.state?.showMissing;

    super.onInitialisation();
  }

  studentLevelChanged = (studentLeveL: StudentLevel): void => {
    this.store$.dispatch(StudentLevelChanged(studentLeveL));
  };

  lessonThemeChanged = ({ lessonTheme, added }: { lessonTheme: LessonTheme; added: boolean }): void => {
    this.store$.dispatch(LessonThemeChanged(lessonTheme as LessonTheme));
    if (added) {
      this.store$.dispatch(LessonThemeAdded(lessonTheme));
    } else {
      this.store$.dispatch(LessonThemeRemoved(lessonTheme));
    }
  };

  otherReasonChanged = (otherReason: string): void => {
    this.store$.dispatch(OtherChanged(otherReason));
  };

  lessonPlanningChanged = ({ question, answer }: { question: number; answer: number }): void => {
    this.store$.dispatch(LessonPlanningQuestionScoreChanged(question, answer));
  };

  riskManagementChanged = ({ question, answer }: { question: number; answer: number }): void => {
    this.store$.dispatch(RiskManagementQuestionScoreChanged(question, answer));
  };

  teachingLearningStrategyChanged = ({ question, answer }: { question: number; answer: number }): void => {
    this.store$.dispatch(TeachingLearningStrategiesQuestionScoreChanged(question, answer));
  };

  countScore() {
    return this.adi3AssessmentProvider.countScoreIfTouched(this.testData() as CatADI3TestData);
  }

  onContinueClick = (totalScore: number): void => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.invalid) {
      return;
    }
    this.store$.dispatch(AssessmentOverallScoreChanged(totalScore));
    this.navController.back();
  };
}
