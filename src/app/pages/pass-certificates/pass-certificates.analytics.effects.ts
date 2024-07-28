import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PassCertificatedViewDidEnter } from '@pages/pass-certificates/pass-certificates.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class PassCertificatesAnalyticsEffects {
	constructor(
		private analytics: AnalyticsProvider,
		private actions$: Actions
	) {}

	passCertificatesView$ = createEffect(() =>
		this.actions$.pipe(
			ofType(PassCertificatedViewDidEnter),
			switchMap(() => {
				// TODO - MES-9495 - remove old analytics
				this.analytics.setCurrentPage(AnalyticsScreenNames.PASS_CERTIFICATES);

				// GA4 Analytics
				this.analytics.setGACurrentPage(AnalyticsScreenNames.PASS_CERTIFICATES);
				return of(AnalyticRecorded());
			})
		)
	);
}
