export class DataStoreProviderMock {
  initDataStore = jasmine.createSpy('initDataStore').and.callThrough();

  setItem = jasmine.createSpy('setItem').and.returnValue(Promise.resolve('set'));

  getItem = jasmine.createSpy('getItem').and.returnValue(Promise.resolve('get'));

  removeItem = jasmine.createSpy('removeItem');

  getKeys = jasmine.createSpy('getKeys').and.returnValue(Promise.resolve(['TESTS']));
}
