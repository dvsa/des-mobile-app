import { vi } from 'vitest';
export class TestPersistenceProviderMock {
  persistTests = vi.fn();
  loadPersistedTests = vi.fn();
  clearPersistedTests = vi.fn();
}
