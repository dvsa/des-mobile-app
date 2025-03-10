import * as moment from 'moment';
import {Moment} from 'moment';
import {DurationInputArg1, MomentInput} from 'moment/moment';

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
  CUSTOM = 'custom',
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

  month(): number {
    return this.moment.month();
  }

  year(): number {
    return this.moment.year();
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

  isBetweenTwoDates(date1: DateTime, date2: DateTime, isTimeless = true): boolean {
    // Initialize the start and end dates for comparison
    let compareStartDate: moment.Moment = null;
    let compareEndDate: moment.Moment = null;

    // Determine the start and end dates based on the order of date1 and date2
    if (date2.isAfter(date1.moment)) {
      compareStartDate = isTimeless ? date1.moment.startOf(Duration.DAY) : date1.moment;
      compareEndDate = isTimeless ? date2.moment.endOf(Duration.DAY) : date2.moment;
    } else {
      compareStartDate = isTimeless ? date2.moment.startOf(Duration.DAY) : date2.moment;
      compareEndDate = isTimeless ? date1.moment.endOf(Duration.DAY) : date1.moment;
    }
    // Check if the current moment is within the start and end dates
    return this.moment.isSameOrBefore(compareEndDate) && this.moment.isSameOrAfter(compareStartDate);
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

  getDatesBetweenTwoDates(endDate: DateTime): DateTime[] {
    const dates: DateTime[] = [];

    const currDate = this.moment.startOf('day');
    const lastDate: Moment = endDate.moment.startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(new DateTime(currDate.clone().toDate()));
    }

    return dates;
  }

  static datePickerInputToString(date) {
    return moment()
      .year(date.year)
      .month(date.month - 1)
      .date(date.day)
      .format('YYYY-MM-DD');
  }
}
