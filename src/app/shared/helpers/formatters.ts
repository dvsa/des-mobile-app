import { Application } from '@dvsa/mes-journal-schema';

/**
 * Formats application reference as a single number, of the form <``app-id``><``book-seq``><``check-digit``>.
 *
 * @param appRef The application reference, as separate fields
 * @returns The app id, booking sequence (padded to 2 digits) and check digit
 */
export const formatApplicationReference = (appRef: Application): string => {
  const formatter = Intl.NumberFormat('en-gb', { minimumIntegerDigits: 2 });
  return `${appRef.applicationId}${formatter.format(appRef.bookingSequence)}${appRef.checkDigit}`;
};

export const removeLeadingZeros = (value: string): string => {
  return value.replace(/^0+(?!$)/, '');
};

export const removeNonAlphaNumeric = (value: string): string => {
  return value.replace(/[^a-z0-9+]+/gi, '');
};

export const stripNullishValues = <T>(obj: T): Partial<T> => {
  const isNilOrNaN = <V>(val: V): boolean => val === null || val === '' || val === undefined || Number.isNaN(val);

  return Object.fromEntries(Object.entries(obj).filter(([, value]) => !isNilOrNaN(value))) as Partial<T>;
};

export const getApplicationId = (appRef: Application): string => {
  if (appRef?.bookingReference) {
    return appRef.bookingReference;
  }
  return appRef.applicationId.toString();
};

export const getFormattedApplicationReference = (appRef: Application): string => {
  if (appRef?.bookingReference) {
    return appRef.bookingReference;
  }
  return formatApplicationReference({
    applicationId: appRef.applicationId,
    bookingSequence: appRef.bookingSequence,
    checkDigit: appRef.checkDigit,
  });
};
