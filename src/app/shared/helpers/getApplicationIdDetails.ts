import { Application } from '@dvsa/mes-journal-schema';
import { formatApplicationReference } from '@shared/helpers/formatters';

export const getApplicationId = (appRef: Application): string => {
  if (appRef?.bookingId) {
    return appRef.bookingId;
  }
  return appRef.applicationId.toString();
};

export const getFormattedApplicationReference = (appRef: Application): string => {
  if (appRef?.bookingId) {
    return appRef.bookingId;
  }
  return formatApplicationReference({
    applicationId: appRef.applicationId,
    bookingSequence: appRef.bookingSequence,
    checkDigit: appRef.checkDigit,
  });
};
