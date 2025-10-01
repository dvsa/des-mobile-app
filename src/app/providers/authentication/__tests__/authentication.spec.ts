import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Capacitor } from '@capacitor/core';
import { AuthConnect, AuthResult, Provider, ProviderOptions } from '@ionic-enterprise/auth';
import { AuthConnectConfig } from '@ionic-enterprise/auth/dist/esm/definitions';
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
import { AuthenticationProvider } from '../authentication';

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

  describe('getAppConfigData', () => {
    it('should set providerOptions with native URLs when running on native platform', async () => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);

      await authenticationProvider.setProviderOptions();

      expect(authenticationProvider.providerOptions).toEqual({
        audience: '',
        clientId: 'local-authentication-client-id',
        discoveryUrl:
          'local-authentication-context/v2.0/.well-known/openid-configuration?appid=local-authentication-client-id',
        logoutUrl: 'local-logout-url',
        redirectUri: 'local-authentication-redirect-url',
        scope: 'openid offline_access profile email',
      });
    });

    it('should set providerOptions with web URLs when running on web platform', async () => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);

      await authenticationProvider.setProviderOptions();

      expect(authenticationProvider.providerOptions).toEqual({
        audience: '',
        clientId: 'local-authentication-client-id',
        discoveryUrl:
          'local-authentication-context/v2.0/.well-known/openid-configuration?appid=local-authentication-client-id',
        logoutUrl: 'http://localhost:8100',
        redirectUri: 'http://localhost:8100',
        scope: 'openid offline_access profile email',
      });
    });

    it('should not set providerOptions if authSettings is missing', async () => {
      expect(authenticationProvider.providerOptions).toBeUndefined();
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
      spyOn(authenticationProvider, 'refreshSession').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'isAuthenticated').and.returnValue(Promise.resolve(true));
      authenticationProvider.authResult = (() => ({ idToken: 'token123' })) as Signal<AuthResult>;
    });

    it('should return idToken if not expired and authenticated', async () => {
      const token = await authenticationProvider.getAuthenticationToken();
      expect(token).toBe('token123');
      expect(authenticationProvider.isAuthenticated).toHaveBeenCalled();
    });

    it('should refresh session if token needs refresh', async () => {
      (authenticationProvider.hasTokenExpired as jasmine.Spy).and.returnValue(Promise.resolve(true));
      const refreshSpy = authenticationProvider.refreshSession as jasmine.Spy;

      await authenticationProvider.getAuthenticationToken();
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should return null if authResult throws', async () => {
      authenticationProvider.authResult = (() => {}) as Signal<AuthResult>;
      const token = await authenticationProvider.getAuthenticationToken();
      expect(token).toBeNull();
    });
  });

  describe('loadEmployeeDetails', () => {
    it('should dispatch both name and id if present', async () => {
      spyOn(authenticationProvider.appConfig, 'getAppConfigAsync').and.resolveTo({
        authentication: { employeeNameKey: 'name', employeeIdKey: 'id' },
      } as AppConfig);

      spyOn(authenticationProvider, 'decodeToken').and.returnValue({ name: 'Alice', id: 'EMP42' });

      await authenticationProvider.loadEmployeeDetails({ idToken: 'token' } as AuthResult);

      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(LoadEmployeeName('Alice'));
      expect(authenticationProvider.store$.dispatch).toHaveBeenCalledWith(LoadEmployeeId({ employeeId: 'EMP42' }));
    });

    it('should not dispatch if idToken is missing', async () => {
      await authenticationProvider.loadEmployeeDetails({} as AuthResult);
      expect(authenticationProvider.store$.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('refreshEmployeeDetails', () => {
    it('should call loadEmployeeDetails() with the authResult', () => {
      spyOn(authenticationProvider, 'loadEmployeeDetails');

      authenticationProvider.refreshEmployeeDetails();

      expect(authenticationProvider.loadEmployeeDetails).toHaveBeenCalledWith(authenticationProvider.authResult());
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
        provider: {} as Provider,
        idToken: 'token',
        config: { platform: 'capacitor' } as AuthConnectConfig,
        receivedAt: 1,
        tokenType: '',
        state: {},
        rawResult: '',
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
    it('should call setProviderOptions if providerOptions is not set', async () => {
      authenticationProvider.providerOptions = undefined;
      spyOn(authenticationProvider, 'setProviderOptions');
      spyOn(AuthConnect, 'login');
      spyOn(authenticationProvider, 'storeAuthResult').and.returnValue(Promise.resolve());

      await authenticationProvider.login();

      expect(authenticationProvider.setProviderOptions).toHaveBeenCalled();
    });

    it('should not call setProviderOptions if providerOptions is already set', async () => {
      authenticationProvider.providerOptions = { clientId: 'test' } as ProviderOptions;
      spyOn(authenticationProvider, 'setProviderOptions');
      spyOn(AuthConnect, 'login');
      spyOn(authenticationProvider, 'storeAuthResult').and.returnValue(Promise.resolve());

      await authenticationProvider.login();

      expect(authenticationProvider.setProviderOptions).not.toHaveBeenCalled();
    });

    it('should call AuthConnect.login and storeAuthResult', async () => {
      authenticationProvider.providerOptions = { clientId: 'test' } as ProviderOptions;
      spyOn(AuthConnect, 'login');
      spyOn(authenticationProvider, 'storeAuthResult').and.returnValue(Promise.resolve());

      await authenticationProvider.login();

      expect(AuthConnect.login).toHaveBeenCalledWith(
        authenticationProvider.provider,
        authenticationProvider.providerOptions
      );
      expect(authenticationProvider.storeAuthResult).toHaveBeenCalled();
    });

    it('should log and rethrow errors from AuthConnect.login', async () => {
      authenticationProvider.providerOptions = { clientId: 'test' } as ProviderOptions;
      const error = new Error('login failed');
      spyOn(AuthConnect, 'login').and.rejectWith(error);
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

  describe('refreshSession', () => {
    it('should call storeAuthResult() with the result of AuthConnect.refreshSession()', () => {
      const testAuth = authenticationProvider.authResult();
      spyOn(AuthConnect, 'refreshSession').and.returnValue(Promise.resolve(testAuth));
      spyOn(authenticationProvider, 'storeAuthResult').and.returnValue(Promise.resolve());

      authenticationProvider.refreshSession();

      expect(AuthConnect.refreshSession).toHaveBeenCalledWith(authenticationProvider.provider, testAuth);
    });
  });

  describe('isAuthenticated', () => {
    beforeEach(() => {
      spyOn(authenticationProvider, 'logEvent');
    });

    it('should return true if offline', async () => {
      spyOn(authenticationProvider, 'isOffline').and.returnValue(true);

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if no authResult and not offline', async () => {
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      authenticationProvider.authResult = (() => undefined) as Signal<AuthResult>;

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return true if token is not expired', async () => {
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'hasTokenExpired').and.returnValue(Promise.resolve(false));
      authenticationProvider.authResult = (() => ({ accessToken: 'abc' })) as Signal<AuthResult>;

      const result = await authenticationProvider.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should refresh session and return true if token expired and accessToken changes', async () => {
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'hasTokenExpired').and.returnValue(Promise.resolve(true));
      const firstToken = { accessToken: 'old' };
      const secondToken = { accessToken: 'new' };
      authenticationProvider.authResult = (() => firstToken) as Signal<AuthResult>;
      spyOn(authenticationProvider, 'refreshSession').and.callFake(async () => {
        authenticationProvider.authResult = (() => secondToken) as Signal<AuthResult>;
      });

      const result = await authenticationProvider.isAuthenticated();

      expect(authenticationProvider.refreshSession).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should refresh session and return false if token expired and accessToken does not change', async () => {
      spyOn(authenticationProvider, 'isOffline').and.returnValue(false);
      spyOn(authenticationProvider, 'hasTokenExpired').and.returnValue(Promise.resolve(true));
      const token = { accessToken: 'same' };
      authenticationProvider.authResult = (() => token) as Signal<AuthResult>;
      spyOn(authenticationProvider, 'refreshSession').and.returnValue(Promise.resolve());

      const result = await authenticationProvider.isAuthenticated();

      expect(authenticationProvider.refreshSession).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should log and return false if an error is thrown', async () => {
      spyOn(authenticationProvider, 'isOffline').and.throwError('fail');

      const result = await authenticationProvider.isAuthenticated();

      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(
        LogType.ERROR,
        'isAuthenticated error',
        jasmine.any(Error)
      );
      expect(result).toBe(false);
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

    it('should return false if decodeToken returns null/undefined', async () => {
      spyOn(authenticationProvider, 'decodeToken').and.returnValue(undefined);
      const result = await authenticationProvider.hasTokenExpired({ idToken: 'bad' } as AuthResult);
      expect(result).toBe(false);
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
      spyOn(authenticationProvider, 'clearStore').and.returnValue(Promise.resolve());
      spyOn(AuthConnect, 'logout').and.returnValue(Promise.resolve());
      authenticationProvider.authResult = (() => {}) as Signal<AuthResult>;
    });

    it('should log start and finish, call AuthConnect.logout, clearStore, and shutDownStoreSubscription', async () => {
      await authenticationProvider.logout();

      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.INFO, 'Logout', 'Started logout flow');
      expect(AuthConnect.logout).toHaveBeenCalledWith(
        authenticationProvider.provider,
        authenticationProvider.authResult()
      );
      expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.INFO, 'Logout', 'Finished logout flow');
      expect(authenticationProvider.clearStore).toHaveBeenCalled();
      expect(authenticationProvider.appConfig.shutDownStoreSubscription).toHaveBeenCalled();
    });

    it('should log error if AuthConnect.logout throws, then call clearStore and shutDownStoreSubscription', async () => {
      const error = new Error('logout failed');
      (AuthConnect.logout as jasmine.Spy).and.rejectWith(error);

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
