import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ActivityCodes } from '@shared/models/activity-codes';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { Router } from '@angular/router';
import { testsReducer } from '../tests.reducer';
import { TestsAnalyticsEffects } from '../tests.analytics.effects';
import * as testsActions from '../tests.actions';
import * as activityCodeActions from '../activity-code/activity-code.actions';
import * as testStatusActions from '../test-status/test-status.actions';
import * as candidateActions from '../journal-data/common/candidate/candidate.actions';
import * as rekeyActions from '../rekey/rekey.actions';
import * as applicationReferenceActions
  from '../journal-data/common/application-reference/application-reference.actions';

import { candidateMock } from '../__mocks__/tests.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { journalReducer } from '@store/journal/journal.reducer';
import * as journalActions from '@store/journal/journal.actions';
import journalSlotsDataMock from '@store/journal/__mocks__/journal-slots-data.mock';
import { ConnectionStatus } from '@providers/network-state/network-state';

describe('TestsAnalyticsEffects', () => {
  let effects: TestsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let navigationStateProviderMock: NavigationStateProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const mockApplication: Application = {
    applicationId: 123456,
    bookingSequence: 78,
    checkDigit: 9,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          journal: journalReducer,
          tests: testsReducer,
        }),
      ],
      providers: [
        TestsAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: NavigationStateProvider,
          useClass: NavigationStateProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
        {
          provide: Router,
          useClass: RouterMock,
        },
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestsAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    navigationStateProviderMock = TestBed.inject(NavigationStateProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  });

  describe('setTestStatusSubmittedEffect', () => {
    it('should set an action saying the test has been submitted if it is not a rekey', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(12345, TestCategory.B));
      store$.dispatch(candidateActions.PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(testStatusActions.SetTestStatusSubmitted('12345'));
      // ASSERT
      effects.setTestStatusSubmittedEffect$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.SUBMIT_TEST,
            'Pass',
          );
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        done();
      });
    });
    it('should set an action saying the test has been submitted if it is a rekey', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(12345, TestCategory.B));
      store$.dispatch(candidateActions.PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(candidateActions.PopulateCandidateDetails(candidateMock));
      store$.dispatch(rekeyActions.MarkAsRekey());
      // ACT
      actions$.next(testStatusActions.SetTestStatusSubmitted('12345'));
      // ASSERT
      effects.setTestStatusSubmittedEffect$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.SUBMIT_REKEY_TEST,
            'Fail',
          );
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        done();
      });
    });
  });

  describe('sendCompletedTestsFailureEffect', () => {
    it('should send an error action', (done) => {
      // ACT
      actions$.next(testsActions.SendCompletedTestsFailure());
      // ASSERT
      effects.sendCompletedTestsFailureEffect$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(
            'Error connecting to microservice (test submission)',
            'No message',
          );
        done();
      });
    });
  });

  describe('testOutcomeChangedEffect', () => {
    it('should log an event', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(12345, TestCategory.B));
      store$.dispatch(candidateActions.PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(rekeyActions.MarkAsNonRekey());
      const eventLabel = 'fail to pass';
      // ACT
      actions$.next(testsActions.TestOutcomeChanged(eventLabel));
      // ASSERT
      effects.testOutcomeChangedEffect$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.TEST_REPORT,
            AnalyticsEvents.TEST_OUTCOME_CHANGED,
            eventLabel,
          );
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        done();
      });
    });
  });
  describe('startTestAnalyticsEffect', () => {
    beforeEach(() => {
      store$.dispatch(
        journalActions.LoadJournalSuccess(
          {
            examiner: {
              staffNumber: '123',
              individualId: 456,
            },
            slotItemsByDate: journalSlotsDataMock,
          },
          ConnectionStatus.ONLINE,
          false,
          new Date(),
        ),
      ); // Load in mock journal state
    });
    it('should log the correct event if it triggered from the journal page', (done) => {
      // ARRANGE
      spyOn(navigationStateProviderMock, 'isRekeySearch')
        .and
        .returnValue(false);
      store$.dispatch(testsActions.StartTest(12345, TestCategory.B));
      // ACT
      actions$.next(testsActions.StartTest(12345, TestCategory.B));
      // ASSERT
      effects.startTestAnalyticsEffect$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(
            AnalyticsDimensionIndices.TEST_CATEGORY,
            TestCategory.B,
          );
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.JOURNAL,
            AnalyticsEvents.START_TEST,
          );
        done();
      });
    });
    it('should log the correct event if it is triggered from the Rekey Search page', (done) => {
      // ARRANGE
      spyOn(navigationStateProviderMock, 'isRekeySearch')
        .and
        .returnValue(true);
      store$.dispatch(testsActions.StartTest(12345, TestCategory.B));
      // ACT
      actions$.next(testsActions.StartTest(12345, TestCategory.B));
      // ASSERT
      effects.startTestAnalyticsEffect$.subscribe((result) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(
            AnalyticsDimensionIndices.TEST_CATEGORY,
            TestCategory.B,
          );
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.REKEY_SEARCH,
            AnalyticsEvents.START_TEST,
          );
        done();
      });
    });
  });
});
