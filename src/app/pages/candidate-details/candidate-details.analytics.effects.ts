import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
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
import { mapAnalyticsScreenName } from '@shared/helpers/map-analytics-screen-name';
import { StoreModel } from '@shared/models/store.model';
import {
	CandidateDetailsModalDismiss,
	CandidateDetailsSlotChangeViewed,
	CandidateDetailsViewDidEnter,
} from '@store/candidate-details/candidate-details.actions';
import {
	getCandidateId,
	isCandidateCheckNeeded,
	isCandidateSpecialNeeds,
} from '@store/candidate-details/candidate-details.selector';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class CandidateDetailsAnalyticsEffects {
	constructor(
		public analytics: AnalyticsProvider,
		private actions$: Actions,
		private appConfigProvider: AppConfigProvider,
		private store$: Store<StoreModel>
	) {}

	candidateView$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CandidateDetailsViewDidEnter),
			concatMap((action) =>
				of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests), select(isPracticeMode))))
			),
			filter(([, practiceMode]) =>
				!practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
			),
			switchMap(([{ slot }]: [ReturnType<typeof CandidateDetailsViewDidEnter>, boolean]) => {
				const specNeeds = isCandidateSpecialNeeds(slot);
				const candidateCheck = isCandidateCheckNeeded(slot);
				const candidateId = getCandidateId(slot);

				// TODO - MES-9495 - remove old analytics
				this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, candidateId?.toString());
				this.analytics.addCustomDimension(
					AnalyticsDimensionIndices.CANDIDATE_WITH_SPECIAL_NEEDS,
					specNeeds ? '1' : '0'
				);
				this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_CHECK, candidateCheck ? '1' : '0');
				this.analytics.setCurrentPage(AnalyticsScreenNames.CANDIDATE_DETAILS);

				// GA4 Analytics
				this.analytics.setGACurrentPage(AnalyticsScreenNames.CANDIDATE_DETAILS);
				this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, candidateId?.toString());
				this.analytics.addGACustomDimension(
					GoogleAnalyticsCustomDimension.CANDIDATE_WITH_SPECIAL_NEEDS,
					specNeeds ? '1' : '0'
				);
				this.analytics.addGACustomDimension(
					GoogleAnalyticsCustomDimension.CANDIDATE_WITH_CHECK,
					candidateCheck ? '1' : '0'
				);

				return of(AnalyticRecorded());
			})
		)
	);

	candidateModalDismiss$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CandidateDetailsModalDismiss),
			concatMap((action) =>
				of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests), select(isPracticeMode))))
			),
			filter(([, practiceMode]) =>
				!practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
			),
			switchMap(([{ sourcePage }]: [ReturnType<typeof CandidateDetailsModalDismiss>, boolean]) => {
				// TODO - MES-9495 - remove old analytics
				this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, null);
				this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_SPECIAL_NEEDS, null);
				this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_CHECK, null);
				this.analytics.setCurrentPage(mapAnalyticsScreenName(sourcePage));

				// GA4 Analytics
				this.analytics.setGACurrentPage(mapAnalyticsScreenName(sourcePage));
				this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, null);
				this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_WITH_SPECIAL_NEEDS, null);
				this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_WITH_CHECK, null);

				return of(AnalyticRecorded());
			})
		)
	);

	slotChangeViewed$ = createEffect(() =>
		this.actions$.pipe(
			ofType(CandidateDetailsSlotChangeViewed),
			concatMap((action) =>
				of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests), select(isPracticeMode))))
			),
			filter(([, practiceMode]) =>
				!practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
			),
			switchMap(([action]: [ReturnType<typeof CandidateDetailsSlotChangeViewed>, boolean]) => {
				// TODO - MES-9495 - remove old analytics
				this.analytics.logEvent(
					AnalyticsEventCategories.JOURNAL,
					AnalyticsEvents.SLOT_CHANGE_VIEWED,
					action.slotId.toString()
				);

				// GA4 Analytics
				this.analytics.logGAEvent(
					GoogleAnalyticsEvents.JOURNAL,
					GoogleAnalyticsEventsTitles.SLOT_VIEWED,
					action.slotId.toString()
				);
				return of(AnalyticRecorded());
			})
		)
	);
}
