import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { StorageCleared } from '@providers/authentication/authentification.actions';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthenticationAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions
  ) {}

  storageCleared$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StorageCleared),
      switchMap((value, index) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.CLEAR_APPLICATION_CACHE,
          GoogleAnalyticsEventsTitles.STATUS,
          GoogleAnalyticsEventsValues.COMPLETED
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
