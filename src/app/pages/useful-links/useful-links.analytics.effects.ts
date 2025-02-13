import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AccessibilityStatementSelected, DTIGuidanceSelected } from '@pages/useful-links/useful-links.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable()
export class UsefulLinksAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>
  ) {}

  dtiGuidanceSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DTIGuidanceSelected),
      concatMap((action: ReturnType<typeof DTIGuidanceSelected>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.USEFUL_LINKS,
          GoogleAnalyticsEventsTitles.SELECTED_LINK_DTI,
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
}
