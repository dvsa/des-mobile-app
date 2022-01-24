import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { provideMockActions } from '@ngrx/effects/testing';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
  AnalyticsEventCategories,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as testResultSearchActions from '../test-results-search.actions';
import { TestResultsSearchAnalyticsEffects } from '../test-results-search.analytics.effects';

describe('TestResultsSearchAnalyticsEffects', () => {
  let effects: TestResultsSearchAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.TEST_RESULTS_SEARCH;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        TestResultsSearchAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });
  });

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestResultsSearchAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    spyOn(analyticsProviderMock, 'logEvent');
  });

  describe('TestResultSearchViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ACT
      actions$.next(testResultSearchActions.TestResultSearchViewDidEnter());
      // ASSERT
      effects.testResultSearchViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

  describe('PerformApplicationReferenceSearch', () => {
    it('should call logEvent', (done) => {
      // ACT
      actions$.next(testResultSearchActions.PerformApplicationReferenceSearch());
      // ASSERT
      effects.performApplicationReferenceSearch$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_RESULTS_SEARCH,
          AnalyticsEvents.APPLICATION_REFERENCE_SEARCH,
        );
        done();
      });
    });
  });

  describe('PerformDriverNumberSearch', () => {
    it('should call logEvent', (done) => {
      // ACT
      actions$.next(testResultSearchActions.PerformDriverNumberSearch());
      // ASSERT
      effects.performDriverNumberSearch$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_RESULTS_SEARCH,
          AnalyticsEvents.DRIVER_NUMBER_SEARCH,
        );
        done();
      });
    });
  });

  describe('PerformLDTMSearch', () => {
    it('should call logEvent with the correct custom dimensions when no search params are provided', (done) => {
      // ACT
      actions$.next(testResultSearchActions.PerformLDTMSearch({}));
      // ASSERT
      effects.performLDTMSearch$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_RESULTS_SEARCH,
          AnalyticsEvents.LDTM_SEARCH,
          '',
        );
        done();
      });
    });

    it('should call logEvent with the correct custom dimensions when 1 search param is provided', (done) => {
      // ACT
      actions$.next(testResultSearchActions.PerformLDTMSearch({ costCode: 'mock-cost-code' }));
      // ASSERT
      effects.performLDTMSearch$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_RESULTS_SEARCH,
          AnalyticsEvents.LDTM_SEARCH,
          'test centre',
        );
        done();
      });
    });

    it('should call logEvent with the correct custom dimensions when all search params are provided', (done) => {
    // ACT
      actions$.next(testResultSearchActions.PerformLDTMSearch({
        costCode: 'mock-cost-code',
        staffNumber: 'mock-staff-number',
        startDate: 'mock-start-date',
      }));
      // ASSERT
      effects.performLDTMSearch$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_RESULTS_SEARCH,
          AnalyticsEvents.LDTM_SEARCH,
          'date, staff id, test centre',
        );
        done();
      });
    });
  });
});
