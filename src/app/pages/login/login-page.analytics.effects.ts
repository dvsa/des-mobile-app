import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ReportError } from '@pages/login/login-page.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles } from '@providers/analytics/analytics.model';
import { AuthenticationError } from '@providers/authentication/authentication.constants';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LoginPageAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions
  ) {}

  logoutError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportError),
      switchMap(({ reportedError }) => {
        let errorType = 'UNKNOWN_ERROR';
        switch (reportedError) {
          case AuthenticationError.CREATE_CONTEXT:
            errorType = 'context_fail';
            break;
          case AuthenticationError.OBTAIN_ACCESS:
            errorType = 'token_fail';
            break;
          case AuthenticationError.CREATE_BRIDGE_CONTROLLER:
            errorType = 'capacitor_fail';
            break;
          case AuthenticationError.NOTHING_TO_SIGN_OUT_FROM:
            errorType = 'signout_fail';
            break;
          case AuthenticationError.UNABLE_TO_LOGOUT:
            errorType = 'logout_fail';
            break;
          case AuthenticationError.INVALID_CLIENT_ID:
            errorType = 'clientID_invalid';
            break;
          case AuthenticationError.WRONG_AUTHORITY_TYPE:
            errorType = 'authority_type';
            break;
          case AuthenticationError.USER_NOT_AUTHORISED:
            errorType = 'user_not_authorised';
            break;
          case AuthenticationError.OFFLINE:
            errorType = 'login_error_connectivity_issue';
            break;
        }
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.SERVICE_ERROR,
          GoogleAnalyticsEventsTitles.AUTH_ERROR,
          errorType
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
