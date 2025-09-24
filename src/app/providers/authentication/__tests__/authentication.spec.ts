import { TestBed } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { CompletedTestPersistenceProviderMock } from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRecordsProviderMock } from '@providers/examiner-records/__mocks__/examiner-records.mock';
import { ExaminerRecordsProvider } from '@providers/examiner-records/examiner-records';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { StoreModel } from '@shared/models/store.model';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { TestPersistenceProviderMock } from '../../test-persistence/__mocks__/test-persistence.mock';
import { TestPersistenceProvider } from '../../test-persistence/test-persistence';
import { AuthenticationProvider } from '../authentication';

describe('AuthenticationProvider', () => {
  let authenticationProvider: AuthenticationProvider;
  let networkStateProvider: NetworkStateProvider;
  let dataStoreProvider: DataStoreProvider;
  const initialState = { appInfo: { employeeId: '1234567' } } as StoreModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationProvider,
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: DataStoreProvider,
          useClass: DataStoreProviderMock,
        },
        {
          provide: TestPersistenceProvider,
          useClass: TestPersistenceProviderMock,
        },
        {
          provide: CompletedTestPersistenceProvider,
          useClass: CompletedTestPersistenceProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: ExaminerRecordsProvider,
          useClass: ExaminerRecordsProviderMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    networkStateProvider = TestBed.inject(NetworkStateProvider);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    dataStoreProvider = TestBed.inject(DataStoreProvider);
  });

  describe('Provider', () => {
    beforeEach(() => {
      spyOn(authenticationProvider, 'logEvent');
    });
    it('should compile', () => {
      expect(authenticationProvider).toBeDefined();
    });
  });
});
