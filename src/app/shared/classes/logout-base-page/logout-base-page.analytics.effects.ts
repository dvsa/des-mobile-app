import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import {
  LogoutCancelled,
  LogoutConfirmed,
  LogoutError,
  LogoutModalChanged,
  LogoutSuccess,
} from '@shared/classes/logout-base-page/logout-base-page.actions';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LogoutBasePageAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions
  ) {}

  logoutConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogoutConfirmed),
      switchMap(({ unuploadedTestCount }) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.LOGOUT,
          unuploadedTestCount > 0
            ? GoogleAnalyticsEventsTitles.CONFIRM_UPLOAD_WARNING
            : GoogleAnalyticsEventsTitles.CONFIRM_LOGOUT,
          GoogleAnalyticsEventsValues.SELECTED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  logoutModalChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogoutModalChanged),
      switchMap(({ unuploadedTestCount }) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.LOGOUT,
          GoogleAnalyticsEventsTitles.MODAL_DYNAMICALLY_CHANGED,
          unuploadedTestCount > 0
            ? GoogleAnalyticsEventsValues.NON_PENDING_TO_PENDING
            : GoogleAnalyticsEventsValues.PENDING_TO_NON_PENDING
        );
        return of(AnalyticRecorded());
      })
    )
  );

  logoutCancelled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogoutCancelled),
      switchMap(({ unuploadedTestCount }) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.LOGOUT,
          unuploadedTestCount > 0
            ? GoogleAnalyticsEventsTitles.CONFIRM_UPLOAD_WARNING
            : GoogleAnalyticsEventsTitles.CONFIRM_LOGOUT,
          GoogleAnalyticsEventsValues.CANCELLED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogoutSuccess),
      switchMap((value, index) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.LOGOUT,
          GoogleAnalyticsEventsTitles.STATUS,
          GoogleAnalyticsEventsValues.SUCCESS
        );
        return of(AnalyticRecorded());
      })
    )
  );

  logoutError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogoutError),
      switchMap((value, index) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.LOGOUT,
          GoogleAnalyticsEventsTitles.STATUS,
          GoogleAnalyticsEventsValues.ERROR
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
