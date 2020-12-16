import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { AppInfoProvider } from '../../app/providers/app-info/app-info';
import { DateTimeProvider } from '../../app/providers/date-time/date-time';
import { AuthenticationProvider } from '../../app/providers/authentication/authentication';

@Injectable()
export class AppInfoEffects {

  constructor(
    private actions$: Actions,
    private appInfoProvider: AppInfoProvider,
    private dateTimeProvider: DateTimeProvider,
    private authenticationProvider: AuthenticationProvider,
  ) {}

}
