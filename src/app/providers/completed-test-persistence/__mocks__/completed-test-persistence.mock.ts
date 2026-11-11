import { vi } from 'vitest';
export class CompletedTestPersistenceProviderMock {
  persistCompletedTests = vi.fn();
  loadCompletedPersistedTests = vi.fn();
  clearPersistedCompletedTests = vi.fn();
}
