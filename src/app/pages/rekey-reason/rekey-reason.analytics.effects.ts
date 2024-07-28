import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
	AnalyticsDimensionIndices,
	AnalyticsEventCategories,
	AnalyticsEvents,
	AnalyticsScreenNames,
	GoogleAnalyticsCustomDimension,
	GoogleAnalyticsEvents,
	GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { RekeyReasonViewDidEnter, RekeyUploadTest } from './rekey-reason.actions';

@Injectable()
export class RekeyReasonAnalyticsEffects {
	constructor(
		private analytics: AnalyticsProvider,
		private actions$: Actions,
		private store$: Store<StoreModel>,
		private appConfigProvider: AppConfigProvider
	) {}

	rekeyReasonViewDidEnter$ = createEffect(() =>
		this.actions$.pipe(
			ofType(RekeyReasonViewDidEnter),
			concatMap((action) =>
				of(action).pipe(
					withLatestFrom(
						this.store$.pipe(select(getTests)),
						this.store$.pipe(
							select(getTests),
							select(getCurrentTest),
							select(getJournalData),
							select(getCandidate),
							select(getCandidateId)
						),
						this.store$.pipe(
							select(getTests),
							select(getCurrentTest),
							select(getJournalData),
							select(getApplicationReference),
							select(getApplicationNumber)
						),
						this.store$.pipe(select(getTests), select(isPracticeMode))
					)
				)
			),
			filter(([, , , , practiceMode]) =>
				!practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
			),
			switchMap(
				([, tests, candidateId, applicationReference]: [
					ReturnType<typeof RekeyReasonViewDidEnter>,
					TestsModel,
					number,
					string,
					boolean,
				]) => {
					// TODO - MES-9495 - remove old analytics
					const screenName = formatAnalyticsText(AnalyticsScreenNames.REKEY_REASON, tests);
					this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
					this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
					this.analytics.setCurrentPage(screenName);

					// GA4 Analytics
					this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.REKEY_REASON, tests));
					this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, `${candidateId}`);
					this.analytics.addGACustomDimension(
						GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
						applicationReference
					);

					return of(AnalyticRecorded());
				}
			)
		)
	);

	rekeyReasonUploadTest$ = createEffect(() =>
		this.actions$.pipe(
			ofType(RekeyUploadTest),
			concatMap((action) =>
				of(action).pipe(
					withLatestFrom(
						this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestOutcome)),
						this.store$.pipe(select(getTests)),
						this.store$.pipe(select(getTests), select(isPracticeMode))
					)
				)
			),
			filter(([, , , practiceMode]) =>
				!practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
			),
			switchMap(([, testOutcome, tests]: [ReturnType<typeof RekeyUploadTest>, string, TestsModel, boolean]) => {
				this.analytics.logEvent(
					formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
					formatAnalyticsText(AnalyticsEvents.CONFIRM_UPLOAD, tests),
					formatAnalyticsText(`Upload confirmed - ${testOutcome}`, tests)
				);

				// GA4 Analytics
				this.analytics.logGAEvent(
					analyticsEventTypePrefix(GoogleAnalyticsEvents.SUBMIT_TEST, tests),
					GoogleAnalyticsEventsTitles.RESULT,
					testOutcome
				);
				return of(AnalyticRecorded());
			})
		)
	);
}
