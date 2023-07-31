export class RouterMock {
  url = '/url';

  navigate = jasmine.createSpy('navigate')
    .and
    .returnValue(Promise.resolve(true));

  navigateByUrl = jasmine.createSpy('navigateByUrl')
    .and
    .returnValue(Promise.resolve(true));

  getCurrentNavigation = jasmine.createSpy('getCurrentNavigation')
    .and
    .returnValue({ extras: { state: { hasNavigatedFromUnsubmitted: true } } });
}
