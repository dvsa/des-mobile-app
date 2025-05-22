import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { get } from 'lodash-es';
import { testsReducer } from '../../tests.reducer';
import * as testStatusActions from '../test-status.actions';
import { TestStatusAnalyticsEffects } from '../test-status.analytics.effects';

describe('TestStatusAnalyticsEffects', () => {
  let effects: TestStatusAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;

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
  describe('getCurrentAppRef', () => {
    it('should return formatted application reference', () => {
      spyOn(get(effects, 'store$') as Store<StoreModule>, 'pipe').and.returnValue({
        subscribe: (cb: any) => {
          cb({ applicationId: '123', bookingSequence: 1, checkDigit: 2 });
          return { unsubscribe: () => {} };
        },
      } as any);
      const result = effects.getCurrentAppRef('slotId');
      expect(typeof result).toBe('string');
    });
  });

  describe('setTestStatusDecidedEffect$', () => {
    it('should log analytics and emit AnalyticRecorded', (done) => {
      spyOn(analyticsProviderMock, 'logGAEvent');
      spyOn(effects, 'getCurrentAppRef').and.returnValue('1');
      actions$.next(testStatusActions.SetTestStatusDecided('1'));
      effects.setTestStatusDecidedEffect$.subscribe((action) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalled();
        expect(action).toEqual(AnalyticRecorded());
        done();
      });
    });
  });

  describe('setTestStatusWriteUpEffect$', () => {
    it('should log analytics and emit AnalyticRecorded', (done) => {
      spyOn(analyticsProviderMock, 'logGAEvent');
      spyOn(effects, 'getCurrentAppRef').and.returnValue('1');
      actions$.next(testStatusActions.SetTestStatusWriteUp('1'));
      effects.setTestStatusWriteUpEffect$.subscribe((action) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalled();
        expect(action).toEqual(AnalyticRecorded());
        done();
      });
    });
  });

  describe('setTestStatusBookedEffect$', () => {
    it('should log analytics and emit AnalyticRecorded', (done) => {
      spyOn(analyticsProviderMock, 'logGAEvent');
      spyOn(effects, 'getCurrentAppRef').and.returnValue('1');
      actions$.next(testStatusActions.SetTestStatusBooked('1'));
      effects.setTestStatusBookedEffect$.subscribe((action) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalled();
        expect(action).toEqual(AnalyticRecorded());
        done();
      });
    });
  });

  describe('setTestStatusStartedEffect$', () => {
    it('should log analytics and emit AnalyticRecorded', (done) => {
      spyOn(analyticsProviderMock, 'logGAEvent');
      spyOn(effects, 'getCurrentAppRef').and.returnValue('1');
      actions$.next(testStatusActions.SetTestStatusStarted('1'));
      effects.setTestStatusStartedEffect$.subscribe((action) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalled();
        expect(action).toEqual(AnalyticRecorded());
        done();
      });
    });
  });

  describe('setTestStatusCompletedEffect$', () => {
    it('should log analytics and emit AnalyticRecorded', (done) => {
      spyOn(analyticsProviderMock, 'logGAEvent');
      spyOn(effects, 'getCurrentAppRef').and.returnValue('1');
      actions$.next(testStatusActions.SetTestStatusCompleted('1'));
      effects.setTestStatusCompletedEffect$.subscribe((action) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalled();
        expect(action).toEqual(AnalyticRecorded());
        done();
      });
    });
  });

  describe('setTestStatusAutosavedEffect$', () => {
    it('should log analytics and emit AnalyticRecorded', (done) => {
      spyOn(analyticsProviderMock, 'logGAEvent');
      spyOn(effects, 'getCurrentAppRef').and.returnValue('1');
      actions$.next(testStatusActions.SetTestStatusAutosaved('1'));
      effects.setTestStatusAutosavedEffect$.subscribe((action) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalled();
        expect(action).toEqual(AnalyticRecorded());
        done();
      });
    });
  });

  describe('setTestStatusSubmittedEffect$', () => {
    it('should log analytics and emit AnalyticRecorded', (done) => {
      spyOn(analyticsProviderMock, 'logGAEvent');
      spyOn(effects, 'getCurrentAppRef').and.returnValue('1');
      actions$.next(testStatusActions.SetTestStatusSubmitted('1'));
      effects.setTestStatusSubmittedEffect$.subscribe((action) => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalled();
        expect(action).toEqual(AnalyticRecorded());
        done();
      });
    });
  });
});
