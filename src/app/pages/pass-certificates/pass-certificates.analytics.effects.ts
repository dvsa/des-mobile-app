import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PassCertificateDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { switchMap } from 'rxjs/operators';
import { AnalyticsDimensionIndices, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

@Injectable()
export class PassCertificatesAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  journalView$ = createEffect(() => this.actions$.pipe(
    ofType(PassCertificateDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.PASS_CERTIFICATES);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, '');
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '');
      return of(AnalyticRecorded());
    }),
  ));
}
