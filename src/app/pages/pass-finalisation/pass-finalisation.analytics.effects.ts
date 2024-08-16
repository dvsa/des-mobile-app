import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { getTests } from '@store/tests/tests.reducer';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
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

      //GA4 Analytics
      this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.PASS_FINALISATION, tests));
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
      [action]:
      [ReturnType<typeof PassFinalisationValidationError>, TestsModel, boolean],
    ) => {
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
      [, ]:
      [ReturnType<typeof passCompletionActions.Code78Present>, TestsModel, boolean],
    ) => {
      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.CODE78,
        GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
        GoogleAnalyticsEventsValues.AUTOMATIC,
      )
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
      [,]:
      [ReturnType<typeof passCompletionActions.Code78NotPresent>, TestsModel, boolean],
    ) => {
      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.CODE78,
        GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
        GoogleAnalyticsEventsValues.MANUAL,
      )
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
      //GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LICENCE_RECEIVED, tests),
        GoogleAnalyticsEventsTitles.RECEIVED,
        GoogleAnalyticsEventsValues.NO,
      )
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
      //GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LICENCE_RECEIVED, tests),
        GoogleAnalyticsEventsTitles.RECEIVED,
        GoogleAnalyticsEventsValues.YES,
      )
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
        //GA4 Analytics
        let gearboxCategory = null;
        switch (action.gearboxCategory) {
          case 'Automatic':
            gearboxCategory = GoogleAnalyticsEventsValues.AUTOMATIC
            break;
          case 'Manual':
            gearboxCategory = GoogleAnalyticsEventsValues.MANUAL
            break;
          default:
            gearboxCategory = GoogleAnalyticsEventsValues.UNKNOWN
            break;
        }

        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.SET_TRANSMISSION, tests),
          GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
          gearboxCategory,
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
      [, tests, activityCode]:
      [ReturnType<typeof testSummaryActions.D255No>, TestsModel, ActivityCode, boolean],
    ) => {
      // D255No used in pass & non-pass flows, this guard stops the appearance of duplicated events.
      if (activityCode === ActivityCodes.PASS) {

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
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.LANGUAGE_CHANGED, tests),
          GoogleAnalyticsEventsTitles.LANGUAGE,
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
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.LANGUAGE_CHANGED, tests),
          GoogleAnalyticsEventsTitles.LANGUAGE,
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
      //GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.SET_ACTIVITY_CODE, tests),
        GoogleAnalyticsEventsTitles.ACTIVITY_CODE,
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
      //GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.FURTHER_DEVELOPMENT, tests),
        GoogleAnalyticsEventsTitles.SELECTION,
        furtherDevelopment ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO,
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
      [, tests]:
      [ReturnType<typeof ReasonForNoAdviceGivenChanged>, TestsModel, string, boolean],
    ) => {
      //GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.FEEDBACK, tests),
        GoogleAnalyticsEventsTitles.FEEDBACK_CATEGORY,
        GoogleAnalyticsEventsValues.NO_ADVICE_REASON,
        GoogleAnalyticsEventsTitles.REASON,
        GoogleAnalyticsEventsValues.FREE_TEXT_ENTERED,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
