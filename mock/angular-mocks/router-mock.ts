import { Event } from '@angular/router';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

export class RouterMock {
  events = new Subject<Event>();

  url = '/url';

  routerState = { root: '' };

  navigate = vi.fn().mockResolvedValue(true);

  navigateByUrl = vi.fn().mockResolvedValue(true);

  getCurrentNavigation = vi.fn().mockReturnValue({ extras: { state: { hasNavigatedFromUnsubmitted: true } } });
}
