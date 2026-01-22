import { TestBed } from '@angular/core/testing';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { Store, StoreModule } from '@ngrx/store';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { StoreModel } from '@shared/models/store.model';
import { LoadCompletedTestsSuccess } from '@store/journal/journal.actions';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { DataStoreProvider, LocalStorageKey } from '../../data-store/data-store';
import { CompletedTestPersistenceProvider } from '../completed-test-persistence';

describe('CompletedTestPersistenceProvider', () => {
  let completedTestPersistenceProvider: CompletedTestPersistenceProvider;
  let dataStoreProviderMock: DataStoreProvider;
  let store$: Store<StoreModel>;
  const completedTests = [
    { applicationReference: '1234' },
    { applicationReference: '567' },
  ] as SearchResultTestSchema[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompletedTestPersistenceProvider,
        {
          provide: DataStoreProvider,
          useClass: DataStoreProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
      ],
      imports: [
        StoreModule.forRoot({
          journal: () => null,
        }),
      ],
    });

    dataStoreProviderMock = TestBed.inject(DataStoreProvider);
    completedTestPersistenceProvider = TestBed.inject(CompletedTestPersistenceProvider);
    store$ = TestBed.inject(Store);
  });

  describe('persistCompletedTests', () => {
    it('should stringify and persist completed tests', async () => {
      await completedTestPersistenceProvider.persistCompletedTests(completedTests);
      const setItemSpy: jasmine.Spy = spyOn(dataStoreProviderMock, 'setItem');
      expect(dataStoreProviderMock.setItem).toHaveBeenCalledTimes(1);
      expect(setItemSpy.calls.first().args[0]).toBe('COMPLETED_TESTS');
      expect(JSON.parse(setItemSpy.calls.first().args[1])).toEqual(completedTests);
    });
  });

  describe('loadCompletedPersistedTests', () => {
    it('should get tests from storage and dispatch action', async () => {
      spyOn(dataStoreProviderMock, 'getItem').and.returnValue(Promise.resolve(JSON.stringify(completedTests)));
      spyOn(store$, 'dispatch');
      await completedTestPersistenceProvider.loadCompletedPersistedTests();
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
      expect(store$.dispatch).toHaveBeenCalledWith(LoadCompletedTestsSuccess(completedTests));
    });
  });

  describe('clearPersistedCompletedTests', () => {
    it('should clear persisted tests', async () => {
      spyOn(dataStoreProviderMock, 'getKeys').and.returnValue(Promise.resolve(['COMPLETED_TESTS']));
      await completedTestPersistenceProvider.clearPersistedCompletedTests();
      expect(dataStoreProviderMock.removeItem).toHaveBeenCalledWith('COMPLETED_TESTS' as LocalStorageKey);
    });
  });
});
