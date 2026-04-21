import { DateTime, Duration } from '@shared/helpers/date-time';

export const PRESS_TIME_TO_ENABLE_EDIT = 10000;

// This function is required for updating incorrect dates of test
// Is mainly used in the office page of Delegated test journies

export function getNewTestStartTime(inputDate: string, startDateTime: string): string {
  const date = inputDate.trim();

  const dateArray = date.split('-').map((d) => Number.parseInt(d, 10));
  const year = dateArray[0];
  const month = dateArray[1];
  const day = dateArray[2];

  let startDateTemp = DateTime.at(startDateTime).dayjs;

  startDateTemp = startDateTemp.date(day);
  startDateTemp = startDateTemp.month(month - 1);
  startDateTemp = startDateTemp.year(year);
  // Database schema accepts only 19 characters for the start date time property
  return startDateTemp.format('YYYY-MM-DDTHH:mm:ss');
}

/**
 * Checks if an inputDate is in range regarding currentDate
 * @param inputDate format: YYYY-MM-DD
 * @param currentDate format: YYYY-MM-DD
 */
export function isValidStartDate(inputDate: string, currentDate: string): boolean {
  if (DateTime.at(inputDate).isAfter(DateTime.at(currentDate))) {
    // inputDate is in the future
    return false;
  }
  return new DateTime(currentDate).diff(DateTime.at(inputDate), Duration.YEAR, true) <= 1;
}
