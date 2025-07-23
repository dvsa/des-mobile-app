import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

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

  describe('fireTestStatusAnalytic', () => {
    it('should log GA event with correct parameters', () => {
      const tests: TestsModel = {
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
      } as TestsModel;

      const testStatus = TestStatus.Booked;
      const slotId = '12345';

      spyOn(analyticsProviderMock, 'logGAEvent');

      effects.fireTestStatusAnalytic(tests, testStatus, slotId);

      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
        TestStatus.Booked,
        '1023'
      );
    });
  });

  describe('setTestStatusBookedEffect$', () => {
    it('should log GA event when SetTestStatusBooked action is dispatched', (done) => {
      const slotId = '12345';
      actions$.next(testStatusActions.SetTestStatusBooked(slotId));

      effects.setTestStatusBookedEffect$.subscribe(() => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          TestStatus.Booked,
          '1023'
        );
        done();
      });
    });
  });

  describe('setTestStatusStartedEffect$', () => {
    it('should log GA event when SetTestStatusStarted action is dispatched', (done) => {
      const slotId = '12345';
      actions$.next(testStatusActions.SetTestStatusStarted(slotId));

      effects.setTestStatusStartedEffect$.subscribe(() => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          TestStatus.Started,
          '1023'
        );
        done();
      });
    });
  });

  describe('setTestStatusDecidedEffect$', () => {
    it('should log GA event when SetTestStatusDecided action is dispatched', (done) => {
      const slotId = '12345';
      actions$.next(testStatusActions.SetTestStatusDecided(slotId));

      effects.setTestStatusDecidedEffect$.subscribe(() => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          TestStatus.Decided,
          '1023'
        );
        done();
      });
    });
  });

  describe('setTestStatusWriteUpEffect$', () => {
    it('should log GA event when SetTestStatusWriteUp action is dispatched', (done) => {
      const slotId = '12345';
      actions$.next(testStatusActions.SetTestStatusWriteUp(slotId));

      effects.setTestStatusWriteUpEffect$.subscribe(() => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          TestStatus.WriteUp,
          '1023'
        );
        done();
      });
    });
  });

  describe('setTestStatusAutosavedEffect$', () => {
    it('should log GA event when SetTestStatusAutosaved action is dispatched', (done) => {
      const slotId = '12345';
      actions$.next(testStatusActions.SetTestStatusAutosaved(slotId));

      effects.setTestStatusAutosavedEffect$.subscribe(() => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          TestStatus.Autosaved,
          '1023'
        );
        done();
      });
    });
  });

  describe('setTestStatusCompletedEffect$', () => {
    it('should log GA event when SetTestStatusCompleted action is dispatched', (done) => {
      const slotId = '12345';
      actions$.next(testStatusActions.SetTestStatusCompleted(slotId));

      effects.setTestStatusCompletedEffect$.subscribe(() => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          TestStatus.Completed,
          '1023'
        );
        done();
      });
    });
  });

  describe('setTestStatusSubmittedEffect$', () => {
    it('should log GA event when SetTestStatusSubmitted action is dispatched', (done) => {
      const slotId = '12345';
      actions$.next(testStatusActions.SetTestStatusSubmitted(slotId));

      effects.setTestStatusSubmittedEffect$.subscribe(() => {
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TEST_STATUS_CHANGED,
          TestStatus.Submitted,
          '1023'
        );
        done();
      });
    });
  });
});
