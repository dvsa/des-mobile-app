import { of } from 'rxjs';

export class AppInfoProviderMock {

  getVersionNumber = jasmine.createSpy('getVersionNumber').and.returnValue(of('1.0.0'));

  getMajorAndMinorVersionNumber = jasmine
    .createSpy('getMajorAndMinorVersionNumber').and.returnValue(Promise.resolve(1.0));
}
