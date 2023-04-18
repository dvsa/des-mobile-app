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
import { TestReportDashboardNavigateToPage } from '@pages/test-report-dashboard/test-report-dashboard.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FeedbackChanged, GradeChanged } from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { TestResultProviderMock } from '@providers/test-result/__mocks__/test-result.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { Subscription } from 'rxjs';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { DateTimeInputComponent } from '@components/common/datetime-input/date-time-input.component';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import { BikeCategoryTypeComponent } from '@components/common/bike-category-type/bike-category-type';
import { CommonModule } from '@angular/common';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { ErrorMessageComponent } from '@components/common/error-message/error-message';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TabComponent } from '@components/common/tab/tab';
import { TabsComponent } from '@components/common/tabs/tabs';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import {
  HealthDeclarationSignedComponent,
} from '@components/common/health-declaration-signed/health-declaration-signed';
import { IncompleteTestsBanner } from '@components/common/incomplete-tests-banner/incomplete-tests-banner';
import { ModalReturnButtonComponent } from '@components/common/modal-return-button/modal-return-button';
import { ModalActivityCodeListComponent } from '@components/common/modal-activity-code-list/modal-activity-code-list';
import { LockScreenIndicator } from '@components/common/screen-lock-indicator/lock-screen-indicator';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { CPCDebriefCardComponent } from '@components/common/cpc-debrief-card/cpc-debrief-card';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { DisplayAddressComponent } from '@components/common/display-address/display-address';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { SignatureComponent } from '@components/common/signature/signature';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { TransmissionDisplayComponent } from '@components/common/transmission-display/transmission-display';
import { Adi3DebriefCard } from '@components/common/adi3-debrief-card/adi3-debrief-card';
import { Adi3DebriefCardBox } from '@components/common/adi3-debrief-card-box/adi3-debrief-card-box';
import {
  SearchablePicklistComponentWrapper,
} from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { SearchablePicklistModal } from '@components/common/searchable-picklist-modal/searchable-picklist-modal';
import { CalculateTestResult, ReturnToTest, TerminateTestFromTestReport } from '@pages/test-report/test-report.actions';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { TestsModel } from '@store/tests/tests.model';
import { StoreModel } from '@shared/models/store.model';
import { provideMockStore } from '@ngrx/store/testing';

describe('TestReportDashboardPage', () => {
  let fixture: ComponentFixture<TestReportDashboardPage>;
  let component: TestReportDashboardPage;
  let routeByCategory: RouteByCategoryProvider;

  const initialState = {
    appInfo: { employeeId: '123456' },
    tests: {
      currentTest: {
        slotId: '123',
      },
      testStatus: {},
      startedTests: {
        123: {
          category: TestCategory.B,
          journalData: {
            candidate: {
              candidateName: {
                firstName: 'firstName',
                lastName: 'lastName',
              },
            },
          },
          communicationPreferences: {
            conductedLanguage: 'English',
          },
          testData: {
            ETA: {
              physical: true,
            },
            eco: {
              completed: true,
            },
            seriousFaults: {
              controlsAccelerator: true,
            },
            dangerousFaults: {
              positioningNormalDriving: true,
            },
            drivingFaults: {
              controlsAccelerator: 1,
              judgementOvertaking: 1,
            },
          },
        } as CatBUniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportDashboardPage,
        MockComponent(ReviewFeedback),
        MockComponent(DashboardItemComponent),
        MockComponent(PracticeModeBanner),
        MockComponent(TimerComponent),
        MockComponent(DateTimeInputComponent),
        MockComponent(BikeCategoryTypeComponent),
        MockComponent(SignatureAreaComponent),
        MockComponent(CandidateSectionComponent),
        MockComponent(DangerousFaultBadgeComponent),
        MockComponent(DataRowComponent),
        MockComponent(EndTestLinkComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(OfflineBannerComponent),
        MockComponent(TabComponent),
        MockComponent(TabsComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(HealthDeclarationSignedComponent),
        MockComponent(IncompleteTestsBanner),
        MockComponent(ModalAlertTitleComponent),
        MockComponent(ModalReturnButtonComponent),
        MockComponent(ModalActivityCodeListComponent),
        MockComponent(LockScreenIndicator),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(DisplayAddressComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(TickIndicatorComponent),
        MockComponent(TransmissionComponent),
        MockComponent(SignatureComponent),
        MockComponent(ActivityCodeComponent),
        MockComponent(TransmissionDisplayComponent),
        MockComponent(CPCDebriefCardComponent),
        MockComponent(Adi3DebriefCard),
        MockComponent(Adi3DebriefCardBox),
        MockComponent(SearchablePicklistComponentWrapper),
        MockComponent(SearchablePicklistModal),
        MockComponent(DisplayAddressComponent),
        MockComponent(DrivingFaultsBadgeComponent),
      ],
      imports: [
        AppModule,
        IonicModule,
        ComponentsModule,
        CommonModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        TestReportValidatorProvider,
        { provide: TestResultProvider, useClass: TestResultProviderMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: ADI3AssessmentProvider, useClass: ADI3AssessmentProvider },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });
    fixture = TestBed.createComponent(TestReportDashboardPage);
    component = fixture.componentInstance;
    routeByCategory = TestBed.inject(RouteByCategoryProvider);
    spyOn(routeByCategory, 'navigateToPage');
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
      spyOn(component, 'displayEndTestModal');
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve({
        present: async () => {},
        onWillDismiss: () => { return Promise.resolve({ data: true }); },
      } as HTMLIonModalElement));
      spyOn(component.modalController, 'dismiss').and.callThrough();
      component.isTestReportPopulated = true;
      component.testDataADI3 = {
        lessonPlanning: { score: 10 },
        riskManagement: { score: 4 },
      };
      await component.onContinueClick();
      expect(component.modalController.create).toHaveBeenCalled();
      expect(component.displayEndTestModal).toHaveBeenCalledWith(true);
    });
  });
  describe('ionViewDidLeave', () => {
    it('should call basePage functions and unsubscribe from subscription if there is one', () => {
      component.localSubscription = new Subscription();
      spyOn(TestReportBasePageComponent.prototype, 'ionViewDidLeave');
      spyOn(TestReportBasePageComponent.prototype, 'cancelSubscription');
      spyOn(component.localSubscription, 'unsubscribe');

      component.ionViewDidLeave();
      expect(TestReportBasePageComponent.prototype.ionViewDidLeave).toHaveBeenCalled();
      expect(TestReportBasePageComponent.prototype.cancelSubscription).toHaveBeenCalled();
      expect(component.localSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
  describe('navigateToPage', () => {
    it('should dispatch TestReportDashboardNavigateToPage with the parameter passed', async () => {
      spyOn(component.store$, 'dispatch');
      await component.navigateToPage('lessonTheme');
      expect(component.store$.dispatch).toHaveBeenCalledWith(TestReportDashboardNavigateToPage('lessonTheme'));
    });
    it('should call navigateToPage with the correct parameters', async () => {
      component.testCategory = TestCategory.ADI3;
      component.testReportState = 16;
      await component.navigateToPage('lessonTheme');
      expect(routeByCategory.navigateToPage).toHaveBeenCalledWith(
        TestFlowPageNames.TEST_REPORT_PAGE,
        TestCategory.ADI3,
        { state: { page: 'lessonTheme', showMissing: true } },
      );
    });
  });

  describe('onModalDismiss', () => {
    it('should dispatch GradeChanged with passed grade, CalculateTestResult and '
      + 'SetActivityCode with 4 if ModalEvent is ModalEvent.CONTINUE', async () => {
      spyOn(component.store$, 'dispatch');

      await component.onModalDismiss(ModalEvent.CONTINUE, 'test', true);

      expect(component.store$.dispatch).toHaveBeenCalledWith(GradeChanged('test'));
      expect(component.store$.dispatch).toHaveBeenCalledWith(CalculateTestResult());
      expect(component.store$.dispatch).toHaveBeenCalledWith(SetActivityCode('4'));
    });
    it('should dispatch ReturnToTest if ModalEvent is ModalEvent.CANCEL', async () => {
      spyOn(component.store$, 'dispatch');

      await component.onModalDismiss(ModalEvent.CANCEL, 'test', true);

      expect(component.store$.dispatch).toHaveBeenCalledWith(ReturnToTest());
    });
    it('should navigate to DEBRIEF_PAGE and dispatch GradeChanged with null and '
      + 'TerminateTestFromTestReport if ModalEvent is '
      + 'ModalEvent.TERMINATE and isTestReportPopulated is true', async () => {
      spyOn(component.store$, 'dispatch');
      spyOn(component.router, 'navigate');

      component.isTestReportPopulated = true;
      await component.onModalDismiss(ModalEvent.TERMINATE, 'test', true);

      expect(component.store$.dispatch).toHaveBeenCalledWith(TerminateTestFromTestReport());
      expect(component.store$.dispatch).toHaveBeenCalledWith(GradeChanged(null));
      expect(component.router.navigate).toHaveBeenCalledWith([TestFlowPageNames.DEBRIEF_PAGE]);
    });
    it('should navigate to NON_PASS_FINALISATION_PAGE if ModalEvent is '
      + 'ModalEvent.TERMINATE and isTestReportPopulated is true', async () => {
      spyOn(component.router, 'navigate');

      component.isTestReportPopulated = false;
      await component.onModalDismiss(ModalEvent.TERMINATE, 'test', true);

      expect(component.router.navigate).toHaveBeenCalledWith([TestFlowPageNames.NON_PASS_FINALISATION_PAGE]);
    });
  });
});
