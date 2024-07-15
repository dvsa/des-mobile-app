import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { SearchProvider } from '@providers/search/search';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';

@Injectable()
export class UnuploadedTestsEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    public networkStateProvider: NetworkStateProvider,
    public searchProvider: SearchProvider,
    public appConfigProvider: AppConfigProvider,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private dateTimeProvider: DateTimeProvider,
    private slotProvider: SlotProvider,
  ) {
  }
}
