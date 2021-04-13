import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { Application } from '@dvsa/mes-journal-schema';
import { configureTestSuite } from 'ng-bullet';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

import { StoreModel } from '../../../app/shared/models/store.model';
import { ActivityCodes } from '../../../app/shared/models/activity-codes';
import { testsReducer } from '../tests.reducer';
import { TestsAnalyticsEffects } from '../tests.analytics.effects';
import * as testsActions from '../tests.actions';
import * as activityCodeActions from '../activity-code/activity-code.actions';
import * as testStatusActions from '../test-status/test-status.actions';
import * as candidateActions from '../journal-data/common/candidate/candidate.actions';
import * as rekeyActions from '../rekey/rekey.actions';
import * as applicationReferenceActions
  from '../journal-data/common/application-reference/application-reference.actions';

// import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
// import { NavigationStateProvider } from '../../../providers/navigation-state/navigation-state';
import { candidateMock } from '../__mocks__/tests.mock';

describe('Tests Analytics Effects', () => {

  let effects: TestsAnalyticsEffects;
  let analyticsProviderMock;
  let navigationStateProviderMock;
  let actions$: any;
  let store$: Store<StoreModel>;
  const mockApplication: Application = {
    applicationId: 123456,
    bookingSequence: 78,
    checkDigit: 9,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        TestsAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        // { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });
  });

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestsAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    // navigationStateProviderMock = TestBed.inject(NavigationStateProvider);
    store$ = TestBed.inject(Store);
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
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.POST_TEST,
          AnalyticsEvents.SUBMIT_TEST,
          'pass',
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
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.POST_TEST,
          AnalyticsEvents.SUBMIT_REKEY_TEST,
          'fail',
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
        expect(result.type === AnalyticRecorded.type).toBe(true);
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
      const eventLabel = 'fail to pass';
      // ACT
      actions$.next(testsActions.TestOutcomeChanged(eventLabel));
      // ASSERT
      effects.testOutcomeChangedEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
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
    it('should log the correct event if it triggered from the journal page', (done) => {
      // ARRANGE
      spyOn(navigationStateProviderMock, 'isRekeySearch').and.returnValue(false);
      // ACT
      actions$.next(testsActions.StartTest(12345, TestCategory.BE));
      // ASSERT
      effects.startTestAnalyticsEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.TEST_CATEGORY,
          TestCategory.BE,
        );
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.JOURNAL,
          AnalyticsEvents.START_TEST,
        );
        done();
      });
    });
    it('should log the correct event if it is triggered from the Rekey Search page', (done) => {
      // ARRANGE
      spyOn(navigationStateProviderMock, 'isRekeySearch').and.returnValue(true);
      // ACT
      actions$.next(testsActions.StartTest(12345, TestCategory.B));
      // ASSERT
      effects.startTestAnalyticsEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.addCustomDimension).toHaveBeenCalledWith(
          AnalyticsDimensionIndices.TEST_CATEGORY,
          TestCategory.B,
        );
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.REKEY_SEARCH,
          AnalyticsEvents.START_TEST,
        );
        done();
      });
    });
  });
});
