import { NavigationExtras } from '@angular/router';

export class RouterMock {
  navigate = (commands: any[], extras?: NavigationExtras): Promise<boolean> => Promise.resolve(true);
  url = '/url';
}
