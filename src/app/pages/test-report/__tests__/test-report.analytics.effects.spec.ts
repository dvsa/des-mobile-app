import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as testsActions from '@store/tests/tests.actions';
import * as controlledStopActions
  from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import * as dangerousFaultsActions
  from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import * as drivingFaultsActions from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import * as seriousFaultsActions from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import * as manoeuvresActions from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import * as manoeuvresADIPart2Actions from
  '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import * as vehicleChecksActions from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import * as testRequirementsActions
  from '@store/tests/test-data/common/test-requirements/test-requirements.actions';
import * as ecoActions from '@store/tests/test-data/common/eco/eco.actions';
import { StoreModel } from '@shared/models/store.model';
import {
  Competencies,
  LegalRequirements,
  ManoeuvreCompetencies,
  ManoeuvreTypes,
  SingleFaultCompetencyNames,
  ExaminerActions,
} from '@store/tests/test-data/test-data.constants';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsLabels,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { fullCompetencyLabels, competencyLabels } from '@shared/constants/competencies/competencies';
import { testsReducer } from '@store/tests/tests.reducer';
import { candidateMock, testReportPracticeModeSlot } from '@store/tests/__mocks__/tests.mock';
import {
  manoeuvreCompetencyLabels,
  manoeuvreTypeLabels,
} from '@shared/constants/competencies/catb-manoeuvres';
import { AnalyticRecorded, AnalyticNotRecorded } from '@providers/analytics/analytics.actions';
import {
  legalRequirementsLabels,
  legalRequirementToggleValues,
} from '@shared/constants/legal-requirements/legal-requirements.constants';
import * as uncoupleRecoupleActions
  from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
// @TODO - MES-7149 - enable once component migrated
// import * as reverseLeftActions from '../components/reverse-left/reverse-left.actions';
import { configureTestSuite } from 'ng-bullet';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
// @TODO - MES-7149 - enable with Mod 1
// import * as avoidanceActions from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import {
  speedCheckToggleValues,
} from '@shared/constants/competencies/cata-mod1-speed-checks';
// @TODO - MES-7149 - enable with Mod 1
// import * as testReportCatAMod1Actions from '../cat-a-mod1/test-report.cat-a-mod1.actions';
// import { ModalReason } from '../cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal.constants';
import * as emergencyStopActions
  from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as singleFaultCompetencyActions
  from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
// @TODO - MES-7148 - enable with Cat D
// import * as pcvDoorExerciseActions from
//   '../../../modules/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.actions';
import * as highwayCodeActions
  from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.actions';
import * as etaActions from '@store/tests/test-data/common/eta/eta.actions';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import * as testReportActions from '../test-report.actions';
import { TestReportAnalyticsEffects } from '../test-report.analytics.effects';

describe('Test Report Analytics Effects', () => {

  let effects: TestReportAnalyticsEffects;
  let actions$: ReplaySubject<any>;
  let analyticsProviderMock;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
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
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        Store,
      ],
    });
  });

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestReportAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    // analyticsProviderMock.logEvent.calls.reset()
    spyOn(analyticsProviderMock, 'logEvent');
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
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(AnalyticsScreenNames.TEST_REPORT);
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.SELECT_REMOVE_MODE,
          AnalyticsEvents.REMOVE_MODE_SELECTED,
        );
        done();
      });
    });
    it('should call logEvent when the action is user generated for untoggling of remove fault mode', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      store$.dispatch(testReportActions.ToggleRemoveFaultMode());
      actions$.next(testReportActions.ToggleRemoveFaultMode(true));
      // ASSERT
      effects.toggleRemoveFaultMode$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.EXIT_REMOVE_MODE,
          AnalyticsEvents.REMOVE_MODE_EXITED,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.SELECT_REMOVE_MODE}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REMOVE_MODE_SELECTED}`,
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
        expect(analyticsProviderMock.logEvent).not.toHaveBeenCalled();
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.SELECT_SERIOUS_MODE,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.SELECT_SERIOUS_MODE}`,
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
        expect(analyticsProviderMock.logEvent).not.toHaveBeenCalled();
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.SELECT_DANGEROUS_MODE,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.SELECT_DANGEROUS_MODE}`,
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
        expect(analyticsProviderMock.logEvent).not.toHaveBeenCalled();
        done();
      });
    });

  });

  describe('addDrivingFault', () => {
    it('should call logEvent for this competency', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      // ACT
      actions$.next(drivingFaultsActions.AddDrivingFault({
        competency: Competencies.controlsGears,
        newFaultCount: 1,
      }));
      // ASSERT
      effects.addDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DRIVING_FAULT,
          fullCompetencyLabels[Competencies.controlsGears],
          1,
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(drivingFaultsActions.AddDrivingFault({
        competency: Competencies.controlsGears,
        newFaultCount: 1,
      }));
      // ASSERT
      effects.addDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DRIVING_FAULT}`,
          fullCompetencyLabels[Competencies.controlsGears],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_SERIOUS_FAULT,
          fullCompetencyLabels[Competencies.controlsGears],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_SERIOUS_FAULT}`,
          fullCompetencyLabels[Competencies.controlsGears],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DANGEROUS_FAULT,
          fullCompetencyLabels[Competencies.controlsGears],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DANGEROUS_FAULT}`,
          fullCompetencyLabels[Competencies.controlsGears],
          1,
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
      actions$.next(manoeuvresActions.AddManoeuvreDrivingFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      }));
      // ASSERT
      effects.addManoeuvreDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DRIVING_FAULT,
          // eslint-disable-next-line max-len
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]} - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(manoeuvresActions.AddManoeuvreDrivingFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      }));
      // ASSERT
      effects.addManoeuvreDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DRIVING_FAULT}`,
          // eslint-disable-next-line max-len
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]} - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
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
      actions$.next(manoeuvresADIPart2Actions.AddManoeuvreDrivingFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      },
      0));
      // ASSERT
      effects.addManoeuvreDrivingFaultCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DRIVING_FAULT,
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]
          } - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
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
      actions$.next(manoeuvresActions.AddManoeuvreSeriousFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      }));
      // ASSERT
      effects.addManoeuvreSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_SERIOUS_FAULT,
          // eslint-disable-next-line max-len
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]} - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(manoeuvresActions.AddManoeuvreSeriousFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      }));
      // ASSERT
      effects.addManoeuvreSeriousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_SERIOUS_FAULT}`,
          // eslint-disable-next-line max-len
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]} - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
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
      actions$.next(manoeuvresADIPart2Actions.AddManoeuvreSeriousFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      },
      0));
      // ASSERT
      effects.addManoeuvreSeriousFaultCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_SERIOUS_FAULT,
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]
          } - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
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
      actions$.next(manoeuvresActions.AddManoeuvreDangerousFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      }));
      // ASSERT
      effects.addManoeuvreDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DANGEROUS_FAULT,
          // eslint-disable-next-line max-len
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]
          } - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(manoeuvresActions.AddManoeuvreDangerousFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      }));
      // ASSERT
      effects.addManoeuvreDangerousFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DANGEROUS_FAULT}`,
          // eslint-disable-next-line max-len
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]} - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
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
      actions$.next(manoeuvresADIPart2Actions.AddManoeuvreDangerousFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      },
      0));
      // ASSERT
      effects.addManoeuvreDangerousFaultCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DANGEROUS_FAULT,
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]
          } - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DRIVING_FAULT,
          fullCompetencyLabels['outcomeControlledStop'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DRIVING_FAULT}`,
          fullCompetencyLabels['outcomeControlledStop'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_SERIOUS_FAULT,
          fullCompetencyLabels['outcomeControlledStop'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_SERIOUS_FAULT}`,
          fullCompetencyLabels['outcomeControlledStop'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DANGEROUS_FAULT,
          fullCompetencyLabels['outcomeControlledStop'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DANGEROUS_FAULT}`,
          fullCompetencyLabels['outcomeControlledStop'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DRIVING_FAULT,
          fullCompetencyLabels['showMeQuestion'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DRIVING_FAULT}`,
          fullCompetencyLabels['showMeQuestion'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_SERIOUS_FAULT,
          fullCompetencyLabels['showMeQuestion'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_SERIOUS_FAULT}`,
          fullCompetencyLabels['showMeQuestion'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DANGEROUS_FAULT,
          fullCompetencyLabels['showMeQuestion'],
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DANGEROUS_FAULT}`,
          fullCompetencyLabels['showMeQuestion'],
          1,
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
      actions$.next(drivingFaultsActions.RemoveDrivingFault({
        competency: Competencies.controlsGears,
        newFaultCount: 0,
      }));
      // ASSERT
      effects.removeDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_DRIVING_FAULT,
          fullCompetencyLabels[Competencies.controlsGears],
          0,
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(drivingFaultsActions.RemoveDrivingFault({
        competency: Competencies.controlsGears,
        newFaultCount: 0,
      }));
      // ASSERT
      effects.removeDrivingFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REMOVE_DRIVING_FAULT}`,
          fullCompetencyLabels[Competencies.controlsGears],
          0,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_SERIOUS_FAULT,
          fullCompetencyLabels[Competencies.controlsGears],
          0,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REMOVE_SERIOUS_FAULT}`,
          fullCompetencyLabels[Competencies.controlsGears],
          0,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_DANGEROUS_FAULT,
          fullCompetencyLabels[Competencies.controlsGears],
          0,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REMOVE_DANGEROUS_FAULT}`,
          fullCompetencyLabels[Competencies.controlsGears],
          0,
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
      actions$.next(manoeuvresActions.RemoveManoeuvreFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      }));
      // ASSERT
      effects.removeManoeuvreFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_DRIVING_FAULT,
          // eslint-disable-next-line max-len
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]} - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(manoeuvresActions.RemoveManoeuvreFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      }));
      // ASSERT
      effects.removeManoeuvreFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REMOVE_DRIVING_FAULT}`,
          // eslint-disable-next-line max-len
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]} - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
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
      actions$.next(manoeuvresADIPart2Actions.RemoveManoeuvreFault({
        manoeuvre: ManoeuvreTypes.reverseRight,
        competency: ManoeuvreCompetencies.controlFault,
      },
      0));
      // ASSERT
      effects.removeManoeuvreFaultCatADIPart2$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_DRIVING_FAULT,
          `${manoeuvreTypeLabels[ManoeuvreTypes.reverseRight]
          } - ${manoeuvreCompetencyLabels[ManoeuvreCompetencies.controlFault]}`,
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
      actions$.next(controlledStopActions.ControlledStopRemoveFault());
      // ASSERT
      effects.controlledStopRemoveFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_FAULT,
          fullCompetencyLabels['outcomeControlledStop'],
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(controlledStopActions.ControlledStopRemoveFault());
      // ASSERT
      effects.controlledStopRemoveFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REMOVE_FAULT}`,
          fullCompetencyLabels['outcomeControlledStop'],
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
      actions$.next(vehicleChecksActions.ShowMeQuestionRemoveFault());
      // ASSERT
      effects.showMeQuestionRemoveFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_FAULT,
          fullCompetencyLabels['showMeQuestion'],
        );
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ACT
      actions$.next(vehicleChecksActions.ShowMeQuestionRemoveFault());
      // ASSERT
      effects.showMeQuestionRemoveFault$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REMOVE_FAULT}`,
          fullCompetencyLabels['showMeQuestion'],
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_END,
          AnalyticsEvents.END_TEST,
          AnalyticsLabels.TERMINATE_TEST,
        );
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_END}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.END_TEST}`,
          AnalyticsLabels.TERMINATE_TEST,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels[LegalRequirements.normalStart1]} - ${legalRequirementToggleValues.completed}`,
        );
        done();
      });
    });
    it('should call logEvent for normal start uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));

      // ACT
      actions$.next(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      // ASSERT
      effects.toggleLegalRequirement$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels[LegalRequirements.normalStart1]} - ${legalRequirementToggleValues.uncompleted}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels['eco']} - ${legalRequirementToggleValues.completed}`,
        );
        done();
      });
    });
    it('should call logEvent for eco uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.ToggleEco());
      // ACT
      actions$.next(ecoActions.ToggleEco());
      // ASSERT
      effects.toggleEco$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels['eco']} - ${legalRequirementToggleValues.uncompleted}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels['manoeuvre']} - ${legalRequirementToggleValues.completed}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels['manoeuvre']} - ${legalRequirementToggleValues.completed}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels['manoeuvre']} - ${legalRequirementToggleValues.uncompleted}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT}`,
          `${legalRequirementsLabels[LegalRequirements.normalStart1]} - ${legalRequirementToggleValues.completed}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT}`,
          `${legalRequirementsLabels['eco']} - ${legalRequirementToggleValues.completed}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels['vehicleChecks']} - ${legalRequirementToggleValues.completed}`,
        );
        done();
      });
    });

    it('should call logEvent for show me / tell me uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(vehicleChecksActions.ShowMeQuestionPassed());
      const showMeQuestionRemoveFaultAction = vehicleChecksActions.ShowMeQuestionRemoveFault();
      store$.dispatch(showMeQuestionRemoveFaultAction);
      // ACT
      actions$.next(showMeQuestionRemoveFaultAction);
      // ASSERT
      effects.showMeQuestionUncompletedEffect$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels['vehicleChecks']} - ${legalRequirementToggleValues.uncompleted}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DRIVING_FAULT,
          'Uncouple recouple',
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DRIVING_FAULT}`,
          'Uncouple recouple',
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_SERIOUS_FAULT,
          'Uncouple recouple',
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_SERIOUS_FAULT}`,
          'Uncouple recouple',
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DANGEROUS_FAULT,
          'Uncouple recouple',
          1,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
          `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.ADD_DANGEROUS_FAULT}`,
          'Uncouple recouple',
          1,
        );
        done();
      });
    });
  });

  // @TODO - MES-7149 - enable once component migrated
  // describe('reverseLeftPopoverOpened', () => {
  //   it('should call logEvent with the correct parameters', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
  //     // ACT
  //     actions$.next(reverseLeftActions.ReverseLeftPopoverOpened());
  //     // ASSERT
  //     effects.reverseLeftPopoverOpened$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REVERSE_LEFT_POPOVER_OPENED}`,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO - MES-7149 - enable once component migrated
  // describe('reverseLeftPopoverClosed', () => {
  //   it('should call logEvent with the correct parameters', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
  //     // ACT
  //     actions$.next(reverseLeftActions.ReverseLeftPopoverClosed());
  //     // ASSERT
  //     effects.reverseLeftPopoverClosed$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.REVERSE_LEFT_POPOVER_CLOSED}`,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO - MES-7149 implement with Cat A Mod 1
  // describe('toggleAvoidanceSpeedReq', () => {
  //   it('should log speed not met for this competency', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
  //     store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
  //     store$.dispatch(PopulateCandidateDetails(candidateMock));
  //
  //     actions$.next(avoidanceActions.AddAvoidanceSeriousFault());
  //     // ASSERT
  //     effects.toggleAvoidanceSpeedReq$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.TOGGLE_AVOIDANCE_SPEED_REQUIREMENT,
  //         `${competencyLabels['speedCheckAvoidance']} - ${speedCheckToggleValues.speedNotMet}`,
  //       );
  //       done();
  //     });
  //   });
  //
  //   it('should call logEvent for speed met for this competency', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
  //     store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
  //     store$.dispatch(PopulateCandidateDetails(candidateMock));
  //
  //     // ACT
  //     actions$.next(avoidanceActions.RemoveAvoidanceSeriousFault());
  //
  //     // ASSERT
  //     effects.toggleAvoidanceSpeedReq$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.TOGGLE_AVOIDANCE_SPEED_REQUIREMENT,
  //         `${competencyLabels['speedCheckAvoidance']} - ${speedCheckToggleValues.speedMet}`,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO - MES-7149 implement with Cat A Mod 1
  // describe('recordAvoidanceFirstAttempt', () => {
  //   it('should call logEvent for record avoidance first attempt', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
  //     store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
  //     store$.dispatch(PopulateCandidateDetails(candidateMock));
  //     const attemptValue = 27;
  //     store$.dispatch(avoidanceActions.RecordAvoidanceFirstAttempt(attemptValue));
  //
  //     // ACT
  //     actions$.next(avoidanceActions.RecordAvoidanceFirstAttempt(attemptValue));
  //
  //     // ASSERT
  //     effects.recordAvoidanceFirstAttempt$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.RECORD_AVOIDANCE_FIRST_ATTEMPT,
  //         `${competencyLabels['speedCheckAvoidance']} - ${attemptValue}`,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO - MES-7149 implement with Cat A Mod 1
  // describe('recordAvoidanceSecondAttempt', () => {
  //   it('should call logEvent for record avoidance second attempt', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
  //     store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
  //     store$.dispatch(PopulateCandidateDetails(candidateMock));
  //     const attemptValue = 5;
  //     store$.dispatch(avoidanceActions.RecordAvoidanceSecondAttempt(attemptValue));
  //
  //     // ACT
  //     actions$.next(avoidanceActions.RecordAvoidanceSecondAttempt(attemptValue));
  //
  //     // ASSERT
  //     effects.recordAvoidanceSecondAttempt$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.RECORD_AVOIDANCE_SECOND_ATTEMPT,
  //         `${competencyLabels['speedCheckAvoidance']} - ${attemptValue}`,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO - MES-7149 implement with Cat A Mod 1
  // describe('speedRequirementNotMetModalOpened', () => {
  //   it('should call logEvent for speed requirement not met modal opened', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
  //     store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
  //     store$.dispatch(PopulateCandidateDetails(candidateMock));
  //
  //     // ACT
  //     actions$.next(testReportCatAMod1Actions.SpeedRequirementNotMetModalOpened());
  //
  //     // ASSERT
  //     effects.speedRequirementNotMetModalOpened$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.SPEED_REQ_NOT_MET_MODAL_OPENED,
  //         ModalReason.SPEED_REQUIREMENTS,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO - MES-7149 implement with Cat A Mod 1
  // describe('emergencyStopDangerousFaultModelOpened', () => {
  //   it('should call logEvent for ememergency stop dangererous fault modal opened', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
  //     store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
  //     store$.dispatch(PopulateCandidateDetails(candidateMock));
  //
  //     // ACT
  //     actions$.next(testReportCatAMod1Actions.EmergencyStopDangerousFaultModelOpened());
  //
  //     // ASSERT
  //     effects.emergencyStopDangerousFaultModelOpened$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.EMERGENCY_STOP_DANGEROUS_FAULT_MODAL_OPENED,
  //         ModalReason.EMERGENCY_STOP_DANGEROUS,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO - MES-7149 implement with Cat A Mod 1
  // describe('emergencyStopSeriousFaultModelOpened', () => {
  //   it('should call logEvent for emergency stop serious fault modal opened', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
  //     store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
  //     store$.dispatch(PopulateCandidateDetails(candidateMock));
  //
  //     // ACT
  //     actions$.next(testReportCatAMod1Actions.EmergencyStopSeriousFaultModelOpened());
  //
  //     // ASSERT
  //     effects.emergencyStopSeriousFaultModelOpened$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.EMERGENCY_STOP_SERIOUS_FAULT_MODAL_OPENED,
  //         ModalReason.EMERGENCY_STOP_SERIOUS,
  //       );
  //       done();
  //     });
  //   });
  // });

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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_EMERGENCY_STOP_SPEED_REQ,
          `${competencyLabels['speedCheckEmergency']} - ${speedCheckToggleValues.speedNotMet}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_EMERGENCY_STOP_SPEED_REQ,
          `${competencyLabels['speedCheckEmergency']} - ${speedCheckToggleValues.speedMet}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.RECORD_EMERGENCY_STOP_FIRST_ATTEMPT,
          `${competencyLabels['speedCheckEmergency']} - ${attemptValue}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.RECORD_EMERGENCY_STOP_SECOND_ATTEMPT,
          `${competencyLabels['speedCheckEmergency']} - ${attemptValue}`,
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
      actions$.next(singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
        SingleFaultCompetencyNames.slalom, CompetencyOutcome.DF,
      ));

      // ASSERT
      effects.setSingleFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_SINGLE_FAULT,
          fullCompetencyLabels.slalom,
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
      actions$.next(singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
        SingleFaultCompetencyNames.slalom, CompetencyOutcome.D,
      ));

      // ASSERT
      effects.setSingleFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_DANGEROUS_SINGLE_FAULT,
          fullCompetencyLabels.slalom,
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
      actions$.next(singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
        SingleFaultCompetencyNames.slalom, CompetencyOutcome.S,
      ));

      // ASSERT
      effects.setSingleFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.ADD_SERIOUS_SINGLE_FAULT,
          fullCompetencyLabels.slalom,
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
      actions$.next(singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome(
        SingleFaultCompetencyNames.slalom,
      ));

      // ASSERT
      effects.removeSingleFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_SINGLE_FAULT,
          fullCompetencyLabels.slalom,
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
      actions$.next(singleFaultCompetencyActions.RemoveSingleDangerousFaultCompetencyOutcome(
        SingleFaultCompetencyNames.slalom,
      ));

      // ASSERT
      effects.removeSingleDangerousFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_DANGEROUS_SINGLE_FAULT,
          fullCompetencyLabels.slalom,
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
      actions$.next(singleFaultCompetencyActions.RemoveSingleSeriousFaultCompetencyOutcome(
        SingleFaultCompetencyNames.slalom,
      ));

      // ASSERT
      effects.removeSingleSeriousFaultCompetencyOutcome$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.REMOVE_SERIOUS_SINGLE_FAULT,
          fullCompetencyLabels.slalom,
        );
        done();
      });
    });
  });

  // @TODO - MES-7148 enable with Cat D
  // describe('PcvDoorExerciseAddDrivingFault', () => {
  //   it('should call logEvent for this competency', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseAddDrivingFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_DRIVING_FAULT,
  //         fullCompetencyLabels.pcvDoorExercise,
  //
  //       );
  //       done();
  //     });
  //   });
  //   it('should call logEvent for this competency, prefixed with practice test', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseAddDrivingFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_DRIVING_FAULT}`,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO MES-7148 - enable with Cat D
  // describe('PcvDoorExerciseSeriousDrivingFault', () => {
  //   it('should call logEvent for this competency', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseAddSeriousFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_SERIOUS_FAULT,
  //         fullCompetencyLabels.pcvDoorExercise,
  //
  //       );
  //       done();
  //     });
  //   });
  //   it('should call logEvent for this competency, prefixed with practice test', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseAddSeriousFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_SERIOUS_FAULT}`,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO MES-7148 - enable with Cat D
  // describe('pcvDoorExerciseAddDangerousFault', () => {
  //   it('should call logEvent for this competency', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseAddDangerousFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_DANGEROUS_FAULT,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  //   it('should call logEvent for this competency, prefixed with practice test', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseAddDangerousFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_DANGEROUS_FAULT}`,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO MES-7148 - enable with Cat D
  // describe('PcvDoorExerciseRemoveDrivingFault', () => {
  //   it('should call logEvent for this competency', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseRemoveDrivingFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_DRIVING_FAULT,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  //   it('should call logEvent for this competency, prefixed with practice test', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseRemoveDrivingFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_DRIVING_FAULT}`,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO MES-7148 - enable with Cat D
  // describe('pcvDoorExerciseRemoveSeriousFaultX', () => {
  //   it('should call logEvent for this competency', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseRemoveSeriousFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_SERIOUS_FAULT,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  //   it('should call logEvent for this competency, prefixed with practice test', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseRemoveSeriousFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_SERIOUS_FAULT}`,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  // });

  // @TODO MES-7148 - enable with Cat D
  // describe('pcvDoorExerciseRemoveDangerousFault', () => {
  //   it('should call logEvent for this competency', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseRemoveDangerousFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         AnalyticsEventCategories.TEST_REPORT,
  //         AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_DANGEROUS_FAULT,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  //   it('should call logEvent for this competency, prefixed with practice test', (done) => {
  //     // ARRANGE
  //     store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
  //     // ACT
  //     actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault());
  //     // ASSERT
  //     effects.pcvDoorExerciseRemoveDangerousFault$.subscribe((result) => {
  //       expect(result.type).toEqual(AnalyticRecorded.type);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
  //       expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEventCategories.TEST_REPORT}`,
  //         `${AnalyticsEventCategories.PRACTICE_TEST} - ${AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_DANGEROUS_FAULT}`,
  //         fullCompetencyLabels.pcvDoorExercise,
  //       );
  //       done();
  //     });
  //   });
  // });

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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels.highwayCodeSafety} - ${legalRequirementToggleValues.completed}`,
        );
        done();
      });
    });
    it('should call log event with toggle highway code uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.F));
      store$.dispatch(PopulateTestCategory(TestCategory.F));
      store$.dispatch(highwayCodeActions.ToggleHighwayCodeSafety());
      // ACT
      actions$.next(highwayCodeActions.ToggleHighwayCodeSafety());
      // ASSERT
      effects.toggleHighwayCodeSafety$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT,
          `${legalRequirementsLabels.highwayCodeSafety} - ${legalRequirementToggleValues.uncompleted}`,
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_ECO_CONTROL,
          'selected',
        );
        done();
      });
    });
    it('should call log event with toggle eco control unselected ', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.ToggleControlEco());
      // ACT
      actions$.next(ecoActions.ToggleControlEco());
      // ASSERT
      effects.toggleEcoControl$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_ECO_CONTROL,
          'unselected',
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_ECO_PLANNING,
          'selected',
        );
        done();
      });
    });
    it('should call log event with toggle eco planning unselected ', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.TogglePlanningEco());
      // ACT
      actions$.next(ecoActions.TogglePlanningEco());
      // ASSERT
      effects.toggleEcoPlanning$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_ECO_PLANNING,
          'unselected',
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_ETA_PHYSICAL,
          'selected',
        );
        done();
      });
    });
    it('should call log event with toggle eta physical unselected ', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(etaActions.ToggleETA(ExaminerActions.physical));
      // ACT
      actions$.next(etaActions.ToggleETA(ExaminerActions.physical));
      // ASSERT
      effects.toggleETA$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_ETA_PHYSICAL,
          'unselected',
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_ETA_VERBAL,
          'selected',
        );
        done();
      });
    });
    it('should call log event with toggle eta verba unselected ', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(etaActions.ToggleETA(ExaminerActions.verbal));
      // ACT
      actions$.next(etaActions.ToggleETA(ExaminerActions.verbal));
      // ASSERT
      effects.toggleETA$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_ETA_VERBAL,
          'unselected',
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.START_TIMER,
        );
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
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_CONTROLLED_STOP,
          `${legalRequirementToggleValues.completed}`,
        );
        done();
      });
    });
    it('should call log event with toggle controlled stop uncompleted', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(controlledStopActions.ToggleControlledStop());
      // ACT
      actions$.next(controlledStopActions.ToggleControlledStop());
      // ASSERT
      effects.toggleControlledStop$.subscribe((result) => {
        expect(result.type).toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledTimes(1);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_REPORT,
          AnalyticsEvents.TOGGLE_CONTROLLED_STOP,
          `${legalRequirementToggleValues.uncompleted}`,
        );
        done();
      });
    });
  });

});
