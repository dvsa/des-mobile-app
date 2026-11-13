import { vi } from 'vitest';
export class DataStoreProviderMock {
  initDataStore = vi.fn();

  setItem = vi.fn().mockReturnValue(Promise.resolve('set'));

  getItem = vi.fn().mockReturnValue(Promise.resolve('get'));

  removeItem = vi.fn();

  getKeys = vi.fn().mockReturnValue(Promise.resolve(['TESTS']));
}
