import * as moment from 'moment';

export const PRESS_TIME_TO_ENABLE_EDIT = 10000;

// This function is required for updating incorrect dates of test
// Is mainly used in the office page of Delegated test journies
// @TODO: MES-7239 refactor this method to use the DateTime class

export function getNewTestStartTime(inputDate: string, startDateTime: string): string {
  const date = inputDate.trim();

  const dateArray = date.split('-').map((d) => parseInt(d, 10));
  const year = dateArray[0];
  const month = dateArray[1];
  const day = dateArray[2];

  const startDateTemp = moment(startDateTime);

  startDateTemp.date(day);
  startDateTemp.month(month - 1);
  startDateTemp.year(year);

  // Database schema accepts only 19 characters for the start date time property
  return startDateTemp.format('YYYY-MM-DDTHH:mm:ss');
}

/**
 * Checks if an inputDate is in range regarding to currentDate
 * @param inputDate format: YYYY-MM-DD
 * @param currentDate format: YYYY-MM-DD
 */
export function isValidStartDate(inputDate: string, currentDate: string): boolean {

  if (moment(inputDate).isAfter(currentDate)) {

    // inputDate is in the future
    return false;
  }

  if (moment(currentDate).diff(inputDate, 'year', true) > 1) {

    // inputDate is more than one year in the past
    return false;
  }

  return true;
}
