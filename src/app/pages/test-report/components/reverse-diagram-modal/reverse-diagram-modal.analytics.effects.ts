import { Injectable } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import * as reverseDiagramActions from './reverse-diagram-modal.actions';

@Injectable()
export class ReverseDiagramModalAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>
  ) {}

  reverseDiagramViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reverseDiagramActions.ReverseDiagramViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getApplicationReference),
              select(getApplicationNumber)
            ),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getCandidate),
              select(getCandidateId)
            ),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory))
          )
        )
      ),
      switchMap(
        ([, tests, applicationReference, candidateId, category]: [
          ReturnType<typeof reverseDiagramActions.ReverseDiagramViewDidEnter>,
          TestsModel,
          string,
          number,
          CategoryCode,
        ]) => {
          // GA4 Analytics
          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.TEST_CATEGORY, category);
          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, `${candidateId}`);
          this.analytics.addGACustomDimension(
            GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
            applicationReference
          );
          this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.REVERSE_DIAGRAM, tests));
          return of(AnalyticRecorded());
        }
      )
    )
  );

  reverseDiagramOpened$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reverseDiagramActions.ReverseDiagramOpened),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      concatMap(([,]: [ReturnType<typeof reverseDiagramActions.ReverseDiagramOpened>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.OPENED,
          GoogleAnalyticsEventsValues.REVERSE_DIAGRAM
        );
        return of(AnalyticRecorded());
      })
    )
  );

  reverseDiagramClosed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reverseDiagramActions.ReverseDiagramClosed),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      concatMap(([,]: [ReturnType<typeof reverseDiagramActions.ReverseDiagramClosed>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.NAVIGATION,
          GoogleAnalyticsEventsTitles.CLOSED,
          GoogleAnalyticsEventsValues.REVERSE_DIAGRAM
        );
        return of(AnalyticRecorded());
      })
    )
  );

  reverseDiagramLengthChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reverseDiagramActions.ReverseDiagramLengthChanged),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      concatMap(([action]: [ReturnType<typeof reverseDiagramActions.ReverseDiagramLengthChanged>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.VEHICLE_LENGTH,
          GoogleAnalyticsEventsTitles.CHANGED_FROM,
          action.previousLength.toString(),
          GoogleAnalyticsEventsTitles.CHANGED_TO,
          action.newLength.toString()
        );
        return of(AnalyticRecorded());
      })
    )
  );

  reverseDiagramWidthChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reverseDiagramActions.ReverseDiagramWidthChanged),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      concatMap(([action]: [ReturnType<typeof reverseDiagramActions.ReverseDiagramWidthChanged>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.VEHICLE_WIDTH,
          GoogleAnalyticsEventsTitles.CHANGED_FROM,
          action.previousWidth.toString(),
          GoogleAnalyticsEventsTitles.CHANGED_TO,
          action.newWidth.toString()
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
