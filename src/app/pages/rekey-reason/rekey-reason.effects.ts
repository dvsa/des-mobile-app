import { Injectable } from '@angular/core';
import {
  Effect, Actions, ofType, createEffect,
} from '@ngrx/effects';
import {
  catchError, concatMap, withLatestFrom, switchMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { FindUserProvider } from '@providers/find-user/find-user';
import { HttpErrorResponse } from '@angular/common/http';
import * as testActions from '@store/tests/tests.actions';
import { select, Store } from '@ngrx/store';
import { getCurrentTest } from '@store/tests/tests.selector';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import * as rekeyActions from './rekey-reason.actions';

@Injectable()
export class RekeyReasonEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private findUserProvider: FindUserProvider,
  ) { }

  rekeyReasonValidateTransferEffect$ = createEffect(() => this.actions$.pipe(
    ofType(rekeyActions.ValidateTransferRekey),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
        ),
      ),
    )),
    switchMap(([, test]: [ReturnType<typeof rekeyActions.ValidateTransferRekey>, TestResultCommonSchema]) => {
      if (test.examinerBooked === test.examinerConducted) {
        return of(testActions.SendCurrentTest());
      }

      return this.findUserProvider
        .userExists(test.examinerConducted)
        .pipe(
          switchMap(() => of(testActions.SendCurrentTest())),
          catchError((error: HttpErrorResponse) =>
            of(rekeyActions.ValidateTransferRekeyFailed(error.status === HttpStatusCodes.NOT_FOUND))),
        );
    }),
  ));
}
