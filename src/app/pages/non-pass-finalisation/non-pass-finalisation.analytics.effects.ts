import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import {
  withLatestFrom, switchMap, concatMap,
} from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { StoreModel } from '@shared/models/store.model';
import {
  AnalyticsScreenNames,
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded, AnalyticNotRecorded } from '@providers/analytics/analytics.actions';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { getTests } from '@store/tests/tests.reducer';
import { getActivityCode, getCurrentTest } from '@store/tests/tests.selector';
import { TestsModel } from '@store/tests/tests.model';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as commsActions from '@store/tests/communication-preferences/communication-preferences.actions';
import { D255No, D255Yes } from '@store/tests/test-summary/test-summary.actions';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import { ActivityCodes } from '@shared/models/activity-codes';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import {
  getFurtherDevelopment,
  getReasonForNoAdviceGiven,
} from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import * as nonPassFinalisationActions from './non-pass-finalisation.actions';
import { NonPassFinalisationValidationError, NonPassFinalisationViewDidEnter } from './non-pass-finalisation.actions';

@Injectable()
export class NonPassFinalisationAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  nonPassFinalisationViewDidEnterEffect$ = createEffect(() => this.actions$.pipe(
    ofType(nonPassFinalisationActions.NonPassFinalisationViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([, tests]: [ReturnType<typeof NonPassFinalisationViewDidEnter>, TestsModel]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.NON_PASS_FINALISATION, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  validationErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(NonPassFinalisationValidationError),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof NonPassFinalisationValidationError>, TestsModel]) => {
      const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.NON_PASS_FINALISATION, tests);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  transmissionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleDetailsActions.GearboxCategoryChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getActivityCode),
        ),
      ),
    )),
    concatMap(([action, tests, activityCode]:
    [ReturnType<typeof vehicleDetailsActions.GearboxCategoryChanged>, TestsModel, ActivityCodeModel]) => {
      if (activityCode) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.GEARBOX_CATEGORY_CHANGED, tests),
          action.gearboxCategory,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  d255Yes$ = createEffect(() => this.actions$.pipe(
    ofType(testSummaryActions.D255Yes),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof D255Yes>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.D255, tests),
        'Yes',
      );
      return of(AnalyticRecorded());
    }),
  ));

  d255No$ = createEffect(() => this.actions$.pipe(
    ofType(testSummaryActions.D255No),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof D255No>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.D255, tests),
        'No',
      );
      return of(AnalyticRecorded());
    }),
  ));

  candidateChoseToProceedWithTestInEnglish$ = createEffect(() => this.actions$.pipe(
    ofType(commsActions.CandidateChoseToProceedWithTestInEnglish),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getActivityCode),
        ),
      ),
    )),
    concatMap(([, tests, activityCode]:
    [ReturnType<typeof commsActions.CandidateChoseToProceedWithTestInEnglish>, TestsModel, ActivityCodeModel]) => {
      if (activityCode) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.LANGUAGE_CHANGED, tests),
          Language.ENGLISH,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  candidateChoseToProceedWithTestInWelsh$ = createEffect(() => this.actions$.pipe(
    ofType(commsActions.CandidateChoseToProceedWithTestInWelsh),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getActivityCode),
        ),
      ),
    )),
    concatMap(([, tests, activityCode]:
    [ReturnType<typeof commsActions.CandidateChoseToProceedWithTestInWelsh>, TestsModel, ActivityCodeModel]) => {
      if (activityCode) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.LANGUAGE_CHANGED, tests),
          Language.CYMRAEG,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  nonPassFinalisationReportActivityCode$ = createEffect(() => this.actions$.pipe(
    ofType(
      nonPassFinalisationActions.NonPassFinalisationReportActivityCode,
    ),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([{ activityCode }, tests]:
    [ReturnType <typeof nonPassFinalisationActions.NonPassFinalisationReportActivityCode>, TestsModel]) => {
      const [description, code] = getEnumKeyByValue(ActivityCodes, activityCode);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.SET_ACTIVITY_CODE, tests),
        `${code} - ${description}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  nonPassFinalisationSeekFurtherDevelopment$ = createEffect(() => this.actions$.pipe(
    ofType(SeekFurtherDevelopmentChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getReview),
          select(getFurtherDevelopment),
        ),
      ),
    )),
    concatMap((
      [, tests, furtherDevelopment]: [ReturnType<typeof SeekFurtherDevelopmentChanged>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.FURTHER_DEVELOPMENT_CHANGED, tests),
        `further development changed to ${furtherDevelopment ? 'Yes' : 'No'}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  nonPassFinalisationReasonGiven$ = createEffect(() => this.actions$.pipe(
    ofType(ReasonForNoAdviceGivenChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getReview),
          select(getReasonForNoAdviceGiven),
        ),
      ),
    )),
    concatMap((
      [, tests, reason]: [ReturnType<typeof ReasonForNoAdviceGivenChanged>, TestsModel, string],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.REASON_FOR_NO_ADVICE_CHANGED, tests),
        `reason for no advice changed ${reason}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
