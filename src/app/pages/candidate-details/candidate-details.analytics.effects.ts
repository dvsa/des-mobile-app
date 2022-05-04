import { Injectable } from '@angular/core';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsDimensionIndices,
  AnalyticsScreenNames,
  AnalyticsEventCategories,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
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
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { mapAnalyticsScreenName } from '@shared/helpers/map-analytics-screen-name';

@Injectable()
export class CandidateDetailsAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  candidateView$ = createEffect(() => this.actions$.pipe(
    ofType(CandidateDetailsViewDidEnter),
    switchMap((action: ReturnType<typeof CandidateDetailsViewDidEnter>) => {
      const specNeeds = isCandidateSpecialNeeds(action.slot);
      const candidateCheck = isCandidateCheckNeeded(action.slot);
      const candidateId = getCandidateId(action.slot);

      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, candidateId);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_SPECIAL_NEEDS, specNeeds ? '1' : '0');
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_CHECK, candidateCheck ? '1' : '0');
      this.analytics.setCurrentPage(AnalyticsScreenNames.CANDIDATE_DETAILS);

      return of(AnalyticRecorded());
    }),
  ));

  candidateModalDismiss$ = createEffect(() => this.actions$.pipe(
    ofType(CandidateDetailsModalDismiss),
    switchMap((action: ReturnType<typeof CandidateDetailsModalDismiss>) => {

      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, null);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_SPECIAL_NEEDS, null);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_CHECK, null);
      this.analytics.setCurrentPage(mapAnalyticsScreenName(action.sourcePage));

      return of(AnalyticRecorded());
    }),
  ));

  slotChangeViewed$ = createEffect(() => this.actions$.pipe(
    ofType(CandidateDetailsSlotChangeViewed),
    switchMap((action: ReturnType<typeof CandidateDetailsSlotChangeViewed>) => {
      this.analytics.logEvent(
        AnalyticsEventCategories.JOURNAL,
        AnalyticsEvents.SLOT_CHANGE_VIEWED,
        action.slotId.toString(),
      );
      return of(AnalyticRecorded());
    }),
  ));
}
