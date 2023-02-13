import { Navigation, NavigationExtras } from '@angular/router';

export class RouterMock {
  navigate = (commands: any[], extras?: NavigationExtras): Promise<boolean> => Promise.resolve(true);
  getCurrentNavigation = () => {return { extras: { state: { hasNavigatedFromUnsubmitted: true } } }};
  url = '/url';
}
