import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { StoreModel } from '@shared/models/store.model';

@Injectable()
export class AppConfigEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appInfoProvider: AppInfoProvider
  ) {}
}
