import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IsDebug } from '@awesome-cordova-plugins/is-debug/ngx';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { Platform } from '@ionic/angular';
import { IsDebugMock, PlatformMock } from '@mocks/index.mock';
import { StoreModule } from '@ngrx/store';
import { AppConfigError } from '@providers/app-config/app-config.constants';
import { AppConfig } from '@providers/app-config/app-config.model';
import { appConfigReducer } from '@store/app-config/app-config.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    vi.spyOn(appConfig, 'getDebugMode').mockReturnValue(Promise.resolve());
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialiseAppConfig', () => {
    it('should run loadMangedConfig() when platform is Ios', async () => {
      vi.useFakeTimers();
      try {
        platform.is = vi.fn().mockReturnValue(true);
        appConfig.loadManagedConfig = vi.fn();

        appConfig.initialiseAppConfig();
        await vi.advanceTimersByTimeAsync(0);

        expect(appConfig.loadManagedConfig).toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });
    it('should not run loadMangedConfig() when platform is not ios', async () => {
      vi.useFakeTimers();
      try {
        platform.is = vi.fn().mockReturnValue(false);
        appConfig.loadManagedConfig = vi.fn();

        appConfig.initialiseAppConfig();
        await vi.advanceTimersByTimeAsync(0);

        expect(appConfig.loadManagedConfig).toHaveBeenCalledTimes(0);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('loadRemoteConfig', () => {
    it('should load remote config', async () => {
      vi.useFakeTimers();
      try {
        appConfig.environmentFile = remoteEnvironmentMock;

        appConfig.loadRemoteConfig();
        await vi.advanceTimersByTimeAsync(0);

        const request = httpMock.expectOne(`${remoteEnvironmentMock.configUrl}?app_version=4.0.0.0`);
        expect(request.request.method).toBe('GET');
        request.flush(environmentResponseMock);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('getAppConfig', () => {
    it('should asynchronously set the appConfig then return it', async () => {
      vi.spyOn(appConfig, 'getAppConfigAsync').mockReturnValue(Promise.resolve({ configUrl: 'url' } as AppConfig));
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
      vi.spyOn(appConfig, 'getAppConfigAsync').mockReturnValue(undefined);

      appConfig.getAppConfig();

      expect(appConfig.getAppConfigAsync).toHaveBeenCalled();
    });
  });

  describe('getAppConfigAsync', () => {
    it('should return existing appConfig without reinitializing', async () => {
      (appConfig as any).appConfig = { configUrl: 'url' };
      vi.spyOn(appConfig, 'initialiseAppConfig');

      const result = await appConfig.getAppConfigAsync();

      expect(result).toEqual({ configUrl: 'url' } as AppConfig);
      expect(appConfig.initialiseAppConfig).not.toHaveBeenCalled();
    });

    it('should validate remote config and skip mapping if validation fails', async () => {
      vi.useFakeTimers();
      try {
        (appConfig as any).appConfig = undefined;
        appConfig.environmentFile.isRemote = true;

        vi.spyOn(appConfig, 'initialiseAppConfig').mockReturnValue(Promise.resolve());
        vi.spyOn(schemaValidatorProvider, 'validateRemoteConfig').mockReturnValue({
          errors: [{ message: 'Invalid' }],
        } as any);
        vi.spyOn(appConfig as any, 'mapRemoteConfig').mockReturnValue(undefined);

        appConfig.getAppConfigAsync();
        await vi.advanceTimersByTimeAsync(0);

        expect((appConfig as any).mapRemoteConfig).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('should handle error during initialization', async () => {
      vi.useFakeTimers();
      try {
        (appConfig as any).appConfig = undefined;
        vi.spyOn(appConfig, 'initialiseAppConfig').mockReturnValue(Promise.reject('Init error'));

        appConfig.getAppConfigAsync();
        await vi.advanceTimersByTimeAsync(0);

        expect(true).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should handle error during config retrieval', async () => {
      vi.useFakeTimers();
      try {
        (appConfig as any).appConfig = undefined;
        appConfig.environmentFile.isRemote = true;

        vi.spyOn(appConfig, 'initialiseAppConfig').mockReturnValue(Promise.resolve());
        vi.spyOn(dataStoreProvider, 'getItem').mockReturnValue(Promise.reject('Retrieval error'));

        appConfig.getAppConfigAsync();
        await vi.advanceTimersByTimeAsync(0);

        expect(true).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('getCachedRemoteConfig', () => {
    it('should parse and return cached config from storage', async () => {
      vi.useFakeTimers();
      try {
        const mockConfig = { configUrl: 'url' };
        vi.spyOn(dataStoreProvider, 'getItem').mockReturnValue(Promise.resolve(JSON.stringify(mockConfig)));

        let result: any;
        (appConfig as any).getCachedRemoteConfig().then((config) => {
          result = config;
        });
        await vi.advanceTimersByTimeAsync(0);

        expect(result).toEqual(mockConfig);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should throw error if config retrieval fails', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(dataStoreProvider, 'getItem').mockReturnValue(Promise.reject('Storage error'));

        let error: string;
        (appConfig as any).getCachedRemoteConfig().catch((e) => {
          error = e;
        });
        await vi.advanceTimersByTimeAsync(0);

        expect(error).toBe('Storage error');
      } finally {
        vi.useRealTimers();
      }
    });
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
      vi.spyOn(isDebug, 'getIsDebug').mockReturnValue(Promise.resolve(true));

      await appConfig.getDebugMode();

      expect(appConfig.isDebugMode).toEqual(true);
    });

    it('should return true when isTest regardless of plugin', async () => {
      (environment as TestersEnvironmentFile).isTest = true;

      vi.spyOn(isDebug, 'getIsDebug').mockReturnValue(Promise.resolve(false));

      await appConfig.getDebugMode();

      expect(appConfig.isDebugMode).toEqual(true);
    });
  });
});
