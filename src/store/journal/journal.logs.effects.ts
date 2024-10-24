import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Log, LogType } from '@shared/models/log.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as logsActions from '../logs/logs.actions';
import * as journalActions from './journal.actions';

@Injectable()
export class JournalLogsEffects {
  constructor(
    private actions$: Actions,
    private authenticationProvider: AuthenticationProvider
  ) {}

  loadJournalFailureLogEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(journalActions.LoadJournalFailure),
      switchMap((action) => {
        const log: Log = this.createLog(LogType.ERROR, action.type);
        return of(logsActions.SaveLog({ payload: log }));
      })
    )
  );

  loadJournalSilentFailureLogEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(journalActions.LoadJournalSilentFailure),
      switchMap((action) => {
        const log: Log = this.createLog(LogType.WARNING, action.type);
        return of(logsActions.SaveLog({ payload: log }));
      })
    )
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
