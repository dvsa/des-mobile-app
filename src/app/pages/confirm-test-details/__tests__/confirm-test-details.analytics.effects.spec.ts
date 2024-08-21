import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject } from 'rxjs';

import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';

import { ConfirmTestDetailsAnalyticsEffects } from '@pages/confirm-test-details/confirm-test-details.analytics.effects';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { StoreModel } from '@shared/models/store.model';
import * as confirmTestDetailsActions from '../confirm-test-details.actions';

describe('ConfirmTestDetailsAnalyticsEffects', () => {
  let effects: ConfirmTestDetailsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.CONFIRM_TEST_DETAILS;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        ConfirmTestDetailsAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ConfirmTestDetailsAnalyticsEffects);
    store$ = TestBed.inject(Store);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  }));

  describe('confirmTestDetailsView$', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(confirmTestDetailsActions.ConfirmTestDetailsViewDidEnter());
      effects.confirmTestDetailsView$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });
  describe('backToDebriefClicked', () => {
    it('should log an event', (done) => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(confirmTestDetailsActions.BackToDebrief());
      effects.backToDebriefClicked$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.BACK,
          GoogleAnalyticsEventsValues.DEBRIEF
        );
        done();
      });
    });
  });
  describe('backButtonClicked', () => {
    it('should log an event', (done) => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(confirmTestDetailsActions.BackButtonClick());
      effects.backButtonClicked$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.BACK,
          GoogleAnalyticsEventsValues.FINALISE_OUTCOME
        );
        done();
      });
    });
  });
});
