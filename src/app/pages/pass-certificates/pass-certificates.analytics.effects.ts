import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { switchMap } from 'rxjs/operators';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';

@Injectable()
export class PassCertificatesAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  passCertificatesView$ = createEffect(() => this.actions$.pipe(
    ofType(PassCertificatedViewDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.PASS_CERTIFICATES);
      return of(AnalyticRecorded());
    }),
  ));
}
