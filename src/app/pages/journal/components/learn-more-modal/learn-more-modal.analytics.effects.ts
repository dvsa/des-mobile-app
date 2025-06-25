import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  RecallLinkSelected,
  RecallModalClosed,
} from '@pages/journal/components/learn-more-modal/learn-more-modal.actions';
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
export class LearnMoreModalAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>
  ) {}

  recallModalClosed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecallModalClosed),
      concatMap((action: ReturnType<typeof RecallModalClosed>) => {
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.STOP_DRIVE_ORDER,
          GoogleAnalyticsEventsTitles.INFORMATION_MODAL,
          GoogleAnalyticsEventsValues.OK
        );
        return of(AnalyticRecorded());
      })
    )
  );

  recallLinkSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecallLinkSelected),
      concatMap((action: ReturnType<typeof RecallLinkSelected>) => {
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.STOP_DRIVE_ORDER,
          GoogleAnalyticsEventsTitles.INFORMATION_MODAL,
          GoogleAnalyticsEventsValues.CITROEN_RECALL_CHECKER
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
