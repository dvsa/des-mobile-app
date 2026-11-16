import { vi } from 'vitest';
export class NavControllerMock {
  navigateBack = vi.fn().mockReturnValue(Promise.resolve(true));
  back = vi.fn().mockReturnValue(Promise.resolve(true));
}
