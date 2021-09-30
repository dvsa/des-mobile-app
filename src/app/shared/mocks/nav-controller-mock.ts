export class NavControllerMock {
  navigateBack = jasmine.createSpy('navigateBack').and.returnValue(Promise.resolve(true));
}
