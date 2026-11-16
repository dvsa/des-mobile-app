import { EMPTY } from 'rxjs';
import { vi } from 'vitest';

export class ScreenOrientationMock {
  ORIENTATIONS: {
    PORTRAIT_PRIMARY: string;
    PORTRAIT_SECONDARY: string;
    LANDSCAPE_PRIMARY: string;
    LANDSCAPE_SECONDARY: string;
    PORTRAIT: string;
    LANDSCAPE: string;
    ANY: string;
  } = {
    PORTRAIT_PRIMARY: 'portrait-primary',
    PORTRAIT_SECONDARY: 'portrait-secondary',
    LANDSCAPE_PRIMARY: 'landscape-primary',
    LANDSCAPE_SECONDARY: 'landscape-secondry',
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
    ANY: 'any',
  };

  type: string = this.ORIENTATIONS.ANY;

  onChange = vi.fn().mockReturnValue(EMPTY);

  lock = vi.fn().mockReturnValue(Promise.resolve());

  unlock = vi.fn();
}
