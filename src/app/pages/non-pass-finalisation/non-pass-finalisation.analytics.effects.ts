import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { StoreModel } from '@shared/models/store.model';
import {
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { getTests } from '@store/tests/tests.reducer';
import { getActivityCode } from '@store/tests/activity-code/activity-code.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import { D255No, D255Yes } from '@store/tests/test-summary/test-summary.actions';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import { ActivityCodes } from '@shared/models/activity-codes';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { AppConfigProvider } from '@providers/app-config/app-config';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import * as nonPassFinalisationActions from './non-pass-finalisation.actions';
import { NonPassFinalisationValidationError, NonPassFinalisationViewDidEnter } from './non-pass-finalisation.actions';

@Injectable()
export class NonPassFinalisationAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  nonPassFinalisationViewDidEnterEffect$ = createEffect(() => this.actions$.pipe(
    ofType(nonPassFinalisationActions.NonPassFinalisationViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]: [ReturnType<typeof NonPassFinalisationViewDidEnter>, TestsModel, boolean],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.NON_PASS_FINALISATION, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  validationErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(NonPassFinalisationValidationError),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [action, tests]: [ReturnType<typeof NonPassFinalisationValidationError>, TestsModel, boolean],
    ) => {
      const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.NON_PASS_FINALISATION, tests);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  d255Yes$ = createEffect(() => this.actions$.pipe(
    ofType(testSummaryActions.D255Yes),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getActivityCode),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests, activityCode]: [ReturnType<typeof D255Yes>, TestsModel, ActivityCode, boolean],
    ) => {
      // D255Yes used in pass & non-pass flows, this guard stops the appearance of duplicated events.
      if (activityCode !== ActivityCodes.PASS) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.D255, tests),
          'Yes',
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  d255No$ = createEffect(() => this.actions$.pipe(
    ofType(testSummaryActions.D255No),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getActivityCode),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests, activityCode]: [ReturnType<typeof D255No>, TestsModel, ActivityCode, boolean],
    ) => {
      // D255No used in pass & non-pass flows, this guard stops the appearance of duplicated events.
      if (activityCode !== ActivityCodes.PASS) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.D255, tests),
          'No',
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  candidateChoseToProceedWithTestInEnglish$ = createEffect(() => this.actions$.pipe(
    ofType(CandidateChoseToProceedWithTestInEnglish),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getActivityCode),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests, activityCode]:
      [ReturnType<typeof CandidateChoseToProceedWithTestInEnglish>, TestsModel, ActivityCode, boolean],
    ) => {
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
    ofType(CandidateChoseToProceedWithTestInWelsh),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getActivityCode),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests, activityCode]:
      [ReturnType<typeof CandidateChoseToProceedWithTestInWelsh>, TestsModel, ActivityCode, boolean],
    ) => {
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
    ofType(nonPassFinalisationActions.NonPassFinalisationReportActivityCode),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [{ activityCode }, tests]:
      [ReturnType<typeof nonPassFinalisationActions.NonPassFinalisationReportActivityCode>, TestsModel, boolean],
    ) => {
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
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [{ seekFurtherDevelopment }, tests]: [ReturnType<typeof SeekFurtherDevelopmentChanged>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.FURTHER_DEVELOPMENT_CHANGED, tests),
        `further development changed to ${seekFurtherDevelopment ? 'Yes' : 'No'}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  nonPassFinalisationReasonGiven$ = createEffect(() => this.actions$.pipe(
    ofType(ReasonForNoAdviceGivenChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [{ reasonForNoAdviceGiven }, tests]:
      [ReturnType<typeof ReasonForNoAdviceGivenChanged>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.REASON_FOR_NO_ADVICE_CHANGED, tests),
        `reason for no advice changed ${reasonForNoAdviceGiven}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
