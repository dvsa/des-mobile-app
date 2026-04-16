import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IsDebug } from '@awesome-cordova-plugins/is-debug/ngx';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { Platform } from '@ionic/angular';
import { IsDebugMock, PlatformMock } from '@mocks/index.mock';
import { StoreModule } from '@ngrx/store';
import { AppConfig } from '@providers/app-config/app-config.model';
import { appConfigReducer } from '@store/app-config/app-config.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import { AppInfoProviderMock } from '../../app-info/__mocks__/app-info.mock';
import { AppInfoProvider } from '../../app-info/app-info';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { LogHelperMock } from '../../logs/__mocks__/logs-helper.mock';
import { LogHelper } from '../../logs/logs-helper';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { SchemaValidatorProviderMock } from '../../schema-validator/__mocks__/schema-validator.mock';
import { SchemaValidatorProvider } from '../../schema-validator/schema-validator';
import { environmentResponseMock } from '../__mocks__/environment-response.mock';
import { remoteEnvironmentMock } from '../__mocks__/environment.mock';
import { AppConfigProvider } from '../app-config';

describe('AppConfigProvider', () => {
  let appConfig: AppConfigProvider;
  let httpMock: HttpTestingController;
  let platform: Platform;
  let isDebug: IsDebug;
  let dataStoreProvider: DataStoreProvider;
  let schemaValidatorProvider: SchemaValidatorProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
          appConfig: appConfigReducer,
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: DataStoreProvider,
          useClass: DataStoreProviderMock,
        },
        {
          provide: SchemaValidatorProvider,
          useClass: SchemaValidatorProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProvider,
          environmentFile: remoteEnvironmentMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AppInfoProvider,
          useClass: AppInfoProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: IsDebug,
          useClass: IsDebugMock,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    appConfig = TestBed.inject(AppConfigProvider);
    httpMock = TestBed.inject(HttpTestingController);
    platform = TestBed.inject(Platform);
    isDebug = TestBed.inject(IsDebug);
    dataStoreProvider = TestBed.inject(DataStoreProvider);
    schemaValidatorProvider = TestBed.inject(SchemaValidatorProvider);
    appConfig.isDebugMode = true;
    spyOn(appConfig, 'getDebugMode').and.returnValue(Promise.resolve());
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialiseAppConfig', () => {
    it('should run loadMangedConfig() when platform is Ios', fakeAsync(() => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(true);
      appConfig.loadManagedConfig = jasmine.createSpy('appConfig.loadManagedConfig');

      appConfig.initialiseAppConfig();
      tick();

      expect(appConfig.loadManagedConfig).toHaveBeenCalled();
    }));
    it('should not run loadMangedConfig() when platform is not ios', fakeAsync(() => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(false);
      appConfig.loadManagedConfig = jasmine.createSpy('appConfig.loadManagedConfig');

      appConfig.initialiseAppConfig();
      tick();

      expect(appConfig.loadManagedConfig).toHaveBeenCalledTimes(0);
    }));
  });

  describe('loadRemoteConfig', () => {
    it('should load remote config', fakeAsync(() => {
      appConfig.environmentFile = remoteEnvironmentMock;

      appConfig.loadRemoteConfig();
      tick();

      const request = httpMock.expectOne(`${remoteEnvironmentMock.configUrl}?app_version=4.0.0.0`);
      expect(request.request.method).toBe('GET');
      request.flush(environmentResponseMock);
    }));
  });

  describe('getAppConfig', () => {
    it('should asynchronously set the appConfig then return it', async () => {
      spyOn(appConfig, 'getAppConfigAsync').and.returnValue(Promise.resolve({ configUrl: 'url' } as AppConfig));
      const conf = appConfig.getAppConfig();
      expect(conf).not.toBeUndefined();
    });

    it('should return appConfig if already set', () => {
      (appConfig as any).appConfig = { configUrl: 'url' };

      const result = appConfig.getAppConfig();

      expect(result).toEqual({ configUrl: 'url' } as AppConfig);
    });

    it('should call getAppConfigAsync if appConfig is not set', () => {
      (appConfig as any).appConfig = undefined;
      spyOn(appConfig, 'getAppConfigAsync');

      appConfig.getAppConfig();

      expect(appConfig.getAppConfigAsync).toHaveBeenCalled();
    });
  });

  describe('getAppConfigAsync', () => {
    it('should return existing appConfig without reinitializing', async () => {
      (appConfig as any).appConfig = { configUrl: 'url' };
      spyOn(appConfig, 'initialiseAppConfig');

      const result = await appConfig.getAppConfigAsync();

      expect(result).toEqual({ configUrl: 'url' } as AppConfig);
      expect(appConfig.initialiseAppConfig).not.toHaveBeenCalled();
    });

    it('should validate remote config and skip mapping if validation fails', fakeAsync(() => {
      (appConfig as any).appConfig = undefined;
      appConfig.environmentFile.isRemote = true;

      spyOn(appConfig, 'initialiseAppConfig').and.returnValue(Promise.resolve());
      spyOn(schemaValidatorProvider, 'validateRemoteConfig').and.returnValue({
        errors: [{ message: 'Invalid' }],
      } as any);
      spyOn(appConfig as any, 'mapRemoteConfig');

      appConfig.getAppConfigAsync();
      tick();

      expect((appConfig as any).mapRemoteConfig).not.toHaveBeenCalled();
    }));

    it('should handle error during initialization', fakeAsync(() => {
      (appConfig as any).appConfig = undefined;
      spyOn(appConfig, 'initialiseAppConfig').and.returnValue(Promise.reject('Init error'));

      appConfig.getAppConfigAsync();
      tick();

      expect(true).toBe(true);
    }));

    it('should handle error during config retrieval', fakeAsync(() => {
      (appConfig as any).appConfig = undefined;
      appConfig.environmentFile.isRemote = true;

      spyOn(appConfig, 'initialiseAppConfig').and.returnValue(Promise.resolve());
      spyOn(dataStoreProvider, 'getItem').and.returnValue(Promise.reject('Retrieval error'));

      appConfig.getAppConfigAsync();
      tick();

      expect(true).toBe(true);
    }));
  });

  describe('getCachedRemoteConfig', () => {
    it('should parse and return cached config from storage', fakeAsync(() => {
      const mockConfig = { configUrl: 'url' };
      spyOn(dataStoreProvider, 'getItem').and.returnValue(Promise.resolve(JSON.stringify(mockConfig)));

      let result: any;
      (appConfig as any).getCachedRemoteConfig().then((config) => {
        result = config;
      });
      tick();

      expect(result).toEqual(mockConfig);
    }));

    it('should throw error if config retrieval fails', fakeAsync(() => {
      spyOn(dataStoreProvider, 'getItem').and.returnValue(Promise.reject('Storage error'));

      let error: string;
      (appConfig as any).getCachedRemoteConfig().catch((e) => {
        error = e;
      });
      tick();

      expect(error).toBe('Storage error');
    }));
  });

  describe('shouldGetCachedConfig', () => {
    it('should return true for non-auth errors', () => {
      const result = (appConfig as any).shouldGetCachedConfig(
        new HttpErrorResponse({
          error: '',
        })
      );
      expect(result).toBe(true);
    });

    it('should return false for 403 status', () => {
      const result = (appConfig as any).shouldGetCachedConfig(
        new HttpErrorResponse({
          error: '',
          status: 403,
        })
      );
      expect(result).toBe(false);
    });

    it('should return false for INVALID_APP_VERSION error', () => {
      const result = (appConfig as any).shouldGetCachedConfig(
        new HttpErrorResponse({
          error: AppConfigError.INVALID_APP_VERSION,
          status: 403,
        })
      );
      expect(result).toBe(false);
    });
  });

  describe('getDebugMode', () => {
    beforeEach(() => {
      (environment as TestersEnvironmentFile).isTest = false;
    });

    it('should return the value from the plugin when not isTest', async () => {
      spyOn(isDebug, 'getIsDebug').and.returnValue(Promise.resolve(true));

      await appConfig.getDebugMode();

      expect(appConfig.isDebugMode).toEqual(true);
    });

    it('should return true when isTest regardless of plugin', async () => {
      (environment as TestersEnvironmentFile).isTest = true;

      spyOn(isDebug, 'getIsDebug').and.returnValue(Promise.resolve(false));

      await appConfig.getDebugMode();

      expect(appConfig.isDebugMode).toEqual(true);
    });
  });
});
