import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { configureTestSuite } from 'ng-bullet';
import { LoadCompletedTestsSuccess } from '@store/journal/journal.actions';
import { DataStoreProvider } from '../../data-store/data-store';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { CompletedTestPersistenceProvider } from '../completed-test-persistence';
import { StoreModel } from '../../../shared/models/store.model';

describe('TestPersistenceProvider', () => {
  let completedTestPersistenceProvider: CompletedTestPersistenceProvider;
  let dataStoreProvider;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        CompletedTestPersistenceProvider,
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
      ],
      imports: [
        StoreModule.forRoot({
          journal: () => null,
        }),
      ],
    });
  });

  const completedTests = [
    { applicationReference: 1234 },
    { applicationReference: 567 },
  ] as SearchResultTestSchema[];

  beforeEach(() => {
    dataStoreProvider = TestBed.inject(DataStoreProvider);
    completedTestPersistenceProvider = TestBed.inject(CompletedTestPersistenceProvider);
    store$ = TestBed.inject(Store);
  });

  describe('persistCompletedTests', () => {
    it('should stringify and persist completed tests', async () => {
      await completedTestPersistenceProvider.persistCompletedTests(completedTests);

      expect(dataStoreProvider.setItem).toHaveBeenCalledTimes(1);
      expect(dataStoreProvider.setItem.calls.first().args[0]).toBe('COMPLETED_TESTS');
      expect(JSON.parse(dataStoreProvider.setItem.calls.first().args[1])).toEqual(completedTests);
    });
  });

  describe('loadCompletedPersistedTests', () => {
    it('should get tests from storage and dispatch action', async () => {
      spyOn(dataStoreProvider, 'getItem').and.returnValue(Promise.resolve(JSON.stringify(completedTests)));
      spyOn(store$, 'dispatch');
      await completedTestPersistenceProvider.loadCompletedPersistedTests();
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
      expect(store$.dispatch).toHaveBeenCalledWith(LoadCompletedTestsSuccess(completedTests));
    });
  });

  describe('clearPersistedCompletedTests', () => {
    it('should clear persisted tests', async () => {
      spyOn(dataStoreProvider, 'getKeys').and.returnValue(Promise.resolve(['COMPLETED_TESTS']));
      await completedTestPersistenceProvider.clearPersistedCompletedTests();
      expect(dataStoreProvider.removeItem).toHaveBeenCalledWith('COMPLETED_TESTS');
    });
  });

});
