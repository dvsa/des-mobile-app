import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { GoogleAnalyticsEvents } from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { CurrentTest, TestsModel } from '@store/tests/tests.model';
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
          tests: () =>
            ({
              currentTest: {} as CurrentTest,
              testStatus: {},
              startedTests: {
                '12345': {
                  journalData: {
                    applicationReference: {
                      applicationId: 1,
                      bookingSequence: 2,
                      checkDigit: 3,
                    },
                  } as JournalData,
                } as TestResultSchemasUnion,
              },
            }) as TestsModel,
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

  describe('setTestStatusBookedEffect$', () => {
    it('should log GA event when SetTestStatusBooked action is dispatched', async () => {
      await new Promise<void>((done, reject) => {
        const slotId = '12345';
        actions$.next(testStatusActions.SetTestStatusBooked(slotId));

        effects.setTestStatusBookedEffect$.subscribe(() => {
          try {
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
              TestStatus.Booked,
              '1023'
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });

  describe('setTestStatusStartedEffect$', () => {
    it('should log GA event when SetTestStatusStarted action is dispatched', async () => {
      await new Promise<void>((done, reject) => {
        const slotId = '12345';
        actions$.next(testStatusActions.SetTestStatusStarted(slotId));

        effects.setTestStatusStartedEffect$.subscribe(() => {
          try {
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
              TestStatus.Started,
              '1023'
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });

  describe('setTestStatusDecidedEffect$', () => {
    it('should log GA event when SetTestStatusDecided action is dispatched', async () => {
      await new Promise<void>((done, reject) => {
        const slotId = '12345';
        actions$.next(testStatusActions.SetTestStatusDecided(slotId));

        effects.setTestStatusDecidedEffect$.subscribe(() => {
          try {
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
              TestStatus.Decided,
              '1023'
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });

  describe('setTestStatusWriteUpEffect$', () => {
    it('should log GA event when SetTestStatusWriteUp action is dispatched', async () => {
      await new Promise<void>((done, reject) => {
        const slotId = '12345';
        actions$.next(testStatusActions.SetTestStatusWriteUp(slotId));

        effects.setTestStatusWriteUpEffect$.subscribe(() => {
          try {
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
              TestStatus.WriteUp,
              '1023'
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });

  describe('setTestStatusAutosavedEffect$', () => {
    it('should log GA event when SetTestStatusAutosaved action is dispatched', async () => {
      await new Promise<void>((done, reject) => {
        const slotId = '12345';
        actions$.next(testStatusActions.SetTestStatusAutosaved(slotId));

        effects.setTestStatusAutosavedEffect$.subscribe(() => {
          try {
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
              TestStatus.Autosaved,
              '1023'
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });

  describe('setTestStatusCompletedEffect$', () => {
    it('should log GA event when SetTestStatusCompleted action is dispatched', async () => {
      await new Promise<void>((done, reject) => {
        const slotId = '12345';
        actions$.next(testStatusActions.SetTestStatusCompleted(slotId));

        effects.setTestStatusCompletedEffect$.subscribe(() => {
          try {
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
              TestStatus.Completed,
              '1023'
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });

  describe('setTestStatusSubmittedEffect$', () => {
    it('should log GA event when SetTestStatusSubmitted action is dispatched', async () => {
      await new Promise<void>((done, reject) => {
        const slotId = '12345';
        actions$.next(testStatusActions.SetTestStatusSubmitted(slotId));

        effects.setTestStatusSubmittedEffect$.subscribe(() => {
          try {
            expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
              GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
              TestStatus.Submitted,
              '1023'
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });
});
