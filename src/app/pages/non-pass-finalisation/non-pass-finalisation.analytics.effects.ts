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
  AnalyticsScreenNames, GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles, GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
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
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import {
  getFurtherDevelopment,
  getReasonForNoAdviceGiven,
} from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
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

      // TODO - MES-9495 - remove old analytics
      const screenName = formatAnalyticsText(AnalyticsScreenNames.NON_PASS_FINALISATION, tests);
      this.analytics.setCurrentPage(screenName);

      //GA4 Analytics
      this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.NON_PASS_FINALISATION, tests));
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
      // TODO - MES-9495 - remove old analytics
      const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.NON_PASS_FINALISATION, tests);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
        action.errorMessage,
      );
      //GA4 Analytics
      const valueName = action.errorMessage.split(' ')[0];

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        valueName,
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

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.D255, tests),
          'Yes',
        );

        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.SET_D255, tests),
          GoogleAnalyticsEventsTitles.FINALISATION_D255,
          GoogleAnalyticsEventsValues.YES,
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

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.D255, tests),
          'No',
        );

        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.SET_D255, tests),
          GoogleAnalyticsEventsTitles.FINALISATION_D255,
          GoogleAnalyticsEventsValues.NO,
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

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.LANGUAGE_CHANGED, tests),
          Language.ENGLISH,
        );
        //GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.LANGUAGE_CHANGED,
          GoogleAnalyticsEventsTitles.LANGUAGE,
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
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
          formatAnalyticsText(AnalyticsEvents.LANGUAGE_CHANGED, tests),
          Language.CYMRAEG,
        );
        //GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.LANGUAGE_CHANGED,
          GoogleAnalyticsEventsTitles.LANGUAGE,
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
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.SET_ACTIVITY_CODE, tests),
        `${code} - ${description}`,
      );
      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.SET_ACTIVITY_CODE,
        GoogleAnalyticsEventsTitles.ACTIVITY_CODE,
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
            select(getCurrentTest),
            select(getTestData),
            select(getReview),
            select(getFurtherDevelopment),
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
      [, tests, furtherDevelopment]: [ReturnType<typeof SeekFurtherDevelopmentChanged>, TestsModel, boolean, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.FURTHER_DEVELOPMENT_CHANGED, tests),
        `further development changed to ${furtherDevelopment ? 'Yes' : 'No'}`,
      );
      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.FURTHER_DEVELOPMENT,
        GoogleAnalyticsEventsTitles.SELECTION,
        furtherDevelopment ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO,
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
            select(getCurrentTest),
            select(getTestData),
            select(getReview),
            select(getReasonForNoAdviceGiven),
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
      [, tests, reason]:
      [ReturnType<typeof ReasonForNoAdviceGivenChanged>, TestsModel, string, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.REASON_FOR_NO_ADVICE_CHANGED, tests),
        `reason for no advice changed ${reason}`,
      );
      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.FEEDBACK,
        GoogleAnalyticsEventsTitles.FEEDBACK_CATEGORY,
        GoogleAnalyticsEventsValues.NO_ADVICE_REASON,
        GoogleAnalyticsEventsTitles.REASON,
        reason,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
