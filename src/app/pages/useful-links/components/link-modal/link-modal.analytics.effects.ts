import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ModalCancel, ModalContinue } from '@pages/useful-links/components/link-modal/link-modal.actions';
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
export class LinkModalAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>
  ) {}

  modalContinue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModalContinue),
      concatMap((action: ReturnType<typeof ModalContinue>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.USEFUL_LINKS,
          GoogleAnalyticsEventsTitles.LEAVING_DES_MODAL,
          GoogleAnalyticsEventsValues.CONTINUE
        );
        return of(AnalyticRecorded());
      })
    )
  );

  modalCancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModalCancel),
      concatMap((action: ReturnType<typeof ModalCancel>) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.USEFUL_LINKS,
          GoogleAnalyticsEventsTitles.LEAVING_DES_MODAL,
          GoogleAnalyticsEventsValues.CANCELLED
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
