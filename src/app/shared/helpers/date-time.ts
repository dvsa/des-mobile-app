import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);

export enum Duration {
  YEAR = 'year',
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
}

export enum DateRange {
  TODAY = 'today',
  WEEK = '7 days',
  FORTNIGHT = '14 days',
  THIRTY_DAYS = '30 days',
  NINETY_DAYS = '90 days',
  ONE_YEAR = '1 year',
  EIGHTEEN_MONTHS = '18 months',
}

export type TimezoneOptions = 'UTC' | 'UK';

export class DateTime {
  dayjs: Dayjs;
  timeZone: TimezoneOptions = 'UTC';

  constructor(sourceDateTime?: DateTime | string | Date, timeZone: TimezoneOptions = 'UTC', keepLocalTime = false) {
    if (sourceDateTime === undefined || sourceDateTime === null) {
      this.dayjs = dayjs();
    } else if (typeof sourceDateTime === 'string') {
      this.dayjs = dayjs(new Date(sourceDateTime));
    } else if (sourceDateTime instanceof Date) {
      this.dayjs = dayjs(sourceDateTime);
    } else {
      this.dayjs = dayjs(sourceDateTime.dayjs);
    }

    this.timeZone = timeZone;

    switch (timeZone) {
      case 'UTC':
        this.dayjs = this.dayjs.utc(keepLocalTime);
        break;
      case 'UK':
        this.dayjs = this.dayjs.tz('Europe/London', keepLocalTime);
        break;
    }
  }

  static at(
    sourceDateTime: DateTime | string | Date,
    timeZone: TimezoneOptions = 'UTC',
    keepLocalTime = false
  ): DateTime {
    return new DateTime(sourceDateTime, timeZone, keepLocalTime);
  }

  add(amount: number, unit: dayjs.ManipulateType): DateTime {
    this.dayjs = this.dayjs.add(amount, unit);
    return this;
  }

  subtract(amount: number, unit: dayjs.ManipulateType): DateTime {
    this.dayjs = this.dayjs.subtract(amount, unit);
    return this;
  }

  format(formatString: string): string {
    return this.dayjs.format(formatString);
  }

  day(): number {
    return this.dayjs.day();
  }

  toString(): string {
    return this.dayjs.toString();
  }

  toISOString(): string {
    return this.dayjs.toISOString();
  }

  isAfter(targetDate: DateTime): boolean {
    return this.dayjs.isAfter(targetDate.dayjs);
  }

  diff(targetDate: DateTime, duration: Duration, precise?: boolean): number {
    return this.dayjs.diff(targetDate.dayjs, duration, precise);
  }

  startOf(timeUnit: Duration) {
    return this.dayjs.startOf(timeUnit);
  }

  daysDiff(targetDate: DateTime): number {
    const today = this.dayjs.startOf(Duration.DAY);
    return targetDate.dayjs.startOf(Duration.DAY).diff(today, Duration.DAY);
  }

  compareDuration(targetDate: DateTime, duration: Duration): number {
    return targetDate.dayjs.diff(this.dayjs, duration);
  }

  isBefore(targetDate: DateTime): boolean {
    return targetDate.dayjs.diff(this.dayjs, Duration.SECOND) > 0;
  }

  isDuringDateRange(range: DateRange): boolean {
    const today = dayjs().startOf(Duration.DAY);

    const dateRange = (() => {
      switch (range) {
        case DateRange.TODAY:
          return today;
        case DateRange.WEEK:
          return today.subtract(1, 'week');
        case DateRange.FORTNIGHT:
          return today.subtract(2, 'weeks');
        case DateRange.THIRTY_DAYS:
          return today.subtract(30, 'days');
        case DateRange.NINETY_DAYS:
          return today.subtract(90, 'days');
        case DateRange.ONE_YEAR:
          return today.subtract(1, 'year');
        case DateRange.EIGHTEEN_MONTHS:
          return today.subtract(18, 'months');
        default:
          return null;
      }
    })();

    return this.dayjs.isSameOrAfter(dateRange);
  }

  static today(): Date {
    return dayjs().toDate();
  }
}
