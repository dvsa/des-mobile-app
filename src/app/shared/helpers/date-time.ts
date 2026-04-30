import {
  add as dfAdd,
  format as dfFormat,
  isAfter as dfIsAfter,
  isBefore as dfIsBefore,
  isEqual as dfIsEqual,
  sub as dfSub,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInYears,
  parseISO,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfSecond,
  startOfYear,
} from 'date-fns';

import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export enum Duration {
  YEAR = 'years',
  DAY = 'days',
  HOUR = 'hours',
  MINUTE = 'minutes',
  SECOND = 'seconds',
  WEEK = 'weeks',
  MONTH = 'months',
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
  date: Date; // always stored as UTC Date
  timeZone: TimezoneOptions = 'UTC';

  constructor(source?: DateTime | string | Date | number, timeZone: 'UTC' | 'UK' = 'UTC', keepLocalTime = false) {
    this.timeZone = timeZone;

    const normalized = this.normalizeInput(source);

    // If input already contains a timezone offset, just parse it.
    const hasOffset = /([Zz]|[+-]\d\d:\d\d)$/.test(normalized);

    if (hasOffset) {
      this.date = new Date(normalized);
      return;
    }

    // Otherwise treat it as a local time in the target zone
    if (timeZone === 'UTC') {
      this.date = parseISO(normalized);
      return;
    }

    if (keepLocalTime) {
      this.date = fromZonedTime(normalized, 'Europe/London');
    } else {
      const d = parseISO(normalized);
      this.date = toZonedTime(d, 'Europe/London');
    }
  }

  private normalizeInput(input?: DateTime | string | Date | number): string {
    if (!input) {
      return new Date().toISOString();
    }

    if (input instanceof DateTime) {
      return input.date.toISOString();
    }

    if (typeof input === 'number') {
      return new Date(input * 1000).toISOString();
    }

    if (typeof input === 'string') {
      //If the input contains slashes of any kind, convert it to a parsable format
      const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (dmy.test(input)) {
        const [_, dd, mm, yyyy] = input.match(dmy);
        return `${yyyy}-${mm}-${dd}`;
      }

      const ymd = /^(\d{4})\/(\d{2})\/(\d{2})$/;
      if (ymd.test(input)) {
        const [_, yyyy, mm, dd] = input.match(ymd);
        return `${yyyy}-${mm}-${dd}`;
      }

      return input;
    }

    return input.toISOString();
  }

  static at(source: DateTime | string | Date, timeZone: TimezoneOptions = 'UTC', keepLocalTime = false): DateTime {
    return new DateTime(source, timeZone, keepLocalTime);
  }

  add(amount: number, unit: Duration): DateTime {
    this.date = dfAdd(this.date, { [unit]: amount });
    return this;
  }

  subtract(amount: number, unit: Duration): DateTime {
    this.date = dfSub(this.date, { [unit]: amount });
    return this;
  }

  format(fmt: string): string {
    return dfFormat(this.date, fmt);
  }

  toString(): string {
    const zone = this.timeZone === 'UK' ? 'Europe/London' : 'UTC';
    return dfFormat(toZonedTime(this.date, zone), "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX");
  }

  isAfter(target: DateTime): boolean {
    return dfIsAfter(this.date, target.date);
  }

  isBefore(target: DateTime): boolean {
    return dfIsBefore(this.date, target.date);
  }

  isSameOrBefore(target: DateTime): boolean {
    return dfIsBefore(this.date, target.date) || dfIsEqual(this.date, target.date);
  }

  isSameOrAfter(target: DateTime): boolean {
    return dfIsAfter(this.date, target.date) || dfIsEqual(this.date, target.date);
  }

  diff(target: DateTime, duration: Duration): number {
    const a = target.date;
    const b = this.date;

    switch (duration) {
      case Duration.YEAR:
        return differenceInYears(a, b);
      case Duration.DAY:
        return differenceInDays(a, b);
      case Duration.HOUR:
        return differenceInHours(a, b);
      case Duration.MINUTE:
        return differenceInMinutes(a, b);
      case Duration.SECOND:
        return differenceInSeconds(a, b);
    }
  }

  daysDiff(target: DateTime): number {
    return differenceInDays(startOfDay(target.date), startOfDay(this.date));
  }

  startOf(unit: Duration): DateTime {
    switch (unit) {
      case Duration.YEAR:
        this.date = startOfYear(this.date);
        break;
      case Duration.DAY:
        this.date = startOfDay(this.date);
        break;
      case Duration.HOUR:
        this.date = startOfHour(this.date);
        break;
      case Duration.MINUTE:
        this.date = startOfMinute(this.date);
        break;
      case Duration.SECOND:
        this.date = startOfSecond(this.date);
        break;
    }
    return this;
  }

  day(): number {
    const zone = this.timeZone === 'UK' ? 'Europe/London' : 'UTC';
    return toZonedTime(this.date, zone).getDay();
  }

  isDuringDateRange(range: DateRange): boolean {
    const comparisonDate = new DateTime().startOf(Duration.DAY);
    const dateRange = (() => {
      switch (range) {
        case DateRange.TODAY:
          return comparisonDate;
        case DateRange.WEEK:
          return comparisonDate.subtract(1, Duration.DAY).subtract(6, Duration.DAY);
        case DateRange.FORTNIGHT:
          return comparisonDate.subtract(14, Duration.DAY);
        case DateRange.THIRTY_DAYS:
          return comparisonDate.subtract(30, Duration.DAY);
        case DateRange.NINETY_DAYS:
          return comparisonDate.subtract(90, Duration.DAY);
        case DateRange.ONE_YEAR:
          return comparisonDate.subtract(1, Duration.YEAR);
        case DateRange.EIGHTEEN_MONTHS:
          return comparisonDate.subtract(18, Duration.MONTH);
      }
    })();
    return this.isSameOrAfter(dateRange);
  }
}
