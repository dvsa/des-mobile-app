import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { StoreModel } from '@shared/models/store.model';

@Injectable()
export class TestCentreJournalEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {}

}
