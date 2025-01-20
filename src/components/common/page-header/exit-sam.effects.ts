import { Injectable } from '@angular/core';
import { ExitSamError } from '@components/common/page-header/exit-sam.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { of, switchMap } from 'rxjs';

@Injectable()
export class ExitSingleAppModeEffects {
  constructor(
    private actions$: Actions,
    public store$: Store<StoreModel>,
    public logHelper: LogHelper
  ) {}

  exitSamError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExitSamError),
      switchMap((action) => {
        console.log('ExitSamError action', action);
        return of(
          SaveLog({
            payload: this.logHelper.createLog(LogType.ERROR, 'ExitSamError', action),
          })
        );
      })
    )
  );
}
