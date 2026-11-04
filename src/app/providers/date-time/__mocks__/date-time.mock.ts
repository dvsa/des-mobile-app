import { Injectable } from '@angular/core';
import { DateTime } from '@shared/helpers/date-time';

@Injectable({
  providedIn: 'root',
})
export class DateTimeProviderMock {
  public now(): DateTime {
    return DateTime.at('2019-02-01');
  }
}
