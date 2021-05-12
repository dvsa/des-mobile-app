export class CompletedTestPersistenceProviderMock {
  persistCompletedTests = jasmine.createSpy('persistCompletedTests');
  loadCompletedPersistedTests = jasmine.createSpy('loadCompletedPersistedTests');
  clearPersistedCompletedTests = jasmine.createSpy('clearPersistedCompletedTests');
}
