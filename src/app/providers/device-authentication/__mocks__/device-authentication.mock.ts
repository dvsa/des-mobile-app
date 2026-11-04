import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceAuthenticationProviderMock {
  triggerLockScreen = jasmine.createSpy('triggerLockScreen').and.returnValue(Promise.resolve(true));
}
