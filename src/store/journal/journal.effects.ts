import { Injectable } from '@angular/core';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  filter,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { interval, Observable, of } from 'rxjs';
// import { groupBy } from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { Action, select, Store } from '@ngrx/store';
import { JournalProvider } from '@providers/journal/journal';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { SlotProvider } from '@providers/slot/slot';
import { JournalRefreshModes } from '@providers/analytics/analytics.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Examiner } from '@dvsa/mes-test-schema/categories/common';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LogHelper } from '@providers/logs/logs-helper';

import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { SearchProvider } from '@providers/search/search';
import { LogType } from '@shared/models/log.model';
import { getExaminer } from '@store/tests/journal-data/common/examiner/examiner.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { removeLeadingZeros } from '@shared/helpers/formatters';
import { hasStartedTests } from '@store/tests/tests.selector';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import * as moment from 'moment';
import { getStaffNumber } from '@store/tests/journal-data/common/examiner/examiner.selector';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerSlotItems, ExaminerSlotItemsByDate } from './journal.model';
import { SaveLog } from '../logs/logs.actions';
import { getJournalState } from './journal.reducer';
import * as journalActions from './journal.actions';
import { LoadCompletedTests, LoadCompletedTestsFailure, LoadCompletedTestsSuccess } from './journal.actions';
import {
  canNavigateToNextDay,
  canNavigateToPreviousDay,
  getCompletedTests,
  getLastRefreshed,
  getSelectedDate,
  getSlots,
} from './journal.selector';

@Injectable()
export class JournalEffects {
  constructor(
    private actions$: Actions,
    private journalProvider: JournalProvider,
    private slotProvider: SlotProvider,
    private store$: Store<StoreModel>,
    public appConfig: AppConfigProvider,
    public networkStateProvider: NetworkStateProvider,
    public dataStoreprovider: DataStoreProvider,
    public authProvider: AuthenticationProvider,
    public dateTimeProvider: DateTimeProvider,
    public searchProvider: SearchProvider,
    private logHelper: LogHelper,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
  ) {
  }

  callJournalProvider$ = (mode: string): Observable<Action> => {
    this.store$.dispatch(journalActions.JournalRefresh(mode));
    return of(null).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getJournalState),
          map(getLastRefreshed),
        ),
        this.store$.pipe(
          select(getJournalState),
          map(getSlots),
        ),
        this.store$.pipe(
          select(getJournalState),
          map(getExaminer),
        ),
      ),
      switchMap(([, lastRefreshed, slots, examiner]) => {
        return this.journalProvider
          .getJournal(lastRefreshed)
          .pipe(
            tap((journalData: ExaminerWorkSchedule) => this.journalProvider.saveJournalForOffline(journalData)),
            map((journalData: ExaminerWorkSchedule): ExaminerSlotItems => ({
              examiner: journalData.examiner as Required<Examiner>,
              slotItems: this.slotProvider.detectSlotChanges(slots, journalData),
            })),
            map((examinerSlotItems: ExaminerSlotItems): ExaminerSlotItemsByDate => ({
              examiner: examinerSlotItems.examiner,
              slotItemsByDate: this.slotProvider.getRelevantSlotItemsByDate(examinerSlotItems.slotItems),
            })),
            map((slotItemsByDate: ExaminerSlotItemsByDate) => journalActions.LoadJournalSuccess(
              slotItemsByDate,
              this.networkStateProvider.getNetworkState(),
              this.authProvider.isInUnAuthenticatedMode(),
              lastRefreshed,
            )),
            catchError((err: HttpErrorResponse) => {
              // For HTTP 304 NOT_MODIFIED we just use the slots we already have cached
              if (err.status === HttpStatusCodes.NOT_MODIFIED) {
                return of(journalActions.LoadJournalSuccess(
                  { examiner, slotItemsByDate: slots },
                  this.networkStateProvider.getNetworkState(),
                  this.authProvider.isInUnAuthenticatedMode(),
                  lastRefreshed,
                ));
              }

              if (err.message === 'Timeout has occurred') {
                return of(journalActions.JournalRefreshError('Retrieving Journal', err.message));
              }

              this.store$.dispatch(SaveLog({
                payload: this.logHelper.createLog(LogType.ERROR, 'Retrieving Journal', err.message),
              }));

              return ErrorObservable.create(err);
            }),
          );
      }),
    );
  };

  journal$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.LoadJournalSilent),
    switchMap(
      () => this.callJournalProvider$(JournalRefreshModes.AUTOMATIC).pipe(
        catchError((err: HttpErrorResponse) => {
          return [
            journalActions.JournalRefreshError('AutomaticJournalRefresh', err.message),
            journalActions.LoadJournalSilentFailure(err),
          ];
        }),
      ),
    ),
  ));

  loadJournal$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.LoadJournal),
    switchMap(
      () => this.callJournalProvider$(JournalRefreshModes.MANUAL).pipe(
        catchError((err: HttpErrorResponse) => {
          return [
            journalActions.JournalRefreshError('ManualJournalRefresh', err.message),
            journalActions.LoadJournalFailure(err),
          ];
        }),
      ),
    ),
  ));

  pollingSetup$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.SetupPolling),
    switchMap(() => {
      // Switch map the manual refreshes so they restart the timer.
      const manualRefreshes$ = this.actions$.pipe(
        ofType(journalActions.LoadJournal),
        // Initial emission so poll doesn't wait until the first manual refresh
        startWith(null),
      );
      const pollTimer$ = manualRefreshes$.pipe(
        switchMap(() => interval(this.appConfig.getAppConfig().journal.autoRefreshInterval)),
      );

      const pollsWhileOnline$ = pollTimer$
        .pipe(
          withLatestFrom(this.networkStateProvider.onNetworkChange()),
          filter(([, connectionStatus]) => connectionStatus === ConnectionStatus.ONLINE),
        );

      return pollsWhileOnline$
        .pipe(
          takeUntil(this.actions$.pipe(ofType(journalActions.StopPolling))),
          switchMap(() => of(journalActions.LoadJournalSilent())),
        );
    }),
  ));

  loadCompletedTests$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.LoadCompletedTests),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getJournalState),
          select(getExaminer),
          select(getStaffNumber),
        ),
        this.store$.pipe(
          select(getTests),
          select(hasStartedTests),
        ),
        this.store$.pipe(
          select(getJournalState),
          select(getCompletedTests),
        ),
      ),
    )),
    filter(([action, , hasStarted, completedTests]:
              [ReturnType<typeof LoadCompletedTests>, string, boolean, SearchResultTestSchema[]]) => {
      if (this.networkStateProvider.getNetworkState() === ConnectionStatus.OFFLINE) return false;
      if (action.callThrough) return true;

      return !hasStarted && completedTests && completedTests.length === 0;
    }),
    switchMap(([, staffNumber]) => {
      const { numberOfDaysToView } = this.appConfig.getAppConfig().journal;
      const advancedSearchParams: AdvancedSearchParams = {
        startDate: moment().subtract(numberOfDaysToView, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        staffNumber: removeLeadingZeros(staffNumber),
        costCode: '',
        excludeAutoSavedTests: 'true',
      };

      return this.searchProvider.advancedSearch(advancedSearchParams).pipe(
        tap((searchResults) => this.completedTestPersistenceProvider.persistCompletedTests(searchResults)),
        map((searchResults) => LoadCompletedTestsSuccess(searchResults)),
        catchError((err) => of(LoadCompletedTestsFailure(err))),
      );
    }),
  ));

  selectPreviousDayEffect$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.SelectPreviousDay),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getJournalState),
          map(getSelectedDate),
        ),
        this.store$.pipe(
          select(getJournalState),
          map((journal) => canNavigateToPreviousDay(journal, this.dateTimeProvider.now())),
        ),
      ),
    )),
    filter(([, , canNavigateToPreviousDayVal]) => canNavigateToPreviousDayVal),
    switchMap(([, selectedDate]) => {
      const previousDay = DateTime.at(selectedDate).add(-1, Duration.DAY).format('YYYY-MM-DD');

      return [
        journalActions.SetSelectedDate(previousDay),
        journalActions.JournalNavigateDay(previousDay),
      ];
    }),
  ));

  selectNextDayEffect$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.SelectNextDay),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getJournalState),
          map(getSelectedDate),
        ),
        this.store$.pipe(
          select(getJournalState),
          map(canNavigateToNextDay),
        ),
      ),
    )),
    filter(([, , canNavigateToNextDayVal]) => canNavigateToNextDayVal),
    switchMap(([, selectedDate]) => {
      const nextDay = DateTime.at(selectedDate).add(1, Duration.DAY).format('YYYY-MM-DD');

      return [
        journalActions.SetSelectedDate(nextDay),
        journalActions.JournalNavigateDay(nextDay),
      ];
    }),
  ));

}
