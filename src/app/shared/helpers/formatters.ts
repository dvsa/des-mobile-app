import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';

/**
 * Formats application reference as a single number, of the form <``app-id``><``book-seq``><``check-digit``>.
 *
 * @param appRef The application reference, as separate fields
 * @returns The app id, booking sequence (padded to 2 digits) and check digit
 */
export const formatApplicationReference = (appRef: ApplicationReference): string => {
  const formatter = Intl.NumberFormat('en-gb', { minimumIntegerDigits: 2 });
  return `${appRef.applicationId}${formatter.format(appRef.bookingSequence)}${appRef.checkDigit}`;
};

export const removeLeadingZeros = (value: string): string => {
  return value.replace(/^0+(?!$)/, '');
};

export const removeNonAlphaNumeric = (value: string): string => {
  return value.replace(/[^a-z0-9+]+/gi, '');
};
