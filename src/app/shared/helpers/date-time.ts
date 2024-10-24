import * as moment from 'moment';
import { DurationInputArg1, MomentInput } from 'moment/moment';

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
export class DateTime {
  moment: moment.Moment;

  constructor(sourceDateTime?: DateTime | string | Date, inputFormat?: moment.MomentFormatSpecification) {
    if (sourceDateTime === undefined || sourceDateTime === null) {
      this.moment = moment();
    } else if (typeof sourceDateTime === 'string') {
      this.moment = inputFormat ? moment(new Date(sourceDateTime), inputFormat) : moment(new Date(sourceDateTime));
    } else if (sourceDateTime instanceof Date) {
      this.moment = moment(sourceDateTime);
    } else {
      this.moment = moment(sourceDateTime.moment);
    }
  }

  static at(sourceDateTime: DateTime | string | Date): DateTime {
    return new DateTime(sourceDateTime);
  }

  add(amount: DurationInputArg1, unit: moment.unitOfTime.DurationConstructor): DateTime {
    this.moment.add(amount, unit);
    return this;
  }

  subtract(amount: number, unit: moment.unitOfTime.DurationConstructor): DateTime {
    this.moment.subtract(amount, unit);
    return this;
  }

  format(formatString: string): string {
    return this.moment.format(formatString);
  }

  day(): number {
    return this.moment.day();
  }

  toString(): string {
    return this.moment.toString();
  }

  toISOString(): string {
    return this.moment.toISOString();
  }

  isAfter(targetDate: MomentInput): boolean {
    return this.moment.isAfter(targetDate);
  }

  diff(targetDate: MomentInput, duration: Duration, precise?: boolean): number {
    return this.moment.diff(targetDate, duration, precise);
  }

  daysDiff(targetDate: DateTime | string | Date): number {
    const date = new DateTime(targetDate);
    const today = this.moment.startOf(Duration.DAY);
    return date.moment.startOf(Duration.DAY).diff(today, Duration.DAY);
  }

  compareDuration(targetDate: DateTime | string | Date, duration: Duration): number {
    if (typeof targetDate === 'string') {
      return moment(targetDate).diff(this.moment, duration);
    }
    return new DateTime(targetDate).moment.diff(this.moment, duration);
  }

  isBefore(targetDate: DateTime | string | Date): boolean {
    const date = new DateTime(targetDate);
    return date.moment.diff(this.moment, Duration.SECOND) > 0;
  }

  isDuringDateRange(range: DateRange): boolean {
    // Set the current date to today with time set to 00:00:00
    const today = new Date().setHours(0, 0, 0, 0);

    // Determine the date range based on the provided range
    const dateRange = (() => {
      switch (range) {
        // If the range is today, return today's date
        case DateRange.TODAY:
          return moment(today);
        // If the range is a week, return the date a week ago from today
        case DateRange.WEEK:
          return moment(today).subtract(1, 'week');
        // If the range is a fortnight, return the date two weeks ago from today
        case DateRange.FORTNIGHT:
          return moment(today).subtract(2, 'weeks');
        // If the range is thirty days, return the date thirty days ago from today
        case DateRange.THIRTY_DAYS:
          return moment(today).subtract(30, 'days');
        // If the range is ninety days, return the date ninety days ago from today
        case DateRange.NINETY_DAYS:
          return moment(today).subtract(90, 'days');
        // If the range is one year, return the date one year ago from today
        case DateRange.ONE_YEAR:
          return moment(today).subtract(1, 'year');
        // If the range is eighteen months, return the date eighteen months ago from today
        case DateRange.EIGHTEEN_MONTHS:
          return moment(today).subtract(18, 'months');
        // If the range is not recognized, return null
        default:
          return null;
      }
    })();

    // Check if the current moment is the same or after the calculated date range
    return this.moment.isSameOrAfter(dateRange);
  }

  static today(): Date {
    return moment().toDate();
  }

  static datePickerInputToString(date: any) {
    return moment()
      .year(date.year)
      .month(date.month - 1)
      .date(date.day)
      .format('YYYY-MM-DD');
  }
}
