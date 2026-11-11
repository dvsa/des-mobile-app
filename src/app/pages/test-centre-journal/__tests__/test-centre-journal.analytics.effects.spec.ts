import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';

import { Action } from '@ngrx/store';
import { TestCentreJournalAnalyticsEffects } from '@pages/test-centre-journal/test-centre-journal.analytics.effects';
import * as testCentreJournalActions from '../test-centre-journal.actions';

describe('TestCentreJournalAnalyticsEffects', () => {
  let effects: TestCentreJournalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
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
  });

  describe('testCentreJournalView$', () => {
    it('should call setCurrentPage', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalViewDidEnter());
      const result = await firstValueFrom(effects.testCentreJournalView$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
  });

  describe('testCentreJournalRefresh$', () => {
    it('should call logEvent with refresh details', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalGetData(false));
      const result = await firstValueFrom(effects.testCentreJournalRefresh$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.REFRESH,
        GoogleAnalyticsEventsValues.AUTOMATIC
      );
    });
  });

  describe('testCentreJournalSelectTestCentre$', () => {
    it('should log an event', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalSelectTestCentre());
      const result = await firstValueFrom(effects.testCentreJournalSelectTestCentre$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.FILTER,
        GoogleAnalyticsEventsValues.LOCATION
      );
    });
  });

  describe('testCentreJournalTabChanged$', () => {
    it('should log an event with an option not listed in the GA4 switch', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalTabChanged('tab1'));
      const result = await firstValueFrom(effects.testCentreJournalTabChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.TAB_SELECTION,
        GoogleAnalyticsEventsValues.UNKNOWN
      );
    });
    it('should log an event', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalTabChanged('View Journals'));
      const result = await firstValueFrom(effects.testCentreJournalTabChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.TAB_SELECTION,
        GoogleAnalyticsEventsValues.JOURNALS
      );
    });
  });

  describe('testCentreJournalSelectCandidate$', () => {
    it('should log an event', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalSelectCandidate());
      const result = await firstValueFrom(effects.testCentreJournalSelectCandidate$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.FILTER,
        GoogleAnalyticsEventsValues.CANDIDATE
      );
    });
  });

  describe('testCentreJournalShowBookings$', () => {
    it('should log an event', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalShowBookings());
      const result = await firstValueFrom(effects.testCentreJournalShowBookings$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
        GoogleAnalyticsEventsValues.BOOKINGS
      );
    });
  });

  describe('testCentreJournalSelectExaminer$', () => {
    it('should log an event', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalSelectExaminer());
      const result = await firstValueFrom(effects.testCentreJournalSelectExaminer$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.FILTER,
        GoogleAnalyticsEventsValues.EXAMINER
      );
    });
  });

  describe('testCentreJournalShowJournals$', () => {
    it('should log an event', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalShowJournals());
      const result = await firstValueFrom(effects.testCentreJournalShowJournals$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
        GoogleAnalyticsEventsValues.JOURNALS
      );
    });
  });

  describe('testCentreJournalDateNavigation$', () => {
    it('should log an event with an option not listed in the GA4 switch', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalDateNavigation('some day'));
      const result = await firstValueFrom(effects.testCentreJournalDateNavigation$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.NAVIGATION,
        GoogleAnalyticsEventsValues.UNKNOWN
      );
    });
    it('should log an event', async () => {
      actions$.next(testCentreJournalActions.TestCentreJournalDateNavigation('today'));
      const result = await firstValueFrom(effects.testCentreJournalDateNavigation$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_CENTRE_JOURNAL,
        GoogleAnalyticsEventsTitles.NAVIGATION,
        GoogleAnalyticsEventsValues.TODAY
      );
    });
  });
});
