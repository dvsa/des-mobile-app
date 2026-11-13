import { vi } from 'vitest';
export class LogsProviderMock {
  sendLogs = vi.fn();
}
