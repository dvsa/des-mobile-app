export class NavControllerMock {
  navigateBack = jasmine.createSpy('navigateBack').and.returnValue(Promise.resolve(true));
  back = jasmine.createSpy('back').and.returnValue(Promise.resolve(true));
}
