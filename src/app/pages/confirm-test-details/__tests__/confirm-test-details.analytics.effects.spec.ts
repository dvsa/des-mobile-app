import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { configureTestSuite } from 'ng-bullet';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

import { ConfirmTestDetailsAnalyticsEffects } from '@pages/confirm-test-details/confirm-test-details.analytics.effects';
import * as confirmTestDetailsActions from '../confirm-test-details.actions';

describe('ConfirmTestDetailsAnalyticsEffects', () => {
  let effects: ConfirmTestDetailsAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.CONFIRM_TEST_DETAILS;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfirmTestDetailsAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });
  });

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(ConfirmTestDetailsAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  });

  describe('confirmTestDetailsView$', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(confirmTestDetailsActions.ConfirmTestDetailsViewDidEnter());
      effects.confirmTestDetailsView$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });
});
