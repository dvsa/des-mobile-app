import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Capacitor } from '@capacitor/core';
import { AuthResult } from '@ionic-enterprise/auth';
import { provideMockStore } from '@ngrx/store/testing';
import { AppConfig } from '@providers/app-config/app-config.model';
import { CompletedTestPersistenceProviderMock } from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRecordsProviderMock } from '@providers/examiner-records/__mocks__/examiner-records.mock';
import { ExaminerRecordsProvider } from '@providers/examiner-records/examiner-records';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { StoreModel } from '@shared/models/store.model';
import { LoadEmployeeId, LoadEmployeeName } from '@store/app-info/app-info.actions';
import { selectEmployeeId } from '@store/app-info/app-info.selectors';
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

    authenticationProvider = TestBed.inject(AuthenticationProvider);

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

      await authenticationProvider.getAppConfigData();

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

      await authenticationProvider.getAppConfigData();

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
      (authenticationProvider as any).store$.selectSignal = mockSelectSignal;

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
      await authenticationProvider.loadEmployeeDetails({} as any);
      expect(authenticationProvider.store$.dispatch).not.toHaveBeenCalled();
    });
  });
});
