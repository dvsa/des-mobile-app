export class RouterMock {
  url = '/url';

  routerState = { root: '' };

  navigate = jasmine.createSpy('navigate').and.resolveTo(true);

  navigateByUrl = jasmine.createSpy('navigateByUrl').and.resolveTo(true);

  getCurrentNavigation = jasmine
    .createSpy('getCurrentNavigation')
    .and.returnValue({ extras: { state: { hasNavigatedFromUnsubmitted: true } } });
}
