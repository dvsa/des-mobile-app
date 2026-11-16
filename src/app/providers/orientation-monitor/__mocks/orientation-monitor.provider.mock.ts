import { vi } from 'vitest';
export class OrientationMonitorProviderMock {
  tearDownListener = vi.fn().mockReturnValue(Promise.resolve());

  monitorOrientation = vi.fn().mockReturnValue(Promise.resolve());
}
