import { Injectable } from '@angular/core';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import { getActivityCode } from '@store/tests/activity-code/activity-code.reducer';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import { D255No, D255Yes } from '@store/tests/test-summary/test-summary.actions';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import * as nonPassFinalisationActions from './non-pass-finalisation.actions';
import { NonPassFinalisationValidationError, NonPassFinalisationViewDidEnter } from './non-pass-finalisation.actions';

@Injectable()
export class NonPassFinalisationAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  nonPassFinalisationViewDidEnterEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(nonPassFinalisationActions.NonPassFinalisationViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof NonPassFinalisationViewDidEnter>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.NON_PASS_FINALISATION, tests));
        return of(AnalyticRecorded());
      })
    )
  );

  validationErrorEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NonPassFinalisationValidationError),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([action, tests]: [ReturnType<typeof NonPassFinalisationValidationError>, TestsModel, boolean]) => {
        //GA4 Analytics
        const valueName = action.errorMessage.split(' ')[0];

        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.VALIDATION_ERROR, tests),
          GoogleAnalyticsEventsTitles.BLANK_FIELD,
          valueName
        );
        return of(AnalyticRecorded());
      })
    )
  );

  d255Yes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testSummaryActions.D255Yes),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getActivityCode)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests, activityCode]: [ReturnType<typeof D255Yes>, TestsModel, ActivityCode, boolean]) => {
        // D255Yes used in pass & non-pass flows, this guard stops the appearance of duplicated events.
        if (activityCode !== ActivityCodes.PASS) {
          //GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.SET_D255, tests),
            GoogleAnalyticsEventsTitles.FINALISATION_D255,
            GoogleAnalyticsEventsValues.YES
          );
          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );

  d255No$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testSummaryActions.D255No),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getActivityCode)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests, activityCode]: [ReturnType<typeof D255No>, TestsModel, ActivityCode, boolean]) => {
        // D255No used in pass & non-pass flows, this guard stops the appearance of duplicated events.
        if (activityCode !== ActivityCodes.PASS) {
          //GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.SET_D255, tests),
            GoogleAnalyticsEventsTitles.FINALISATION_D255,
            GoogleAnalyticsEventsValues.NO
          );
          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );

  candidateChoseToProceedWithTestInEnglish$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CandidateChoseToProceedWithTestInEnglish),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getActivityCode)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([, tests, activityCode]: [
          ReturnType<typeof CandidateChoseToProceedWithTestInEnglish>,
          TestsModel,
          ActivityCode,
          boolean,
        ]) => {
          if (activityCode) {
            //GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.LANGUAGE_CHANGED, tests),
              GoogleAnalyticsEventsTitles.LANGUAGE,
              Language.ENGLISH
            );
            return of(AnalyticRecorded());
          }
          return of(AnalyticNotRecorded());
        }
      )
    )
  );

  candidateChoseToProceedWithTestInWelsh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CandidateChoseToProceedWithTestInWelsh),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getActivityCode)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([, tests, activityCode]: [
          ReturnType<typeof CandidateChoseToProceedWithTestInWelsh>,
          TestsModel,
          ActivityCode,
          boolean,
        ]) => {
          if (activityCode) {
            //GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.LANGUAGE_CHANGED, tests),
              GoogleAnalyticsEventsTitles.LANGUAGE,
              Language.CYMRAEG
            );
            return of(AnalyticRecorded());
          }
          return of(AnalyticNotRecorded());
        }
      )
    )
  );

  nonPassFinalisationReportActivityCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(nonPassFinalisationActions.NonPassFinalisationReportActivityCode),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([{ activityCode }, tests]: [
          ReturnType<typeof nonPassFinalisationActions.NonPassFinalisationReportActivityCode>,
          TestsModel,
          boolean,
        ]) => {
          const [description, code] = getEnumKeyByValue(ActivityCodes, activityCode);
          //GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.SET_ACTIVITY_CODE, tests),
            GoogleAnalyticsEventsTitles.ACTIVITY_CODE,
            `${code} - ${description}`
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );
}
