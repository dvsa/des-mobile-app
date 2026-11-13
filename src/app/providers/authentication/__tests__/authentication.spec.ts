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
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { unitTestErrorCause } from '../../../../test-setup.vitest';
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

    vi.spyOn(authenticationProvider.store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('Provider', () => {
    beforeEach(() => {
      vi.spyOn(authenticationProvider, 'logEvent').mockReturnValue(undefined);
    });
    it('should compile', () => {
      expect(authenticationProvider).toBeDefined();
    });
  });

  describe('getEmployeeId', () => {
    it('should return the employee id from the store', () => {
      // Mock selectSignal to return a function that returns a test value
      const mockSelectSignal = vi.fn().mockReturnValue(() => 'EMP123');
      authenticationProvider.store$.selectSignal = mockSelectSignal;

      const result = authenticationProvider.getEmployeeId();
      expect(result).toBe('EMP123');
      expect(mockSelectSignal).toHaveBeenCalledWith(selectEmployeeId);
    });
  });

  describe('getAuthenticationToken', () => {
    beforeEach(() => {
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'hasTokenExpired').mockReturnValue(Promise.resolve(false));
      vi.spyOn(authenticationProvider, 'login').mockReturnValue(Promise.resolve());
      vi.spyOn(authenticationProvider, 'isAuthenticated').mockReturnValue(Promise.resolve(true));
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
      vi.spyOn(authenticationProvider, 'isAuthenticated').mockReturnValue(Promise.resolve(false));
      const token = await authenticationProvider.getAuthenticationToken();
      expect(token).toBeNull();
    });
  });

  describe('loadEmployeeDetails', () => {
    it('should dispatch both name and id if present, stripping any leading zeroes', async () => {
      vi.spyOn(authenticationProvider.appConfig, 'getAppConfigAsync').mockResolvedValue({
        authentication: { employeeNameKey: 'name', employeeIdKey: 'id' },
      } as AppConfig);

      vi.spyOn(authenticationProvider, 'decodeToken').mockReturnValue({ name: 'Alice', id: '0011' });

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
      vi.spyOn(authenticationProvider, 'loadEmployeeDetails').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockReturnValue(Promise.resolve({} as AuthResult));

      await authenticationProvider.refreshEmployeeDetails();

      expect(authenticationProvider.loadEmployeeDetails).toHaveBeenCalledWith({} as unknown as AuthResult);
    });
  });

  describe('storeAuthResult', () => {
    it('should dispatch the updateAuthResult action, set the local storage & call loadEmployeeDetails with the authResult', async () => {
      vi.spyOn(authenticationProvider, 'loadEmployeeDetails').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider.dataStoreProvider, 'setItem');

      const testAuth = { idToken: 'token123' } as AuthResult;

      await authenticationProvider.storeAuthResult(testAuth);

      expect(authenticationProvider.dataStoreProvider.setItem).toHaveBeenCalledWith(
        LocalStorageKey.AUTH_RESULT,
        JSON.stringify(testAuth)
      );
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(UpdateAuthResult(testAuth));
      expect(authenticationProvider.loadEmployeeDetails).toHaveBeenCalledWith(testAuth);
    });
    it('should remove the authResult from the storage if there is no value', async () => {
      vi.spyOn(authenticationProvider, 'loadEmployeeDetails').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider.dataStoreProvider, 'setItem');

      const testAuth = null;

      await authenticationProvider.storeAuthResult(testAuth);

      expect(authenticationProvider.dataStoreProvider.removeItem).toHaveBeenCalledWith(LocalStorageKey.AUTH_RESULT);
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(UpdateAuthResult(testAuth));
      expect(authenticationProvider.loadEmployeeDetails).toHaveBeenCalledWith(testAuth);
    });
  });

  describe('isTokenFromMSAuth', () => {
    it('should return true if the test Auth has the isMSAuth flag', () => {
      let testAuth = authenticationProvider.authResult();
      testAuth = {
        ...testAuth,
        isMSAuth: true,
      };

      expect(authenticationProvider.isTokenFromMSAuth(testAuth)).toEqual(true);
    });
    it('should return false if the test Auth does not have the isMSAuth flag', () => {
      let testAuth = authenticationProvider.authResult();
      testAuth = {
        ...testAuth,
        isMSAuth: false,
      };

      expect(authenticationProvider.isTokenFromMSAuth(testAuth)).toEqual(false);
    });
    it('should return false if the test Auth does not have the isMSAuth property', () => {
      const testAuth = authenticationProvider.authResult();

      expect(authenticationProvider.isTokenFromMSAuth(testAuth)).toEqual(false);
    });
  });

  describe('getStoredAuthResult', () => {
    it('should return parsed auth result when stored result exists and has provider', async () => {
      const mockAuthResult: AuthResult = {
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult;
      vi.spyOn(authenticationProvider.dataStoreProvider, 'getItem').mockReturnValue(
        Promise.resolve(JSON.stringify(mockAuthResult))
      );

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toEqual(mockAuthResult);
    });

    it('should return null when stored result does not exist', async () => {
      vi.spyOn(authenticationProvider.dataStoreProvider, 'getItem').mockReturnValue(Promise.resolve(null));

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toBeNull();
    });

    it('should return null when stored result exists but has no provider', async () => {
      const mockAuthResult = { idToken: 'token' };
      vi.spyOn(authenticationProvider.dataStoreProvider, 'getItem').mockReturnValue(
        Promise.resolve(JSON.stringify(mockAuthResult))
      );

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toBeNull();
    });

    it('should return null when stored result exists but is not an object', async () => {
      const mockAuthResult = 1;
      vi.spyOn(authenticationProvider.dataStoreProvider, 'getItem').mockReturnValue(
        Promise.resolve(JSON.stringify(mockAuthResult))
      );

      const result = await authenticationProvider.getStoredAuthResult();

      expect(result).toBeNull();
    });

    it('should return null and log error when getItem throws', async () => {
      const error = new Error('getItem failed', { cause: unitTestErrorCause });
      vi.spyOn(authenticationProvider.dataStoreProvider, 'getItem').mockImplementation(() => {
        throw new Error(error.message, { cause: unitTestErrorCause });
      });
      vi.spyOn(authenticationProvider, 'logEvent').mockReturnValue(undefined);

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
      vi.spyOn(authenticationProvider, 'pluginLogin').mockResolvedValue({
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult);
      vi.spyOn(authenticationProvider, 'storeAuthResult').mockResolvedValue(undefined);
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'init').mockReturnValue(undefined);

      await authenticationProvider.login();

      expect(authenticationProvider.init).toHaveBeenCalled();
      expect(authenticationProvider.storeAuthResult).toHaveBeenCalled();
    });

    it('should not call setProviderOptions if providerOptions is already set', async () => {
      authenticationProvider.authOptions = { clientId: 'test' };
      vi.spyOn(authenticationProvider, 'pluginLogin').mockResolvedValue({
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult);
      vi.spyOn(authenticationProvider, 'storeAuthResult').mockReturnValue(Promise.resolve());
      vi.spyOn(authenticationProvider, 'init').mockReturnValue(undefined);

      await authenticationProvider.login();

      expect(authenticationProvider.init).not.toHaveBeenCalled();
    });

    it('should call plugin login and storeAuthResult', async () => {
      authenticationProvider.authOptions = { clientId: 'test' };
      vi.spyOn(authenticationProvider, 'pluginLogin').mockResolvedValue({
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult);
      vi.spyOn(authenticationProvider, 'storeAuthResult').mockReturnValue(Promise.resolve());

      await authenticationProvider.login();

      expect(authenticationProvider.pluginLogin).toHaveBeenCalled();
      expect(authenticationProvider.storeAuthResult).toHaveBeenCalled();
    });

    it('should log and rethrow errors from AuthConnect.login', async () => {
      authenticationProvider.authOptions = { clientId: 'test' };
      const error = new Error('login failed', { cause: unitTestErrorCause });
      vi.spyOn(authenticationProvider, 'pluginLogin').mockRejectedValue(error);
      vi.spyOn(authenticationProvider, 'storeAuthResult').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider, 'logEvent').mockReturnValue(undefined);

      await expect(authenticationProvider.login()).rejects.toEqual(error);
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(
        LogType.ERROR,
        'Authentication provider - Login error',
        error
      );
      expect(authenticationProvider.storeAuthResult).not.toHaveBeenCalled();
    });

    it('should pass forceTokenRefresh parameter to pluginLogin when provided', async () => {
      authenticationProvider.authOptions = { clientId: 'test' };
      vi.spyOn(authenticationProvider, 'pluginLogin').mockResolvedValue({
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult);
      vi.spyOn(authenticationProvider, 'storeAuthResult').mockReturnValue(Promise.resolve());

      await authenticationProvider.login(true);

      expect(authenticationProvider.pluginLogin).toHaveBeenCalledWith(true);
      expect(authenticationProvider.storeAuthResult).toHaveBeenCalled();
    });

    it('should pass undefined to pluginLogin when forceTokenRefresh is not provided', async () => {
      authenticationProvider.authOptions = { clientId: 'test' };
      vi.spyOn(authenticationProvider, 'pluginLogin').mockResolvedValue({
        idToken: 'token',
        accessToken: 'token123',
        scopes: ['email'],
      } as AuthResult);
      vi.spyOn(authenticationProvider, 'storeAuthResult').mockReturnValue(Promise.resolve());

      await authenticationProvider.login();

      expect(authenticationProvider.pluginLogin).toHaveBeenCalledWith(undefined);
      expect(authenticationProvider.storeAuthResult).toHaveBeenCalled();
    });
  });

  describe('isOffline', () => {
    it('should return true if network state is offline', () => {
      vi.spyOn(networkStateProvider, 'getNetworkState').mockReturnValue(1);

      const result = authenticationProvider.isOffline();
      expect(result).toBe(true);
    });

    it('should return false if network state is online', () => {
      vi.spyOn(networkStateProvider, 'getNetworkState').mockReturnValue(0);

      const result = authenticationProvider.isOffline();
      expect(result).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    beforeEach(() => {
      vi.spyOn(authenticationProvider, 'logEvent').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider, 'hasTokenExpired').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider, 'isTokenFromMSAuth').mockReturnValue(undefined);
    });
    it('should return true when offline', async () => {
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(true);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(true);
      expect(authenticationProvider.getAuthResult).not.toHaveBeenCalled();
    });

    it('should return false when no auth result exists', async () => {
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockResolvedValue(null);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.hasTokenExpired).not.toHaveBeenCalled();
    });

    it('should return true when token is valid, not expired and has MSAuth flag', async () => {
      const mockAuthResult = {} as AuthResult;
      vi.spyOn(authenticationProvider, 'isTokenFromMSAuth').mockReturnValue(true);
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockResolvedValue(mockAuthResult);
      vi.spyOn(authenticationProvider, 'login').mockResolvedValue(undefined);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(true);
      expect(authenticationProvider.hasTokenExpired).toHaveBeenCalledWith(mockAuthResult);
      expect(authenticationProvider.login).not.toHaveBeenCalled();
    });

    it('should return false when token is valid, but has no MSAuth flag', async () => {
      const mockAuthResult = {} as AuthResult;
      vi.spyOn(authenticationProvider, 'isTokenFromMSAuth').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockResolvedValue(mockAuthResult);
      vi.spyOn(authenticationProvider, 'login').mockResolvedValue(undefined);
      vi.spyOn(authenticationProvider, 'storeAuthResult').mockReturnValue(undefined);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.storeAuthResult).toHaveBeenCalled();
      expect(authenticationProvider.login).not.toHaveBeenCalled();
    });

    it('should attempt token refresh when token is expired', async () => {
      const mockAuthResult = {} as AuthResult;
      vi.spyOn(authenticationProvider, 'isTokenFromMSAuth').mockReturnValue(true);
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockResolvedValue(mockAuthResult);
      vi.spyOn(authenticationProvider, 'hasTokenExpired').mockResolvedValue(true);
      vi.spyOn(authenticationProvider, 'login').mockResolvedValue(undefined);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(true);
      expect(authenticationProvider.login).toHaveBeenCalledWith(true);
    });

    it('should catch errors from getAuthResult and return false', async () => {
      const testError = new Error('Auth result retrieval failed', { cause: unitTestErrorCause });
      vi.spyOn(authenticationProvider, 'isTokenFromMSAuth').mockReturnValue(true);
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockRejectedValue(testError);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.ERROR, 'isAuthenticated error', testError);
    });

    it('should catch errors from hasTokenExpired and return false', async () => {
      const mockAuthResult = {} as AuthResult;
      const testError = new Error('Token expiry check failed', { cause: unitTestErrorCause });

      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockResolvedValue(mockAuthResult);
      vi.spyOn(authenticationProvider, 'isTokenFromMSAuth').mockReturnValue(true);
      vi.spyOn(authenticationProvider, 'hasTokenExpired').mockRejectedValue(testError);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.ERROR, 'isAuthenticated error', testError);
    });

    it('should catch errors from refreshSession and return false', async () => {
      const testError = new Error('Token refresh failed', { cause: unitTestErrorCause });
      const mockAuthResult = {} as AuthResult;
      vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);
      vi.spyOn(authenticationProvider, 'getAuthResult').mockResolvedValue(mockAuthResult);
      vi.spyOn(authenticationProvider, 'hasTokenExpired').mockResolvedValue(true);
      vi.spyOn(authenticationProvider, 'isTokenFromMSAuth').mockReturnValue(true);
      vi.spyOn(authenticationProvider, 'login').mockRejectedValue(testError);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.ERROR, 'isAuthenticated error', testError);
    });
  });

  describe('hasTokenExpired', () => {
    it('should return true if token is expired', async () => {
      const expiredExp = Math.floor(Date.now() / 1000) - 1000;
      vi.spyOn(authenticationProvider, 'decodeToken').mockReturnValue({ exp: expiredExp });
      const result = await authenticationProvider.hasTokenExpired({ idToken: 'expired' } as AuthResult);
      expect(result).toBe(true);
    });

    it('should return false if token is not expired', async () => {
      const futureExp = Math.floor(Date.now() / 1000) + 1000;
      vi.spyOn(authenticationProvider, 'decodeToken').mockReturnValue({ exp: futureExp });
      const result = await authenticationProvider.hasTokenExpired({ idToken: 'valid' } as AuthResult);
      expect(result).toBe(false);
    });

    it('should return false if exp is missing', async () => {
      vi.spyOn(authenticationProvider, 'decodeToken').mockReturnValue({});
      const result: boolean = await authenticationProvider.hasTokenExpired({ idToken: 'invalid' } as AuthResult);
      expect(result).toBe(false);
    });

    it('should return true if decodeToken returns null/undefined', async () => {
      vi.spyOn(authenticationProvider, 'decodeToken').mockReturnValue(undefined);
      const result = await authenticationProvider.hasTokenExpired({ idToken: 'bad' } as AuthResult);
      expect(result).toBe(true);
    });
  });

  describe('clearStore', () => {
    it('should dispatch all unload actions and clear persisted data', async () => {
      vi.spyOn(authenticationProvider.store$, 'dispatch').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider.testPersistenceProvider, 'clearPersistedTests').mockReturnValue(
        Promise.resolve()
      );
      vi.spyOn(authenticationProvider.dataStoreProvider, 'removeItem').mockReturnValue(Promise.resolve(''));
      vi.spyOn(authenticationProvider.examinerRecordsProvider, 'clearExaminerRecordsCache').mockReturnValue(
        Promise.resolve()
      );
      vi.spyOn(authenticationProvider.completedTestPersistenceProvider, 'clearPersistedCompletedTests').mockReturnValue(
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
      vi.spyOn(authenticationProvider, 'logEvent').mockReturnValue(undefined);
      vi.spyOn(authenticationProvider.appConfig, 'shutDownStoreSubscription');
      vi.spyOn(authenticationProvider, 'getAuthResult').mockResolvedValue({} as AuthResult);
      vi.spyOn(authenticationProvider, 'clearStore').mockReturnValue(Promise.resolve());
      vi.spyOn(authenticationProvider, 'pluginLogout').mockReturnValue(Promise.resolve());
      authenticationProvider.authResult = (() => {}) as Signal<AuthResult>;
    });

    it('should log start and finish, call logout, clearStore, and shutDownStoreSubscription', async () => {
      await authenticationProvider.logout();

      expect(authenticationProvider.pluginLogout).toHaveBeenCalled();

      expect(authenticationProvider.clearStore).toHaveBeenCalled();
      expect(authenticationProvider.appConfig.shutDownStoreSubscription).toHaveBeenCalled();
    });

    it('should log error if AuthConnect.logout throws, then call clearStore and shutDownStoreSubscription', async () => {
      const error = new Error('logout failed', { cause: unitTestErrorCause });
      (authenticationProvider.pluginLogout as Mock).mockRejectedValue(error);

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
