import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
  AnalyticsDimensionIndices,
  AnalyticsErrorTypes,
  AnalyticsEvents,
  AnalyticsEventCategories,
} from '@providers/analytics/analytics.model';
import {
  WaitingRoomToCarBikeCategoryChanged,
  WaitingRoomToCarBikeCategorySelected,
  WaitingRoomToCarError,
  WaitingRoomToCarValidationError,
  WaitingRoomToCarViewBikeCategoryModal,
  WaitingRoomToCarViewDidEnter,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { TestsModel } from '@store/tests/tests.model';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';

@Injectable()
export class WaitingRoomToCarAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  waitingRoomToCarViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
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
      [ReturnType<typeof WaitingRoomToCarViewDidEnter>, TestsModel, string, number, CategoryCode],
    ) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.setCurrentPage(
        formatAnalyticsText(AnalyticsScreenNames.WAITING_ROOM_TO_CAR, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarError$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarError),
    concatMap((action) => of(action)
      .pipe(
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
    switchMap((
      [action, tests, category]: [ReturnType<typeof WaitingRoomToCarError>, TestsModel, CategoryCode],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.WAITING_ROOM_TO_CAR, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logError(
        `${AnalyticsErrorTypes.SUBMIT_FORM_ERROR} (${screenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarValidationError$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarValidationError),
    concatMap((action) => of(action)
      .pipe(
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
    switchMap((
      [action, tests, category]: [ReturnType<typeof WaitingRoomToCarValidationError>, TestsModel, CategoryCode],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.WAITING_ROOM_TO_CAR, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarBikeCategoryChanged$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarBikeCategoryChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap(([action, tests]: [ReturnType<typeof WaitingRoomToCarBikeCategoryChanged>, TestsModel]) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, action.selectedBikeCategory);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.BIKE_CATEGORY_CHANGED, tests),
        `bike category changed to ${action.initialBikeCategory} from ${action.selectedBikeCategory}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarBikeCategorySelected$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarBikeCategorySelected),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap(([action, tests]: [ReturnType<typeof WaitingRoomToCarBikeCategorySelected>, TestsModel]) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, action.bikeCategory);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.BIKE_CATEGORY_SELECTED, tests),
        `bike category ${action.bikeCategory} selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarViewBikeCategoryModal$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarViewBikeCategoryModal),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap(([, tests]: [ReturnType<typeof WaitingRoomToCarViewBikeCategoryModal>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.BIKE_CATEGORY_MODAL_TRIGGERED, tests),
        'bike category selection modal triggered',
      );
      return of(AnalyticRecorded());
    }),
  ));
}
