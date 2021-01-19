import { of } from 'rxjs';

export class AppInfoProviderMock {

  getVersionNumber = jasmine.createSpy('getVersionNumber').and.returnValue(of('4.0.0'));

  getMajorAndMinorVersionNumber = jasmine
    .createSpy('getMajorAndMinorVersionNumber').and.returnValue(Promise.resolve(4.0));
}
