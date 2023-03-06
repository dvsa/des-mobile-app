import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  JournalRefreshModes,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

import { TestCentreJournalAnalyticsEffects } from '@pages/test-centre-journal/test-centre-journal.analytics.effects';
import * as testCentreJournalActions from '../test-centre-journal.actions';

describe('TestCentreJournalAnalyticsEffects', () => {
  let effects: TestCentreJournalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.TEST_CENTRE_JOURNAL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestCentreJournalAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestCentreJournalAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    spyOn(analyticsProviderMock, 'logEvent');
  });

  describe('testCentreJournalView$', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalViewDidEnter());
      effects.testCentreJournalView$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

  describe('testCentreJournalRefresh$', () => {
    it('should call logEvent with refresh details', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalGetData(false));
      effects.testCentreJournalRefresh$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.REFRESH_TC_JOURNAL,
          JournalRefreshModes.AUTOMATIC,
        );
        done();
      });
    });
  });

  describe('testCentreJournalSelectTestCentre$', () => {
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalSelectTestCentre());
      effects.testCentreJournalSelectTestCentre$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.CHANGE_LOCATION,
        );
        done();
      });
    });
  });

  describe('testCentreJournalTabChanged$', () => {
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalTabChanged('tab1'));
      effects.testCentreJournalTabChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.TAB_SELECTION,
          'tab1',
        );
        done();
      });
    });
  });

  describe('testCentreJournalSelectCandidate$', () => {
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalSelectCandidate());
      effects.testCentreJournalSelectCandidate$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.CANDIDATE_SELECTION,
        );
        done();
      });
    });
  });

  describe('testCentreJournalShowBookings$', () => {
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalShowBookings());
      effects.testCentreJournalShowBookings$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.BUTTON_SELECTION,
          'Show booking',
        );
        done();
      });
    });
  });

  describe('testCentreJournalSelectExaminer$', () => {
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalSelectExaminer());
      effects.testCentreJournalSelectExaminer$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.EXAMINER_SELECTION,
        );
        done();
      });
    });
  });

  describe('testCentreJournalShowJournals$', () => {
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalShowJournals());
      effects.testCentreJournalShowJournals$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.BUTTON_SELECTION,
          'Show journals',
        );
        done();
      });
    });
  });

  describe('testCentreJournalDateNavigation$', () => {
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalDateNavigation('some day'));
      effects.testCentreJournalDateNavigation$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.NAVIGATION,
          'some day',
        );
        done();
      });
    });
  });
});
