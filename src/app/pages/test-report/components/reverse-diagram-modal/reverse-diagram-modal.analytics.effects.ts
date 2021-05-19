import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { TestsModel } from '@store/tests/tests.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import * as reverseDiagramActions from './reverse-diagram-modal.actions';

@Injectable()
export class ReverseDiagramModalAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  reverseDiagramViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(reverseDiagramActions.ReverseDiagramViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getCandidate),
          select(getCandidateId),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getTestCategory),
        ),
      ),
    )),
    switchMap((
      [, tests, applicationReference, candidateId, category]:
      [ReturnType <typeof reverseDiagramActions.ReverseDiagramViewDidEnter>, TestsModel, string, number, CategoryCode],
    ) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.setCurrentPage(
        formatAnalyticsText(AnalyticsScreenNames.REVERSE_DIAGRAM, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  reverseDiagramOpened$ = createEffect(() => this.actions$.pipe(
    ofType(reverseDiagramActions.ReverseDiagramOpened),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType <typeof reverseDiagramActions.ReverseDiagramOpened>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REVERSE_DIAGRAM_OPENED, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  reverseDiagramClosed$ = createEffect(() => this.actions$.pipe(
    ofType(reverseDiagramActions.ReverseDiagramClosed),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType <typeof reverseDiagramActions.ReverseDiagramClosed>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REVERSE_DIAGRAM_CLOSED, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  reverseDiagramLengthChanged$ = createEffect(() => this.actions$.pipe(
    ofType(reverseDiagramActions.ReverseDiagramLengthChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([action, tests]:
    [ReturnType<typeof reverseDiagramActions.ReverseDiagramLengthChanged>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REVERSE_DIAGRAM_LENGTH_CHANGED, tests),
        `from ${action.previousLength} to ${action.newLength}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  reverseDiagramWidthChanged$ = createEffect(() => this.actions$.pipe(
    ofType(reverseDiagramActions.ReverseDiagramWidthChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([action, tests]: [ReturnType <typeof reverseDiagramActions.ReverseDiagramWidthChanged>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REVERSE_DIAGRAM_WIDTH_CHANGED, tests),
        `from ${action.previousWidth} to ${action.newWidth}`,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
