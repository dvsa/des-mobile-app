import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { GoogleAnalyticsEvents } from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { testsReducer } from '../../tests.reducer';
import * as testStatusActions from '../test-status.actions';
import { TestStatusAnalyticsEffects } from '../test-status.analytics.effects';

describe('TestStatusAnalyticsEffects', () => {
  let effects: TestStatusAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        TestStatusAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestStatusAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  });

  describe('setTestStatusDecidedEffect', () => {
    it('should log test decided event', (done) => {
      const slotId = '1101';

      actions$.next(testStatusActions.SetTestStatusDecided(slotId));

      effects.setTestStatusDecidedEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBeTruthy();

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.TEST_DECIDED);
        done();
      });
    });
  });

  describe('setTestStatusWriteUpEffect', () => {
    it('should log test in write-up event', (done) => {
      const slotId = '1101';

      actions$.next(testStatusActions.SetTestStatusWriteUp(slotId));

      effects.setTestStatusWriteUpEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBeTruthy();
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.TEST_IN_WRITE_UP);
        done();
      });
    });
  });

  describe('setTestStatusAutosavedEffect', () => {
    it('should log test in autosaved event', (done) => {
      const slotId = '1101';

      actions$.next(testStatusActions.SetTestStatusAutosaved(slotId));

      effects.setTestStatusAutosavedEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBeTruthy();

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.TEST_AUTOSAVED);
        done();
      });
    });
  });

  describe('setTestStatusSubmittedEffect', () => {
    it('should log test submitted event', (done) => {
      const slotId = '1101';

      actions$.next(testStatusActions.SetTestStatusSubmitted(slotId));

      effects.setTestStatusSubmittedEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBeTruthy();

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(GoogleAnalyticsEvents.TEST_SUBMITTED);
        done();
      });
    });
  });
});
