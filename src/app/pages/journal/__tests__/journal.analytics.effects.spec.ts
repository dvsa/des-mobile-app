import { TestBed } from '@angular/core/testing';
import { Candidate } from '@dvsa/mes-test-schema/categories/common';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import * as futureTestModalActions from '@pages/journal/journal.actions';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
  JournalRefreshModes,
} from '@providers/analytics/analytics.model';
import * as slotActions from '@providers/slot/slot.actions';
import { ActivityCodes } from '@shared/models/activity-codes';
import * as journalActions from '@store/journal/journal.actions';
import {
  JournalRehydrationError,
  JournalRehydrationNull,
  JournalRehydrationSuccess,
} from '@store/journal/journal.actions';
import { JournalRehydrationPage, JournalRehydrationType } from '@store/journal/journal.effects';
import { journalReducer } from '@store/journal/journal.reducer';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { JournalAnalyticsEffects } from '../journal.analytics.effects';

describe('JournalAnalyticsEffects', () => {
  let effects: JournalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  const screenName = AnalyticsScreenNames.JOURNAL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          journal: journalReducer,
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                activityCode: ActivityCodes.PASS,
                journalData: {
                  candidate: { candidateId: 1 } as Candidate,
                  applicationReference: {
                    applicationId: 1,
                    bookingSequence: 1,
                    checkDigit: 1,
                  },
                  testSlotAttributes: {
                    start: '2026-10-15T09:30:00.000Z',
                  },
                },
              },
            },
          }),
        }),
      ],
      providers: [
        JournalAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(JournalAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  });

  describe('journalView', () => {
    it('should call setCurrentPage', async () => {
      actions$.next(journalActions.JournalViewDidEnter());
      const result = await firstValueFrom(effects.journalView$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        ''
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        ''
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_CATEGORY,
        ''
      );
    });
  });
  describe('journalNavigation', () => {
    it('should log an event', async () => {
      actions$.next(journalActions.JournalNavigateDay('1'));
      const result = await firstValueFrom(effects.journalNavigation$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.NAVIGATION,
        'Tomorrow'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.JOURNAL_DAYS_FROM_TODAY,
        '4'
      );
    });
  });
  describe('journalRefresh', () => {
    it('should log an event', async () => {
      actions$.next(journalActions.JournalRefresh(JournalRefreshModes.AUTOMATIC));
      const result = await firstValueFrom(effects.journalRefresh$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.REFRESH,
        GoogleAnalyticsEventsValues.AUTOMATIC
      );
    });
  });
  describe('earlyStartModalDidEnter', () => {
    it('should log an event', async () => {
      actions$.next(journalActions.EarlyStartModalDidEnter());
      const result = await firstValueFrom(effects.earlyStartModalDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
        GoogleAnalyticsEventsValues.DISPLAY
      );
    });
  });
  describe('earlyStartModalContinue', () => {
    it('should log an event', async () => {
      actions$.next(journalActions.EarlyStartDidContinue());
      const result = await firstValueFrom(effects.earlyStartModalContinue$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
        GoogleAnalyticsEventsValues.CONTINUE
      );
    });
  });
  describe('earlyStartModalReturn', () => {
    it('should log an event', async () => {
      actions$.next(journalActions.EarlyStartDidReturn());
      const result = await firstValueFrom(effects.earlyStartModalReturn$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
        GoogleAnalyticsEventsValues.EXIT
      );
    });
  });
  describe('journalRefreshError', () => {
    it('should log an error', async () => {
      actions$.next(journalActions.JournalRefreshError('error-description', 'error-message'));
      const result = await firstValueFrom(effects.journalRefreshError$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.REFRESH,
        'unknownJournalRefresh',
        GoogleAnalyticsEventsTitles.ERROR,
        'error-message'
      );
    });
    it('should log an error with AutomaticJournalRefresh', async () => {
      actions$.next(journalActions.JournalRefreshError('AutomaticJournalRefresh', 'error-message'));
      const result = await firstValueFrom(effects.journalRefreshError$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.REFRESH,
        GoogleAnalyticsEventsValues.AUTOMATIC,
        GoogleAnalyticsEventsTitles.ERROR,
        'error-message'
      );
    });
    it('should log an error with ManualJournalRefresh', async () => {
      actions$.next(journalActions.JournalRefreshError('ManualJournalRefresh', 'error-message'));
      const result = await firstValueFrom(effects.journalRefreshError$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.REFRESH,
        GoogleAnalyticsEventsValues.MANUAL,
        GoogleAnalyticsEventsTitles.ERROR,
        'error-message'
      );
    });
  });
  describe('slotChanged', () => {
    it('should log an event', async () => {
      actions$.next(slotActions.SlotHasChanged(12345));
      const result = await firstValueFrom(effects.slotChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.JOURNAL,
        GoogleAnalyticsEventsTitles.SLOT_CHANGED,
        '12345'
      );
    });
  });
  describe('resumingWriteUpEffect', () => {
    it('should call setCurrentPage', async () => {
      actions$.next(journalActions.ResumingWriteUp('123'));
      const result = await firstValueFrom(effects.resumingWriteUpEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.RESUME_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.PASS
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '1011'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.TEST_SLOT_DATETIME,
        '2026-10-15T09:30:00.000Z'
      );
    });
  });

  describe('JournalRehydrationSuccess', () => {
    it(
      'should logGAEvent with the dashboard and auto when ' +
        'JournalRehydrationSuccess action is dispatched with those values',
      async () => {
        actions$.next(JournalRehydrationSuccess(JournalRehydrationType.AUTO, JournalRehydrationPage.DASHBOARD));
        const result = await firstValueFrom(effects.journalRehydrationSuccess$);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.REHYDRATION,
          GoogleAnalyticsEventsTitles.REFRESH,
          `${GoogleAnalyticsEventsValues.AUTOMATIC}_${GoogleAnalyticsEventsValues.COMPLETED}`
        );
        expect(result).toEqual(AnalyticRecorded());
      }
    );
    it(
      'should logGAEvent with the journal and manual when JournalRehydrationSuccess ' +
        'action is dispatched with those values',
      async () => {
        actions$.next(JournalRehydrationSuccess(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL));
        const result = await firstValueFrom(effects.journalRehydrationSuccess$);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.REHYDRATION,
          GoogleAnalyticsEventsTitles.REFRESH,
          `${GoogleAnalyticsEventsValues.MANUAL}_${GoogleAnalyticsEventsValues.COMPLETED}`
        );
        expect(result).toEqual(AnalyticRecorded());
      }
    );
  });
  describe('JournalRehydrationNull', () => {
    it(
      'should logGAEvent with the dashboard and auto when JournalRehydrationSuccess ' +
        'action is dispatched with those values',
      async () => {
        actions$.next(JournalRehydrationNull(JournalRehydrationType.AUTO, JournalRehydrationPage.DASHBOARD));
        const result = await firstValueFrom(effects.journalRehydrationNull$);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.REHYDRATION,
          GoogleAnalyticsEventsTitles.REFRESH,
          `${GoogleAnalyticsEventsValues.AUTOMATIC}_${GoogleAnalyticsEventsValues.NULL}`
        );
        expect(result).toEqual(AnalyticRecorded());
      }
    );
    it(
      'should logGAEvent with the journal and manual when JournalRehydrationSuccess ' +
        'action is dispatched with those values',
      async () => {
        actions$.next(JournalRehydrationNull(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL));
        const result = await firstValueFrom(effects.journalRehydrationNull$);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.REHYDRATION,
          GoogleAnalyticsEventsTitles.REFRESH,
          `${GoogleAnalyticsEventsValues.MANUAL}_${GoogleAnalyticsEventsValues.NULL}`
        );
        expect(result).toEqual(AnalyticRecorded());
      }
    );
  });
  describe('JournalRehydrationError', () => {
    it(
      'should logGAEvent with the dashboard and auto when JournalRehydrationSuccess ' +
        'action is dispatched with those values',
      async () => {
        actions$.next(JournalRehydrationError(JournalRehydrationType.AUTO, JournalRehydrationPage.DASHBOARD));
        const result = await firstValueFrom(effects.journalRehydrationError$);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.REHYDRATION,
          GoogleAnalyticsEventsTitles.REFRESH,
          `${GoogleAnalyticsEventsValues.AUTOMATIC}_${GoogleAnalyticsEventsValues.ERROR}`
        );
        expect(result).toEqual(AnalyticRecorded());
      }
    );
    it(
      'should logGAEvent with the journal and manual when JournalRehydrationSuccess ' +
        'action is dispatched with those values',
      async () => {
        actions$.next(JournalRehydrationError(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL));
        const result = await firstValueFrom(effects.journalRehydrationError$);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.REHYDRATION,
          GoogleAnalyticsEventsTitles.REFRESH,
          `${GoogleAnalyticsEventsValues.MANUAL}_${GoogleAnalyticsEventsValues.ERROR}`
        );
        expect(result).toEqual(AnalyticRecorded());
      }
    );
  });

  describe('FutureTestModalCancel', () => {
    it('should log cancel analytics event', async () => {
      actions$.next(futureTestModalActions.FutureTestModalCancelButton());
      const action = await firstValueFrom(effects.futureTestModalCancel$);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.DX_TEST_IN_FUTURE,
        GoogleAnalyticsEventsTitles.MODAL,
        GoogleAnalyticsEventsValues.CANCELLED
      );
      expect(action).toEqual(AnalyticRecorded());
    });
  });

  describe('FutureTestModalContinueButton', () => {
    it('should log continue analytics event', async () => {
      actions$.next(futureTestModalActions.FutureTestModalContinueButton());
      const action = await firstValueFrom(effects.futureTestModalContinue$);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.DX_TEST_IN_FUTURE,
        GoogleAnalyticsEventsTitles.MODAL,
        GoogleAnalyticsEventsValues.CONTINUE
      );
      expect(action).toEqual(AnalyticRecorded());
    });
  });
});
