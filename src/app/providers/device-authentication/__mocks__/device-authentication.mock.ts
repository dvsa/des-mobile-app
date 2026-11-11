import { Injectable } from '@angular/core';
import { vi } from 'vitest';

@Injectable({
  providedIn: 'root',
})
export class DeviceAuthenticationProviderMock {
  triggerLockScreen = vi.fn().mockReturnValue(Promise.resolve(true));
}
