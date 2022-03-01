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
  CandidateDetailsSlotChangeViewed,
  CandidateDetailsViewDidEnter,
} from '@store/candidate-details/candidate-details.actions';
import {
  getCandidateId,
  isCandidateCheckNeeded,
  isCandidateSpecialNeeds,
} from '@store/candidate-details/candidate-details.selector';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatApplicationReference } from '@shared/helpers/formatters';

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
      const applicationReference = formatApplicationReference(action.slot?.booking?.application);

      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, candidateId);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_SPECIAL_NEEDS, specNeeds ? '1' : '0');
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_WITH_CHECK, candidateCheck ? '1' : '0');
      this.analytics.setCurrentPage(AnalyticsScreenNames.CANDIDATE_DETAILS);

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
