import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AdvancedSearchParams } from '@providers/search/search.models';
import * as testResultSearchActions from '../test-results-search.actions';
import { TestResultsSearchAnalyticsEffects } from '../test-results-search.analytics.effects';

describe('TestResultsSearchAnalyticsEffects', () => {
  let effects: TestResultsSearchAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.TEST_RESULTS_SEARCH;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestResultsSearchAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestResultsSearchAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  });

  describe('TestResultSearchViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      // ACT
      actions$.next(testResultSearchActions.TestResultSearchViewDidEnter());
      // ASSERT
      effects.testResultSearchViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenName);
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
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.COMPLETED_TEST_SEARCH,
            GoogleAnalyticsEventsTitles.FILTER,
            GoogleAnalyticsEventsValues.APP_REF
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
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.COMPLETED_TEST_SEARCH,
            GoogleAnalyticsEventsTitles.FILTER,
            GoogleAnalyticsEventsValues.DRIVER_NUMBER
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
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.LDTM_SEARCH,
            GoogleAnalyticsEventsTitles.FILTER,
            ''
          );
        done();
      });
    });

    it('should call logEvent with the correct custom dimensions when 1 search param is provided', (done) => {
      // ACT
      actions$.next(testResultSearchActions.PerformLDTMSearch({ costCode: 'mock-cost-code' }));
      // ASSERT
      effects.performLDTMSearch$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.LDTM_SEARCH,
            GoogleAnalyticsEventsTitles.FILTER,
            'test centre'
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
        category: 'mock-category',
        activityCode: 'mock-activity-code',
        passCertificateNumber: 'mock-pass-cert',
        rekey: true,
      } as AdvancedSearchParams));
      // ASSERT
      effects.performLDTMSearch$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.LDTM_SEARCH,
            GoogleAnalyticsEventsTitles.FILTER,
            'date, staff id, test centre, activity code, test category, pass certificate, rekey'
          );
        done();
      });
    });
  });
});
