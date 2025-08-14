import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { MockStore } from '@ngrx/store/testing';
import { JournalFutureTestModalAnalyticsEffects } from '../journal-future-test-modal.analytics.effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import * as futureTestModalActions from '../journal-future-test-modal.actions';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';

describe('JournalFutureTestModalAnalyticsEffects', () => {
  let effects: JournalFutureTestModalAnalyticsEffects;
  let actions$: Observable<Action>;
  let analyticsProviderMock: jasmine.SpyObj<AnalyticsProvider>;

  beforeEach(async() => {
    analyticsProviderMock = jasmine.createSpyObj('AnalyticsProvider', ['logGAEvent']);
    analyticsProviderMock.logGAEvent.and.returnValue(await Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        JournalFutureTestModalAnalyticsEffects,
        provideMockActions(() => actions$),
        { provide: AnalyticsProvider, useValue: analyticsProviderMock },
        Store
      ]
    });

    effects = TestBed.inject(JournalFutureTestModalAnalyticsEffects);
  });

  it('should log cancel analytics event', (done) => {
    actions$ = new Observable((observer) => {
      observer.next(futureTestModalActions.FutureTestModalCancelButton());
    });

    effects.futureTestModalCancel$.subscribe((action) => {
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.DX_TEST_IN_FUTURE,
        GoogleAnalyticsEventsTitles.MODAL,
        GoogleAnalyticsEventsValues.CANCELLED
      );
      expect(action).toEqual(AnalyticRecorded());
      done();
    });
  });

  it('should log continue analytics event', (done) => {
    actions$ = new Observable((observer) => {
      observer.next(futureTestModalActions.FutureTestModalContinueButton());
    });

    effects.futureTestModalContinue$.subscribe((action) => {
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.DX_TEST_IN_FUTURE,
        GoogleAnalyticsEventsTitles.MODAL,
        GoogleAnalyticsEventsValues.CONTINUE
      );
      expect(action).toEqual(AnalyticRecorded());
      done();
    });
  });
});
