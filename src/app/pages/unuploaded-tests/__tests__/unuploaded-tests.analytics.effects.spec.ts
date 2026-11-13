import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { ContinueUnuploadedTest, UnuploadedTestsViewDidEnter } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { UnuploadedTestsAnalyticsEffects } from '@pages/unuploaded-tests/unuploaded-tests.analytics.effects';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

describe('UnuploadedTestsAnalyticsEffects', () => {
  let effects: UnuploadedTestsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  const screenName = AnalyticsScreenNames.UN_UPLOADED;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnuploadedTestsAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(UnuploadedTestsAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  });

  describe('UnuploadedTestsViewDidEnter', () => {
    it('should call setCurrentPage', async () => {
      actions$.next(UnuploadedTestsViewDidEnter());
      const result = await firstValueFrom(effects.unUploadedTestViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
  });

  describe('continueUnUploadedTest$', () => {
    it('should log an event', async () => {
      actions$.next(ContinueUnuploadedTest(TestStatus.WriteUp));
      const result = await firstValueFrom(effects.continueUnUploadedTest$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.INCOMPLETE_TESTS,
        GoogleAnalyticsEventsTitles.TEST_STATUS,
        TestStatus.WriteUp
      );
    });
  });
});
