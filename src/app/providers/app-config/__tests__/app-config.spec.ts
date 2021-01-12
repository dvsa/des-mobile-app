import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

import { AppConfigProvider } from '../app-config';

import { environmentResponseMock } from '../__mocks__/environment-response.mock';
import { remoteEnvironmentMock } from '../__mocks__/environment.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { AppInfoProvider } from '../../app-info/app-info';
import { AppInfoProviderMock } from '../../app-info/__mocks__/app-info.mock';
import { SchemaValidatorProvider } from '../../schema-validator/schema-validator';
import { SchemaValidatorProviderMock } from '../../schema-validator/__mocks__/schema-validator.mock';
import { LogHelper } from '../../logs/logs-helper';
import { LogHelperMock } from '../../logs/__mocks__/logs-helper.mock';

describe('App Config Provider', () => {

  let appConfig: AppConfigProvider;
  let httpMock: HttpTestingController;
  let platform: Platform;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: SchemaValidatorProvider, useClass: SchemaValidatorProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProvider, environmentFile: remoteEnvironmentMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AppInfoProvider, useClass: AppInfoProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });
  });

  beforeEach(() => {
    appConfig = TestBed.inject(AppConfigProvider);
    httpMock = TestBed.inject(HttpTestingController);
    platform = TestBed.inject(Platform);
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

      const request = httpMock.expectOne(`${remoteEnvironmentMock.configUrl}?app_version=1`);
      expect(request.request.method).toBe('GET');
      request.flush(environmentResponseMock);
    }));
  });

  describe('loadMangedConfig', () => {
    it('should load managed config and update environmentFile', () => {
      appConfig.loadManagedConfig();

      expect(appConfig.environmentFile.configUrl).toBe('AppConfigMock');
    });
  });
});
