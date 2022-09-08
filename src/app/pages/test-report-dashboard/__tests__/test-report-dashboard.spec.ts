import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
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

describe('TestReportDashboardPage', () => {
  let fixture: ComponentFixture<TestReportDashboardPage>;
  let component: TestReportDashboardPage;

  configureTestSuite(() => {
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
        TestResultProvider,
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: ADI3AssessmentProvider, useClass: ADI3AssessmentProvider },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestReportDashboardPage);
    component = fixture.componentInstance;
  }));

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
});
