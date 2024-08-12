import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsScreenNames,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsDimensionIndices,
  JournalRefreshModes,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
  GoogleAnalyticsCustomDimension,
} from '@providers/analytics/analytics.model';
import * as slotActions from '@providers/slot/slot.actions';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as journalActions from '@store/journal/journal.actions';
import { journalReducer } from '@store/journal/journal.reducer';
import { JournalAnalyticsEffects } from '../journal.analytics.effects';
import {
  Candidate,
} from '@dvsa/mes-test-schema/categories/common';
import { ActivityCodes } from '@shared/models/activity-codes';
import {
  JournalRehydrationError,
  JournalRehydrationNull,
  JournalRehydrationSuccess,
} from '@store/journal/journal.actions';
import { JournalRehydrationPage, JournalRehydrationType } from '@store/journal/journal.effects';

describe('JournalAnalyticsEffects', () => {
  let effects: JournalAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.JOURNAL;

  beforeEach(waitForAsync(() => {
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
                }
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
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('journalView', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(journalActions.JournalViewDidEnter());
      effects.journalView$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenName);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '');

        expect(analyticsProviderMock.setGACurrentPage)
          .toHaveBeenCalledWith(screenName);
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.CANDIDATE_ID, '');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE, '');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.TEST_CATEGORY, '');
        done();
      });
    });
  });
  describe('journalNavigation', () => {
    it('should log an event', (done) => {
      actions$.next(journalActions.JournalNavigateDay('1'));
      effects.journalNavigation$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.JOURNAL,
            AnalyticsEvents.NAVIGATION,
            'Tomorrow',
          );
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.JOURNAL_DAYS_FROM_TODAY, '4');

        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.JOURNAL,
            GoogleAnalyticsEventsTitles.NAVIGATION,
            'Tomorrow',
          );
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.JOURNAL_DAYS_FROM_TODAY, '4');

        done();
      });
    });
  });
  describe('journalRefresh', () => {
    it('should log an event', (done) => {
      actions$.next(journalActions.JournalRefresh(JournalRefreshModes.AUTOMATIC));
      effects.journalRefresh$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.JOURNAL,
            AnalyticsEvents.REFRESH_JOURNAL,
            JournalRefreshModes.AUTOMATIC,
          );
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.JOURNAL,
            GoogleAnalyticsEventsTitles.REFRESH,
            JournalRefreshModes.AUTOMATIC,
          );
        done();
      });
    });
  });
  describe('earlyStartModalDidEnter', () => {
    it('should log an event', (done) => {
      actions$.next(journalActions.EarlyStartModalDidEnter());
      effects.earlyStartModalDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.JOURNAL,
          AnalyticsEvents.DISPLAY_EARLY_START_MODAL,
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
          GoogleAnalyticsEventsValues.DISPLAY,
        );
        done();
      });
    });
  });
  describe('earlyStartModalContinue', () => {
    it('should log an event', (done) => {
      actions$.next(journalActions.EarlyStartDidContinue());
      effects.earlyStartModalContinue$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.JOURNAL,
          AnalyticsEvents.EXIT_EARLY_START_MODAL_CONTINUE,
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
          GoogleAnalyticsEventsValues.CONTINUE,
        );
        done();
      });
    });
  });
  describe('earlyStartModalReturn', () => {
    it('should log an event', (done) => {
      actions$.next(journalActions.EarlyStartDidReturn());
      effects.earlyStartModalReturn$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.JOURNAL,
          AnalyticsEvents.EXIT_EARLY_START_MODAL_RETURN,
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.EARLY_START_MODAL,
          GoogleAnalyticsEventsValues.EXIT,
        );
        done();
      });
    });
  });
  describe('journalRefreshError', () => {
    it('should log an error', (done) => {
      actions$.next(journalActions.JournalRefreshError('error-description', 'error-message'));
      effects.journalRefreshError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(
            'error-description',
            'error-message',
          );
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.JOURNAL,
            GoogleAnalyticsEventsTitles.REFRESH,
            'unknownJournalRefresh',
            GoogleAnalyticsEventsTitles.ERROR,
            'error-message',
          );
        done();
      });
    });
    it('should log an error with AutomaticJournalRefresh', (done) => {
      actions$.next(journalActions.JournalRefreshError('AutomaticJournalRefresh', 'error-message'));
      effects.journalRefreshError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(
            'AutomaticJournalRefresh',
            'error-message',
          );
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.JOURNAL,
            GoogleAnalyticsEventsTitles.REFRESH,
            GoogleAnalyticsEventsValues.AUTOMATIC,
            GoogleAnalyticsEventsTitles.ERROR,
            'error-message',
          );
        done();
      });
    });
    it('should log an error with ManualJournalRefresh', (done) => {
      actions$.next(journalActions.JournalRefreshError('ManualJournalRefresh', 'error-message'));
      effects.journalRefreshError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(
            'ManualJournalRefresh',
            'error-message',
          );
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.JOURNAL,
            GoogleAnalyticsEventsTitles.REFRESH,
            GoogleAnalyticsEventsValues.MANUAL,
            GoogleAnalyticsEventsTitles.ERROR,
            'error-message',
          );
        done();
      });
    });
  });
  describe('slotChanged', () => {
    it('should log an event', (done) => {
      actions$.next(slotActions.SlotHasChanged(12345));
      effects.slotChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.JOURNAL,
            AnalyticsEvents.SLOT_CHANGED,
            '12345',
          );
        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.JOURNAL,
            GoogleAnalyticsEventsTitles.SLOT_CHANGED,
            '12345',
          );
        done();
      });
    });
  });
  describe('resumingWriteUpEffect', () => {
    it('should call setCurrentPage', (done) => {

      actions$.next(journalActions.ResumingWriteUp('123'));
      effects.resumingWriteUpEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.RESUME_WRITE_UP,
            'pass',
          );
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(
            AnalyticsDimensionIndices.APPLICATION_REFERENCE,
            '1011',);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');

        expect(analyticsProviderMock.logGAEvent)
          .toHaveBeenCalledWith(
            GoogleAnalyticsEvents.RESUME_WRITE_UP,
            GoogleAnalyticsEventsTitles.RESULT,
            GoogleAnalyticsEventsValues.PASS);
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addGACustomDimension)
          .toHaveBeenCalledWith(GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE, '1011');
        done();
      });
    });
  });

  describe('JournalRehydrationSuccess', () => {
    it('should logGAEvent with the dashboard and auto when ' +
      'JournalRehydrationSuccess action is dispatched with those values', (done) => {
      actions$.next(JournalRehydrationSuccess(
        JournalRehydrationType.AUTO, JournalRehydrationPage.DASHBOARD
      ));

      effects.journalRehydrationSuccess$.subscribe((result) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.DASHBOARD,
          GoogleAnalyticsEventsTitles.REHYDRATION,
          GoogleAnalyticsEventsValues.AUTOMATIC + '_' + GoogleAnalyticsEventsValues.COMPLETED
        );
        expect(result).toEqual(AnalyticRecorded());
        done();
      });
    });
    it('should logGAEvent with the journal and manual when JournalRehydrationSuccess ' +
      'action is dispatched with those values', (done) => {
      actions$.next(JournalRehydrationSuccess(
        JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL
      ));

      effects.journalRehydrationSuccess$.subscribe((result) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.REHYDRATION,
          GoogleAnalyticsEventsValues.MANUAL + '_' + GoogleAnalyticsEventsValues.COMPLETED
        );
        expect(result).toEqual(AnalyticRecorded());
        done();
      });
    });
  });
  describe('JournalRehydrationNull', () => {
    it('should logGAEvent with the dashboard and auto when JournalRehydrationSuccess ' +
      'action is dispatched with those values', (done) => {
      actions$.next(JournalRehydrationNull(
        JournalRehydrationType.AUTO, JournalRehydrationPage.DASHBOARD
      ));

      effects.journalRehydrationNull$.subscribe((result) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.DASHBOARD,
          GoogleAnalyticsEventsTitles.REHYDRATION,
          GoogleAnalyticsEventsValues.AUTOMATIC + '_' + GoogleAnalyticsEventsValues.NULL
        );
        expect(result).toEqual(AnalyticRecorded());
        done();
      });
    });
    it('should logGAEvent with the journal and manual when JournalRehydrationSuccess ' +
      'action is dispatched with those values', (done) => {
      actions$.next(JournalRehydrationNull(
        JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL
      ));

      effects.journalRehydrationNull$.subscribe((result) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.REHYDRATION,
          GoogleAnalyticsEventsValues.MANUAL + '_' + GoogleAnalyticsEventsValues.NULL
        );
        expect(result).toEqual(AnalyticRecorded());
        done();
      });
    });
  });
  describe('JournalRehydrationError', () => {
    it('should logGAEvent with the dashboard and auto when JournalRehydrationSuccess ' +
      'action is dispatched with those values', (done) => {
      actions$.next(JournalRehydrationError(
        JournalRehydrationType.AUTO, JournalRehydrationPage.DASHBOARD
      ));

      effects.journalRehydrationError$.subscribe((result) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.DASHBOARD,
          GoogleAnalyticsEventsTitles.REHYDRATION,
          GoogleAnalyticsEventsValues.AUTOMATIC + '_' + GoogleAnalyticsEventsValues.ERROR
        );
        expect(result).toEqual(AnalyticRecorded());
        done();
      });
    });
    it('should logGAEvent with the journal and manual when JournalRehydrationSuccess ' +
      'action is dispatched with those values', (done) => {
      actions$.next(JournalRehydrationError(
        JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL
      ));

      effects.journalRehydrationError$.subscribe((result) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.JOURNAL,
          GoogleAnalyticsEventsTitles.REHYDRATION,
          GoogleAnalyticsEventsValues.MANUAL + '_' + GoogleAnalyticsEventsValues.ERROR
        );
        expect(result).toEqual(AnalyticRecorded());
        done();
      });
    });
  });
});
