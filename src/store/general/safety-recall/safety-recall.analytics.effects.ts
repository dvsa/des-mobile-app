import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import {
  CheckVINPressed,
  RecallLearnMoreModalOpened,
  RecallLinkSelected,
  RecallModalClosed,
} from '@store/general/safety-recall/safety-recall.actions';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable()
export class SafetyRecallAnalyticsEffects {
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

  recallLearnMoreModalOpened$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecallLearnMoreModalOpened),
      concatMap((action: ReturnType<typeof RecallLearnMoreModalOpened>) => {
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.STOP_DRIVE_ORDER,
          GoogleAnalyticsEventsTitles.BANNER,
          GoogleAnalyticsEventsValues.LEARN_MORE
        );
        return of(AnalyticRecorded());
      })
    )
  );

  checkVINPressed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckVINPressed),
      concatMap((action: ReturnType<typeof CheckVINPressed>) => {
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.STOP_DRIVE_ORDER,
          GoogleAnalyticsEventsTitles.SELECTION,
          GoogleAnalyticsEventsValues.RECALL_CHECKER
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
          GoogleAnalyticsEventsValues.RECALL_CHECKER
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
