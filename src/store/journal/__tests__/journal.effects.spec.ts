import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';

import { journalReducer } from '../journal.reducer';
import * as journalActions from '../journal.actions';
import { JournalEffects } from '../journal.effects';
import { JournalProvider } from '../../../app/providers/journal/journal';
import { SlotProvider } from '../../../app/providers/slot/slot';
// import { JournalModel } from '../journal.model';
import { NetworkStateProvider } from '../../../app/providers/network-state/network-state';
import { AppConfigProvider } from '../../../app/providers/app-config/app-config';
import { JournalProviderMock } from '../../../app/providers/journal/__mocks__/journal.mock';
import { AppConfigProviderMock } from '../../../app/providers/app-config/__mocks__/app-config.mock';
import { NetworkStateProviderMock } from '../../../app/providers/network-state/__mocks__/network-state.mock';
import { DataStoreProviderMock } from '../../../app/providers/data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '../../../app/providers/data-store/data-store';
import { AuthenticationProvider } from '../../../app/providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../../app/providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '../../../app/providers/date-time/date-time';
import { DateTimeProviderMock } from '../../../app/providers/date-time/__mocks__/date-time.mock';
import { LogHelperMock } from '../../../app/providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '../../../app/providers/logs/logs-helper';

fdescribe('Journal Effects', () => {

  let effects: JournalEffects;
  let actions$: any;
  let journalProvider: JournalProvider;
  let slotProvider: SlotProvider;
  // let store$: Store<JournalModel>;
  // let networkStateProvider: NetworkStateProvider;
  // let appConfigProvider: AppConfigProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          journal: journalReducer,
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        JournalEffects,
        provideMockActions(() => actions$),
        { provide: JournalProvider, useClass: JournalProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        // { provide: SearchProvider, useClass: SearchProviderMock },
        Store,
        SlotProvider,
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });
  });

  beforeEach(() => {
    // ARRANGE
    actions$ = new ReplaySubject(1);
    journalProvider = TestBed.inject(JournalProvider);
    effects = TestBed.inject(JournalEffects);
    slotProvider = TestBed.inject(SlotProvider);
    // store$ = TestBed.get(Store);
    // networkStateProvider = TestBed.get(NetworkStateProvider);
    // appConfigProvider = TestBed.get(AppConfigProvider);
  });

  it('should dispatch the success action when the journal loads successfully', (done) => {
    // ARRANGE
    spyOn(journalProvider, 'getJournal').and.callThrough();
    spyOn(journalProvider, 'saveJournalForOffline').and.callThrough();
    spyOn(slotProvider, 'detectSlotChanges').and.callThrough();
    spyOn(slotProvider, 'extendWithEmptyDays').and.callThrough();
    spyOn(slotProvider, 'getRelevantSlots').and.callThrough();
    // ACT
    actions$.next(journalActions.LoadJournal());
    // ASSERT
    effects.loadJournal$.subscribe((result) => {
      expect(journalProvider.getJournal).toHaveBeenCalled();
      // expect(journalProvider.saveJournalForOffline).toHaveBeenCalled();
      expect(slotProvider.detectSlotChanges).toHaveBeenCalledWith({}, JournalProviderMock.mockJournal);
      expect(slotProvider.extendWithEmptyDays).toHaveBeenCalled();
      expect(slotProvider.getRelevantSlots).toHaveBeenCalled();
      expect(result.type === '[JournalPage] Load Journal Success').toBe(true);
      done();
    });

  });

});
