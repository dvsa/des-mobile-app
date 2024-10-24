import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomValidationError, WaitingRoomViewDidEnter } from '@pages/waiting-room/waiting-room.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import {
  VRNModalCancelled,
  VRNModalOpened,
  VRNModalSaved,
} from '@store/tests/candidate-section/candidate-section.actions';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { CbtNumberChanged } from '@store/tests/pre-test-declarations/cat-a/pre-test-declarations.cat-a.actions';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class WaitingRoomAnalyticsEffects {
  private className = `/${TestFlowPageNames.WAITING_ROOM_PAGE}`;

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private router: Router,
    private appConfigProvider: AppConfigProvider
  ) {}

  waitingRoomViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WaitingRoomViewDidEnter),
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
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([, tests, applicationReference, candidateId, category]: [
          ReturnType<typeof WaitingRoomViewDidEnter>,
          TestsModel,
          string,
          number,
          CategoryCode,
          boolean,
        ]) => {
          //GA4 Analytics
          this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.WAITING_ROOM, tests));

          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.TEST_CATEGORY, category);
          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, `${candidateId}`);
          this.analytics.addGACustomDimension(
            GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
            applicationReference
          );

          return of(AnalyticRecorded());
        }
      )
    )
  );

  waitingRoomValidationError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WaitingRoomValidationError),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([action, tests]: [ReturnType<typeof WaitingRoomValidationError>, TestsModel, CategoryCode, boolean]) => {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.VALIDATION_ERROR, tests),
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            action.errorMessage
          );

          return of(AnalyticRecorded());
        }
      )
    )
  );

  cbtNumberChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CbtNumberChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof CbtNumberChanged>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(analyticsEventTypePrefix(AnalyticsEvents.CBT_CHANGED, tests));

        return of(AnalyticRecorded());
      })
    )
  );

  vrnModalOpened$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VRNModalOpened),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof VRNModalOpened>, TestsModel, boolean]) => {
        if (this.router.url?.startsWith(this.className)) {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(AnalyticsEvents.VRN_CAPTURE, tests),
            GoogleAnalyticsEventsTitles.OUTCOME,
            GoogleAnalyticsEventsValues.VRN_CAPTURE_SELECTED
          );

          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );

  vrnModalCancelled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VRNModalCancelled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof VRNModalCancelled>, TestsModel, boolean]) => {
        if (this.router.url?.startsWith(this.className)) {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(AnalyticsEvents.VRN_CAPTURE, tests),
            GoogleAnalyticsEventsTitles.OUTCOME,
            GoogleAnalyticsEventsValues.VRN_CAPTURE_CANCELLED
          );
          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );

  vrnModalSaved$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VRNModalSaved),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof VRNModalSaved>, TestsModel, boolean]) => {
        if (this.router.url?.startsWith(this.className)) {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(AnalyticsEvents.VRN_CAPTURE, tests),
            GoogleAnalyticsEventsTitles.OUTCOME,
            GoogleAnalyticsEventsValues.VRN_CAPTURE_SAVED
          );
          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );
}
