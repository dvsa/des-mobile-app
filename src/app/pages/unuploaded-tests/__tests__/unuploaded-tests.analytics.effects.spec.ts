import { ReplaySubject } from 'rxjs';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { UnuploadedTestsAnalyticsEffects } from '@pages/unuploaded-tests/unuploaded-tests.analytics.effects';
import { ContinueUnuploadedTest, UnuploadedTestsViewDidEnter } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';

describe('UnuploadedTestsAnalyticsEffects', () => {
  let effects: UnuploadedTestsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.UN_UPLOADED;

  beforeEach(waitForAsync(() => {
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
  }));

  describe('UnuploadedTestsViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(UnuploadedTestsViewDidEnter());
      effects.unUploadedTestViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        //GA4 Analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

  describe('continueUnUploadedTest$', () => {
    it('should log an event', (done) => {
      actions$.next(ContinueUnuploadedTest(TestStatus.WriteUp));
      effects.continueUnUploadedTest$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.INCOMPLETE_TESTS,
          GoogleAnalyticsEventsTitles.TEST_STATUS,
          TestStatus.WriteUp,
        );
        done();
      });
    });
  });
});
