/* eslint-disable */
import { DataStoreProvider } from '@providers/data-store/data-store';
import { SecureStorageObject } from '@awesome-cordova-plugins/secure-storage';
import { TestBed } from '@angular/core/testing';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { provideMockStore } from '@ngrx/store/testing';
import { Log, LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';

describe('DataStoreProvider', () => {
  let provider: DataStoreProvider;
  let store$: Store<StoreModel>;
  let platform: Platform;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataStoreProvider,
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        provideMockStore(),
      ],
    });

    provider = TestBed.inject(DataStoreProvider);
    store$ = TestBed.inject(Store);
    platform = TestBed.inject(Platform);
    spyOn(store$, 'dispatch');
    spyOn(platform, 'is')
      .and
      .returnValue(true);
  });

  describe('setSecureContainer', () => {
    it('should set secureContainer', () => {
      provider.secureContainer = {} as SecureStorageObject;
      provider.setSecureContainer(null);
      expect(provider.secureContainer)
        .toEqual(null);
    });
  });

  describe('getSecureContainer', () => {
    it('should return secureContainer', () => {
      provider.secureContainer = {} as SecureStorageObject;
      expect(provider.getSecureContainer())
        .toEqual({} as SecureStorageObject);
    });
  });

  describe('getKeys', () => {
    it('should return an empty string if secureContainer is null', async () => {
      provider.secureContainer = null;
      expect(await provider.getKeys())
        .toEqual(['']);
    });
    it('should return testData if secureContainer is not null', async () => {
      provider.secureContainer = {
        keys(): Promise<string[]> {
          return Promise.resolve(['testData']);
        },
      } as SecureStorageObject;
      expect(await provider.getKeys())
        .toEqual(['testData']);
    });
  });

  describe('getItem', () => {
    it('should return an empty string if secureContainer is null', async () => {
      provider.secureContainer = null;
      expect(await provider.getItem(null))
        .toEqual('');
    });
    it('should return testData if secureContainer is not null', async () => {
      provider.secureContainer = {
        get(key: string): Promise<string> {
          return Promise.resolve('testData');
        },
      } as SecureStorageObject;
      expect(await provider.getItem(null))
        .toEqual('testData');
    });
  });

  describe('setItem', () => {
    it('should return an empty string if secureContainer is null', async () => {
      provider.secureContainer = null;
      expect(await provider.setItem(null, null))
        .toEqual('');
    });
    it('should return testData if secureContainer is not null', async () => {
      provider.secureContainer = {
        set(key: string, value: string): Promise<any> {
          return Promise.resolve('testData');
        },
      } as SecureStorageObject;
      expect(await provider.setItem(null, null))
        .toEqual('testData');
    });
    it('should return an error string if the function throws an error', async () => {
      provider.secureContainer = {
        set(key: string, value: string): Promise<any> {
          return Promise.resolve('testData');
        },
      } as SecureStorageObject;
      spyOn(provider.secureContainer, 'set')
        .and
        .returnValue(Promise.reject('error'));

      try {
        await provider.setItem(null, null);
      } catch (err) {
        expect(err)
          .toEqual('error');
      }
    });
  });
  describe('removeItem', () => {
    it('should return an empty string if secureContainer is null', async () => {
      provider.secureContainer = null;
      expect(await provider.removeItem(null))
        .toEqual('');
    });
    it('should return an empty string if secureContainer is null', async () => {
      provider.secureContainer = {
        remove(key: string, value: string): Promise<any> {
          return Promise.resolve('testData');
        },
      } as SecureStorageObject;
      expect(await provider.removeItem(null))
        .toEqual('testData');
    });
    it('should return an error string if the function throws an error', async () => {
      provider.secureContainer = {
        remove(key: string): Promise<any> {
          return Promise.resolve('testData');
        },
      } as SecureStorageObject;
      spyOn(provider.secureContainer, 'remove')
        .and
        .returnValue(Promise.reject('error'));

      await provider.removeItem('key');

      expect(store$.dispatch)
        .toHaveBeenCalledWith(SaveLog({
          payload: {
            message: 'error',
            type: LogType.ERROR,
            timestamp: 123,
            description: 'Description',
            appVersion: '1.1.0',
            iosVersion: '1.0.0',
            deviceId: 'fb455c20-c025-4d6b-bbf2-aab80af6efb8',
            drivingExaminerId: 'testData',
          } as Log,
        }));
    });
  });

});
