import { Application } from '@dvsa/mes-journal-schema';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';

/**
 * Formats booking reference into a string with spaces.
 *
 * @returns The booking reference, formatted
 * @param val
 */
export const formatVisualBookingReference = (val: string): string => {
  if (val) {
    const raw = formatBookingReferenceForBackend(val?.replace(/\s+/g, '').toUpperCase());

    const a = raw.slice(0, 1);
    const b = raw.slice(1, 4);
    const c = raw.slice(4, 7);
    const d = raw.slice(7, 9);
    const e = raw.slice(9, 10);

    let result = a;
    if (b) result += ` ${b}`;
    if (c) result += ` ${c}`;
    if (d) result += ` ${d}`;
    if (e) result += e;

    return result;
  }
  return val;
};

/**
 * Removes spaces and symbols from the booking reference and convert the value to uppercase.
 *
 * @returns The booking reference with spaces and symbols removed, in uppercase.
 * @param val
 */
export const formatBookingReferenceForBackend = (val: string) => {
  if (val) {
    return val?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  }
  return '';
};

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

/**
 * Gets the relatve application reference for a test once it has reached the results db.
 *
 * This method returns the slot id if the test is sourced from DSP
 *
 * @param journalData
 */
export const getResultTableApplicationReference = (journalData: JournalData): number => {
  if (journalData.applicationReference?.bookingReference) {
    return journalData.testSlotAttributes.slotId;
  }
  return Number(
    formatApplicationReference({
      applicationId: journalData.applicationReference.applicationId,
      bookingSequence: journalData.applicationReference.bookingSequence,
      checkDigit: journalData.applicationReference.checkDigit,
    })
  );
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
