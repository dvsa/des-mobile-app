import { vi } from 'vitest';
export class InsomniaMock {
  keepAwake = vi.fn().mockReturnValue(Promise.resolve());
  allowSleepAgain = vi.fn();
}
