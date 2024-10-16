import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, StoreModule } from '@ngrx/store';
import { UpdateAvailable } from '@pages/dashboard/components/update-available-modal/update-available-modal';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import {
  UpdateAvailableBadgeClicked,
  UpdateAvailableOptionClicked,
  UpdateAvailablePopup,
} from '@store/app-info/app-info.actions';
import { journalReducer } from '@store/journal/journal.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import * as dashboardActions from '../dashboard.actions';
import { DetectDeviceTheme } from '../dashboard.actions';
import { DashboardAnalyticsEffects } from '../dashboard.analytics.effects';

describe('DashboardAnalyticsEffects', () => {
  let effects: DashboardAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  const screenName = AnalyticsScreenNames.DASHBOARD;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          journal: journalReducer,
          tests: testsReducer,
        }),
      ],
      providers: [
        DashboardAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DashboardAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
  }));

  describe('dashboardViewDidEnter', () => {
    it('should call setCurrentPage', (done) => {
      actions$.next(dashboardActions.DashboardViewDidEnter());
      effects.dashboardViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // GA4 analytics
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });
  describe('practiceTestReportSelected$', () => {
    it('should log an event', (done) => {
      actions$.next(dashboardActions.PracticeTestReportCard());
      effects.practiceTestReportSelected$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.PRACTICE_MODE_NAVIGATION,
          GoogleAnalyticsEventsTitles.PRACTICE_TEST_SELECTED,
          TestCategory.B
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
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.MENU,
          GoogleAnalyticsEventsTitles.STATUS,
          GoogleAnalyticsEventsValues.OPEN
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
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.MENU,
          GoogleAnalyticsEventsTitles.STATUS,
          GoogleAnalyticsEventsValues.CLOSE
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
        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.MENU,
          GoogleAnalyticsEventsTitles.SELECTION,
          'opt1'
        );
        done();
      });
    });
  });
  describe('updateAvailablePopup$', () => {
    it('should log an event', (done) => {
      actions$.next(UpdateAvailablePopup());
      effects.updateAvailablePopup$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.APP_UPDATE,
          GoogleAnalyticsEventsTitles.STATUS,
          GoogleAnalyticsEventsValues.OPEN
        );
        done();
      });
    });
  });
  describe('updateAvailableOptionClicked$', () => {
    it('should log an event', (done) => {
      actions$.next(UpdateAvailableOptionClicked(UpdateAvailable.OK));
      effects.updateAvailableOptionClicked$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.APP_UPDATE,
          GoogleAnalyticsEventsTitles.STATUS,
          UpdateAvailable.OK
        );
        done();
      });
    });
  });
  describe('updateAvailableBadgeClicked$', () => {
    it('should log an event', (done) => {
      actions$.next(UpdateAvailableBadgeClicked());
      effects.updateAvailableBadgeClicked$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.APP_UPDATE,
          GoogleAnalyticsEventsTitles.STATUS,
          GoogleAnalyticsEventsValues.CLICKED
        );
        done();
      });
    });
  });

  describe('detectDeviceTheme$', () => {
    it('should log an event', (done) => {
      actions$.next(DetectDeviceTheme());
      effects.detectDeviceTheme$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);

        // GA4 Analytics
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.METADATA,
          GoogleAnalyticsEventsTitles.DEVICE_THEME,
          GoogleAnalyticsEventsValues.LIGHT_MODE
        );
        done();
      });
    });
  });
});
