import { Injectable } from '@angular/core';
import { DateTime } from '@shared/helpers/date-time';
import { isEmpty } from 'lodash-es';
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
