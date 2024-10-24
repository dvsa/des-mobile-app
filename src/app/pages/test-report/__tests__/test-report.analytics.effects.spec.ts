import { TestBed } from '@angular/core/testing';
import * as testReportAdi3Actions from '@app/pages/test-report/cat-adi-part3/test-report.cat-adi-part3.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ValidFaultTypes } from '@pages/office/components/fault-comment/fault-comment';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfig } from '@providers/app-config/app-config.model';
import { lessonThemeValues } from '@shared/constants/adi3-questions/lesson-theme.constants';
import {
  manoeuvreCompetencyAnalyticLabels,
  manoeuvreTypeAnalyticLabels,
} from '@shared/constants/competencies/catb-manoeuvres';
import { competencyLabels, fullAnalyticCompetencyLabels } from '@shared/constants/competencies/competencies';
import {
  legalRequirementToggleValues,
  legalRequirementsLabels,
} from '@shared/constants/legal-requirements/legal-requirements.constants';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock, testReportPracticeModeSlot } from '@store/tests/__mocks__/tests.mock';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as avoidanceActions from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import * as emergencyStopActions from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import * as manoeuvresADIPart2Actions from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import * as lessonThemeActions from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.actions';
import * as lessonPlanningActions from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.actions';
import * as riskManagementActions from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.actions';
// eslint-disable-next-line max-len
import * as teachingLearningStrategiesActions from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.actions';
import * as vehicleChecksActions from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import * as pcvDoorExerciseActions from '@store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.actions';
import * as controlledStopActions from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import * as dangerousFaultsActions from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import * as drivingFaultsActions from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import * as ecoActions from '@store/tests/test-data/common/eco/eco.actions';
import * as etaActions from '@store/tests/test-data/common/eta/eta.actions';
import * as highwayCodeActions from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.actions';
import * as manoeuvresActions from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import * as seriousFaultsActions from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import * as singleFaultCompetencyActions from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import * as testRequirementsActions from '@store/tests/test-data/common/test-requirements/test-requirements.actions';
import * as uncoupleRecoupleActions from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import {
  Competencies,
  ExaminerActions,
  LegalRequirements,
  ManoeuvreCompetencies,
  ManoeuvreTypes,
  SingleFaultCompetencyNames,
} from '@store/tests/test-data/test-data.constants';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject } from 'rxjs';
import { ModalReason } from '../cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal.constants';
import * as testReportCatAMod1Actions from '../cat-a-mod1/test-report.cat-a-mod1.actions';
import * as reverseLeftActions from '../components/reverse-left/reverse-left.actions';
import * as testReportActions from '../test-report.actions';
import { TestReportAnalyticsEffects } from '../test-report.analytics.effects';

describe('TestReportAnalyticsEffects', () => {
  let effects: TestReportAnalyticsEffects;
  let actions$: ReplaySubject<any>;
  let analyticsProviderMock: AnalyticsProvider;
  let store$: Store<StoreModel>;
  let appConfigProvider: AppConfigProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
          testReport: testReportReducer,
        }),
      ],
      providers: [
        TestReportAnalyticsEffects,
        provideMockActions(() => actions$),
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestReportAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    appConfigProvider = TestBed.inject(AppConfigProvider);
    spyOn(appConfigProvider, 'getAppConfig').and.returnValue({
      journal: { enablePracticeModeAnalytics: true },
    } as AppConfig);
  });

  describe('testReportViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testReportActions.TestReportViewDidEnter());
      // ASSERT
      effects.testReportViewDidEnter$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(AnalyticsScreenNames.TEST_REPORT);
        done();
      });
    });
  });

  describe('toggleRemoveFaultMode', () => {
    it('should call logEvent when the action is user generated', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      store$.dispatch(testReportActions.ToggleRemoveFaultMode());
      actions$.next(testReportActions.ToggleRemoveFaultMode(true));
      // ASSERT
      effects.toggleRemoveFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.SELECT_MODE,
          GoogleAnalyticsEventsTitles.MODE,
          GoogleAnalyticsEventsValues.REMOVE
        );
        done();
      });
    });
    it('should call logEvent when the action is user generated for untoggling of remove fault mode', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testReportActions.ToggleRemoveFaultMode(true));
      // ASSERT
      effects.toggleRemoveFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.EXIT_MODE,
          GoogleAnalyticsEventsTitles.MODE,
          GoogleAnalyticsEventsValues.REMOVE
        );
        done();
      });
    });
    it('should call logEvent when the action is user generated, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      store$.dispatch(testReportActions.ToggleRemoveFaultMode());
      actions$.next(testReportActions.ToggleRemoveFaultMode(true));
      // ASSERT
      effects.toggleRemoveFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SELECT_MODE}`,
          GoogleAnalyticsEventsTitles.MODE,
          GoogleAnalyticsEventsValues.REMOVE
        );
        done();
      });
    });
    it('should not call logEvent when the action is not user generated', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testReportActions.ToggleRemoveFaultMode());
      // ASSERT
      effects.toggleRemoveFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticNotRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('toggleSeriousFaultMode', () => {
    it('should call logEvent when action is user generated', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testReportActions.ToggleSeriousFaultMode(true));
      // ASSERT
      effects.toggleSeriousFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.SELECT_MODE,
          GoogleAnalyticsEventsTitles.MODE,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent when action is user generated, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(testReportActions.ToggleSeriousFaultMode(true));
      // ASSERT
      effects.toggleSeriousFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SELECT_MODE}`,
          GoogleAnalyticsEventsTitles.MODE,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should not call logEvent when action is not user generated', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testReportActions.ToggleSeriousFaultMode());
      // ASSERT
      effects.toggleSeriousFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticNotRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('toggleDangerousFaultMode', () => {
    it('should call logEvent when action is user generated', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testReportActions.ToggleDangerousFaultMode(true));
      // ASSERT
      effects.toggleDangerousFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.SELECT_MODE,
          GoogleAnalyticsEventsTitles.MODE,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent when action is user generated prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(testReportActions.ToggleDangerousFaultMode(true));
      // ASSERT
      effects.toggleDangerousFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SELECT_MODE}`,
          GoogleAnalyticsEventsTitles.MODE,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should not call logEvent when action is not user generated', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testReportActions.ToggleDangerousFaultMode());
      // ASSERT
      effects.toggleDangerousFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticNotRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('addDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(
        drivingFaultsActions.AddDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 1,
        })
      );
      // ASSERT
      effects.addDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(
        drivingFaultsActions.AddDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 1,
        })
      );
      // ASSERT
      effects.addDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('addSeriousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(seriousFaultsActions.AddSeriousFault(Competencies.controlsGears));
      // ASSERT
      effects.addSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(seriousFaultsActions.AddSeriousFault(Competencies.controlsGears));
      // ASSERT
      effects.addSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('addDangerousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(dangerousFaultsActions.AddDangerousFault(Competencies.controlsGears));
      // ASSERT
      effects.addDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(dangerousFaultsActions.AddDangerousFault(Competencies.controlsGears));
      // ASSERT
      effects.addDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('addManoeuvreDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(
        manoeuvresActions.AddManoeuvreDrivingFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      // ASSERT
      effects.addManoeuvreDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
            manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
          }`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(
        manoeuvresActions.AddManoeuvreDrivingFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      // ASSERT
      effects.addManoeuvreDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.ADD_FAULT}_${
            manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]
          }_${manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('addManoeuvreDrivingFaultCatADIPart2', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      // ACT
      actions$.next(
        manoeuvresADIPart2Actions.AddManoeuvreDrivingFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          0
        )
      );
      // ASSERT
      effects.addManoeuvreDrivingFaultCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
            manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
          }`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('addManoeuvreSeriousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(
        manoeuvresActions.AddManoeuvreSeriousFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      // ASSERT
      effects.addManoeuvreSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
            manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
          }`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(
        manoeuvresActions.AddManoeuvreSeriousFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      // ASSERT
      effects.addManoeuvreSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.ADD_FAULT}_${
            manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]
          }_${manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('addManoeuvreSeriousFaultCatADIPart2', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      // ACT
      actions$.next(
        manoeuvresADIPart2Actions.AddManoeuvreSeriousFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          0
        )
      );
      // ASSERT
      effects.addManoeuvreSeriousFaultCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
            manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
          }`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('addManoeuvreDangerousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(
        manoeuvresActions.AddManoeuvreDangerousFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      // ASSERT
      effects.addManoeuvreDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
            manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
          }`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(
        manoeuvresActions.AddManoeuvreDangerousFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      // ASSERT
      effects.addManoeuvreDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.ADD_FAULT}_${
            manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]
          }_${manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('addManoeuvreDangerousFaultCatADIPart2', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      // ACT
      actions$.next(
        manoeuvresADIPart2Actions.AddManoeuvreDangerousFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          0
        )
      );
      // ASSERT
      effects.addManoeuvreDangerousFaultCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
            manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
          }`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('controlledStopAddDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(controlledStopActions.ControlledStopAddDrivingFault());
      // ASSERT
      effects.controlledStopAddDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels['outcomeControlledStop']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(controlledStopActions.ControlledStopAddDrivingFault());
      // ASSERT
      effects.controlledStopAddDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels['outcomeControlledStop']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('controlledStopAddSeriousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(controlledStopActions.ControlledStopAddSeriousFault());
      // ASSERT
      effects.controlledStopAddSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels['outcomeControlledStop']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(controlledStopActions.ControlledStopAddSeriousFault());
      // ASSERT
      effects.controlledStopAddSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels['outcomeControlledStop']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('controlledStopAddDangerousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(controlledStopActions.ControlledStopAddDangerousFault());
      // ASSERT
      effects.controlledStopAddDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels['outcomeControlledStop']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(controlledStopActions.ControlledStopAddDangerousFault());
      // ASSERT
      effects.controlledStopAddDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels['outcomeControlledStop']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('showMeQuestionDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionDrivingFault());
      // ASSERT
      effects.showMeQuestionDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels['showMeQuestion']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionDrivingFault());
      // ASSERT
      effects.showMeQuestionDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels['showMeQuestion']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('showMeQuestionSeriousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionSeriousFault());
      // ASSERT
      effects.showMeQuestionSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels['showMeQuestion']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionSeriousFault());
      // ASSERT
      effects.showMeQuestionSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels['showMeQuestion']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('showMeQuestionDangerousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionDangerousFault());
      // ASSERT
      effects.showMeQuestionDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels['showMeQuestion']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionDangerousFault());
      // ASSERT
      effects.showMeQuestionDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels['showMeQuestion']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('removeDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(
        drivingFaultsActions.RemoveDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 0,
        })
      );
      // ASSERT
      effects.removeDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(
        drivingFaultsActions.RemoveDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 0,
        })
      );
      // ASSERT
      effects.removeDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.REMOVE_FAULT
          }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('removeSeriousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(seriousFaultsActions.RemoveSeriousFault(Competencies.controlsGears));
      // ASSERT
      effects.removeSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(seriousFaultsActions.RemoveSeriousFault(Competencies.controlsGears));
      // ASSERT
      effects.removeSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.REMOVE_FAULT
          }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('removeDangerousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(dangerousFaultsActions.RemoveDangerousFault(Competencies.controlsGears));
      // ASSERT
      effects.removeDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(dangerousFaultsActions.RemoveDangerousFault(Competencies.controlsGears));
      // ASSERT
      effects.removeDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.REMOVE_FAULT
          }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('removeManoeuvreDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(
        manoeuvresActions.RemoveManoeuvreFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          CompetencyOutcome.DF
        )
      );
      // ASSERT
      effects.removeManoeuvreFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
            manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
          }`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(
        manoeuvresActions.RemoveManoeuvreFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          CompetencyOutcome.DF
        )
      );
      // ASSERT
      effects.removeManoeuvreFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.REMOVE_FAULT}_${
            manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]
          }_${manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]}`,
          // eslint-disable-next-line max-len
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('removeManoeuvreDrivingFaultCatADIPart2', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      // ACT
      actions$.next(
        manoeuvresADIPart2Actions.RemoveManoeuvreFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          0,
          CompetencyOutcome.DF
        )
      );
      // ASSERT
      effects.removeManoeuvreFaultCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
            manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
          }`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('controlledStopRemoveFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(controlledStopActions.ControlledStopRemoveFault(CompetencyOutcome.DF));
      // ASSERT
      effects.controlledStopRemoveFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels['outcomeControlledStop']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(controlledStopActions.ControlledStopRemoveFault(CompetencyOutcome.DF));
      // ASSERT
      effects.controlledStopRemoveFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.REMOVE_FAULT
          }_${fullAnalyticCompetencyLabels['outcomeControlledStop']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('showMeQuestionRemoveFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionRemoveFault(CompetencyOutcome.DF));
      // ASSERT
      effects.showMeQuestionRemoveFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels['showMeQuestion']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionRemoveFault(CompetencyOutcome.DF));
      // ASSERT
      effects.showMeQuestionRemoveFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.REMOVE_FAULT
          }_${fullAnalyticCompetencyLabels['showMeQuestion']}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('testTermination', () => {
    it('should call logEvent for termination event', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testReportActions.TerminateTestFromTestReport());
      // ASSERT
      effects.testTermination$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.TEST_TERMINATED);
        done();
      });
    });
    it('should call logEvent for termination event, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(testReportActions.TerminateTestFromTestReport());
      // ASSERT
      effects.testTermination$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.TEST_TERMINATED}`
        );
        done();
      });
    });
  });

  describe('toggleLegalRequirement', () => {
    it('should call logEvent for normal start completed', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      // ACT
      actions$.next(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      // ASSERT
      effects.toggleLegalRequirement$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_NS1`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });
    it('should call logEvent for normal start uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      // ASSERT
      effects.toggleLegalRequirement$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_NS1`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.uncompleted
        );
        done();
      });
    });
    it('should call logEvent for eco completed', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.ToggleEco());
      // ACT
      actions$.next(ecoActions.ToggleEco());
      // ASSERT
      effects.toggleEco$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_ECO`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });
    it('should call logEvent for eco uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(ecoActions.ToggleEco());
      // ASSERT
      effects.toggleEco$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_ECO`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.uncompleted
        );
        done();
      });
    });

    it('should call logEvent for selected manoeuvre', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(manoeuvresActions.RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad));
      // ASSERT
      effects.manoeuvreCompletedEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_MAN`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });

    it('should call logEvent for selected manoeuvre for ADI part2', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      // ACT
      actions$.next(manoeuvresADIPart2Actions.RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad, 0));
      // ASSERT
      effects.manoeuvreCompletedEffectCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_MAN`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });

    it('should call logEvent for deselected manoeuvre', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(manoeuvresActions.RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad));
      // ACT
      actions$.next(manoeuvresActions.RecordManoeuvresDeselection(ManoeuvreTypes.reverseParkRoad));
      // ASSERT
      effects.deselectReverseLeftManoeuvreEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_MAN`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.uncompleted
        );
        done();
      });
    });

    it('should call logEvent for normal start, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      store$.dispatch(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      // ACT
      actions$.next(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      // ASSERT
      effects.toggleLegalRequirement$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_NS1`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });
    it('should call logEvent for eco, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      store$.dispatch(ecoActions.ToggleEco());
      // ACT
      actions$.next(ecoActions.ToggleEco());
      // ASSERT
      effects.toggleEco$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_ECO`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });

    it('should call logEvent for show me / tell me completed', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      const showMeQuestionPassedAction = vehicleChecksActions.ShowMeQuestionPassed();
      store$.dispatch(showMeQuestionPassedAction);
      // ACT
      actions$.next(showMeQuestionPassedAction);
      // ASSERT
      effects.showMeQuestionCompletedEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_SM`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });

    it('should call logEvent for show me / tell me uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(vehicleChecksActions.ShowMeQuestionPassed());
      const showMeQuestionRemoveFaultAction = vehicleChecksActions.ShowMeQuestionRemoveFault(CompetencyOutcome.DF);
      store$.dispatch(showMeQuestionRemoveFaultAction);
      // ACT
      actions$.next(showMeQuestionRemoveFaultAction);
      // ASSERT
      effects.showMeQuestionUncompletedEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_SM`,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.uncompleted
        );
        done();
      });
    });
  });

  describe('uncoupleRecoupleAddDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.BE));
      // ACT
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddDrivingFault());
      // ASSERT
      effects.uncoupleRecoupleAddDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddDrivingFault());
      // ASSERT
      effects.uncoupleRecoupleAddDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('uncoupleRecoupleAddSeriousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.BE));
      // ACT
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddSeriousFault());
      // ASSERT
      effects.uncoupleRecoupleAddSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddSeriousFault());
      // ASSERT
      effects.uncoupleRecoupleAddSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('uncoupleRecoupleAddDangerousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.BE));
      // ACT
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddDangerousFault());
      // ASSERT
      effects.uncoupleRecoupleAddDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddDangerousFault());
      // ASSERT
      effects.uncoupleRecoupleAddDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('reverseLeftPopoverOpened', () => {
    it('should call logEvent with the correct parameters', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(reverseLeftActions.ReverseLeftPopoverOpened());
      // ASSERT
      effects.reverseLeftPopoverOpened$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.NAVIGATION}`,
          GoogleAnalyticsEventsTitles.OPENED,
          GoogleAnalyticsEventsValues.REVERSE_MANOEUVRE
        );
        done();
      });
    });
  });

  describe('reverseLeftPopoverClosed', () => {
    it('should call logEvent with the correct parameters', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(reverseLeftActions.ReverseLeftPopoverClosed());
      // ASSERT
      effects.reverseLeftPopoverClosed$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.NAVIGATION}`,
          GoogleAnalyticsEventsTitles.CLOSED,
          GoogleAnalyticsEventsValues.REVERSE_MANOEUVRE
        );
        done();
      });
    });
  });

  describe('toggleAvoidanceSpeedReq', () => {
    it('should log speed not met for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      actions$.next(avoidanceActions.AddAvoidanceSeriousFault());
      // ASSERT
      effects.toggleAvoidanceSpeedReq$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          GoogleAnalyticsEventsValues.NOT_MET
        );
        done();
      });
    });

    it('should call logEvent for speed met for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(avoidanceActions.RemoveAvoidanceSeriousFault());

      // ASSERT
      effects.toggleAvoidanceSpeedReq$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          GoogleAnalyticsEventsValues.MET
        );
        done();
      });
    });
  });

  describe('recordAvoidanceFirstAttempt', () => {
    it('should call logEvent for record avoidance first attempt', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      const attemptValue = 27;
      store$.dispatch(avoidanceActions.RecordAvoidanceFirstAttempt(attemptValue));

      // ACT
      actions$.next(avoidanceActions.RecordAvoidanceFirstAttempt(attemptValue));

      // ASSERT
      effects.recordAvoidanceFirstAttempt$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE,
          GoogleAnalyticsEventsTitles.FIRST_ATTEMPT,
          `${competencyLabels['speedCheckAvoidance']} - ${attemptValue}`
        );
        done();
      });
    });
  });

  describe('recordAvoidanceSecondAttempt', () => {
    it('should call logEvent for record avoidance second attempt', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      const attemptValue = 5;
      store$.dispatch(avoidanceActions.RecordAvoidanceSecondAttempt(attemptValue));

      // ACT
      actions$.next(avoidanceActions.RecordAvoidanceSecondAttempt(attemptValue));

      // ASSERT
      effects.recordAvoidanceSecondAttempt$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE,
          GoogleAnalyticsEventsTitles.SECOND_ATTEMPT,
          `${competencyLabels['speedCheckAvoidance']} - ${attemptValue}`
        );
        done();
      });
    });
  });

  describe('speedRequirementNotMetModalOpened', () => {
    it('should call logEvent for speed requirement not met modal opened', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(testReportCatAMod1Actions.SpeedRequirementNotMetModalOpened());

      // ASSERT
      effects.speedRequirementNotMetModalOpened$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VALIDATION_ERROR,
          GoogleAnalyticsEventsTitles.MODAL,
          GoogleAnalyticsEventsValues.SPEED_REQ_NOT_MET
        );
        done();
      });
    });
  });

  describe('emergencyStopDangerousFaultModelOpened', () => {
    it('should call logEvent for emergency stop dangerous fault modal opened', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(testReportCatAMod1Actions.EmergencyStopDangerousFaultModelOpened());

      // ASSERT
      effects.emergencyStopDangerousFaultModelOpened$.subscribe((result) => {
        expect(result.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.OPENED,
          ModalReason.EMERGENCY_STOP_DANGEROUS
        );
        done();
      });
    });
  });

  describe('emergencyStopSeriousFaultModelOpened', () => {
    it('should call logEvent for emergency stop serious fault modal opened', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(testReportCatAMod1Actions.EmergencyStopSeriousFaultModelOpened());

      // ASSERT
      effects.emergencyStopSeriousFaultModelOpened$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.OPENED,
          ModalReason.EMERGENCY_STOP_SERIOUS
        );
        done();
      });
    });
  });

  describe('toggleEmergencyStopSpeedReq', () => {
    it('should call logEvent for speed not met', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(emergencyStopActions.AddEmergencyStopSeriousFault());

      // ASSERT
      effects.toggleEmergencyStopSpeedReq$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.EMERGENCY_STOP,
          GoogleAnalyticsEventsTitles.SPEED_REQ,
          GoogleAnalyticsEventsValues.NOT_MET
        );
        done();
      });
    });

    it('should call logEvent for speed met', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(emergencyStopActions.RemoveEmergencyStopSeriousFault());

      // ASSERT
      effects.toggleEmergencyStopSpeedReq$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.EMERGENCY_STOP,
          GoogleAnalyticsEventsTitles.SPEED_REQ,
          GoogleAnalyticsEventsValues.MET
        );
        done();
      });
    });
  });

  describe('recordEmergencyStopFirstAttempt', () => {
    it('should call logEvent for record emergency stop first attempt', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      const attemptValue = 27;
      store$.dispatch(emergencyStopActions.RecordEmergencyStopFirstAttempt(attemptValue));

      // ACT
      actions$.next(emergencyStopActions.RecordEmergencyStopFirstAttempt(attemptValue));

      // ASSERT
      effects.recordEmergencyStopFirstAttempt$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.EMERGENCY_STOP,
          GoogleAnalyticsEventsTitles.FIRST_ATTEMPT,
          `${competencyLabels['speedCheckEmergency']} - ${attemptValue}`
        );
        done();
      });
    });
  });

  describe('recordEmergencyStopSecondAttempt', () => {
    it('should call logEvent for record emergency stop second attempt', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      const attemptValue = 27;
      store$.dispatch(emergencyStopActions.RecordEmergencyStopSecondAttempt(attemptValue));

      // ACT
      actions$.next(emergencyStopActions.RecordEmergencyStopSecondAttempt(attemptValue));

      // ASSERT
      effects.recordEmergencyStopSecondAttempt$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.EMERGENCY_STOP,
          GoogleAnalyticsEventsTitles.SECOND_ATTEMPT,
          `${competencyLabels['speedCheckEmergency']} - ${attemptValue}`
        );
        done();
      });
    });
  });

  describe('setSingleFaultCompetencyOutcome', () => {
    it('should call logEvent for adding a single competency driving fault', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(
        singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
          SingleFaultCompetencyNames.slalom,
          CompetencyOutcome.DF
        )
      );

      // ASSERT
      effects.setSingleFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });

    it('should call logEvent for adding a single competency dangerous fault', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(
        singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
          SingleFaultCompetencyNames.slalom,
          CompetencyOutcome.D
        )
      );

      // ASSERT
      effects.setSingleFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });

    it('should call logEvent for adding a single competency serious fault', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(
        singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
          SingleFaultCompetencyNames.slalom,
          CompetencyOutcome.S
        )
      );

      // ASSERT
      effects.setSingleFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('removeSingleFaultCompetencyOutcome', () => {
    it('should call logEvent for removing a single competency driving fault', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome(SingleFaultCompetencyNames.slalom));

      // ASSERT
      effects.removeSingleFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('removeSingleDangerousFaultCompetencyOutcome', () => {
    it('should call logEvent for removing a single competency dangerous fault', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(
        singleFaultCompetencyActions.RemoveSingleDangerousFaultCompetencyOutcome(SingleFaultCompetencyNames.slalom)
      );

      // ASSERT
      effects.removeSingleDangerousFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('removeSingleSeriousFaultCompetencyOutcome', () => {
    it('should call logEvent for removing a single competency serious fault', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));

      // ACT
      actions$.next(
        singleFaultCompetencyActions.RemoveSingleSeriousFaultCompetencyOutcome(SingleFaultCompetencyNames.slalom)
      );

      // ASSERT
      effects.removeSingleSeriousFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('PcvDoorExerciseAddDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault());
      // ASSERT
      effects.pcvDoorExerciseAddDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault());
      // ASSERT
      effects.pcvDoorExerciseAddDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('PcvDoorExerciseSeriousDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault());
      // ASSERT
      effects.pcvDoorExerciseAddSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault());
      // ASSERT
      effects.pcvDoorExerciseAddSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('pcvDoorExerciseAddDangerousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault());
      // ASSERT
      effects.pcvDoorExerciseAddDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault());
      // ASSERT
      effects.pcvDoorExerciseAddDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.ADD_FAULT
          }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('PcvDoorExerciseRemoveDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault());
      // ASSERT
      effects.pcvDoorExerciseRemoveDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault());
      // ASSERT
      effects.pcvDoorExerciseRemoveDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.REMOVE_FAULT
          }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING
        );
        done();
      });
    });
  });

  describe('pcvDoorExerciseRemoveSeriousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault());
      // ASSERT
      effects.pcvDoorExerciseRemoveSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault());
      // ASSERT
      effects.pcvDoorExerciseRemoveSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.REMOVE_FAULT
          }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS
        );
        done();
      });
    });
  });

  describe('pcvDoorExerciseRemoveDangerousFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault());
      // ASSERT
      effects.pcvDoorExerciseRemoveDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault());
      // ASSERT
      effects.pcvDoorExerciseRemoveDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
            GoogleAnalyticsEvents.REMOVE_FAULT
          }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS
        );
        done();
      });
    });
  });

  describe('toggleHighwayCodeSafety', () => {
    it('should call log event with toggle highway code stop completed', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.F));
      store$.dispatch(PopulateTestCategory(TestCategory.F));
      store$.dispatch(highwayCodeActions.ToggleHighwayCodeSafety());
      // ACT
      actions$.next(highwayCodeActions.ToggleHighwayCodeSafety());
      // ASSERT
      effects.toggleHighwayCodeSafety$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.LEGAL_REQUIREMENT,
          GoogleAnalyticsEventsTitles.ITEM_NAME,
          legalRequirementsLabels.highwayCodeSafety,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });
    it('should call log event with toggle highway code uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.F));
      store$.dispatch(PopulateTestCategory(TestCategory.F));
      // ACT
      actions$.next(highwayCodeActions.ToggleHighwayCodeSafety());
      // ASSERT
      effects.toggleHighwayCodeSafety$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.LEGAL_REQUIREMENT,
          GoogleAnalyticsEventsTitles.ITEM_NAME,
          legalRequirementsLabels.highwayCodeSafety,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.uncompleted
        );
        done();
      });
    });
  });
  describe('toggleEcoControl', () => {
    it('should call log event with toggle eco control selected', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.ToggleControlEco());
      // ACT
      actions$.next(ecoActions.ToggleControlEco());
      // ASSERT
      effects.toggleEcoControl$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.ECO_CONTROL,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          'selected'
        );
        done();
      });
    });
    it('should call log event with toggle eco control unselected', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(ecoActions.ToggleControlEco());
      // ASSERT
      effects.toggleEcoControl$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.ECO_CONTROL,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          'unselected'
        );
        done();
      });
    });
  });
  describe('toggleEcoPlanning', () => {
    it('should call log event with toggle eco planning selected', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.TogglePlanningEco());
      // ACT
      actions$.next(ecoActions.TogglePlanningEco());
      // ASSERT
      effects.toggleEcoPlanning$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.ECO_PLANNING,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          'selected'
        );
        done();
      });
    });
    it('should call log event with toggle eco planning unselected', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(ecoActions.TogglePlanningEco());
      // ASSERT
      effects.toggleEcoPlanning$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.ECO_PLANNING,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          'unselected'
        );
        done();
      });
    });
  });
  describe('toggleETA', () => {
    it('should call log event with toggle eta physical selected', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(etaActions.ToggleETA(ExaminerActions.physical));
      // ACT
      actions$.next(etaActions.ToggleETA(ExaminerActions.physical));
      // ASSERT
      effects.toggleETA$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.ETA,
          GoogleAnalyticsEventsTitles.ITEM_NAME,
          GoogleAnalyticsEventsValues.ETA_PHYSICAL,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          'selected'
        );
        done();
      });
    });
    it('should call log event with toggle eta physical unselected', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(etaActions.ToggleETA(ExaminerActions.physical));
      // ASSERT
      effects.toggleETA$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.ETA,
          GoogleAnalyticsEventsTitles.ITEM_NAME,
          GoogleAnalyticsEventsValues.ETA_PHYSICAL,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          'unselected'
        );
        done();
      });
    });
    it('should call log event with toggle eta verbal selected', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(etaActions.ToggleETA(ExaminerActions.verbal));
      // ACT
      actions$.next(etaActions.ToggleETA(ExaminerActions.verbal));
      // ASSERT
      effects.toggleETA$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.ETA,
          GoogleAnalyticsEventsTitles.ITEM_NAME,
          GoogleAnalyticsEventsValues.ETA_VERBAL,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          'selected'
        );
        done();
      });
    });
    it('should call log event with toggle eta verbal unselected', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(etaActions.ToggleETA(ExaminerActions.verbal));
      // ASSERT
      effects.toggleETA$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.ETA,
          GoogleAnalyticsEventsTitles.ITEM_NAME,
          GoogleAnalyticsEventsValues.ETA_VERBAL,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          'unselected'
        );
        done();
      });
    });
  });
  describe('startTimer', () => {
    it('should call logEvent with a start timer event', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      // ACT
      actions$.next(testReportActions.StartTimer());
      // ASSERT
      effects.startTimer$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.START_TIMER);
        done();
      });
    });
  });
  describe('toggleControlledStop', () => {
    it('should call log event with toggle controlled stop completed', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(controlledStopActions.ToggleControlledStop());
      // ACT
      actions$.next(controlledStopActions.ToggleControlledStop());
      // ASSERT
      effects.toggleControlledStop$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.CONTROLLED_STOP,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.completed
        );
        done();
      });
    });
    it('should call log event with toggle controlled stop uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(controlledStopActions.ToggleControlledStop());
      // ASSERT
      effects.toggleControlledStop$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.CONTROLLED_STOP,
          GoogleAnalyticsEventsTitles.ITEM_STATUS,
          legalRequirementToggleValues.uncompleted
        );
        done();
      });
    });
  });
  describe('studentLevelChanged', () => {
    it('should call log event for this competency', (done) => {
      // ARRANGE
      const studentLevel = 'beginner';
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonThemeActions.StudentLevelChanged(studentLevel));
      // ASSERT
      effects.studentLevelChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.STUDENT_EXPERIENCE,
          GoogleAnalyticsEventsTitles.LEVEL,
          studentLevel
        );
      });
      done();
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      const studentLevel = 'beginner';
      store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonThemeActions.StudentLevelChanged(studentLevel));
      // ASSERT
      effects.studentLevelChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.STUDENT_EXPERIENCE}`,
          GoogleAnalyticsEventsTitles.LEVEL,
          studentLevel
        );
      });
      done();
    });
  });
  describe('addLessonTheme', () => {
    it('should call log event for this competency', (done) => {
      // ARRANGE
      const lessonTheme = 'junctions';
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonThemeActions.LessonThemeAdded(lessonTheme));
      // ASSERT
      effects.studentLevelChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.LESSON_THEME,
          GoogleAnalyticsEventsTitles.ADDED,
          lessonThemeValues[lessonTheme]
        );
      });
      done();
    });
    it('should call log event for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      const lessonTheme = 'junctions';
      store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonThemeActions.LessonThemeAdded(lessonTheme));
      // ASSERT
      effects.addLessonTheme$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LESSON_THEME}`,
          GoogleAnalyticsEventsTitles.ADDED,
          lessonThemeValues[lessonTheme]
        );
      });
      done();
    });
  });
  describe('removeLessonTheme', () => {
    it('should call log event for this competency', (done) => {
      // ARRANGE
      const lessonTheme = 'junctions';
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonThemeActions.LessonThemeRemoved(lessonTheme));
      // ASSERT
      effects.removeLessonTheme$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.LESSON_THEME,
          GoogleAnalyticsEventsTitles.REMOVED,
          lessonThemeValues[lessonTheme]
        );
      });
      done();
    });
    it('should call log event for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      const lessonTheme = 'junctions';
      store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonThemeActions.LessonThemeRemoved(lessonTheme));
      // ASSERT
      effects.removeLessonTheme$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LESSON_THEME}`,
          GoogleAnalyticsEventsTitles.REMOVED,
          lessonThemeValues[lessonTheme]
        );
      });
      done();
    });
  });
  describe('otherReasonChanged', () => {
    it('should call log event for this competency', (done) => {
      // ARRANGE
      const otherReason = 'Other Reason';
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonThemeActions.OtherChanged(otherReason));
      // ASSERT
      effects.otherReasonChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.FEEDBACK,
          GoogleAnalyticsEventsTitles.FEEDBACK_CATEGORY,
          GoogleAnalyticsEventsValues.OTHER_REASON,
          GoogleAnalyticsEventsTitles.REASON,
          otherReason
        );
      });
      done();
    });
    it('should call log event for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      const otherReason = 'Other Reason';
      store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonThemeActions.OtherChanged(otherReason));
      // ASSERT
      effects.otherReasonChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.FEEDBACK}`,
          GoogleAnalyticsEventsTitles.FEEDBACK_CATEGORY,
          GoogleAnalyticsEventsValues.OTHER_REASON,
          GoogleAnalyticsEventsTitles.REASON,
          otherReason
        );
      });
      done();
    });
  });
  describe('lessonPlanningQuestionScoreChanged', () => {
    it('should call log event for this competency', (done) => {
      const question = 1;
      const score = 2;
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonPlanningActions.LessonPlanningQuestionScoreChanged(question, score));
      // ASSERT
      effects.lessonPlanningQuestionScoreChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.LESSON_PLANNING,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          String(question),
          GoogleAnalyticsEventsTitles.QUESTION_SCORE,
          String(score)
        );
      });
      done();
    });
    it('should call log event for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      const question = 1;
      const score = 2;
      store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(lessonPlanningActions.LessonPlanningQuestionScoreChanged(question, score));
      // ASSERT
      effects.lessonPlanningQuestionScoreChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LESSON_PLANNING}`,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          String(question),
          GoogleAnalyticsEventsTitles.QUESTION_SCORE,
          String(score)
        );
      });
      done();
    });
  });
  describe('riskManagementQuestionScoreChanged', () => {
    it('should call log event for this competency', (done) => {
      const question = 1;
      const score = 2;
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(riskManagementActions.RiskManagementQuestionScoreChanged(question, score));
      // ASSERT
      effects.riskManagementQuestionScoreChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.RISK_MANAGEMENT,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          String(question),
          GoogleAnalyticsEventsTitles.QUESTION_SCORE,
          String(score)
        );
      });
      done();
    });
    it('should call log event for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      const question = 1;
      const score = 2;
      store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(riskManagementActions.RiskManagementQuestionScoreChanged(question, score));
      // ASSERT
      effects.riskManagementQuestionScoreChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.RISK_MANAGEMENT}`,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          String(question),
          GoogleAnalyticsEventsTitles.QUESTION_SCORE,
          String(score)
        );
      });
      done();
    });
  });
  describe('teachingLearningStrategyQuestionScoreChanged', () => {
    it('should call log event for this competency', (done) => {
      const question = 1;
      const score = 2;
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
      // ACT
      // eslint-disable-next-line max-len
      store$.dispatch(
        teachingLearningStrategiesActions.TeachingLearningStrategiesQuestionScoreChanged(question, score)
      );
      // ASSERT
      effects.teachingLearningStrategyQuestionScoreChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.LEARNING_STRATEGY,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          String(question),
          GoogleAnalyticsEventsTitles.QUESTION_SCORE,
          String(score)
        );
      });
      done();
    });
    it('should call log event for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      const question = 1;
      const score = 2;
      store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(
        teachingLearningStrategiesActions.TeachingLearningStrategiesQuestionScoreChanged(question, score)
      );
      // ASSERT
      effects.teachingLearningStrategyQuestionScoreChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LEARNING_STRATEGY}`,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          String(question),
          GoogleAnalyticsEventsTitles.QUESTION_SCORE,
          String(score)
        );
      });
      done();
    });
  });
  describe('testReportAssessmentOverallScore', () => {
    it('should call log event for this competency', (done) => {
      const score = 10;
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
      // ACT
      // eslint-disable-next-line max-len
      store$.dispatch(testReportAdi3Actions.AssessmentOverallScoreChanged(score));
      // ASSERT
      effects.testReportAssessmentOverallScore$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.OVERALL_ASSESSMENT,
          GoogleAnalyticsEventsTitles.SCORE,
          String(score)
        );
      });
      done();
    });
    it('should call log event for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      const score = 10;
      store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
      // ACT
      store$.dispatch(testReportAdi3Actions.AssessmentOverallScoreChanged(score));
      // ASSERT
      effects.teachingLearningStrategyQuestionScoreChanged$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.OVERALL_ASSESSMENT}`,
          GoogleAnalyticsEventsTitles.SCORE,
          String(score)
        );
      });
      done();
    });
  });
});
