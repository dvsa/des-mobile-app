import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsDimensionIndices,
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames, GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles, GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { TestsModel } from '@store/tests/tests.model';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, isPracticeMode } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
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
import { TestFlowPageNames } from '@pages/page-names.constants';
import { Router } from '@angular/router';
import { AppConfigProvider } from '@providers/app-config/app-config';
import {
  BookingEmailSelected,
  CommunicationValidationError,
  CommunicationViewDidEnter,
  NewEmailSelected, PostalSelected,
} from './communication.actions';

@Injectable()
export class CommunicationAnalyticsEffects {

  private className: string = `/${TestFlowPageNames.COMMUNICATION_PAGE}`;

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private router: Router,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  communicationViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(CommunicationViewDidEnter),
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
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, applicationReference, candidateId, category]:
      [ReturnType<typeof CommunicationViewDidEnter>, TestsModel, string, number, CategoryCode, boolean],
    ) => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.setCurrentPage(formatAnalyticsText(AnalyticsScreenNames.COMMUNICATION, tests));

      //GA4 Analytics
      this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.COMMUNICATION, tests));

      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      return of(AnalyticRecorded());
    }),
  ));

  communicationValidationError$ = createEffect(() => this.actions$.pipe(
    ofType(CommunicationValidationError),
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
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap(([action, tests, category]:
    [ReturnType<typeof CommunicationValidationError>, TestsModel, CategoryCode, boolean]) => {

      // TODO - MES-9495 - remove old analytics
      const screenName = formatAnalyticsText(AnalyticsScreenNames.COMMUNICATION, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logError(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenName})`, action.errorMessage);

      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.VALIDATION_ERROR, tests),
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  vrnModalOpened$ = createEffect(() => this.actions$.pipe(
    ofType(VRNModalOpened),
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
    concatMap(([, tests]: [ReturnType<typeof VRNModalOpened>, TestsModel, boolean]) => {
      if (this.router.url?.startsWith(this.className)) {

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.COMMUNICATION, tests),
          AnalyticsEvents.VRN_CAPTURE,
          AnalyticsEvents.VRN_CAPTURE_SELECTED,
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(AnalyticsEvents.VRN_CAPTURE, tests),
          GoogleAnalyticsEventsTitles.OUTCOME,
          GoogleAnalyticsEventsValues.VRN_CAPTURE_SELECTED,
        );

        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  vrnModalCancelled$ = createEffect(() => this.actions$.pipe(
    ofType(VRNModalCancelled),
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
    concatMap(([, tests]: [ReturnType<typeof VRNModalCancelled>, TestsModel, boolean]) => {
      if (this.router.url?.startsWith(this.className)) {

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.COMMUNICATION, tests),
          AnalyticsEvents.VRN_CAPTURE,
          AnalyticsEvents.VRN_CAPTURE_CANCELLED,
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.VRN_CAPTURE, tests),
          GoogleAnalyticsEventsTitles.OUTCOME,
          GoogleAnalyticsEventsValues.VRN_CAPTURE_CANCELLED,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  vrnModalSaved$ = createEffect(() => this.actions$.pipe(
    ofType(VRNModalSaved),
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
    concatMap(([, tests]: [ReturnType<typeof VRNModalSaved>, TestsModel, boolean]) => {
      if (this.router.url?.startsWith(this.className)) {

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.COMMUNICATION, tests),
          AnalyticsEvents.VRN_CAPTURE,
          AnalyticsEvents.VRN_CAPTURE_SAVED,
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.VRN_CAPTURE, tests),
          GoogleAnalyticsEventsTitles.OUTCOME,
          GoogleAnalyticsEventsValues.VRN_CAPTURE_SAVED,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  bookingEmailSelected$ = createEffect(() => this.actions$.pipe(
    ofType(BookingEmailSelected),
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
    concatMap(([, tests]: [ReturnType<typeof BookingEmailSelected>, TestsModel, boolean]) => {
      if (this.router.url?.startsWith(this.className)) {

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          AnalyticsEventCategories.COMMUNICATION,
          AnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
          'Booking Email',
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS, tests),
          GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
          GoogleAnalyticsEventsValues.COMMS_METHOD_BOOKING_EMAIL,
        );

        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  newEmailSelected$ = createEffect(() => this.actions$.pipe(
    ofType(NewEmailSelected),
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
    concatMap(([, tests]: [ReturnType<typeof NewEmailSelected>, TestsModel, boolean]) => {
      if (this.router.url?.startsWith(this.className)) {

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          AnalyticsEventCategories.COMMUNICATION,
          AnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
          'New Email',
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS, tests),
          GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
          GoogleAnalyticsEventsValues.COMMS_METHOD_NEW_EMAIL,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  postalSelected$ = createEffect(() => this.actions$.pipe(
    ofType(PostalSelected),
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
    concatMap(([, tests]: [ReturnType<typeof PostalSelected>, TestsModel, boolean]) => {
      if (this.router.url?.startsWith(this.className)) {

        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          AnalyticsEventCategories.COMMUNICATION,
          AnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS,
          'By Post',
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.CANDIDATE_RECEIVE_TEST_RESULTS, tests),
          GoogleAnalyticsEventsTitles.COMMS_CHANNEL,
          GoogleAnalyticsEventsValues.COMMS_METHOD_POST,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

}
