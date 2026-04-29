import { Application } from '@dvsa/mes-journal-schema';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';

/**
 * Provides a mask for input fields, forcing booking references into 1 of 2 formats depending on whether the first input is a letter.
 *
 * @returns The mask
 * @param val
 */
export const bookingReferenceMask: MaskitoOptions = {
  mask: ({ value }) => {
    if (/^\d/.test(value)) {
      return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    }
    return [/[D]/i, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /[ABCDEFGHJKLMNPQRTUVWXYZ0-9]/i];
  },
};

export const maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

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
