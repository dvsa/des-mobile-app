import { of } from 'rxjs';
import { vi } from 'vitest';

export class ApplicationRefMock {
  tick = vi.fn();

  isStable = vi.fn().mockReturnValue(of(true));
}
