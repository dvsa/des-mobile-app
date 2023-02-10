import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

import { DashboardAnalyticsEffects } from '../dashboard.analytics.effects';
import * as dashboardActions from '../dashboard.actions';

describe('DashboardAnalyticsEffects', () => {
  let effects: DashboardAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.DASHBOARD;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DashboardAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

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
  describe('practiceTestReportSelected$', () => {
    it('should log an event', (done) => {
      actions$.next(dashboardActions.PracticeTestReportCard());
      effects.practiceTestReportSelected$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.DASHBOARD,
          AnalyticsEvents.PRACTICE_TEST_SELECTED,
        );
        done();
      });
    });
  });
  describe('sideMenuOpen$', () => {
    it('should log an event', (done) => {
      actions$.next(dashboardActions.SideMenuOpened());
      effects.sideMenuOpen$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.DASHBOARD,
          AnalyticsEvents.SIDE_MENU,
          'Menu Opened',
        );
        done();
      });
    });
  });
  describe('sideMenuClosed$', () => {
    it('should log an event', (done) => {
      actions$.next(dashboardActions.SideMenuClosed());
      effects.sideMenuClosed$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.DASHBOARD,
          AnalyticsEvents.SIDE_MENU,
          'Menu Closed',
        );
        done();
      });
    });
  });
  describe('sideMenuItemSelected$', () => {
    it('should log an event', (done) => {
      actions$.next(dashboardActions.SideMenuItemSelected('opt1'));
      effects.sideMenuItemSelected$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.DASHBOARD,
          AnalyticsEvents.SIDE_MENU,
          'opt1 Selected',
        );
        done();
      });
    });
  });
});
