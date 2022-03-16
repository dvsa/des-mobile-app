import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
  AnalyticsDimensionIndices,
  AnalyticsErrorTypes,
  AnalyticsEvents,
  AnalyticsEventCategories,
} from '@providers/analytics/analytics.model';
import {
  WaitingRoomViewDidEnter,
  WaitingRoomValidationError,
} from '@pages/waiting-room/waiting-room.actions';
import {
  CbtNumberChanged,
} from '@store/tests/pre-test-declarations/cat-a/pre-test-declarations.cat-a.actions';
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
import {
  VRNModalCancelled,
  VRNModalOpened,
  VRNModalSaved,
} from '@store/tests/candidate-section/candidate-section.actions';

@Injectable()
export class WaitingRoomAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  waitingRoomViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomViewDidEnter),
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
      [ReturnType<typeof WaitingRoomViewDidEnter>, TestsModel, string, number, CategoryCode],
    ) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.setCurrentPage(formatAnalyticsText(AnalyticsScreenNames.WAITING_ROOM, tests));
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomValidationError$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomValidationError),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getTestCategory),
        ),
      ),
    )),
    switchMap(([action, tests, category]:
    [ReturnType<typeof WaitingRoomValidationError>, TestsModel, CategoryCode]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.WAITING_ROOM, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logError(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenName})`,
        action.errorMessage);
      return of(AnalyticRecorded());
    }),
  ));

  cbtNumberChanged$ = createEffect(() => this.actions$.pipe(
    ofType(CbtNumberChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof CbtNumberChanged>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM, tests),
        formatAnalyticsText(AnalyticsEvents.CBT_CHANGED, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  vrnModalOpened$ = createEffect(() => this.actions$.pipe(
    ofType(VRNModalOpened),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof VRNModalOpened>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM, tests),
        AnalyticsEvents.VRN_CAPTURE,
        AnalyticsEvents.VRN_CAPTURE_SELECTED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  vrnModalCancelled$ = createEffect(() => this.actions$.pipe(
    ofType(VRNModalCancelled),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof VRNModalCancelled>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM, tests),
        AnalyticsEvents.VRN_CAPTURE,
        AnalyticsEvents.VRN_CAPTURE_CANCELLED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  vrnModalSaved$ = createEffect(() => this.actions$.pipe(
    ofType(VRNModalSaved),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof VRNModalSaved>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM, tests),
        AnalyticsEvents.VRN_CAPTURE,
        AnalyticsEvents.VRN_CAPTURE_SAVED,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
