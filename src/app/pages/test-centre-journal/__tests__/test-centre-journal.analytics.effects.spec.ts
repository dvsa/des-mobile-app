import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
  JournalRefreshModes,
} from '@providers/analytics/analytics.model';

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
        // GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

  describe('testCentreJournalRefresh$', () => {
    it('should call logEvent with refresh details', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalGetData(false));
      effects.testCentreJournalRefresh$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.REFRESH_TC_JOURNAL,
          JournalRefreshModes.AUTOMATIC
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.REFRESH,
          JournalRefreshModes.AUTOMATIC
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
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.CHANGE_LOCATION
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.FILTER,
          GoogleAnalyticsEventsValues.LOCATION
        );
        done();
      });
    });
  });

  describe('testCentreJournalTabChanged$', () => {
    it('should log an event with an option not listed in the GA4 switch', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalTabChanged('tab1'));
      effects.testCentreJournalTabChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.TAB_SELECTION,
          'tab1'
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.TAB_SELECTION,
          GoogleAnalyticsEventsValues.UNKNOWN
        );
        done();
      });
    });
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalTabChanged('View Journals'));
      effects.testCentreJournalTabChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.TAB_SELECTION,
          'View Journals'
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.TAB_SELECTION,
          GoogleAnalyticsEventsValues.JOURNALS
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
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.CANDIDATE_SELECTION
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.FILTER,
          GoogleAnalyticsEventsValues.CANDIDATE
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
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.BUTTON_SELECTION,
          'Show booking'
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
          GoogleAnalyticsEventsValues.BOOKINGS
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
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.EXAMINER_SELECTION
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.FILTER,
          GoogleAnalyticsEventsValues.EXAMINER
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
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.BUTTON_SELECTION,
          'Show journals'
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
          GoogleAnalyticsEventsValues.JOURNALS
        );
        done();
      });
    });
  });

  describe('testCentreJournalDateNavigation$', () => {
    it('should log an event with an option not listed in the GA4 switch', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalDateNavigation('some day'));
      effects.testCentreJournalDateNavigation$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.NAVIGATION,
          'some day'
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.NAVIGATION,
          GoogleAnalyticsEventsValues.UNKNOWN
        );
        done();
      });
    });
    it('should log an event', (done) => {
      actions$.next(testCentreJournalActions.TestCentreJournalDateNavigation('today'));
      effects.testCentreJournalDateNavigation$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.TEST_CENTRE_JOURNAL,
          AnalyticsEvents.NAVIGATION,
          'today'
        );
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
          GoogleAnalyticsEventsTitles.NAVIGATION,
          GoogleAnalyticsEventsValues.TODAY
        );
        done();
      });
    });
  });
});
