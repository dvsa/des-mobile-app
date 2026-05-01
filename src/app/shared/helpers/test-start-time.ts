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

  const startDateTemp = DateTime.at(startDateTime).getAsDate();

  startDateTemp.setFullYear(year, month - 1, day);
  // Database schema accepts only 19 characters for the start date time property
  return DateTime.at(startDateTemp).format("yyyy-MM-dd'T'HH:mm:ss");
}

/**
 * Checks if an inputDate is in range regarding currentDate
 * @param inputDate format: yyyy-MM-dd
 * @param currentDate format: yyyy-MM-dd
 */
export function isValidStartDate(inputDate: string, currentDate: string): boolean {
  const inputDateTime = DateTime.at(inputDate);
  const currentDateTime = DateTime.at(currentDate);

  if (inputDateTime.isAfter(currentDateTime)) {
    // inputDate is in the future
    return false;
  }

  const oneYearAgo = currentDateTime.subtract(1, Duration.YEAR);

  return inputDateTime.isSameOrAfter(oneYearAgo);
}
