import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { configureTestSuite } from 'ng-bullet';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

import { DashboardAnalyticsEffects } from '../dashboard.analytics.effects';
import * as dashboardActions from '../dashboard.actions';

describe('DashboardAnalyticsEffects', () => {
  let effects: DashboardAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.DASHBOARD;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });
  });

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DashboardAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  });

  describe('dashboardViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(dashboardActions.DashboardViewDidEnter());
      effects.dashboardViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });
});
