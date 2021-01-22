import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as journalActions from './journal.actions';
import * as logsActions from '../logs/logs.actions';
import { AuthenticationProvider } from '../../app/providers/authentication/authentication';
import { Log, LogType } from '../../app/shared/models/log.model';

@Injectable()
export class JournalLogsEffects {

  constructor(
    private actions$: Actions,
    private authenticationProvider: AuthenticationProvider,
  ) { }

  @Effect()
  loadJournalFailureLogEffect$ = this.actions$.pipe(
    ofType(journalActions.LOAD_JOURNAL_FAILURE),
    switchMap((action: journalActions.LoadJournalFailure) => {
      const log: Log = this.createLog(LogType.ERROR, action.type);
      return of(logsActions.SaveLog({ payload: log }));
    }),
  );

  @Effect()
  loadJournalSilentFailureLogEffect$ = this.actions$.pipe(
    ofType(journalActions.LOAD_JOURNAL_SILENT_FAILURE),
    switchMap((action: journalActions.LoadJournalSilentFailure) => {
      const log: Log = this.createLog(LogType.WARNING, action.type);
      return of(logsActions.SaveLog({ payload: log }));
    }),
  );

  private createLog(logType: LogType, actionType: string): Log {
    const employeeId: string = this.authenticationProvider.getEmployeeId();
    return {
      type: logType,
      message: `DE with id: ${employeeId} - ${actionType}`,
      timestamp: Date.now(),
      drivingExaminerId: employeeId,
    };
  }

}
