import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { NavParamsMock } from '@pages/journal/components/journal-early-start-modal/__mocks__/nav-params.mock';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestReportDashboardPage } from '@pages/test-report-dashboard/test-report-dashboard.page';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';

describe('TestReportDashboardPage', () => {
  let fixture: ComponentFixture<TestReportDashboardPage>;
  let component: TestReportDashboardPage;
  const navMock: NavParamsMock = new NavParamsMock();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportDashboardPage,
      ],
      imports: [
        AppModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        TestReportValidatorProvider,
        TestResultProvider,
        {
          provide: NavParams,
          useFactory: () => navMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
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
