import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import * as communicationActions from './communication.actions';

@Injectable()
export class CommunicationEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>
  ) {}

  communicationSubmitInfoEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(communicationActions.CommunicationSubmitInfo),
      switchMap(() => {
        return [testsActions.PersistTests()];
      })
    )
  );
}
