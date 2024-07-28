export class TestPersistenceProviderMock {
  persistTests = jasmine.createSpy('persistTests');
  loadPersistedTests = jasmine.createSpy('loadPersistedTests');
  clearPersistedTests = jasmine.createSpy('clearPersistedTests');
}
