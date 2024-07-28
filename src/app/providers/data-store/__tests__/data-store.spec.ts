import { TestBed } from '@angular/core/testing';
import { SecureStorageObject } from '@awesome-cordova-plugins/secure-storage';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { StorageMock } from '@mocks/ionic-mocks/storage.mock';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
/* eslint-disable */
import { DataStoreProvider, LocalStorageKey } from '@providers/data-store/data-store';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { Log, LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';

describe('DataStoreProvider', () => {
	let provider: DataStoreProvider;
	let store$: Store<StoreModel>;
	let platform: Platform;
	let secureStorage: SecureStorage;
	let storage: Storage;
	const secureStorageMock: jasmine.SpyObj<SecureStorage> = jasmine.createSpyObj('SecureStorage', {
		create: Promise.resolve({} as SecureStorageObject),
	});
	const mockStorage = {
		[LocalStorageKey.CONFIG]: 'this is the data we want',
		otherKey: 'this is other random data',
	};

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
				{
					provide: SecureStorage,
					useValue: secureStorageMock,
				},
				{
					provide: Storage,
					useValue: StorageMock,
				},
				provideMockStore(),
			],
		});

		provider = TestBed.inject(DataStoreProvider);
		store$ = TestBed.inject(Store);
		platform = TestBed.inject(Platform);
		secureStorage = TestBed.inject(SecureStorage);
		storage = TestBed.inject(Storage);
		spyOn(store$, 'dispatch');
		spyOn(platform, 'is').and.returnValue(true);
		secureStorage.create = jasmine.createSpy().and.returnValue(Promise.resolve({} as SecureStorageObject));
	});

	describe('createContainer', () => {
		it('should create container named DES', async () => {
			spyOn(provider, 'setSecureContainer');
			await provider.createContainer();
			expect(provider.setSecureContainer).toHaveBeenCalledWith({} as SecureStorageObject);
			expect(secureStorage.create).toHaveBeenCalledWith('DES');
		});
		it('should not call set container on thrown error', async () => {
			secureStorage.create = jasmine.createSpy().and.returnValue(Promise.reject('Failed to create container'));
			spyOn(provider, 'setSecureContainer');

			try {
				await provider.createContainer();
			} catch (err) {
				expect(provider.setSecureContainer).not.toHaveBeenCalled();
			}
		});
	});

	describe('setSecureContainer', () => {
		it('should set secureContainer', () => {
			provider.secureContainer = {} as SecureStorageObject;
			provider.setSecureContainer(null);
			expect(provider.secureContainer).toEqual(null);
		});
	});

	describe('getSecureContainer', () => {
		it('should return secureContainer', () => {
			provider.secureContainer = {} as SecureStorageObject;
			expect(provider.getSecureContainer()).toEqual({} as SecureStorageObject);
		});
	});

	describe('getKeys', () => {
		it('should return default when not iOS', async () => {
			spyOn(provider, 'isIos').and.returnValue(false);

			expect(await provider.getKeys()).toEqual(['']);
		});
		it('should get `keys` from storage', async () => {
			spyOn(provider, 'isIos').and.returnValue(true);
			storage.keys = jasmine.createSpy().and.returnValue(['testData']);
			expect(await provider.getKeys()).toEqual(['testData']);
		});
	});

	describe('getItem', () => {
		it('should return default when not iOS', async () => {
			spyOn(provider, 'isIos').and.returnValue(false);

			expect(await provider.getItem(null)).toEqual('');
		});
		it('should `get` data from storage', async () => {
			spyOn(provider, 'isIos').and.returnValue(true);
			storage.get = jasmine.createSpy().and.returnValue('testData');

			await provider.getItem(LocalStorageKey.LOGS);

			expect(storage.get).toHaveBeenCalledWith(LocalStorageKey.LOGS);
		});
	});

	describe('setItem', () => {
		it('should return default when not iOS', async () => {
			spyOn(provider, 'isIos').and.returnValue(false);
			expect(await provider.setItem(null, null)).toEqual('');
		});
		it('should call `set` with a key and a value', async () => {
			spyOn(provider, 'isIos').and.returnValue(true);

			storage.set = jasmine.createSpy().and.returnValue(Promise.resolve());

			await provider.setItem(LocalStorageKey.LOGS, 'val1');

			expect(storage.set).toHaveBeenCalledWith(LocalStorageKey.LOGS, 'val1');
		});
		it('should return an error string if the function throws an error', async () => {
			storage.set = jasmine.createSpy().and.returnValue(Promise.reject('error'));

			try {
				await provider.setItem(LocalStorageKey.LOGS, 'val1');
			} catch (err) {
				expect(err).toEqual('error');
			}
		});
	});
	describe('removeItem', () => {
		it('should return default when not iOS', async () => {
			spyOn(provider, 'isIos').and.returnValue(false);

			expect(await provider.removeItem(null)).toEqual('');
		});
		it('should return an empty string if secureContainer is null', async () => {
			spyOn(provider, 'isIos').and.returnValue(true);

			storage.remove = jasmine.createSpy().and.returnValue(Promise.resolve());

			await provider.removeItem(LocalStorageKey.LOGS);

			expect(storage.remove).toHaveBeenCalledWith(LocalStorageKey.LOGS);
		});
		it('should return an error string if the function throws an error', async () => {
			storage.remove = jasmine.createSpy().and.returnValue(Promise.reject('error'));

			await provider.removeItem(LocalStorageKey.LOGS);

			expect(store$.dispatch).toHaveBeenCalledWith(
				SaveLog({
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
				})
			);
		});
	});

	describe('migrateKey', () => {
		beforeEach(() => {
			storage.set = jasmine.createSpy().and.returnValue(Promise.resolve());

			provider.secureContainer = {
				get(key: string): Promise<string> {
					return mockStorage[key];
				},
				remove(key: string): Promise<string> {
					return;
				},
			} as SecureStorageObject;
		});

		it('should call through to storage.set when they key is found', async () => {
			await provider.migrateKey(LocalStorageKey.CONFIG);
			expect(storage.set).toHaveBeenCalledWith(LocalStorageKey.CONFIG, 'this is the data we want');
		});

		it('should not call set when no key exists in secure container', async () => {
			await provider.migrateKey(LocalStorageKey.LOGS);
			expect(storage.set).not.toHaveBeenCalled();
		});
	});
	describe('migrateAllKeys', () => {
		beforeEach(() => {
			spyOn(provider, 'migrateKey').and.returnValue(Promise.resolve());
		});

		it('should not call migrate when no secureContainer exists', async () => {
			provider.secureContainer = null;

			await provider.migrateAllKeys();

			expect(provider.migrateKey).not.toHaveBeenCalled();
		});

		it('should call migrate for each key found', async () => {
			provider.secureContainer = {
				keys(): Promise<string[]> {
					return Promise.resolve(['key1', 'key2']);
				},
			} as SecureStorageObject;

			await provider.migrateAllKeys();

			expect(provider.migrateKey).toHaveBeenCalledTimes(2);
		});
	});
});
