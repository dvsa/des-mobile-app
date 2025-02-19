import { TestBed, waitForAsync } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { CompletedTestPersistenceProviderMock } from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRecordsProviderMock } from '@providers/examiner-records/__mocks__/examiner-records.mock';
import { ExaminerRecordsProvider } from '@providers/examiner-records/examiner-records';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { ConnectionStatus, NetworkStateProvider } from '../../network-state/network-state';
import { TestPersistenceProviderMock } from '../../test-persistence/__mocks__/test-persistence.mock';
import { TestPersistenceProvider } from '../../test-persistence/test-persistence';
import { AuthenticationProvider, Token } from '../authentication';

describe('AuthenticationProvider', () => {
  let authenticationProvider: AuthenticationProvider;
  let networkStateProvider: NetworkStateProvider;
  let dataStoreProvider: DataStoreProvider;
  const initialState = { appInfo: { employeeId: '1234567' } } as StoreModel;

  beforeEach(waitForAsync(() => {
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
    authenticationProvider.initialiseAuthentication();
  }));

  describe('Provider', () => {
    beforeEach(() => {
      spyOn(authenticationProvider, 'logEvent');
    });
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

    it('should call through to isAccessTokenAvailable,isAccessTokenExpired & refreshSession successfully', async () => {
      spyOn(authenticationProvider, 'isInUnAuthenticatedMode').and.returnValue(false);
      spyOn(authenticationProvider.ionicAuth, 'isAccessTokenAvailable').and.returnValue(Promise.resolve(true));
      spyOn(authenticationProvider.ionicAuth, 'isAccessTokenExpired').and.returnValue(Promise.resolve(true));
      spyOn(authenticationProvider.ionicAuth, 'refreshSession').and.returnValue(Promise.resolve());
      const isAuthenticated = await authenticationProvider.isAuthenticated();
      expect(authenticationProvider.ionicAuth.isAccessTokenAvailable).toHaveBeenCalled();
      expect(authenticationProvider.ionicAuth.isAccessTokenExpired).toHaveBeenCalled();
      expect(authenticationProvider.ionicAuth.refreshSession).toHaveBeenCalled();
      expect(isAuthenticated).toEqual(true);
    });

    it('should not call refreshSession when isAccessTokenAvailable returns false', async () => {
      spyOn(authenticationProvider, 'isInUnAuthenticatedMode').and.returnValue(false);
      spyOn(authenticationProvider.ionicAuth, 'isAccessTokenAvailable').and.returnValue(Promise.resolve(false));
      spyOn(authenticationProvider.ionicAuth, 'isAccessTokenExpired').and.returnValue(Promise.resolve(true));
      spyOn(authenticationProvider.ionicAuth, 'refreshSession').and.returnValue(Promise.resolve());
      const isAuthenticated = await authenticationProvider.isAuthenticated();
      expect(authenticationProvider.ionicAuth.isAccessTokenAvailable).toHaveBeenCalled();
      expect(authenticationProvider.ionicAuth.isAccessTokenExpired).not.toHaveBeenCalled();
      expect(authenticationProvider.ionicAuth.refreshSession).not.toHaveBeenCalled();
      expect(isAuthenticated).toEqual(false);
    });

    it('should not call refreshSession when isAccessTokenExpired returns false', async () => {
      spyOn(authenticationProvider, 'isInUnAuthenticatedMode').and.returnValue(false);
      spyOn(authenticationProvider.ionicAuth, 'isAccessTokenAvailable').and.returnValue(Promise.resolve(true));
      spyOn(authenticationProvider.ionicAuth, 'isAccessTokenExpired').and.returnValue(Promise.resolve(false));
      spyOn(authenticationProvider.ionicAuth, 'refreshSession').and.returnValue(Promise.resolve());
      const isAuthenticated = await authenticationProvider.isAuthenticated();
      expect(authenticationProvider.ionicAuth.isAccessTokenAvailable).toHaveBeenCalled();
      expect(authenticationProvider.ionicAuth.isAccessTokenExpired).toHaveBeenCalled();
      expect(authenticationProvider.ionicAuth.refreshSession).not.toHaveBeenCalled();
      expect(isAuthenticated).toEqual(true);
    });

    /* Test passes, although due to code it throws an error which might lead to further confusion, but can be enabled
     * to check the functionality has not been broken if desired */
    xit('should throw at refresh and run through catch', async () => {
      spyOn(authenticationProvider, 'isInUnAuthenticatedMode').and.returnValue(false);
      spyOn(authenticationProvider.ionicAuth, 'isAccessTokenAvailable').and.returnValue(Promise.resolve(true));
      spyOn(authenticationProvider.ionicAuth, 'isAccessTokenExpired').and.returnValue(Promise.resolve(true));
      spyOn(authenticationProvider.ionicAuth, 'refreshSession').and.returnValue(
        Promise.reject(new Error('refresh, threw'))
      );
      const isAuthenticated = await authenticationProvider.isAuthenticated();
      expect(authenticationProvider.ionicAuth.isAccessTokenAvailable).toHaveBeenCalled();
      expect(authenticationProvider.ionicAuth.isAccessTokenExpired).toHaveBeenCalled();
      expect(authenticationProvider.ionicAuth.refreshSession).toHaveBeenCalled();
      expect(isAuthenticated).toEqual(false);
    });

    it('getAuthenticationToken() should return a token', async () => {
      dataStoreProvider.getItem = jasmine
        .createSpy('setItem')
        .and.returnValue(Promise.resolve('"U0lMRU5UIEFZU05DIFRFU1QgVE9LRU4"'));
      spyOn(authenticationProvider.ionicAuth, 'isAuthenticated').and.returnValue(Promise.resolve(true));
      spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(
        Promise.resolve({
          exp: 1602686015366,
        })
      );
      spyOn(authenticationProvider, 'isAuthenticated').and.returnValue(Promise.resolve(true));
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
      spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(
        Promise.resolve({
          localemployeeIdKey: ['12345678'],
        })
      );
      await authenticationProvider.setEmployeeId();
      expect(authenticationProvider.getEmployeeId()).toEqual('12345678');
    });

    it('should set the correct employeeId when it is a string', async () => {
      spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(
        Promise.resolve({
          localemployeeIdKey: '12345678',
        })
      );
      await authenticationProvider.setEmployeeId();
      expect(authenticationProvider.getEmployeeId()).toEqual('12345678');
    });

    it('should strip leading zeroes from the employeeId', async () => {
      spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(
        Promise.resolve({
          localemployeeIdKey: ['0123456'],
        })
      );
      await authenticationProvider.setEmployeeId();
      expect(authenticationProvider.getEmployeeId()).toEqual('123456');
    });

    describe('logout', () => {
      beforeEach(() => {
        spyOn(authenticationProvider, 'logEvent');
        spyOn(authenticationProvider, 'clearStore').and.returnValue(Promise.resolve());
        spyOn(authenticationProvider, 'clearTokens').and.returnValue(Promise.resolve());
        spyOn(authenticationProvider.appConfig, 'shutDownStoreSubscription');
        spyOn(authenticationProvider.subscription, 'unsubscribe');
        spyOn(authenticationProvider.authConnect, 'logout').and.returnValue(Promise.resolve());
      });

      it('should log the start and end of the logout flow', async () => {
        await authenticationProvider.logout();
        expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.DEBUG, 'Logout', 'Started logout flow');
        expect(authenticationProvider.logEvent).toHaveBeenCalledWith(LogType.DEBUG, 'Logout', 'Finished logout flow');
      });

      it('should clear the store and tokens', async () => {
        await authenticationProvider.logout();
        expect(authenticationProvider.clearStore).toHaveBeenCalled();
        expect(authenticationProvider.clearTokens).toHaveBeenCalled();
      });

      it('should shut down the store subscription and unsubscribe from the subscription', async () => {
        await authenticationProvider.logout();
        expect(authenticationProvider.appConfig.shutDownStoreSubscription).toHaveBeenCalled();
        expect(authenticationProvider.subscription.unsubscribe).toHaveBeenCalled();
      });

      it('should call authConnect.logout', async () => {
        await authenticationProvider.logout();
        expect(authenticationProvider.authConnect.logout).toHaveBeenCalled();
      });

      it('should handle errors and log them', async () => {
        const error = new Error('logout error');
        spyOn(authenticationProvider.authConnect, 'logout').and.returnValue(Promise.reject(error));
        spyOn(authenticationProvider, 'onLogoutError');
        await authenticationProvider.logout();
        expect(authenticationProvider.onLogoutError).toHaveBeenCalledWith(error, 'Authentication provider');
      });
    });

    describe('loadEmployeeName', () => {
      it('should load the employee name from the token if available', async () => {
        const expectedName = 'A N Examiner';
        spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(
          Promise.resolve({
            localemployeenamekey: expectedName,
          })
        );
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
        spyOn(authenticationProvider.ionicAuth, 'getIdToken').and.returnValue(
          Promise.resolve({
            exp: 1,
          })
        );
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
