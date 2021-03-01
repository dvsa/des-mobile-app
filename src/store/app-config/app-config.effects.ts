import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { StoreModel } from '../../app/shared/models/store.model';
import { AppInfoProvider } from '../../app/providers/app-info/app-info';

@Injectable()
export class AppConfigEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appInfoProvider: AppInfoProvider,
  ) {}

}
