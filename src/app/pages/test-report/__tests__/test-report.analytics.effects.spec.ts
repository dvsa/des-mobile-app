import { TestBed } from '@angular/core/testing';
import * as testReportAdi3Actions from '@app/pages/test-report/cat-adi-part3/test-report.cat-adi-part3.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
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
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModalReason } from '../cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal.constants';
import * as testReportCatAMod1Actions from '../cat-a-mod1/test-report.cat-a-mod1.actions';
import * as reverseLeftActions from '../components/reverse-left/reverse-left.actions';
import * as testReportActions from '../test-report.actions';
import { TestReportAnalyticsEffects } from '../test-report.analytics.effects';

describe('TestReportAnalyticsEffects', () => {
  let effects: TestReportAnalyticsEffects;
  let actions$: ReplaySubject<Action>;
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
    vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({
      journal: { enablePracticeModeAnalytics: true },
    } as AppConfig);
  });

  describe('testReportViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testReportActions.TestReportViewDidEnter());
      const result = await firstValueFrom(effects.testReportViewDidEnter$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(AnalyticsScreenNames.TEST_REPORT);
    });
  });

  describe('toggleRemoveFaultMode', () => {
    it('should call logEvent when the action is user generated', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(testReportActions.ToggleRemoveFaultMode());
      actions$.next(testReportActions.ToggleRemoveFaultMode(true));
      const result = await firstValueFrom(effects.toggleRemoveFaultMode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SELECT_MODE,
        GoogleAnalyticsEventsTitles.MODE,
        GoogleAnalyticsEventsValues.REMOVE
      );
    });
    it('should call logEvent when the action is user generated for untoggling of remove fault mode', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testReportActions.ToggleRemoveFaultMode(true));
      const result = await firstValueFrom(effects.toggleRemoveFaultMode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EXIT_MODE,
        GoogleAnalyticsEventsTitles.MODE,
        GoogleAnalyticsEventsValues.REMOVE
      );
    });
    it('should call logEvent when the action is user generated, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      store$.dispatch(testReportActions.ToggleRemoveFaultMode());
      actions$.next(testReportActions.ToggleRemoveFaultMode(true));
      const result = await firstValueFrom(effects.toggleRemoveFaultMode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SELECT_MODE}`,
        GoogleAnalyticsEventsTitles.MODE,
        GoogleAnalyticsEventsValues.REMOVE
      );
    });
    it('should not call logEvent when the action is not user generated', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testReportActions.ToggleRemoveFaultMode());
      const result = await firstValueFrom(effects.toggleRemoveFaultMode$);
      expect(result.type).toEqual(AnalyticNotRecorded.type);
      expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
    });
  });

  describe('toggleSeriousFaultMode', () => {
    it('should call logEvent when action is user generated', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testReportActions.ToggleSeriousFaultMode(true));
      const result = await firstValueFrom(effects.toggleSeriousFaultMode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SELECT_MODE,
        GoogleAnalyticsEventsTitles.MODE,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent when action is user generated, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(testReportActions.ToggleSeriousFaultMode(true));
      const result = await firstValueFrom(effects.toggleSeriousFaultMode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SELECT_MODE}`,
        GoogleAnalyticsEventsTitles.MODE,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should not call logEvent when action is not user generated', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testReportActions.ToggleSeriousFaultMode());
      const result = await firstValueFrom(effects.toggleSeriousFaultMode$);
      expect(result.type).toEqual(AnalyticNotRecorded.type);
      expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
    });
  });

  describe('toggleDangerousFaultMode', () => {
    it('should call logEvent when action is user generated', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testReportActions.ToggleDangerousFaultMode(true));
      const result = await firstValueFrom(effects.toggleDangerousFaultMode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SELECT_MODE,
        GoogleAnalyticsEventsTitles.MODE,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent when action is user generated prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(testReportActions.ToggleDangerousFaultMode(true));
      const result = await firstValueFrom(effects.toggleDangerousFaultMode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SELECT_MODE}`,
        GoogleAnalyticsEventsTitles.MODE,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should not call logEvent when action is not user generated', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testReportActions.ToggleDangerousFaultMode());
      const result = await firstValueFrom(effects.toggleDangerousFaultMode$);
      expect(result.type).toEqual(AnalyticNotRecorded.type);
      expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
    });
  });

  describe('addDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(
        drivingFaultsActions.AddDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 1,
        })
      );
      const result = await firstValueFrom(effects.addDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(
        drivingFaultsActions.AddDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 1,
        })
      );
      const result = await firstValueFrom(effects.addDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('addSeriousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(seriousFaultsActions.AddSeriousFault(Competencies.controlsGears));
      const result = await firstValueFrom(effects.addSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(seriousFaultsActions.AddSeriousFault(Competencies.controlsGears));
      const result = await firstValueFrom(effects.addSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('addDangerousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(dangerousFaultsActions.AddDangerousFault(Competencies.controlsGears));
      const result = await firstValueFrom(effects.addDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(dangerousFaultsActions.AddDangerousFault(Competencies.controlsGears));
      const result = await firstValueFrom(effects.addDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('addManoeuvreDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(
        manoeuvresActions.AddManoeuvreDrivingFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      const result = await firstValueFrom(effects.addManoeuvreDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
          manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
        }`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(
        manoeuvresActions.AddManoeuvreDrivingFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      const result = await firstValueFrom(effects.addManoeuvreDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.ADD_FAULT}_${
          manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]
        }_${manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('addManoeuvreDrivingFaultCatADIPart2', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      actions$.next(
        manoeuvresADIPart2Actions.AddManoeuvreDrivingFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          0
        )
      );
      const result = await firstValueFrom(effects.addManoeuvreDrivingFaultCatADIPart2$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
          manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
        }`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('addManoeuvreSeriousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(
        manoeuvresActions.AddManoeuvreSeriousFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      const result = await firstValueFrom(effects.addManoeuvreSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
          manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
        }`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(
        manoeuvresActions.AddManoeuvreSeriousFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      const result = await firstValueFrom(effects.addManoeuvreSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.ADD_FAULT}_${
          manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]
        }_${manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('addManoeuvreSeriousFaultCatADIPart2', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      actions$.next(
        manoeuvresADIPart2Actions.AddManoeuvreSeriousFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          0
        )
      );
      const result = await firstValueFrom(effects.addManoeuvreSeriousFaultCatADIPart2$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
          manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
        }`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('addManoeuvreDangerousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(
        manoeuvresActions.AddManoeuvreDangerousFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      const result = await firstValueFrom(effects.addManoeuvreDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
          manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
        }`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(
        manoeuvresActions.AddManoeuvreDangerousFault({
          manoeuvre: ManoeuvreTypes.reverseRight,
          competency: ManoeuvreCompetencies.controlFault,
        })
      );
      const result = await firstValueFrom(effects.addManoeuvreDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.ADD_FAULT}_${
          manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]
        }_${manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('addManoeuvreDangerousFaultCatADIPart2', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      actions$.next(
        manoeuvresADIPart2Actions.AddManoeuvreDangerousFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          0
        )
      );
      const result = await firstValueFrom(effects.addManoeuvreDangerousFaultCatADIPart2$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
          manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
        }`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('controlledStopAddDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(controlledStopActions.ControlledStopAddDrivingFault());
      const result = await firstValueFrom(effects.controlledStopAddDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.outcomeControlledStop}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(controlledStopActions.ControlledStopAddDrivingFault());
      const result = await firstValueFrom(effects.controlledStopAddDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.outcomeControlledStop}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('controlledStopAddSeriousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(controlledStopActions.ControlledStopAddSeriousFault());
      const result = await firstValueFrom(effects.controlledStopAddSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.outcomeControlledStop}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(controlledStopActions.ControlledStopAddSeriousFault());
      const result = await firstValueFrom(effects.controlledStopAddSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.outcomeControlledStop}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('controlledStopAddDangerousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(controlledStopActions.ControlledStopAddDangerousFault());
      const result = await firstValueFrom(effects.controlledStopAddDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.outcomeControlledStop}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(controlledStopActions.ControlledStopAddDangerousFault());
      const result = await firstValueFrom(effects.controlledStopAddDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.outcomeControlledStop}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('showMeQuestionDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(vehicleChecksActions.ShowMeQuestionDrivingFault());
      const result = await firstValueFrom(effects.showMeQuestionDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.showMeQuestion}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(vehicleChecksActions.ShowMeQuestionDrivingFault());
      const result = await firstValueFrom(effects.showMeQuestionDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.showMeQuestion}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('showMeQuestionSeriousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(vehicleChecksActions.ShowMeQuestionSeriousFault());
      const result = await firstValueFrom(effects.showMeQuestionSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.showMeQuestion}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(vehicleChecksActions.ShowMeQuestionSeriousFault());
      const result = await firstValueFrom(effects.showMeQuestionSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.showMeQuestion}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('showMeQuestionDangerousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(vehicleChecksActions.ShowMeQuestionDangerousFault());
      const result = await firstValueFrom(effects.showMeQuestionDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.showMeQuestion}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(vehicleChecksActions.ShowMeQuestionDangerousFault());
      const result = await firstValueFrom(effects.showMeQuestionDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.showMeQuestion}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('removeDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(
        drivingFaultsActions.RemoveDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 0,
        })
      );
      const result = await firstValueFrom(effects.removeDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(
        drivingFaultsActions.RemoveDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 0,
        })
      );
      const result = await firstValueFrom(effects.removeDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.REMOVE_FAULT
        }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('removeSeriousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(seriousFaultsActions.RemoveSeriousFault(Competencies.controlsGears));
      const result = await firstValueFrom(effects.removeSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(seriousFaultsActions.RemoveSeriousFault(Competencies.controlsGears));
      const result = await firstValueFrom(effects.removeSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.REMOVE_FAULT
        }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('removeDangerousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(dangerousFaultsActions.RemoveDangerousFault(Competencies.controlsGears));
      const result = await firstValueFrom(effects.removeDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(dangerousFaultsActions.RemoveDangerousFault(Competencies.controlsGears));
      const result = await firstValueFrom(effects.removeDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.REMOVE_FAULT
        }_${fullAnalyticCompetencyLabels[Competencies.controlsGears]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('removeManoeuvreDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(
        manoeuvresActions.RemoveManoeuvreFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          CompetencyOutcome.DF
        )
      );
      const result = await firstValueFrom(effects.removeManoeuvreFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
          manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
        }`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(
        manoeuvresActions.RemoveManoeuvreFault(
          {
            manoeuvre: ManoeuvreTypes.reverseRight,
            competency: ManoeuvreCompetencies.controlFault,
          },
          CompetencyOutcome.DF
        )
      );
      const result = await firstValueFrom(effects.removeManoeuvreFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.REMOVE_FAULT}_${
          manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]
        }_${manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]}`,
        // eslint-disable-next-line max-len
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('removeManoeuvreDrivingFaultCatADIPart2', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
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
      const result = await firstValueFrom(effects.removeManoeuvreFaultCatADIPart2$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${manoeuvreTypeAnalyticLabels[ManoeuvreTypes.reverseRight]}_${
          manoeuvreCompetencyAnalyticLabels[ManoeuvreCompetencies.controlFault]
        }`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('controlledStopRemoveFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(controlledStopActions.ControlledStopRemoveFault(CompetencyOutcome.DF));
      const result = await firstValueFrom(effects.controlledStopRemoveFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.outcomeControlledStop}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(controlledStopActions.ControlledStopRemoveFault(CompetencyOutcome.DF));
      const result = await firstValueFrom(effects.controlledStopRemoveFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.REMOVE_FAULT
        }_${fullAnalyticCompetencyLabels.outcomeControlledStop}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('showMeQuestionRemoveFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(vehicleChecksActions.ShowMeQuestionRemoveFault(CompetencyOutcome.DF));
      const result = await firstValueFrom(effects.showMeQuestionRemoveFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.showMeQuestion}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(vehicleChecksActions.ShowMeQuestionRemoveFault(CompetencyOutcome.DF));
      const result = await firstValueFrom(effects.showMeQuestionRemoveFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.REMOVE_FAULT
        }_${fullAnalyticCompetencyLabels.showMeQuestion}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('testTermination', () => {
    it('should call logEvent for termination event', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testReportActions.TerminateTestFromTestReport());
      const result = await firstValueFrom(effects.testTermination$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.TEST_TERMINATED);
    });
    it('should call logEvent for termination event, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(testReportActions.TerminateTestFromTestReport());
      const result = await firstValueFrom(effects.testTermination$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.TEST_TERMINATED}`
      );
    });
  });

  describe('toggleLegalRequirement', () => {
    it('should call logEvent for normal start completed', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      actions$.next(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      const result = await firstValueFrom(effects.toggleLegalRequirement$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_NS1`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });
    it('should call logEvent for normal start uncompleted', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      const result = await firstValueFrom(effects.toggleLegalRequirement$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_NS1`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.uncompleted
      );
    });
    it('should call logEvent for eco completed', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.ToggleEco());
      actions$.next(ecoActions.ToggleEco());
      const result = await firstValueFrom(effects.toggleEco$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_ECO`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });
    it('should call logEvent for eco uncompleted', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(ecoActions.ToggleEco());
      const result = await firstValueFrom(effects.toggleEco$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_ECO`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.uncompleted
      );
    });

    it('should call logEvent for selected manoeuvre', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(manoeuvresActions.RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad));
      const result = await firstValueFrom(effects.manoeuvreCompletedEffect$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_MAN`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });

    it('should call logEvent for selected manoeuvre for ADI part2', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI2));
      actions$.next(manoeuvresADIPart2Actions.RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad, 0));
      const result = await firstValueFrom(effects.manoeuvreCompletedEffectCatADIPart2$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_MAN`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });

    it('should call logEvent for deselected manoeuvre', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(manoeuvresActions.RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad));
      actions$.next(manoeuvresActions.RecordManoeuvresDeselection(ManoeuvreTypes.reverseParkRoad));
      const result = await firstValueFrom(effects.deselectReverseLeftManoeuvreEffect$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_MAN`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.uncompleted
      );
    });

    it('should call logEvent for normal start, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      store$.dispatch(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      actions$.next(testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1));
      const result = await firstValueFrom(effects.toggleLegalRequirement$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_NS1`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });
    it('should call logEvent for eco, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      store$.dispatch(ecoActions.ToggleEco());
      actions$.next(ecoActions.ToggleEco());
      const result = await firstValueFrom(effects.toggleEco$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_ECO`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });

    it('should call logEvent for show me / tell me completed', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      const showMeQuestionPassedAction = vehicleChecksActions.ShowMeQuestionPassed();
      store$.dispatch(showMeQuestionPassedAction);
      actions$.next(showMeQuestionPassedAction);
      const result = await firstValueFrom(effects.showMeQuestionCompletedEffect$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_SM`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });

    it('should call logEvent for show me / tell me uncompleted', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(vehicleChecksActions.ShowMeQuestionPassed());
      const showMeQuestionRemoveFaultAction = vehicleChecksActions.ShowMeQuestionRemoveFault(CompetencyOutcome.DF);
      store$.dispatch(showMeQuestionRemoveFaultAction);
      actions$.next(showMeQuestionRemoveFaultAction);
      const result = await firstValueFrom(effects.showMeQuestionUncompletedEffect$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.LEGAL_REQUIREMENT}_SM`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.uncompleted
      );
    });
  });

  describe('uncoupleRecoupleAddDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.BE));
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddDrivingFault());
      const result = await firstValueFrom(effects.uncoupleRecoupleAddDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddDrivingFault());
      const result = await firstValueFrom(effects.uncoupleRecoupleAddDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('uncoupleRecoupleAddSeriousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.BE));
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddSeriousFault());
      const result = await firstValueFrom(effects.uncoupleRecoupleAddSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddSeriousFault());
      const result = await firstValueFrom(effects.uncoupleRecoupleAddSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('uncoupleRecoupleAddDangerousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.BE));
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddDangerousFault());
      const result = await firstValueFrom(effects.uncoupleRecoupleAddDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(uncoupleRecoupleActions.UncoupleRecoupleAddDangerousFault());
      const result = await firstValueFrom(effects.uncoupleRecoupleAddDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.uncoupleRecouple}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('reverseLeftPopoverOpened', () => {
    it('should call logEvent with the correct parameters', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(reverseLeftActions.ReverseLeftPopoverOpened());
      const result = await firstValueFrom(effects.reverseLeftPopoverOpened$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.NAVIGATION}`,
        GoogleAnalyticsEventsTitles.OPENED,
        GoogleAnalyticsEventsValues.REVERSE_MANOEUVRE
      );
    });
  });

  describe('reverseLeftPopoverClosed', () => {
    it('should call logEvent with the correct parameters', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(reverseLeftActions.ReverseLeftPopoverClosed());
      const result = await firstValueFrom(effects.reverseLeftPopoverClosed$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.NAVIGATION}`,
        GoogleAnalyticsEventsTitles.CLOSED,
        GoogleAnalyticsEventsValues.REVERSE_MANOEUVRE
      );
    });
  });

  describe('toggleAvoidanceSpeedReq', () => {
    it('should log speed not met for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(avoidanceActions.AddAvoidanceSeriousFault());
      const result = await firstValueFrom(effects.toggleAvoidanceSpeedReq$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        GoogleAnalyticsEventsValues.NOT_MET
      );
    });

    it('should call logEvent for speed met for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(avoidanceActions.RemoveAvoidanceSeriousFault());
      const result = await firstValueFrom(effects.toggleAvoidanceSpeedReq$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        GoogleAnalyticsEventsValues.MET
      );
    });
  });

  describe('reportAvoidanceFirstAttempt', () => {
    it('should call logEvent for report avoidance first attempt', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      const attemptValue = 27;
      store$.dispatch(avoidanceActions.RecordAvoidanceFirstAttempt(attemptValue));
      store$.dispatch(avoidanceActions.ReportAvoidanceFirstAttempt(attemptValue));
      actions$.next(avoidanceActions.ReportAvoidanceFirstAttempt(attemptValue));
      const result = await firstValueFrom(effects.reportAvoidanceFirstAttempt$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE,
        GoogleAnalyticsEventsTitles.FIRST_ATTEMPT,
        `${competencyLabels.speedCheckAvoidance} - ${attemptValue}`
      );
    });
  });

  describe('reportAvoidanceSecondAttempt', () => {
    it('should call logEvent for report avoidance second attempt', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      const attemptValue = 5;
      store$.dispatch(avoidanceActions.RecordAvoidanceSecondAttempt(attemptValue));
      store$.dispatch(avoidanceActions.ReportAvoidanceSecondAttempt(attemptValue));
      actions$.next(avoidanceActions.ReportAvoidanceSecondAttempt(attemptValue));
      const result = await firstValueFrom(effects.reportAvoidanceSecondAttempt$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE,
        GoogleAnalyticsEventsTitles.SECOND_ATTEMPT,
        `${competencyLabels.speedCheckAvoidance} - ${attemptValue}`
      );
    });
  });

  describe('speedRequirementNotMetModalOpened', () => {
    it('should call logEvent for speed requirement not met modal opened', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(testReportCatAMod1Actions.SpeedRequirementNotMetModalOpened());
      const result = await firstValueFrom(effects.speedRequirementNotMetModalOpened$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.MODAL,
        GoogleAnalyticsEventsValues.SPEED_REQ_NOT_MET
      );
    });
  });

  describe('emergencyStopDangerousFaultModelOpened', () => {
    it('should call logEvent for emergency stop dangerous fault modal opened', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(testReportCatAMod1Actions.EmergencyStopDangerousFaultModelOpened());
      const result = await firstValueFrom(effects.emergencyStopDangerousFaultModelOpened$);
      expect(result.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.NAVIGATION,
        GoogleAnalyticsEventsTitles.OPENED,
        ModalReason.EMERGENCY_STOP_DANGEROUS
      );
    });
  });

  describe('emergencyStopSeriousFaultModelOpened', () => {
    it('should call logEvent for emergency stop serious fault modal opened', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(testReportCatAMod1Actions.EmergencyStopSeriousFaultModelOpened());
      const result = await firstValueFrom(effects.emergencyStopSeriousFaultModelOpened$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.NAVIGATION,
        GoogleAnalyticsEventsTitles.OPENED,
        ModalReason.EMERGENCY_STOP_SERIOUS
      );
    });
  });

  describe('toggleEmergencyStopSpeedReq', () => {
    it('should call logEvent for speed not met', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(emergencyStopActions.AddEmergencyStopSeriousFault());
      const result = await firstValueFrom(effects.toggleEmergencyStopSpeedReq$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EMERGENCY_STOP,
        GoogleAnalyticsEventsTitles.SPEED_REQ,
        GoogleAnalyticsEventsValues.NOT_MET
      );
    });

    it('should call logEvent for speed met', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(emergencyStopActions.RemoveEmergencyStopSeriousFault());
      const result = await firstValueFrom(effects.toggleEmergencyStopSpeedReq$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EMERGENCY_STOP,
        GoogleAnalyticsEventsTitles.SPEED_REQ,
        GoogleAnalyticsEventsValues.MET
      );
    });
  });

  describe('reportEmergencyStopFirstAttempt', () => {
    it('should call logEvent for report emergency stop first attempt', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      const attemptValue = 27;
      store$.dispatch(emergencyStopActions.RecordEmergencyStopFirstAttempt(attemptValue));
      store$.dispatch(emergencyStopActions.ReportEmergencyStopFirstAttempt(attemptValue));
      actions$.next(emergencyStopActions.ReportEmergencyStopFirstAttempt(attemptValue));
      const result = await firstValueFrom(effects.reportEmergencyStopFirstAttempt$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EMERGENCY_STOP,
        GoogleAnalyticsEventsTitles.FIRST_ATTEMPT,
        `${competencyLabels.speedCheckEmergency} - ${attemptValue}`
      );
    });
  });

  describe('reportEmergencyStopSecondAttempt', () => {
    it('should call logEvent for report emergency stop second attempt', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      const attemptValue = 27;
      store$.dispatch(emergencyStopActions.RecordEmergencyStopSecondAttempt(attemptValue));
      store$.dispatch(emergencyStopActions.ReportEmergencyStopSecondAttempt(attemptValue));
      actions$.next(emergencyStopActions.ReportEmergencyStopSecondAttempt(attemptValue));
      const result = await firstValueFrom(effects.reportEmergencyStopSecondAttempt$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.EMERGENCY_STOP,
        GoogleAnalyticsEventsTitles.SECOND_ATTEMPT,
        `${competencyLabels.speedCheckEmergency} - ${attemptValue}`
      );
    });
  });

  describe('setSingleFaultCompetencyOutcome', () => {
    it('should call logEvent for adding a single competency driving fault', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(
        singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
          SingleFaultCompetencyNames.slalom,
          CompetencyOutcome.DF
        )
      );
      const result = await firstValueFrom(effects.setSingleFaultCompetencyOutcome$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });

    it('should call logEvent for adding a single competency dangerous fault', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(
        singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
          SingleFaultCompetencyNames.slalom,
          CompetencyOutcome.D
        )
      );
      const result = await firstValueFrom(effects.setSingleFaultCompetencyOutcome$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });

    it('should call logEvent for adding a single competency serious fault', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(
        singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome(
          SingleFaultCompetencyNames.slalom,
          CompetencyOutcome.S
        )
      );
      const result = await firstValueFrom(effects.setSingleFaultCompetencyOutcome$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('removeSingleFaultCompetencyOutcome', () => {
    it('should call logEvent for removing a single competency driving fault', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome(SingleFaultCompetencyNames.slalom));
      const result = await firstValueFrom(effects.removeSingleFaultCompetencyOutcome$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('removeSingleDangerousFaultCompetencyOutcome', () => {
    it('should call logEvent for removing a single competency dangerous fault', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(
        singleFaultCompetencyActions.RemoveSingleDangerousFaultCompetencyOutcome(SingleFaultCompetencyNames.slalom)
      );
      const result = await firstValueFrom(effects.removeSingleDangerousFaultCompetencyOutcome$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('removeSingleSeriousFaultCompetencyOutcome', () => {
    it('should call logEvent for removing a single competency serious fault', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.EUAM1));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(
        singleFaultCompetencyActions.RemoveSingleSeriousFaultCompetencyOutcome(SingleFaultCompetencyNames.slalom)
      );
      const result = await firstValueFrom(effects.removeSingleSeriousFaultCompetencyOutcome$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.slalom}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('PcvDoorExerciseAddDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseAddDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseAddDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('PcvDoorExerciseSeriousDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseAddSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseAddSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('pcvDoorExerciseAddDangerousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseAddDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.ADD_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseAddDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.ADD_FAULT
        }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('PcvDoorExerciseRemoveDrivingFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseRemoveDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseRemoveDrivingFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.REMOVE_FAULT
        }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING
      );
    });
  });

  describe('pcvDoorExerciseRemoveSeriousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseRemoveSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseRemoveSeriousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.REMOVE_FAULT
        }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS
      );
    });
  });

  describe('pcvDoorExerciseRemoveDangerousFault', () => {
    it('should call logEvent for this competency', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseRemoveDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.REMOVE_FAULT}_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      actions$.next(pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault());
      const result = await firstValueFrom(effects.pcvDoorExerciseRemoveDangerousFault$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${
          GoogleAnalyticsEvents.REMOVE_FAULT
        }_${fullAnalyticCompetencyLabels.pcvDoorExercise}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS
      );
    });
  });

  describe('toggleHighwayCodeSafety', () => {
    it('should call log event with toggle highway code stop completed', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.F));
      store$.dispatch(PopulateTestCategory(TestCategory.F));
      store$.dispatch(highwayCodeActions.ToggleHighwayCodeSafety());
      actions$.next(highwayCodeActions.ToggleHighwayCodeSafety());
      const result = await firstValueFrom(effects.toggleHighwayCodeSafety$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.LEGAL_REQUIREMENT,
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels.highwayCodeSafety,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });
    it('should call log event with toggle highway code uncompleted', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.F));
      store$.dispatch(PopulateTestCategory(TestCategory.F));
      actions$.next(highwayCodeActions.ToggleHighwayCodeSafety());
      const result = await firstValueFrom(effects.toggleHighwayCodeSafety$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.LEGAL_REQUIREMENT,
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels.highwayCodeSafety,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.uncompleted
      );
    });
  });
  describe('toggleEcoControl', () => {
    it('should call log event with toggle eco control selected', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.ToggleControlEco());
      actions$.next(ecoActions.ToggleControlEco());
      const result = await firstValueFrom(effects.toggleEcoControl$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.ECO_CONTROL,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        'selected'
      );
    });
    it('should call log event with toggle eco control unselected', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(ecoActions.ToggleControlEco());
      const result = await firstValueFrom(effects.toggleEcoControl$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.ECO_CONTROL,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        'unselected'
      );
    });
  });
  describe('toggleEcoPlanning', () => {
    it('should call log event with toggle eco planning selected', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(ecoActions.TogglePlanningEco());
      actions$.next(ecoActions.TogglePlanningEco());
      const result = await firstValueFrom(effects.toggleEcoPlanning$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.ECO_PLANNING,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        'selected'
      );
    });
    it('should call log event with toggle eco planning unselected', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(ecoActions.TogglePlanningEco());
      const result = await firstValueFrom(effects.toggleEcoPlanning$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.ECO_PLANNING,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        'unselected'
      );
    });
  });
  describe('toggleETA', () => {
    it('should call log event with toggle eta physical selected', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(etaActions.ToggleETA(ExaminerActions.physical));
      actions$.next(etaActions.ToggleETA(ExaminerActions.physical));
      const result = await firstValueFrom(effects.toggleETA$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.ETA,
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        GoogleAnalyticsEventsValues.ETA_PHYSICAL,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        'selected'
      );
    });
    it('should call log event with toggle eta physical unselected', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(etaActions.ToggleETA(ExaminerActions.physical));
      const result = await firstValueFrom(effects.toggleETA$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.ETA,
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        GoogleAnalyticsEventsValues.ETA_PHYSICAL,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        'unselected'
      );
    });
    it('should call log event with toggle eta verbal selected', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(etaActions.ToggleETA(ExaminerActions.verbal));
      actions$.next(etaActions.ToggleETA(ExaminerActions.verbal));
      const result = await firstValueFrom(effects.toggleETA$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.ETA,
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        GoogleAnalyticsEventsValues.ETA_VERBAL,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        'selected'
      );
    });
    it('should call log event with toggle eta verbal unselected', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(etaActions.ToggleETA(ExaminerActions.verbal));
      const result = await firstValueFrom(effects.toggleETA$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.ETA,
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        GoogleAnalyticsEventsValues.ETA_VERBAL,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        'unselected'
      );
    });
  });
  describe('startTimer', () => {
    it('should call logEvent with a start timer event', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.D));
      actions$.next(testReportActions.StartTimer());
      const result = await firstValueFrom(effects.startTimer$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.START_TIMER);
    });
  });
  describe('toggleControlledStop', () => {
    it('should call log event with toggle controlled stop completed', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      store$.dispatch(controlledStopActions.ToggleControlledStop());
      actions$.next(controlledStopActions.ToggleControlledStop());
      const result = await firstValueFrom(effects.toggleControlledStop$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.CONTROLLED_STOP,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed
      );
    });
    it('should call log event with toggle controlled stop uncompleted', async () => {
      store$.dispatch(testsActions.StartTest(123456, TestCategory.B));
      actions$.next(controlledStopActions.ToggleControlledStop());
      const result = await firstValueFrom(effects.toggleControlledStop$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.CONTROLLED_STOP,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.uncompleted
      );
    });
  });
  describe('studentLevelChanged', () => {
    it('should call log event for this competency', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const studentLevel = 'beginner';
        store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonThemeActions.StudentLevelChanged(studentLevel));
        // ASSERT
        expect(effects.studentLevelChanged$).toBeDefined();
        effects.studentLevelChanged$.subscribe((result) => {
          try {
            expect(result.type).toEqual(AnalyticRecorded.type);

            // GA4 Analytics
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.STUDENT_EXPERIENCE,
              GoogleAnalyticsEventsTitles.LEVEL,
              studentLevel
            );
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
    it('should call logEvent for this competency, prefixed with practice test', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const studentLevel = 'beginner';
        store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonThemeActions.StudentLevelChanged(studentLevel));
        // ASSERT
        effects.studentLevelChanged$.subscribe((result) => {
          try {
            expect(result.type).toEqual(AnalyticRecorded.type);

            // GA4 Analytics
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.STUDENT_EXPERIENCE}`,
              GoogleAnalyticsEventsTitles.LEVEL,
              studentLevel
            );
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
  });
  describe('addLessonTheme', () => {
    it('should call log event for this competency', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const lessonTheme = 'junctions';
        store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonThemeActions.LessonThemeAdded(lessonTheme));
        // ASSERT
        effects.studentLevelChanged$.subscribe((result) => {
          try {
            expect(result.type).toEqual(AnalyticRecorded.type);

            // GA4 Analytics
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.LESSON_THEME,
              GoogleAnalyticsEventsTitles.ADDED,
              lessonThemeValues[lessonTheme]
            );
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
    it('should call log event for this competency, prefixed with practice test', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const lessonTheme = 'junctions';
        store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonThemeActions.LessonThemeAdded(lessonTheme));
        // ASSERT
        effects.addLessonTheme$.subscribe((result) => {
          try {
            expect(result.type).toEqual(AnalyticRecorded.type);

            // GA4 Analytics
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LESSON_THEME}`,
              GoogleAnalyticsEventsTitles.ADDED,
              lessonThemeValues[lessonTheme]
            );
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
  });
  describe('removeLessonTheme', () => {
    it('should call log event for this competency', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const lessonTheme = 'junctions';
        store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonThemeActions.LessonThemeRemoved(lessonTheme));
        // ASSERT
        effects.removeLessonTheme$.subscribe((result) => {
          try {
            expect(result.type).toEqual(AnalyticRecorded.type);

            // GA4 Analytics
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.LESSON_THEME,
              GoogleAnalyticsEventsTitles.REMOVED,
              lessonThemeValues[lessonTheme]
            );
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
    it('should call log event for this competency, prefixed with practice test', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const lessonTheme = 'junctions';
        store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonThemeActions.LessonThemeRemoved(lessonTheme));
        // ASSERT
        effects.removeLessonTheme$.subscribe((result) => {
          try {
            expect(result.type).toEqual(AnalyticRecorded.type);

            // GA4 Analytics
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LESSON_THEME}`,
              GoogleAnalyticsEventsTitles.REMOVED,
              lessonThemeValues[lessonTheme]
            );
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
  });
  describe('otherReasonChanged', () => {
    it('should call log event for this competency', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const otherReason = 'Other Reason';
        store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonThemeActions.OtherChanged(otherReason));
        // ASSERT
        effects.otherReasonChanged$.subscribe((result) => {
          try {
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
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
    it('should call log event for this competency, prefixed with practice test', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const otherReason = 'Other Reason';
        store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonThemeActions.OtherChanged(otherReason));
        // ASSERT
        effects.otherReasonChanged$.subscribe((result) => {
          try {
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
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
  });
  describe('lessonPlanningQuestionScoreChanged', () => {
    it('should call log event for this competency', async () => {
      await new Promise<void>((done, reject) => {
        const question = 1;
        const score = 2;
        // ARRANGE
        store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonPlanningActions.LessonPlanningQuestionScoreChanged(question, score));
        // ASSERT
        effects.lessonPlanningQuestionScoreChanged$.subscribe((result) => {
          try {
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
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
    it('should call log event for this competency, prefixed with practice test', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const question = 1;
        const score = 2;
        store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(lessonPlanningActions.LessonPlanningQuestionScoreChanged(question, score));
        // ASSERT
        effects.lessonPlanningQuestionScoreChanged$.subscribe((result) => {
          try {
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
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
  });
  describe('riskManagementQuestionScoreChanged', () => {
    it('should call log event for this competency', async () => {
      await new Promise<void>((done, reject) => {
        const question = 1;
        const score = 2;
        // ARRANGE
        store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(riskManagementActions.RiskManagementQuestionScoreChanged(question, score));
        // ASSERT
        effects.riskManagementQuestionScoreChanged$.subscribe((result) => {
          try {
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
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
    it('should call log event for this competency, prefixed with practice test', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const question = 1;
        const score = 2;
        store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(riskManagementActions.RiskManagementQuestionScoreChanged(question, score));
        // ASSERT
        effects.riskManagementQuestionScoreChanged$.subscribe((result) => {
          try {
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
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
  });
  describe('teachingLearningStrategyQuestionScoreChanged', () => {
    it('should call log event for this competency', async () => {
      await new Promise<void>((done, reject) => {
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
          try {
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
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
    it('should call log event for this competency, prefixed with practice test', async () => {
      await new Promise<void>((done, reject) => {
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
          try {
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
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
  });
  describe('testReportAssessmentOverallScore', () => {
    it('should call log event for this competency', async () => {
      await new Promise<void>((done, reject) => {
        const score = 10;
        // ARRANGE
        store$.dispatch(testsActions.StartTest(123456, TestCategory.ADI3));
        // ACT
        // eslint-disable-next-line max-len
        store$.dispatch(testReportAdi3Actions.AssessmentOverallScoreChanged(score));
        // ASSERT
        effects.testReportAssessmentOverallScore$.subscribe((result) => {
          try {
            expect(result.type).toEqual(AnalyticRecorded.type);

            // GA4 Analytics
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.OVERALL_ASSESSMENT,
              GoogleAnalyticsEventsTitles.SCORE,
              String(score)
            );
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
    it('should call log event for this competency, prefixed with practice test', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        const score = 10;
        store$.dispatch(testsActions.StartTestReportPracticeTest(123456, TestCategory.ADI3));
        // ACT
        store$.dispatch(testReportAdi3Actions.AssessmentOverallScoreChanged(score));
        // ASSERT
        effects.teachingLearningStrategyQuestionScoreChanged$.subscribe((result) => {
          try {
            expect(result.type).toEqual(AnalyticRecorded.type);

            // GA4 Analytics
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.OVERALL_ASSESSMENT}`,
              GoogleAnalyticsEventsTitles.SCORE,
              String(score)
            );
          } catch (error) {
            reject(error);
          }
        }, reject);
        done();
      });
    });
  });
});
