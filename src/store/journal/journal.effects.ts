import { Injectable } from '@angular/core';
import { ExaminerWorkSchedule, TestSlot } from '@dvsa/mes-journal-schema';
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
import { interval, Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Action, select, Store } from '@ngrx/store';
import { JournalProvider } from '@providers/journal/journal';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { SlotProvider } from '@providers/slot/slot';
import { JournalRefreshModes } from '@providers/analytics/analytics.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Examiner } from '@dvsa/mes-test-schema/categories/common';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LogHelper } from '@providers/logs/logs-helper';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { SearchProvider } from '@providers/search/search';
import { LogType } from '@shared/models/log.model';
import { getExaminer } from '@store/tests/journal-data/common/examiner/examiner.reducer';
import { getTests, TestResultSchemasUnionWithAutosaveAndSlotID } from '@store/tests/tests.reducer';
import { AdvancedSearchParams } from '@providers/search/search.models';
import { formatApplicationReference, removeLeadingZeros } from '@shared/helpers/formatters';
import { hasStartedTests } from '@store/tests/tests.selector';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerSlotItems, ExaminerSlotItemsByDate } from './journal.model';
import { SaveLog } from '../logs/logs.actions';
import { getJournalState } from './journal.reducer';
import * as journalActions from './journal.actions';
import { LoadCompletedTestsFailure, LoadCompletedTestsSuccess } from './journal.actions';
import {
  canNavigateToNextDay,
  canNavigateToPreviousDay,
  getCompletedTests,
  getLastRefreshed,
  getSelectedDate,
  getSlots,
} from './journal.selector';
import { selectEmployeeId } from '@store/app-info/app-info.selectors';
import { get } from 'lodash-es';
import { RehydrationReturn } from '@providers/journal-rehydration/journal-rehydration';
import { LoadRemoteTests } from '@store/tests/tests.actions';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { CompressionProvider } from '@providers/compression/compression';

@Injectable()
export class JournalEffects {
  // every 5 minutes
  private static readonly interval = 300000;

  constructor(
    private actions$: Actions,
    private journalProvider: JournalProvider,
    private slotProvider: SlotProvider,
    private store$: Store<StoreModel>,
    public appConfig: AppConfigProvider,
    public networkStateProvider: NetworkStateProvider,
    public authProvider: AuthenticationProvider,
    public dateTimeProvider: DateTimeProvider,
    public searchProvider: SearchProvider,
    private logHelper: LogHelper,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private compressionProvider: CompressionProvider,
  ) {
  }

  callJournalProvider$ = (mode: string): Observable<Action> => {
    this.store$.dispatch(journalActions.JournalRefresh(mode));
    return of(null)
      .pipe(
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
                if (err.status === HttpStatusCode.NotModified) {
                  return of(journalActions.LoadJournalSuccess(
                    {
                      examiner,
                      slotItemsByDate: slots,
                    },
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

                return throwError(() => new HttpErrorResponse(err));
              }),
            );
        }),
      );
  };

  journal$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.LoadJournalSilent),
    switchMap(
      () => this.callJournalProvider$(JournalRefreshModes.AUTOMATIC)
        .pipe(
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
      () => this.callJournalProvider$(JournalRefreshModes.MANUAL)
        .pipe(
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
        switchMap(() =>
          interval(this.appConfig.getAppConfig()?.journal.autoRefreshInterval || JournalEffects.interval),
        ),
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

  rehydrateJournal$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.RehydrateJournal),
    switchMap((action) => {
      //Get a list of every test slot that doesn't have a test status or has one that should be overwritten by rehydration
      let testsThatNeedRehydrated = action.testSlots
        .filter(value => (get(value, 'slotData.booking'))
          && (!(action.testsModel.testStatus[value.slotData.slotDetail.slotId]) ||
            !isAnyOf(action.testsModel.testStatus[value.slotData.slotDetail.slotId], [
              TestStatus.WriteUp,
              TestStatus.Autosaved,
              TestStatus.Completed,
              TestStatus.Submitted,
            ])
          ))
        .map(value => {
          //Return the slot ID and the application reference for the values in testSlots
          return ({
            slotId: value.slotData.slotDetail.slotId,
            appRef: formatApplicationReference(
              {
                applicationId: (value.slotData as TestSlot).booking.application.applicationId,
                bookingSequence: (value.slotData as TestSlot).booking.application.bookingSequence,
                checkDigit: (value.slotData as TestSlot).booking.application.checkDigit,
              },
            ),
          });
        });
      //If testsThatNeedRehydrated has items in it, we need to get the test result from the backend
      if (testsThatNeedRehydrated.length > 0) {
        let completedTestsWithAutoSaveAndID: TestResultSchemasUnionWithAutosaveAndSlotID[] = [];
        //Get the app refs that need rehydrated from the backend
        this.searchProvider
          .getTestResults(testsThatNeedRehydrated.map(value =>
            value.appRef.toString()), action.employeeId,
          )
          .pipe(
            map((response: HttpResponse<any>): string => response.body),
            //Decompress data
            map((data) => (this.compressionProvider.extract<RehydrationReturn[]>(data))),
            map((tests) => {
              tests.forEach((test) => {
                //Push the test details to the array, so it can be dispatched to the state
                completedTestsWithAutoSaveAndID.push({
                  autosave: !!test.autosave,
                  testData: test.test_result,
                  slotId: test.test_result.journalData.testSlotAttributes.slotId.toString(),
                });
              });
              return of();
            }),
            catchError(async (err) => {
              //Error handling
              this.store$.dispatch(SaveLog({
                payload: this.logHelper.createLog(
                  LogType.ERROR,
                  `Getting test results (${testsThatNeedRehydrated.map(value => value.appRef.toString())})`,
                  err,
                ),
              }));
              return of();
            }),
          ).subscribe(() => {
          if (completedTestsWithAutoSaveAndID.length > 0) {
            //Dispatch tests so they can be loaded into the local store
            this.store$.dispatch(LoadRemoteTests(completedTestsWithAutoSaveAndID));
          }
        });
      }
    }),
  ));

  loadCompletedTests$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.LoadCompletedTests),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(selectEmployeeId),
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
    filter(([action, , hasStarted, completedTests]) => {
      if (this.networkStateProvider.getNetworkState() === ConnectionStatus.OFFLINE) {
        this.store$.dispatch(LoadCompletedTestsSuccess(completedTests));
        return false;
      }
      if ((environment as unknown as TestersEnvironmentFile)?.isTest) return false;
      if (action.callThrough) return true;


      return !hasStarted && completedTests && completedTests.length === 0;
    }),
    switchMap(([, staffNumber]) => {
      const { numberOfDaysToView } = this.appConfig.getAppConfig().journal;

      const startDate = new DateTime()
        .subtract(numberOfDaysToView, Duration.DAY)
        .format('YYYY-MM-DD');

      const endDate = new DateTime()
        .format('YYYY-MM-DD');

      const advancedSearchParams: AdvancedSearchParams = {
        startDate,
        endDate,
        staffNumber: removeLeadingZeros(staffNumber),
        costCode: '',
        excludeAutoSavedTests: 'false',
        activityCode: '',
        category: '',
      };

      return this.searchProvider.advancedSearch(advancedSearchParams)
        .pipe(
          map((searchResults: SearchResultTestSchema[]) => searchResults),
          tap((searchResults) => this.completedTestPersistenceProvider.persistCompletedTests(searchResults)),
          map((searchResults: SearchResultTestSchema[]) => LoadCompletedTestsSuccess(searchResults)),
          catchError((err) => of(LoadCompletedTestsFailure(err))),
        );
    }),
  ));

  selectPreviousDayEffect$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.SelectPreviousDay),
    concatMap((action) => of(action)
      .pipe(
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
      const previousDay = DateTime.at(selectedDate)
        .add(-1, Duration.DAY)
        .format('YYYY-MM-DD');

      return [
        journalActions.SetSelectedDate(previousDay),
        journalActions.JournalNavigateDay(previousDay),
      ];
    }),
  ));

  selectNextDayEffect$ = createEffect(() => this.actions$.pipe(
    ofType(journalActions.SelectNextDay),
    concatMap((action) => of(action)
      .pipe(
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
      const nextDay = DateTime.at(selectedDate)
        .add(1, Duration.DAY)
        .format('YYYY-MM-DD');

      return [
        journalActions.SetSelectedDate(nextDay),
        journalActions.JournalNavigateDay(nextDay),
      ];
    }),
  ));

}
