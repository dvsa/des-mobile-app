import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  AccessibilityStatementSelected,
  DT1GuidanceSelected,
  UsefulLinksReturnToDashboardPressed,
} from '@pages/useful-links/useful-links.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { of } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';

@Injectable()
export class UsefulLinksAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>
  ) {}

  dt1GuidanceSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DT1GuidanceSelected),
      concatMap((action: ReturnType<typeof DT1GuidanceSelected>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.USEFUL_LINKS,
          GoogleAnalyticsEventsTitles.SELECTED_LINK_DT1,
          GoogleAnalyticsEventsValues.LEAVING_DES_MODAL
        );
        return of(AnalyticRecorded());
      })
    )
  );

  accessibilityStatementSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccessibilityStatementSelected),
      concatMap((action: ReturnType<typeof AccessibilityStatementSelected>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.USEFUL_LINKS,
          GoogleAnalyticsEventsTitles.SELECTED_LINK_AS,
          GoogleAnalyticsEventsValues.LEAVING_DES_MODAL
        );
        return of(AnalyticRecorded());
      })
    )
  );

  returnToDashboardPressed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsefulLinksReturnToDashboardPressed),
      switchMap(() => {
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.USEFUL_LINKS,
          GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
          GoogleAnalyticsEventsValues.RETURN_TO_DASHBOARD
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
