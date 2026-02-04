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
          case AuthenticationError.NO_INTERNET:
            errorType = 'NO_INTERNET';
            break;
          case AuthenticationError.USER_CANCELLED:
            errorType = 'USER_CANCELLED';
            break;
          case AuthenticationError.NO_RESPONSE:
            errorType = 'NO_RESPONSE';
            break;
          case AuthenticationError.USER_NOT_AUTHORISED:
            errorType = 'USER_NOT_AUTHORISED';
            break;
        }
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.SERVICE_ERROR,
          GoogleAnalyticsEventsTitles.SOMETHING_WENT_WRONG,
          errorType
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
