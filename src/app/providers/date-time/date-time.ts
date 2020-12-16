import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';

import { DateTime } from '../../shared/helpers/date-time';
import { AppConfigProvider } from '../app-config/app-config';

@Injectable()
export class DateTimeProvider {

  constructor(private appConfigProvider: AppConfigProvider) {}

  public now(): DateTime {
    const { timeTravelDate } = this.appConfigProvider.getAppConfig();
    if (isEmpty(timeTravelDate)) {
      return new DateTime();
    }
    return DateTime.at(timeTravelDate);
  }

}
