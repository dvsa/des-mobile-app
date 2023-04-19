import {
  ComponentFixture, fakeAsync, TestBed, tick, waitForAsync,
} from '@angular/core/testing';
import {
  IonicModule, ModalController, NavController, Platform,
} from '@ionic/angular';
import { NavControllerMock, PlatformMock } from '@mocks/index.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { Store } from '@ngrx/store';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { NonPassFinalisationPage } from '@pages/non-pass-finalisation/non-pass-finalisation.page';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import * as testActions from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import {
  D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed,
} from '@store/tests/test-summary/test-summary.actions';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeDescription } from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodeFinalisationProvider } from '@providers/activity-code-finalisation/activity-code-finalisation';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import {
  ActivityCodeFinalisationMock,
} from '@providers/activity-code-finalisation/__mocks__/activity-code-finalisation.mock';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { TestDataByCategoryProviderMock } from '@providers/test-data-by-category/__mocks__/test-data-by-category.mock';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { Subscription } from 'rxjs';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestsModel } from '@store/tests/tests.model';
import { provideMockStore } from '@ngrx/store/testing';
import { take } from 'rxjs/operators';
import {
  NonPassFinalisationReportActivityCode,
  NonPassFinalisationValidationError,
  NonPassFinalisationViewDidEnter,
} from '../non-pass-finalisation.actions';

describe('NonPassFinalisationPage', () => {
  let fixture: ComponentFixture<NonPassFinalisationPage>;
  let component: NonPassFinalisationPage;
  let store$: Store<StoreModel>;
  let outcomeBehaviourProvider: OutcomeBehaviourMapProvider;
  let router: Router;
  const activatedRouteMock = {
    snapshot: {
      data: {
        nonPassData: [{}, {}],
      },
    } as Data,
  } as ActivatedRoute;

  const initialState = {
    appInfo: { employeeId: '123456' },
    tests: {
      currentTest: {
        slotId: '123',
      },
      testStatus: {},
      startedTests: {
        123: {
          version: '1',
          rekey: false,
          activityCode: '1',
          passCompletion: { passCertificateNumber: 'test', code78: true },
          category: TestCategory.SC,
          changeMarker: null,
          examinerBooked: null,
          examinerConducted: null,
          examinerKeyed: null,
          testSummary: {
            debriefWitnessed: true,
          },
          testData: {
            endTime: '2',
            startTime: '1',
            review: {
              seekFurtherDevelopment: true,
              reasonForNoAdviceGiven: 'test',
              grade: 'test1',
              immediateDanger: false,
            },
          },
          journalData: {
            examiner: null,
            testCentre: null,
            testSlotAttributes: null,
            applicationReference: null,
            candidate: {
              candidateName: {
                firstName: 'Firstname',
                lastName: 'Lastname',
              },
            },
          },
        } as TestResultCommonSchema,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        NonPassFinalisationPage,
        MockComponent(PracticeModeBanner),
        MockComponent(ActivityCodeComponent),
        MockComponent(D255Component),
        MockComponent(LanguagePreferencesComponent),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(FinalisationHeaderComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
      providers: [
        { provide: Router, useClass: RouterMock },
        { provide: NavController, useClass: NavControllerMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: ActivityCodeFinalisationProvider, useClass: ActivityCodeFinalisationMock },
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProviderMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: TestDataByCategoryProvider, useClass: TestDataByCategoryProviderMock },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(NonPassFinalisationPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    router = TestBed.inject(Router);
    outcomeBehaviourProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    spyOn(router, 'navigate');
  }));

  describe('Class', () => {

    describe('ngOnInit', () => {
      it('should resolve state variables', () => {
        spyOn(outcomeBehaviourProvider, 'isVisible').and.returnValue(true);

        component.ngOnInit();
        component.pageState.displayDebriefWitnessed$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(true));
        component.pageState.displayD255$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(true));
        component.pageState.showADIWarning$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(false));
        component.pageState.furtherDevelopment$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(true));
        component.pageState.displayFurtherDevelopment$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(true));
        component.pageState.adviceReason$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual('test'));
        component.pageState.displayAdviceReasonGiven$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(true));
        component.pageState.testOutcomeGrade$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual('test1'));
        component.pageState.showADI3Field$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(true));
        component.pageState.immediateDanger$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(false));
        component.pageState.isStandardsCheck$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(true));
        component.pageState.testStartTime$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual('1'));
        component.pageState.testEndTime$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual('2'));
      });
    });

    describe('ionViewDidEnter', () => {
      it('should dispatch a view did enter action', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(NonPassFinalisationViewDidEnter());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
      it('should dispatch D255No is test category is ADI2', () => {
        component.testCategory = TestCategory.ADI2;
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(D255No());
      });
    });
    describe('d255Changed', () => {
      it('should dispatch the correct action if the inputted value is true', () => {
        component.d255Changed(true);
        expect(store$.dispatch).toHaveBeenCalledWith(D255Yes());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the inputted value is false', () => {
        component.d255Changed(false);
        expect(store$.dispatch).toHaveBeenCalledWith(D255No());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });
    describe('debriefWitnessedChanged', () => {
      it('should dispatch the correct action if the inputted value is true', () => {
        component.debriefWitnessedChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(DebriefWitnessed());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the inputted value is false', () => {
        component.debriefWitnessedChanged(false);
        expect(store$.dispatch).toHaveBeenCalledWith(DebriefUnWitnessed());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });
    describe('isWelshChanged', () => {
      it('should dispatch the correct action if the isWelsh flag is true', () => {
        component.isWelshChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(CandidateChoseToProceedWithTestInWelsh('Cymraeg'));
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the isWelsh flag is false', () => {
        component.isWelshChanged(false);
        expect(store$.dispatch).toHaveBeenCalledWith(CandidateChoseToProceedWithTestInEnglish('English'));
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });
    describe('onCancel', () => {
      it('should dismiss modal', async () => {
        await component.openTestDataValidationModal();
        spyOn(component.invalidTestDataModal, 'dismiss');
        await component.onCancel();
        expect(component.invalidTestDataModal.dismiss).toHaveBeenCalled();
      });
    });
    describe('onReturnToTestReport', () => {
      it('should dismiss modal', async () => {
        await component.openTestDataValidationModal();
        spyOn(component.invalidTestDataModal, 'dismiss');
        await component.onReturnToTestReport();
        expect(component.invalidTestDataModal.dismiss).toHaveBeenCalled();
      });
      it('should call navigateToPage with TEST_REPORT_DASHBOARD_PAGE if'
          + ' test category is ADI3', async () => {
        spyOn(component.routeByCat, 'navigateToPage');
        await component.openTestDataValidationModal();

        component.testCategory = TestCategory.ADI3;

        await component.onReturnToTestReport();
        expect(component.routeByCat.navigateToPage).toHaveBeenCalledWith(TestFlowPageNames.TEST_REPORT_DASHBOARD_PAGE);
      });
      it('should call navigateToPage with TEST_REPORT_PAGE and testCategory if'
          + ' test category is not ADI3', async () => {
        spyOn(component.routeByCat, 'navigateToPage');
        await component.openTestDataValidationModal();

        component.testCategory = TestCategory.B;

        await component.onReturnToTestReport();
        expect(component.routeByCat.navigateToPage).toHaveBeenCalledWith(
          TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.B,
        );
      });
    });
    describe('continue', () => {
      it(`should create the TestFinalisationInvalidTestDataModal
      when activityCode is 5 and no S/D faults`, async () => {
        store$.dispatch(testActions.StartTest(123, TestCategory.B));
        spyOn(component, 'openTestDataValidationModal').and.callThrough();
        spyOn(component.modalController, 'create').and.callThrough();
        spyOn(component.activityCodeFinalisationProvider, 'testDataIsInvalid').and.returnValue(Promise.resolve(true));

        component.slotId = '123';
        component.activityCode = {
          activityCode: ActivityCodes.FAIL_CANDIDATE_STOPS_TEST,
          description: ActivityCodeDescription.FAIL_CANDIDATE_STOPS_TEST,
        };
        component.testData = {
          dangerousFaults: {},
          seriousFaults: {},
        };

        // Act
        await component.continue();

        // Assert
        expect(component.openTestDataValidationModal).toHaveBeenCalled();
        expect(component.modalController.create).toHaveBeenCalled();
      });
      it(`should dispatch NonPassFinalisationReportActivityCode with activity code and call navigateToPage
      with CONFIRM_TEST_DETAILS_PAGE if testDataIsInvalid is false`, async () => {
        component.activityCode = { activityCode: '2', description: ActivityCodeDescription.FAIL };
        store$.dispatch(testActions.StartTest(123, TestCategory.B));

        spyOn(component.routeByCat, 'navigateToPage');
        spyOn(component, 'openTestDataValidationModal').and.callThrough();
        spyOn(component.modalController, 'create').and.callThrough();
        spyOn(component.activityCodeFinalisationProvider, 'testDataIsInvalid').and.returnValue(Promise.resolve(false));

        // Act
        await component.continue();

        // Assert
        expect(store$.dispatch).toHaveBeenCalledWith(NonPassFinalisationReportActivityCode(ActivityCodes.FAIL));
        expect(component.routeByCat.navigateToPage).toHaveBeenCalledWith(TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE);
      });

      it(`should create the TestFinalisationInvalidTestDataModal
      when activityCode is 4 and no S/D faults`, async () => {
        // Arrange
        store$.dispatch(testActions.StartTest(123, TestCategory.B));
        spyOn(component, 'openTestDataValidationModal').and.callThrough();
        spyOn(component.modalController, 'create')
          .and
          .callThrough();
        spyOn(component.activityCodeFinalisationProvider, 'testDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));

        component.slotId = '123';
        component.activityCode = {
          activityCode: ActivityCodes.FAIL_PUBLIC_SAFETY,
          description: ActivityCodeDescription.FAIL_PUBLIC_SAFETY,
        };
        component.testData = {
          dangerousFaults: {},
          seriousFaults: {},
        };

        // Act
        await component.continue();

        // Assert
        expect(component.openTestDataValidationModal).toHaveBeenCalled();
        expect(component.modalController.create).toHaveBeenCalled();
      });

      it('should dispatch the appropriate ValidationError actions', fakeAsync(() => {
        component.form = new UntypedFormGroup({
          requiredControl1: new UntypedFormControl(null, [Validators.required]),
          requiredControl2: new UntypedFormControl(null, [Validators.required]),
          notRequiredControl: new UntypedFormControl(null),
        });

        component.activityCode = {
          activityCode: ActivityCodes.FAIL,
          description: ActivityCodeDescription.FAIL,
        };
        component.testData = {
          dangerousFaults: {},
          seriousFaults: {},
        };

        component.continue();
        tick();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(NonPassFinalisationValidationError('requiredControl1 is blank'));
        expect(store$.dispatch)
          .toHaveBeenCalledWith(NonPassFinalisationValidationError('requiredControl2 is blank'));
        expect(store$.dispatch)
          .not
          .toHaveBeenCalledWith(NonPassFinalisationValidationError('notRequiredControl is blank'));
      }));
    });
    describe('navigateToDebrief', () => {
      it('should call the back method from Location to navigate back to Debrief', async () => {
        await component.navigateToDebrief();
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.DEBRIEF_PAGE]);
      });
    });
    describe('isADI3', () => {
      it('should return true if TestCategory is ADI3', () => {
        component.testCategory = TestCategory.ADI3;
        expect(component.isADI3()).toEqual(true);
      });
      it('should return false if TestCategory is not ADI3', () => {
        component.testCategory = TestCategory.B;
        expect(component.isADI3()).toEqual(false);
      });
    });
    describe('showLanguage', () => {
      it('should return false if TestCategory is ADI3', () => {
        component.testCategory = TestCategory.ADI3;
        expect(component.showLanguage()).toEqual(false);
      });
      it('should return true if TestCategory is not ADI3', () => {
        component.testCategory = TestCategory.B;
        expect(component.showLanguage()).toEqual(true);
      });
    });
    describe('furtherDevelopmentChanged', () => {
      it('should dispatch SeekFurtherDevelopmentChanged using the parameter given', () => {
        component.furtherDevelopmentChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(SeekFurtherDevelopmentChanged(true));
      });
    });
    describe('activityCodeChanged', () => {
      it('should set activityCodee to the parameter given and dispatch SetActivityCode'
          + ' using the activityCode provided', () => {
        component.activityCodeChanged({ activityCode: '1', description: ActivityCodeDescription.PASS });
        expect(store$.dispatch).toHaveBeenCalledWith(SetActivityCode('1'));
      });
    });
    describe('ionViewDidLeave', () => {
      it('should unsubscribe from subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });
    describe('adviceReasonChanged', () => {
      it('should dispatch ReasonForNoAdviceGivenChanged using the parameter given', () => {
        component.adviceReasonChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(ReasonForNoAdviceGivenChanged('test'));
      });
    });
    describe('didTestComplete', () => {
      [
        ActivityCodes.FAIL,
        ActivityCodes.FAIL_PUBLIC_SAFETY,
        ActivityCodes.FAIL_CANDIDATE_STOPS_TEST].forEach((value) => {
        it(`should return true if activity code is ${value}`, () => {
          component.activityCode = { activityCode: value, description: null };
          expect(component.didTestComplete()).toEqual(true);
        });
      });
      it('should return false if activityCode is not on the accepted list', () => {
        component.activityCode = { activityCode: ActivityCodes.PASS, description: null };
        expect(component.didTestComplete()).toEqual(false);
      });
      it('should return false if there is no activity code', () => {
        component.activityCode = null;
        expect(component.didTestComplete()).toEqual(false);
      });
    });
    describe('testDataValidationMsg', () => {
      [
        TestCategory.ADI3,
        TestCategory.SC,
      ].forEach((value) => {
        it(`should return Code 4 message if Test category is ${value}`, () => {
          component.testCategory = value;
          expect(component['testDataValidationMsg']).toEqual(
            'Code 4 cannot be selected because the PDI has a Risk Management score of more than 7',
          );
        });
      });
      it('should return level of faults message if Test category is not on the case list', () => {
        component.testCategory = TestCategory.C;
        expect(component['testDataValidationMsg']).toEqual(
          'The level of faults on this practical test does not meet the requirement for code 4 or 5.',
        );
      });
    });
    describe('testStartTimeChanged', () => {
      it('should dispatch endTime to store', () => {
        spyOn(store$, 'dispatch');
        component.testStartTimeChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(StartTimeChanged('test'));
      });
    });
    describe('testEndTimeChanged', () => {
      it('should dispatch endTime to store', () => {
        spyOn(store$, 'dispatch');
        component.testEndTimeChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(EndTimeChanged('test'));
      });
    });
    describe('showD255', () => {
      it('Hide D255 when category C3a', async () => {
        component.testCategory = TestCategory.C;
        expect(component.showD255()).toEqual(true);
      });
      it('Show D255 when is not category C3a', async () => {
        component.testCategory = TestCategory.CM;
        expect(component.showD255()).toEqual(false);
      });
    });
  });
});
