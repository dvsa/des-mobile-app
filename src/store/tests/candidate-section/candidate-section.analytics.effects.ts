import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';

@Injectable()
export class CandidateSectionAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }
}
