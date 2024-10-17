import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { FindUserProvider } from '@providers/find-user/find-user';
import { StoreModel } from '@shared/models/store.model';
import * as testActions from '@store/tests/tests.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import * as rekeyActions from './rekey-reason.actions';

@Injectable()
export class RekeyReasonEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private findUserProvider: FindUserProvider
  ) {}

  rekeyReasonValidateTransferEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rekeyActions.ValidateTransferRekey),
      concatMap((action) =>
        of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests), select(getCurrentTest))))
      ),
      switchMap(([, test]: [ReturnType<typeof rekeyActions.ValidateTransferRekey>, TestResultCommonSchema]) => {
        if (test.examinerBooked === test.examinerConducted) {
          return of(testActions.SendCurrentTest());
        }

        return this.findUserProvider.userExists(test.examinerConducted).pipe(
          switchMap((response: HttpResponse<any>) => {
            if (response.status === HttpStatusCode.NoContent) {
              // user does not exist
              return of(rekeyActions.ValidateTransferRekeyFailed(true));
            }
            // user exists
            return of(testActions.SendCurrentTest());
          }),
          catchError(() => of(rekeyActions.ValidateTransferRekeyFailed(true)))
        );
      })
    )
  );
}
