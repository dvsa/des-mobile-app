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
} from '@providers/analytics/analytics.model';
import * as slotActions from '@providers/slot/slot.actions';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as journalActions from '@store/journal/journal.actions';
import { journalReducer } from '@store/journal/journal.reducer';
import { JournalAnalyticsEffects } from '../journal.analytics.effects';

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
        done();
      });
    });
  });
});
