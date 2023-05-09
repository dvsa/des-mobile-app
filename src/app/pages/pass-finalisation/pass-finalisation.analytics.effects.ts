import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import {
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { getTests } from '@store/tests/tests.reducer';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as passCompletionActions from '@store/tests/pass-completion/pass-completion.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import { getActivityCode } from '@store/tests/activity-code/activity-code.reducer';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import * as commsActions from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { TestsModel } from '@store/tests/tests.model';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import * as passFinalisationActions from '@pages/pass-finalisation/pass-finalisation.actions';
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
import { Router } from '@angular/router';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { PassFinalisationValidationError, PassFinalisationViewDidEnter } from './pass-finalisation.actions';

@Injectable()
export class PassFinalisationAnalyticsEffects {

  private classPrefix: string = '/PassFinalisation';

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private router: Router,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  passFinalisationViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(PassFinalisationViewDidEnter),
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
      [, tests]:
      [ReturnType<typeof PassFinalisationViewDidEnter>, TestsModel, boolean],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.PASS_FINALISATION, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  validationErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(PassFinalisationValidationError),
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
      [action, tests]:
      [ReturnType<typeof PassFinalisationValidationError>, TestsModel, boolean],
    ) => {
      const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.PASS_FINALISATION, tests);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  code78PresentEffect$ = createEffect(() => this.actions$.pipe(
    ofType(passCompletionActions.Code78Present),
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
      [, tests]:
      [ReturnType<typeof passCompletionActions.Code78Present>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_CODE_78, tests),
        'Yes',
      );
      return of(AnalyticRecorded());
    }),
  ));

  code78NotPresentEffect$ = createEffect(() => this.actions$.pipe(
    ofType(passCompletionActions.Code78NotPresent),
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
      [, tests]:
      [ReturnType<typeof passCompletionActions.Code78NotPresent>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_CODE_78, tests),
        'No',
      );
      return of(AnalyticRecorded());
    }),
  ));

  provisionalLicenseNotReceived$ = createEffect(() => this.actions$.pipe(
    ofType(passCompletionActions.ProvisionalLicenseNotReceived),
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
      [, tests]:
      [ReturnType<typeof passCompletionActions.ProvisionalLicenseNotReceived>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LICENSE_RECEIVED, tests),
        'No',
      );
      return of(AnalyticRecorded());
    }),
  ));

  provisionalLicenseReceived$ = createEffect(() => this.actions$.pipe(
    ofType(passCompletionActions.ProvisionalLicenseReceived),
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
      [, tests]:
      [ReturnType<typeof passCompletionActions.ProvisionalLicenseReceived>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LICENSE_RECEIVED, tests),
        'Yes',
      );
      return of(AnalyticRecorded());
    }),
  ));

  transmissionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleDetailsActions.GearboxCategoryChanged),
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
      [action, tests, activityCode]:
      [ReturnType<typeof vehicleDetailsActions.GearboxCategoryChanged>, TestsModel, ActivityCode, boolean],
    ) => {
      // Check current URL begins with PassFin prefix before recording analytic to stop duplicated events.
      if (activityCode != null && this.router.url?.startsWith(this.classPrefix)) {
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
      [ReturnType<typeof testSummaryActions.D255Yes>, TestsModel, ActivityCode, boolean],
    ) => {
      // D255Yes used in pass & non-pass flows, this guard stops the appearance of duplicated events.
      if (activityCode === ActivityCodes.PASS) {
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
      [, tests, activityCode]:
      [ReturnType<typeof testSummaryActions.D255No>, TestsModel, ActivityCode, boolean],
    ) => {
      // D255No used in pass & non-pass flows, this guard stops the appearance of duplicated events.
      if (activityCode === ActivityCodes.PASS) {
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
    ofType(commsActions.CandidateChoseToProceedWithTestInEnglish),
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
      [ReturnType<typeof commsActions.CandidateChoseToProceedWithTestInEnglish>, TestsModel, ActivityCode, boolean],
    ) => {
      if (activityCode !== null) {
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
      [ReturnType<typeof commsActions.CandidateChoseToProceedWithTestInWelsh>, TestsModel, ActivityCode, boolean],
    ) => {
      if (activityCode !== null) {
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

  passFinalisationReportActivityCode$ = createEffect(() => this.actions$.pipe(
    ofType(passFinalisationActions.PassFinalisationReportActivityCode),
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
      [ReturnType<typeof passFinalisationActions.PassFinalisationReportActivityCode>, TestsModel, boolean],
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

  passFinalisationSeekFurtherDevelopment$ = createEffect(() => this.actions$.pipe(
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
      [, tests, furtherDevelopment]:
      [ReturnType<typeof SeekFurtherDevelopmentChanged>, TestsModel, boolean, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.FURTHER_DEVELOPMENT_CHANGED, tests),
        `further development changed to ${furtherDevelopment ? 'Yes' : 'No'}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  passFinalisationReasonGiven$ = createEffect(() => this.actions$.pipe(
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
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.REASON_FOR_NO_ADVICE_CHANGED, tests),
        `reason for no advice changed ${reason}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
