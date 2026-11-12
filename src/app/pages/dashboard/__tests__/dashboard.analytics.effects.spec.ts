import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
import { Action, Store, StoreModule } from '@ngrx/store';
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
  let actions$: ReplaySubject<Action>;
  const screenName = AnalyticsScreenNames.DASHBOARD;

  beforeEach(() => {
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
  });

  describe('dashboardViewDidEnter', () => {
    it('should call setCurrentPage', async () => {
      actions$.next(dashboardActions.DashboardViewDidEnter());
      const result = await firstValueFrom(effects.dashboardViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
  });
  describe('practiceTestReportSelected$', () => {
    it('should log an event', async () => {
      actions$.next(dashboardActions.PracticeTestReportCard());
      const result = await firstValueFrom(effects.practiceTestReportSelected$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.PRACTICE_MODE_NAVIGATION,
        GoogleAnalyticsEventsTitles.PRACTICE_TEST_SELECTED,
        TestCategory.B
      );
    });
  });
  describe('sideMenuOpen$', () => {
    it('should log an event', async () => {
      actions$.next(dashboardActions.SideMenuOpened());
      const result = await firstValueFrom(effects.sideMenuOpen$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.MENU,
        GoogleAnalyticsEventsTitles.STATUS,
        GoogleAnalyticsEventsValues.OPEN
      );
    });
  });
  describe('sideMenuClosed$', () => {
    it('should log an event', async () => {
      actions$.next(dashboardActions.SideMenuClosed());
      const result = await firstValueFrom(effects.sideMenuClosed$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.MENU,
        GoogleAnalyticsEventsTitles.STATUS,
        GoogleAnalyticsEventsValues.CLOSE
      );
    });
  });
  describe('sideMenuItemSelected$', () => {
    it('should log an event', async () => {
      actions$.next(dashboardActions.SideMenuItemSelected('opt1'));
      const result = await firstValueFrom(effects.sideMenuItemSelected$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.MENU,
        GoogleAnalyticsEventsTitles.SELECTION,
        'opt1'
      );
    });
  });
  describe('updateAvailablePopup$', () => {
    it('should log an event', async () => {
      actions$.next(UpdateAvailablePopup());
      const result = await firstValueFrom(effects.updateAvailablePopup$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.APP_UPDATE,
        GoogleAnalyticsEventsTitles.STATUS,
        GoogleAnalyticsEventsValues.OPEN
      );
    });
  });
  describe('updateAvailableOptionClicked$', () => {
    it('should log an event', async () => {
      actions$.next(UpdateAvailableOptionClicked(UpdateAvailable.OK));
      const result = await firstValueFrom(effects.updateAvailableOptionClicked$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.APP_UPDATE,
        GoogleAnalyticsEventsTitles.STATUS,
        UpdateAvailable.OK
      );
    });
  });
  describe('updateAvailableBadgeClicked$', () => {
    it('should log an event', async () => {
      actions$.next(UpdateAvailableBadgeClicked());
      const result = await firstValueFrom(effects.updateAvailableBadgeClicked$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.APP_UPDATE,
        GoogleAnalyticsEventsTitles.STATUS,
        GoogleAnalyticsEventsValues.CLICKED
      );
    });
  });
  describe('detectDeviceTheme$', () => {
    it.each([
      [false, GoogleAnalyticsEventsValues.LIGHT_MODE],
      [true, GoogleAnalyticsEventsValues.DARK_MODE],
    ])('should log the device theme when dark mode is %s', async (matches, expectedTheme) => {
      vi.stubGlobal(
        'matchMedia',
        vi.fn(
          (media: string): MediaQueryList =>
            Object.assign(new EventTarget(), {
              media,
              matches,
              onchange: null,
              addListener: vi.fn(),
              removeListener: vi.fn(),
            })
        )
      );
      try {
        actions$.next(DetectDeviceTheme());
        const result = await firstValueFrom(effects.detectDeviceTheme$);
        expect(result.type).toBe(AnalyticRecorded.type);
        expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.METADATA,
          GoogleAnalyticsEventsTitles.DEVICE_THEME,
          expectedTheme
        );
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });
});
