import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import {
  CandidateDeclarationSigned,
  SetDeclarationStatus,
  SignatureConfirmed,
  ToggleInsuranceDeclaration,
  ToggleResidencyDeclaration,
} from '@store/tests/pre-test-declarations/pre-test-declarations.actions';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class PreTestDeclarationsAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  signatureConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignatureConfirmed),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof SignatureConfirmed>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.CANDIDATE_SIGNATURE, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          GoogleAnalyticsEventsValues.COMPLETED
        );

        return of(AnalyticRecorded());
      })
    )
  );

  toggleInsuranceDeclaration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToggleInsuranceDeclaration),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([{ selected }, tests]: [ReturnType<typeof ToggleInsuranceDeclaration>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.INSURANCE_DECLARATION, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          selected ? GoogleAnalyticsEventsValues.CONFIRMED : GoogleAnalyticsEventsValues.UNCONFIRMED
        );

        return of(AnalyticRecorded());
      })
    )
  );

  candidateDeclarationSigned$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CandidateDeclarationSigned),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof CandidateDeclarationSigned>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.CANDIDATE_DECLARATION, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          GoogleAnalyticsEventsValues.CONFIRMED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  setDeclarationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SetDeclarationStatus),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([{ declarationStatus }, tests]: [ReturnType<typeof SetDeclarationStatus>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.DECLARATION_STATUS, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          declarationStatus ? GoogleAnalyticsEventsValues.CONFIRMED : GoogleAnalyticsEventsValues.UNCONFIRMED
        );

        return of(AnalyticRecorded());
      })
    )
  );

  toggleResidencyDeclaration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToggleResidencyDeclaration),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([{ selected }, tests]: [ReturnType<typeof ToggleResidencyDeclaration>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.RESIDENCY_DECLARATION, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          selected ? GoogleAnalyticsEventsValues.CONFIRMED : GoogleAnalyticsEventsValues.UNCONFIRMED
        );

        return of(AnalyticRecorded());
      })
    )
  );
}
