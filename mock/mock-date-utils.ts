import { get } from 'lodash';
import { DateTime } from '../src/app/shared/helpers/date-time';

export const getTodayAsIsoDate = () => new Date().toISOString()
  .split('T')[0];

export const getIsoDateDaysInFuture = (daysAhead: number) => {
  const today = new DateTime();
  const futureDate = today.add(daysAhead, 'days');
  return futureDate.format('YYYY-MM-DD');
};

export const getNextWorkingDayAsIsoDate = () => {
  const today = new DateTime();
  const sunday = 0;
  let nextWorkingDay = today.add(1, 'day');
  if (today.day() === sunday) {
    nextWorkingDay = nextWorkingDay.add(1, 'day');
  }
  return nextWorkingDay.toISOString()
    .split('T')[0];
};

export const getPreviousWorkingDayAsIsoDate = () => {
  const today = new DateTime();
  const sunday = 0;
  let previousWorkingDay = today.add(-1, 'day');
  if (today.day() === sunday) {
    previousWorkingDay = previousWorkingDay.add(-1, 'day');
  }
  return previousWorkingDay.toISOString()
    .split('T')[0];
};

export const inNext2Days = <T>(section: T): boolean => {
  const slotDate = get(section, 'slotDetail.start', '') as string;

  const now = new DateTime();

  const today: boolean = DateTime.at(slotDate)
    .moment
    .isSame(now.moment, 'day');
  const tomorrow: boolean = DateTime.at(slotDate)
    .moment
    .isSame(now.moment.add(1, 'day'), 'day');

  return today || tomorrow;
};
