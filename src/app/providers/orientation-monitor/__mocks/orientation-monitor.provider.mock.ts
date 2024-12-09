export class OrientationMonitorProviderMock {
  tearDownListener = jasmine.createSpy('tearDownListener').and.returnValue(Promise.resolve());

  monitorOrientation = jasmine.createSpy('monitorOrientation').and.returnValue(Promise.resolve());
}
