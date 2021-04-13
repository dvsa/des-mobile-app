import { TestBed, async } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideMockStore } from '@ngrx/store/testing';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider, Token } from '../authentication';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { NetworkStateProvider, ConnectionStatus } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { AppConfig } from '../../app-config/app-config.model';
import { DataStoreProvider } from '../../data-store/data-store';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { TestPersistenceProvider } from '../../test-persistence/test-persistence';
import { TestPersistenceProviderMock } from '../../test-persistence/__mocks__/test-persistence.mock';

describe('Authentication', () => {
  let authenticationProvider: AuthenticationProvider;
  let networkStateProvider: NetworkStateProvider;
  let appConfigProvider: AppConfigProvider;
  let dataStoreProvider: DataStoreProvider;
  const initialState = { appInfo: { employeeId: '1234567' } } as StoreModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationProvider,
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: TestPersistenceProvider, useClass: TestPersistenceProviderMock },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(async(() => {
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    appConfigProvider = TestBed.inject(AppConfigProvider);
    dataStoreProvider = TestBed.inject(DataStoreProvider);
    authenticationProvider.initialiseAuthentication();
  }));

  describe('Provider', () => {

    it('should compile', () => {
      expect(authenticationProvider).toBeDefined();
    });

    it('determineAuthenticationMode() should set unauthenticated mode to true if offline', () => {
      spyOn(networkStateProvider, 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);
      authenticationProvider.determineAuthenticationMode();
      expect(authenticationProvider.isInUnAuthenticatedMode()).toEqual(true);
    });

    it('determineAuthenticationMode() should set unauthenticated mode to false if online', () => {
      spyOn(networkStateProvider, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      authenticationProvider.determineAuthenticationMode();
      expect(authenticationProvider.isInUnAuthenticatedMode()).toEqual(false);
    });

    it('isAuthenticated() should return true if in unauthenticated mode', async () => {
      spyOn(authenticationProvider, 'isInUnAuthenticatedMode').and.returnValue(true);
      const isAuthenticated = await authenticationProvider.isAuthenticated();
      expect(isAuthenticated).toEqual(true);
    });

    it('isAuthenticated() call through to ionicAuth if not in unauthenticated mode', async () => {
      spyOn(authenticationProvider, 'isInUnAuthenticatedMode').and.returnValue(false);
      spyOn(authenticationProvider.ionicAuth, 'isAuthenticated').and.returnValue(Promise.resolve(false));
      const isAuthenticated = await authenticationProvider.isAuthenticated();
      expect(authenticationProvider.ionicAuth.isAuthenticated).toHaveBeenCalled();
      expect(isAuthenticated).toEqual(false);
    });

    it('getAuthenticationToken() should return a token', async () => {
      dataStoreProvider.getItem = jasmine.createSpy('setItem')
        .and.returnValue(Promise.resolve('"U0lMRU5UIEFZU05DIFRFU1QgVE9LRU4"'));
      spyOn(authenticationProvider.ionicAuth, 'isAuthenticated').and.returnValue(Promise.resolve(true));
      spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(Promise.resolve({
        exp: 1602686015366,
      }));
      const token = await authenticationProvider.getAuthenticationToken();

      expect(token).toEqual('U0lMRU5UIEFZU05DIFRFU1QgVE9LRU4');
    });

    it('should call ionic login', async () => {
      spyOn(authenticationProvider.ionicAuth, 'login').and.returnValue(Promise.resolve());
      await authenticationProvider.login();

      expect(authenticationProvider.ionicAuth.login).toHaveBeenCalled();
    });

    it('should login without authenticating in unauthenticated mode', async () => {
      spyOn(authenticationProvider, 'isInUnAuthenticatedMode').and.returnValue(true);
      spyOn(authenticationProvider.ionicAuth, 'login').and.returnValue(Promise.resolve());
      await authenticationProvider.login();
      expect(authenticationProvider.ionicAuth.login).toHaveBeenCalledTimes(0);
    });

    it('should login with authenticating in unauthenticated mode', async () => {
      spyOn(authenticationProvider, 'isInUnAuthenticatedMode').and.returnValue(false);
      spyOn(authenticationProvider.ionicAuth, 'login').and.returnValue(Promise.resolve());
      await authenticationProvider.login();
      expect(authenticationProvider.ionicAuth.login).toHaveBeenCalledTimes(1);
    });

    it('should set the correct employeeId when it is an array', async () => {
      spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(Promise.resolve({
        localemployeeIdKey: ['12345678'],
      }));
      await authenticationProvider.setEmployeeId();
      expect(authenticationProvider.getEmployeeId()).toEqual('12345678');
    });

    it('should set the correct employeeId when it is a string', async () => {
      spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(Promise.resolve({
        localemployeeIdKey: '12345678',
      }));
      await authenticationProvider.setEmployeeId();
      expect(authenticationProvider.getEmployeeId()).toEqual('12345678');
    });

    it('should strip leading zeroes from the employeeId', async () => {
      spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(Promise.resolve({
        localemployeeIdKey: ['0123456'],
      }));
      await authenticationProvider.setEmployeeId();
      expect(authenticationProvider.getEmployeeId()).toEqual('123456');
    });

    describe('logout', () => {
      it('should logout successfully', async () => {
        spyOn(authenticationProvider.ionicAuth, 'logout');
        await authenticationProvider.logout();
        expect(authenticationProvider.ionicAuth.logout).toHaveBeenCalled();
        expect(dataStoreProvider.removeItem).toHaveBeenCalledWith(Token.ID);
        expect(dataStoreProvider.removeItem).toHaveBeenCalledWith(Token.ACCESS);
        expect(dataStoreProvider.removeItem).toHaveBeenCalledWith(Token.REFRESH);
      });

      it('should clear the persisted tests when the configuration to do so is enabled', async () => {
        const configWithPersistenceClearing: AppConfig = {
          ...appConfigProvider.getAppConfig(),
          logoutClearsTestPersistence: true,
        };
        spyOn(appConfigProvider, 'getAppConfig').and.returnValue(configWithPersistenceClearing);
        spyOn(authenticationProvider.ionicAuth, 'logout');
        await authenticationProvider.logout();
        expect(authenticationProvider.ionicAuth.logout).toHaveBeenCalled();
        expect(dataStoreProvider.removeItem).toHaveBeenCalledWith(Token.ID);
        expect(dataStoreProvider.removeItem).toHaveBeenCalledWith(Token.ACCESS);
        expect(dataStoreProvider.removeItem).toHaveBeenCalledWith(Token.REFRESH);
      });
    });

    describe('loadEmployeeName', () => {
      it('should load the employee name from the token if available', async () => {
        const expectedName = 'A N Examiner';
        spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(Promise.resolve({
          localemployeenamekey: expectedName,
        }));
        const actualName = await authenticationProvider.loadEmployeeName();
        expect(actualName).toEqual(expectedName);
      });
      it('shoiuld return an empty string if token value unavailable', async () => {
        spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(Promise.resolve(null));
        const actualName = await authenticationProvider.loadEmployeeName();
        expect(actualName).toEqual('');
      });
    });

    describe('expireTokens', () => {
      it('should call through to ionic auth expire() method', async () => {
        spyOn(authenticationProvider.ionicAuth, 'expire').and.returnValue(Promise.resolve());
        await authenticationProvider.expireTokens();
        expect(authenticationProvider.ionicAuth.expire).toHaveBeenCalled();
      });
    });

    describe('refreshTokenIfExpired', () => {
      it('should call ionicAuth.refreshSession if token expired', async () => {
        spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(Promise.resolve({
          exp: 1,
        }));
        spyOn(authenticationProvider.ionicAuth, 'refreshSession');
        await authenticationProvider.refreshTokenIfExpired();
        expect(authenticationProvider.ionicAuth.refreshSession).toHaveBeenCalled();
      });
    });

    describe('getAuthenticationToken', () => {
      beforeEach(() => {
        spyOn(authenticationProvider, 'hasValidToken').and.returnValue(Promise.resolve(false));
        spyOn(authenticationProvider, 'expireTokens');
        spyOn(authenticationProvider, 'isAuthenticated').and.returnValue(Promise.resolve(true));
      });
      it('should expire the token if it is not valid before returning a new one', async () => {
        const stringToken = '{ "exp": 123 }';
        spyOn(dataStoreProvider, 'getItem').and.returnValue(Promise.resolve(stringToken));
        const token = await authenticationProvider.getAuthenticationToken();
        expect(authenticationProvider.expireTokens).toHaveBeenCalled();
        expect(token).toEqual(JSON.parse(stringToken));
        expect(dataStoreProvider.getItem).toHaveBeenCalledWith(Token.ID);
      });
      it('will return null if no valid token in storage', async () => {
        spyOn(dataStoreProvider, 'getItem').and.returnValue(Promise.reject(new Error('some error')));
        const token = await authenticationProvider.getAuthenticationToken();
        expect(token).toEqual(null);
        expect(dataStoreProvider.getItem).toHaveBeenCalledWith(Token.ID);
      });
    });

  });
});
