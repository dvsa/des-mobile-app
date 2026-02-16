import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DelegatedRekeySearchClearState } from '@pages/delegated-rekey-search/delegated-rekey-search.actions';
import { ResetRekeyReason } from '@pages/rekey-reason/rekey-reason.actions';
import { RekeySearchClearState } from '@pages/rekey-search/rekey-search.actions';
import { ResetFaultMode } from '@pages/test-report/test-report.actions';
import { AppConfig } from '@providers/app-config/app-config.model';
import { CompletedTestPersistenceProviderMock } from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRecordsProviderMock } from '@providers/examiner-records/__mocks__/examiner-records.mock';
import { ExaminerRecordsProvider } from '@providers/examiner-records/examiner-records';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { UnloadAppConfig } from '@store/app-config/app-config.actions';
import {
  LoadAppVersion,
  LoadEmployeeId,
  LoadEmployeeName,
  UnloadAppInfo,
  UpdateAuthResult,
} from '@store/app-info/app-info.actions';
import { selectEmployeeId } from '@store/app-info/app-info.selectors';
import { UnloadExaminerRecords } from '@store/examiner-records/examiner-records.actions';
import { UnloadJournal } from '@store/journal/journal.actions';
import { ClearLogs } from '@store/logs/logs.actions';
import { ClearTestCentresRefData } from '@store/reference-data/reference-data.actions';
import { ResetTestCentreJournal } from '@store/test-centre-journal/test-centre-journal.actions';
import { UnloadTests } from '@store/tests/tests.actions';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { DataStoreProvider, LocalStorageKey } from '../../data-store/data-store';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { TestPersistenceProviderMock } from '../../test-persistence/__mocks__/test-persistence.mock';
import { TestPersistenceProvider } from '../../test-persistence/test-persistence';
import { AuthResult, AuthenticationProvider } from '../authentication';

describe('AuthenticationProvider', () => {
  let authenticationProvider: AuthenticationProvider;
  let networkStateProvider: NetworkStateProvider;
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
        {
          provide: ExaminerRecordsProvider,
          useClass: ExaminerRecordsProviderMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    authenticationProvider = TestBed.inject(AuthenticationProvider);
    networkStateProvider = TestBed.inject(NetworkStateProvider);

    spyOn(authenticationProvider.store$, 'dispatch');
  });

  describe('Provider', () => {
    beforeEach(() => {
      spyOn(authenticationProvider, 'logEvent');
    });
    it('should compile', () => {
      expect(authenticationProvider).toBeDefined();
    });
  });

  describe('getEmployeeId', () => {
    it('should return the employee id from the store', () => {
      // Mock selectSignal to return a function that returns a test value
      const mockSelectSignal = jasmine.createSpy().and.returnValue(() => 'EMP123');
      authenticationProvider.store$.selectSignal = mockSelectSignal;

      const result = authenticationProvider.getEmployeeId();
      expect(result).toBe('EMP123');
      expect(mockSelectSignal).toHaveBeenCalledWith(selectEmployeeId);
    });
  });

  describe('getAuthenticationToken', () => {
    beforeEach(() => {
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'hasTokenExpired').and.returnValue(Promise.resolve(false));
      spyOn(authenticationProvider, 'login').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'isAuthenticated').and.returnValue(Promise.resolve(true));
      authenticationProvider.authResult = (() => ({ idToken: 'token123' })) as Signal<AuthResult>;
    });

    it('should return idToken if authenticated', async () => {
      const token = await authenticationProvider.getAuthenticationToken();
      expect(token).toBe('token123');
      expect(authenticationProvider.isAuthenticated).toHaveBeenCalled();
    });

    it('should return null if authResult throws', async () => {
      authenticationProvider.authResult = (() => {}) as Signal<AuthResult>;
      const token = await authenticationProvider.getAuthenticationToken();
      expect(token).toBeNull();
    });

    it('should return null if user is not authenticated', async () => {
      spyOn(authenticationProvider, 'isAuthenticated').and.returnValue(Promise.resolve(false));
      const token = await authenticationProvider.getAuthenticationToken();
      expect(token).toBeNull();
    });
  });

  describe('loadEmployeeDetails', () => {
    it('should dispatch both name and id if present, stripping any leading zeroes', async () => {
      spyOn(authenticationProvider.appConfig, 'getAppConfigAsync').and.resolveTo({
        authentication: { employeeNameKey: 'name', employeeIdKey: 'id' },
      } as AppConfig);

      spyOn(authenticationProvider, 'decodeToken').and.returnValue({ name: 'Alice', id: '0011' });

      await authenticationProvider.loadEmployeeDetails({ idToken: 'token' } as AuthResult);

      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(LoadEmployeeName('Alice'));
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(LoadEmployeeId({ employeeId: '11' }));
    });

    it('should not dispatch if idToken is missing', async () => {
      await authenticationProvider.loadEmployeeDetails({} as AuthResult);
      expect(authenticationProvider.store$.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('refreshEmployeeDetails', () => {
    it('should call loadEmployeeDetails() with the authResult', async () => {
      spyOn(authenticationProvider, 'loadEmployeeDetails');
      spyOn(authenticationProvider, 'getAuthResult').and.returnValue(Promise.resolve({} as AuthResult));

      await authenticationProvider.refreshEmployeeDetails();

      expect(authenticationProvider.loadEmployeeDetails).toHaveBeenCalledWith({} as unknown as AuthResult);
    });
  });

  describe('storeAuthResult', () => {
    it('should dispatch the updateAuthResult action, set the local storage & call loadEmployeeDetails with the authResult', async () => {
      spyOn(authenticationProvider, 'loadEmployeeDetails');
      spyOn(authenticationProvider.dataStoreProvider, 'setItem');
      const testAuth = authenticationProvider.authResult();

      await authenticationProvider.storeAuthResult(testAuth);

      expect(authenticationProvider.dataStoreProvider.setItem).toHaveBeenCalledWith(
        LocalStorageKey.AUTH_RESULT,
        JSON.stringify(testAuth)
      );
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(UpdateAuthResult(testAuth));
      expect(authenticationProvider.loadEmployeeDetails).toHaveBeenCalledWith(testAuth);
    });
  });

  describe('getStoredAuthResult', () => {
    it('should return parsed auth result when stored result exists and has provider', async () => {
      const mockAuthResult: AuthResult = {
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult;
      spyOn(authenticationProvider.dataStoreProvider, 'getItem').and.returnValue(
        Promise.resolve(JSON.stringify(mockAuthResult))
      );

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toEqual(mockAuthResult);
    });

    it('should return null when stored result does not exist', async () => {
      spyOn(authenticationProvider.dataStoreProvider, 'getItem').and.returnValue(Promise.resolve(null));

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toBeNull();
    });

    it('should return null when stored result exists but has no provider', async () => {
      const mockAuthResult = { idToken: 'token' };
      spyOn(authenticationProvider.dataStoreProvider, 'getItem').and.returnValue(
        Promise.resolve(JSON.stringify(mockAuthResult))
      );

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toBeNull();
    });

    it('should return null when stored result exists but is not an object', async () => {
      const mockAuthResult = 1;
      spyOn(authenticationProvider.dataStoreProvider, 'getItem').and.returnValue(
        Promise.resolve(JSON.stringify(mockAuthResult))
      );

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toBeNull();
    });

    it('should return null and log error when getItem throws', async () => {
      const error = new Error('getItem failed');
      spyOn(authenticationProvider.dataStoreProvider, 'getItem').and.throwError(error.message);
      spyOn(authenticationProvider, 'logEvent');

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toBeNull();
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(
        LogType.ERROR,
        'Authentication provider - Get stored result error',
        error
      );
    });
  });

  describe('login', () => {
    it('should set auth options if not initialised', async () => {
      authenticationProvider.authOptions = null;
      spyOn(authenticationProvider, 'pluginLogin').and.resolveTo({
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult);
      spyOn(authenticationProvider, 'storeAuthResult').and.resolveTo();
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'init');

      await authenticationProvider.login();

      expect(authenticationProvider.init).toHaveBeenCalled();
      expect(authenticationProvider.storeAuthResult).toHaveBeenCalled();
    });

    it('should not call setProviderOptions if providerOptions is already set', async () => {
      authenticationProvider.authOptions = { clientId: 'test' };
      spyOn(authenticationProvider, 'pluginLogin').and.resolveTo({
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult);
      spyOn(authenticationProvider, 'storeAuthResult').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'init');

      await authenticationProvider.login();

      expect(authenticationProvider.init).not.toHaveBeenCalled();
    });

    it('should call plugin login and storeAuthResult', async () => {
      authenticationProvider.authOptions = { clientId: 'test' };
      spyOn(authenticationProvider, 'pluginLogin').and.resolveTo({
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult);
      spyOn(authenticationProvider, 'storeAuthResult').and.returnValue(Promise.resolve());

      await authenticationProvider.login();

      expect(authenticationProvider.pluginLogin).toHaveBeenCalled();
      expect(authenticationProvider.storeAuthResult).toHaveBeenCalled();
    });

    it('should log and rethrow errors from AuthConnect.login', async () => {
      authenticationProvider.authOptions = { clientId: 'test' };
      const error = new Error('login failed');
      spyOn(authenticationProvider, 'pluginLogin').and.rejectWith(error);
      spyOn(authenticationProvider, 'storeAuthResult');
      spyOn(authenticationProvider, 'logEvent');

      await expectAsync(authenticationProvider.login()).toBeRejectedWith(error);
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(
        LogType.ERROR,
        'Authentication provider - Login error',
        error
      );
      expect(authenticationProvider.storeAuthResult).not.toHaveBeenCalled();
    });
  });

  describe('isOffline', () => {
    it('should return true if network state is offline', () => {
      spyOn(networkStateProvider, 'getNetworkState').and.returnValue(1);

      const result = authenticationProvider.isOffline();
      expect(result).toBe(true);
    });

    it('should return false if network state is online', () => {
      spyOn(networkStateProvider, 'getNetworkState').and.returnValue(0);

      const result = authenticationProvider.isOffline();
      expect(result).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    beforeEach(() => {
      spyOn(authenticationProvider, 'logEvent');
      spyOn(authenticationProvider, 'isOffline');
      spyOn(authenticationProvider, 'getAuthResult');
      spyOn(authenticationProvider, 'hasTokenExpired');
    });
    it('should return true when offline', async () => {
      spyOn(authenticationProvider, 'isOffline').and.returnValue(true);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(true);
      expect(authenticationProvider.getAuthResult).not.toHaveBeenCalled();
    });

    it('should return false when no auth result exists', async () => {
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'getAuthResult').and.resolveTo(null);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.hasTokenExpired).not.toHaveBeenCalled();
    });

    it('should return true when token is valid and not expired', async () => {
      const mockAuthResult = {} as AuthResult;
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'getAuthResult').and.resolveTo(mockAuthResult);
      spyOn(authenticationProvider, 'login').and.resolveTo();

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(true);
      expect(authenticationProvider.hasTokenExpired).toHaveBeenCalledWith(mockAuthResult);
      expect(authenticationProvider.login).not.toHaveBeenCalled();
    });

    it('should attempt token refresh when token is expired', async () => {
      const mockAuthResult = {} as AuthResult;
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'getAuthResult').and.resolveTo(mockAuthResult);
      spyOn(authenticationProvider, 'hasTokenExpired').and.resolveTo(true);
      spyOn(authenticationProvider, 'login').and.resolveTo();

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(true);
      expect(authenticationProvider.login).toHaveBeenCalled();
    });

    it('should catch errors from getAuthResult and return false', async () => {
      const testError = new Error('Auth result retrieval failed');
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'getAuthResult').and.rejectWith(testError);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.ERROR, 'isAuthenticated error', testError);
    });

    it('should catch errors from hasTokenExpired and return false', async () => {
      const mockAuthResult = {} as AuthResult;
      const testError = new Error('Token expiry check failed');

      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'getAuthResult').and.resolveTo(mockAuthResult);
      spyOn(authenticationProvider, 'hasTokenExpired').and.rejectWith(testError);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.ERROR, 'isAuthenticated error', testError);
    });

    it('should catch errors from refreshSession and return false', async () => {
      const testError = new Error('Token refresh failed');
      const mockAuthResult = {} as AuthResult;
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'getAuthResult').and.resolveTo(mockAuthResult);
      spyOn(authenticationProvider, 'hasTokenExpired').and.resolveTo(true);
      spyOn(authenticationProvider, 'login').and.rejectWith(testError);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.ERROR, 'isAuthenticated error', testError);
    });
  });

  describe('hasTokenExpired', () => {
    it('should return true if token is expired', async () => {
      const expiredExp = Math.floor(Date.now() / 1000) - 1000;
      spyOn(authenticationProvider, 'decodeToken').and.returnValue({ exp: expiredExp });
      const result = await authenticationProvider.hasTokenExpired({ idToken: 'expired' } as AuthResult);
      expect(result).toBe(true);
    });

    it('should return false if token is not expired', async () => {
      const futureExp = Math.floor(Date.now() / 1000) + 1000;
      spyOn(authenticationProvider, 'decodeToken').and.returnValue({ exp: futureExp });
      const result = await authenticationProvider.hasTokenExpired({ idToken: 'valid' } as AuthResult);
      expect(result).toBe(false);
    });

    it('should return false if exp is missing', async () => {
      spyOn(authenticationProvider, 'decodeToken').and.returnValue({});
      const result: boolean = await authenticationProvider.hasTokenExpired({ idToken: 'invalid' } as AuthResult);
      expect(result).toBe(false);
    });

    it('should return true if decodeToken returns null/undefined', async () => {
      spyOn(authenticationProvider, 'decodeToken').and.returnValue(undefined);
      const result = await authenticationProvider.hasTokenExpired({ idToken: 'bad' } as AuthResult);
      expect(result).toBe(true);
    });
  });

  describe('clearStore', () => {
    it('should dispatch all unload actions and clear persisted data', async () => {
      spyOn(authenticationProvider.store$, 'dispatch');
      spyOn(authenticationProvider.testPersistenceProvider, 'clearPersistedTests').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider.dataStoreProvider, 'removeItem').and.returnValue(Promise.resolve(''));
      spyOn(authenticationProvider.examinerRecordsProvider, 'clearExaminerRecordsCache').and.returnValue(
        Promise.resolve()
      );
      spyOn(authenticationProvider.completedTestPersistenceProvider, 'clearPersistedCompletedTests').and.returnValue(
        Promise.resolve()
      );

      await authenticationProvider.clearStore();

      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(UnloadJournal());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(UnloadTests());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(UnloadAppConfig());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(LoadAppVersion());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(RekeySearchClearState());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(DelegatedRekeySearchClearState());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(UnloadAppInfo());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(UnloadExaminerRecords());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(ClearTestCentresRefData());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(ResetTestCentreJournal());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(ResetRekeyReason());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(ResetFaultMode());
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(ClearLogs());

      expect(authenticationProvider.testPersistenceProvider.clearPersistedTests).toHaveBeenCalled();
      expect(authenticationProvider.dataStoreProvider.removeItem).toHaveBeenCalledWith(
        LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME
      );
      expect(authenticationProvider.dataStoreProvider.removeItem).toHaveBeenCalledWith(LocalStorageKey.CONFIG);
      expect(authenticationProvider.examinerRecordsProvider.clearExaminerRecordsCache).toHaveBeenCalled();
      expect(authenticationProvider.completedTestPersistenceProvider.clearPersistedCompletedTests).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      spyOn(authenticationProvider, 'logEvent');
      spyOn(authenticationProvider.appConfig, 'shutDownStoreSubscription');
      spyOn(authenticationProvider, 'getAuthResult').and.resolveTo({} as AuthResult);
      spyOn(authenticationProvider, 'clearStore').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'pluginLogout').and.returnValue(Promise.resolve());
      authenticationProvider.authResult = (() => {}) as Signal<AuthResult>;
    });

    it('should log start and finish, call logout, clearStore, and shutDownStoreSubscription', async () => {
      await authenticationProvider.logout();

      expect(authenticationProvider.pluginLogout).toHaveBeenCalled();

      expect(authenticationProvider.clearStore).toHaveBeenCalled();
      expect(authenticationProvider.appConfig.shutDownStoreSubscription).toHaveBeenCalled();
    });

    it('should log error if AuthConnect.logout throws, then call clearStore and shutDownStoreSubscription', async () => {
      const error = new Error('logout failed');
      (authenticationProvider.pluginLogout as jasmine.Spy).and.rejectWith(error);

      await authenticationProvider.logout();

      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(
        LogType.ERROR,
        'Authentication provider - Logout error',
        error
      );
      expect(authenticationProvider.clearStore).toHaveBeenCalled();
      expect(authenticationProvider.appConfig.shutDownStoreSubscription).toHaveBeenCalled();
    });
  });
});
