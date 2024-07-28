export class DataStoreProviderMock {
	setItem = jasmine.createSpy('setItem').and.returnValue(Promise.resolve('set'));

	getItem = jasmine.createSpy('getItem').and.returnValue(Promise.resolve('get'));

	setSecureContainer = jasmine.createSpy('setSecureContainer').and.returnValue(Promise.resolve());

	createContainer = jasmine.createSpy('createContainer').and.returnValue(Promise.resolve());

	removeItem = jasmine.createSpy('removeItem');

	getKeys = jasmine.createSpy('getKeys').and.returnValue(Promise.resolve(['TESTS']));

	migrateKey = jasmine.createSpy('migrateKey').and.returnValue(Promise.resolve());

	migrateAllKeys = jasmine.createSpy('migrateAllKeys').and.returnValue(Promise.resolve());

	hasStorageBeenMigrated = jasmine.createSpy('hasStorageBeenMigrated').and.returnValue(Promise.resolve(false));
}
