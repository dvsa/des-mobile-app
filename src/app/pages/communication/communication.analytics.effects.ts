import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
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
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  BookingEmailSelected,
  CommunicationValidationError,
  CommunicationViewDidEnter,
  NewEmailSelected,
  PostalSelected,
} from './communication.actions';

@Injectable()
export class CommunicationAnalyticsEffects {
  private className = `/${TestFlowPageNames.COMMUNICATION_PAGE}`;

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private router: Router,
    private appConfigProvider: AppConfigProvider
  ) {}

  communicationViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunicationViewDidEnter),
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
          ReturnType<typeof CommunicationViewDidEnter>,
          TestsModel,
          string,
          number,
          CategoryCode,
          boolean,
        ]) => {
          //GA4 Analytics
          this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.COMMUNICATION, tests));

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

  communicationValidationError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunicationValidationError),
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
        ([action, tests]: [ReturnType<typeof CommunicationValidationError>, TestsModel, CategoryCode, boolean]) => {
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
            analyticsEventTypePrefix(GoogleAnalyticsEvents.VRN_CAPTURE, tests),
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
            analyticsEventTypePrefix(GoogleAnalyticsEvents.VRN_CAPTURE, tests),
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
            analyticsEventTypePrefix(GoogleAnalyticsEvents.VRN_CAPTURE, tests),
            GoogleAnalyticsEventsTitles.OUTCOME,
            GoogleAnalyticsEventsValues.VRN_CAPTURE_SAVED
          );
          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );

  bookingEmailSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingEmailSelected),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof BookingEmailSelected>, TestsModel, boolean]) => {
        if (this.router.url?.startsWith(this.className)) {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS, tests),
            GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
            GoogleAnalyticsEventsValues.COMMS_METHOD_BOOKING_EMAIL
          );

          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );

  newEmailSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewEmailSelected),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof NewEmailSelected>, TestsModel, boolean]) => {
        if (this.router.url?.startsWith(this.className)) {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS, tests),
            GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
            GoogleAnalyticsEventsValues.COMMS_METHOD_NEW_EMAIL
          );
          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );

  postalSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostalSelected),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof PostalSelected>, TestsModel, boolean]) => {
        if (this.router.url?.startsWith(this.className)) {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS, tests),
            GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
            GoogleAnalyticsEventsValues.COMMS_METHOD_POST
          );
          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );
}
