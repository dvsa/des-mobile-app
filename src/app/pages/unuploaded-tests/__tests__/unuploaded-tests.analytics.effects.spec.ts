import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ContinueUnuploadedTest, UnuploadedTestsViewDidEnter } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { UnuploadedTestsAnalyticsEffects } from '@pages/unuploaded-tests/unuploaded-tests.analytics.effects';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { ReplaySubject } from 'rxjs';

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
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('UnuploadedTestsViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(UnuploadedTestsViewDidEnter());
      effects.unUploadedTestViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);

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

        // TODO - MES-9495 - remove old analytics
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.UN_UPLOADED_TESTS,
          AnalyticsEvents.TEST_SELECTED,
          TestStatus.WriteUp
        );

        //GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.INCOMPLETE_TESTS,
          GoogleAnalyticsEventsTitles.TEST_STATUS,
          TestStatus.WriteUp
        );
        done();
      });
    });
  });
});
