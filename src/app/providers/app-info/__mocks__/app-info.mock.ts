import { of } from 'rxjs';
import { vi } from 'vitest';

export class AppInfoProviderMock {
  getVersionNumber = vi.fn().mockReturnValue(of('4.0.0'));

  getFullVersionNumber = vi.fn().mockReturnValue(Promise.resolve('4.0.0.0'));

  getMajorAndMinorVersionNumber = vi.fn().mockReturnValue(Promise.resolve('4.0'));
}
