import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { SearchProvider } from '@providers/search/search';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import {
  catchError, concatMap, filter, map, switchMap, tap, withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { getJournalState } from '@store/journal/journal.reducer';
import { getExaminer } from '@store/tests/journal-data/common/examiner/examiner.reducer';
import { getStaffNumber } from '@store/tests/journal-data/common/examiner/examiner.selector';
import {
  LoadCompletedTestsFailure,
  LoadCompletedTestsSuccess,
} from '@store/journal/journal.actions';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { AdvancedSearchParams } from '@providers/search/search.models';
import * as moment from 'moment/moment';
import { removeLeadingZeros } from '@shared/helpers/formatters';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { DateTime } from '@shared/helpers/date-time';
import {
  LoadCompletedTestsFromUnsubmitted,
  UnuploadedTestsViewDidEnter,
} from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { unsubmittedTestSlotsInDateOrder$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';

@Injectable()
export class UnuploadedTestsEffects {
  private static readonly WINDOW_WITH_GRACE_PERIOD = 60;

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    public networkStateProvider: NetworkStateProvider,
    public searchProvider: SearchProvider,
    public appConfigProvider: AppConfigProvider,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
  ) {
  }

  unUploadedTestsViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(UnuploadedTestsViewDidEnter),
    switchMap(() => ([
      LoadCompletedTestsFromUnsubmitted(true, this.appConfigProvider.getAppConfig()?.journal?.numberOfDaysToView),
    ])),
  ));

    loadCompletedTests$ = createEffect(() => this.actions$.pipe(
      ofType(LoadCompletedTestsFromUnsubmitted),
      concatMap((action) => of(action).pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getJournalState),
            select(getExaminer),
            select(getStaffNumber),
          ),
          unsubmittedTestSlotsInDateOrder$(this.store$),
        ),
      )),
      filter((
        [, , unsubmittedTestSlots]: [ReturnType<typeof LoadCompletedTestsFromUnsubmitted>, string, SlotItem[]],
      ) => (
        // Have to be online, have unSubmittedTestSlots and not be in test env
        this.networkStateProvider.getNetworkState() === ConnectionStatus.ONLINE
          && unsubmittedTestSlots?.length > 0
          && (environment as unknown as TestersEnvironmentFile)?.isTest === false
      )),
      switchMap(([{ numberOfDays }, staffNumber, unsubmittedTestSlots]) => {
        // daysDiff is the calculation from today - the oldest incomplete test start date
        let daysDiff = new DateTime().daysDiff(unsubmittedTestSlots[0]?.slotData.slotDetail.start);

        // Need completed tests to cover the entire journal window due to LoadCompletedTestsSuccess re-hydrating journal
        // slot data
        if (daysDiff < numberOfDays) { daysDiff = numberOfDays; }
        // If tests are older than 60 days, we want to avoid bringing back excessive amounts of data for performance
        // reasons
        if (daysDiff > UnuploadedTestsEffects.WINDOW_WITH_GRACE_PERIOD) {
          daysDiff = UnuploadedTestsEffects.WINDOW_WITH_GRACE_PERIOD;
        }

        const advancedSearchParams: AdvancedSearchParams = {
          startDate: moment().subtract(daysDiff, 'days').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          staffNumber: removeLeadingZeros(staffNumber),
          costCode: '',
          excludeAutoSavedTests: 'false',
          activityCode: '',
          category: '',
        };

        return this.searchProvider.advancedSearch(advancedSearchParams).pipe(
          map((searchResults: SearchResultTestSchema[]) => searchResults),
          tap((searchResults) => this.completedTestPersistenceProvider.persistCompletedTests(searchResults)),
          map((searchResults: SearchResultTestSchema[]) => LoadCompletedTestsSuccess(searchResults)),
          catchError((err) => of(LoadCompletedTestsFailure(err))),
        );
      }),
    ));
}
