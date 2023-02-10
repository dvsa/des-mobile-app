import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import { IonicModule, ModalController } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestReportDashboardPage } from '@pages/test-report-dashboard/test-report-dashboard.page';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { ReviewFeedback } from '@pages/test-report-dashboard/components/review-feedback/review-feedback';
import { DashboardItemComponent } from '@pages/test-report-dashboard/components/dashboard-item/dashboard-item';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { TimerComponent } from '@pages/test-report/components/timer/timer';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  TestReportDashboardNavigateToPage,
} from '@pages/test-report-dashboard/test-report-dashboard.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FeedbackChanged } from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { TestResultProviderMock } from '@providers/test-result/__mocks__/test-result.mock';

describe('TestReportDashboardPage', () => {

  let fixture: ComponentFixture<TestReportDashboardPage>;
  let component: TestReportDashboardPage;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportDashboardPage,
        MockComponent(ReviewFeedback),
        MockComponent(DashboardItemComponent),
        MockComponent(PracticeModeBanner),
        MockComponent(TimerComponent),
      ],
      imports: [
        AppModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        TestReportValidatorProvider,
        { provide: TestResultProvider, useClass: TestResultProviderMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: ADI3AssessmentProvider, useClass: ADI3AssessmentProvider },
      ],
    });

    fixture = TestBed.createComponent(TestReportDashboardPage);
    component = fixture.componentInstance;
  }));

  describe('isValidDashboard', () => {
    it('should return true if testReportState is 17 and lessonAndThemeState and form are'
        + 'both valid', () => {
      component.testReportState = 17;
      component.lessonAndThemeState = { valid: true, score: 0 };
      component.form.clearValidators();

      expect(component.isValidDashboard).toEqual(true);
    });
    it('should return false if testReportState is not 17 and lessonAndThemeState and form are'
        + 'both valid', () => {
      component.testReportState = 0;
      component.lessonAndThemeState = { valid: true, score: 0 };
      component.form.clearValidators();

      expect(component.isValidDashboard).toEqual(false);
    });
    it('should return false if testReportState is 17 and lessonAndThemeState is not valid and form is '
        + 'valid', () => {
      component.testReportState = 17;
      component.lessonAndThemeState = { valid: false, score: 0 };
      component.form.clearValidators();

      expect(component.isValidDashboard).toEqual(false);
    });
    it('should return false if testReportState is 17 and lessonAndThemeState is valid and form is '
        + 'not valid', () => {
      component.testReportState = 17;
      component.lessonAndThemeState = { valid: true, score: 0 };
      component.form = new UntypedFormGroup({
        field: new FormControl(null, Validators.required),
      });

      expect(component.isValidDashboard).toEqual(false);
    });
  });

  describe('validateLessonTheme', () => {
    it('should return {false, 0} if none of the elements are present/valid', () => {
      expect(component.validateLessonTheme({
        lessonThemes: [],
        other: '',
        studentLevel: null,
      }))
        .toEqual({
          valid: false,
          score: 0,
        });
    });
    it('should return {false, 1} if 1 of the elements are present/valid', () => {
      expect(component.validateLessonTheme({
        lessonThemes: [],
        other: '',
        studentLevel: 'beginner',
      }))
        .toEqual({
          valid: false,
          score: 1,
        });
    });
    it('should return {true, 2} if both of the elements are present/valid', () => {
      expect(component.validateLessonTheme({
        lessonThemes: [],
        other: 'A',
        studentLevel: 'beginner',
      }))
        .toEqual({
          valid: true,
          score: 2,
        });
      expect(component.validateLessonTheme({
        lessonThemes: ['motorways'],
        other: '',
        studentLevel: 'beginner',
      }))
        .toEqual({
          valid: true,
          score: 2,
        });
    });
  });

  describe('feedbackChanged', () => {
    it('should dispatch store with correct parameters', () => {
      spyOn(component.store$, 'dispatch');
      component.feedbackChanged('feedback');
      expect(component.store$.dispatch).toHaveBeenCalledWith(FeedbackChanged('feedback'));
    });
  });

  describe('onContinueClick', () => {
    it('should call empty displayEndTestModal with no data if isTestReportPopulated is false'
        + ' or riskManagement.score is more than 8', async () => {
      spyOn(component, 'displayEndTestModal').and.callThrough();
      component.isTestReportPopulated = false;
      component.testDataADI3 = {
        lessonPlanning: { score: 10 },
        riskManagement: { score: 10 },
      };

      await component.onContinueClick();

      expect(component.displayEndTestModal).toHaveBeenCalled();
    });
    it('should create a modal and call displayEndTestModal with data'
        + ' if isTestReportPopulated is true riskManagement.score is less than 8', async () => {
      spyOn(component, 'displayEndTestModal').and.callThrough();
      spyOn(component.modalController, 'create').and.returnValue({
        present: async () => {},
        onDidDismiss: () => {},
        onWillDismiss: () => {},
      } as HTMLIonModalElement);
      spyOn(component.modalController, 'dismiss').and.callThrough();

      component.isTestReportPopulated = true;
      component.testDataADI3 = {
        lessonPlanning: { score: 10 },
        riskManagement: { score: 4 },
      };

      await component.onContinueClick();

      expect(component.modalController.create).toHaveBeenCalled();
      expect(component.displayEndTestModal).toHaveBeenCalledWith('testWill');
    });
  });

  describe('navigateToPage', () => {
    it('should dispatch TestReportDashboardNavigateToPage with the paramter passed', async () => {
      spyOn(component.store$, 'dispatch');

      await component.navigateToPage('lessonTheme');
      expect(component.store$.dispatch).toHaveBeenCalledWith(TestReportDashboardNavigateToPage('lessonTheme'));
    });
    it('should call navigateToPage with the correct parameters', async () => {
      spyOn(component['routeByCategory'], 'navigateToPage').and.callThrough();
      component.testReportState = 16;

      await component.navigateToPage('lessonTheme');
      expect(component['routeByCategory'].navigateToPage).toHaveBeenCalledWith(
        TestFlowPageNames.TEST_REPORT_PAGE,
        TestCategory.ADI3,
        { state: { page: 'lessonTheme', showMissing: true } },
      );
    });
  });
});
