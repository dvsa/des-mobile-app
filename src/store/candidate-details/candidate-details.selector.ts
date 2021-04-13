import { isEmpty } from 'lodash';
import { Application } from '@dvsa/mes-journal-schema';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { Details } from '@pages/candidate-details/candidate-details.page.model';
import { getSlotType } from '@shared/helpers/get-slot-type';
import { formatApplicationReference } from '@shared/helpers/formatters';

export const getCandidateName = (slot: any): string => {
  const { title, firstName, lastName } = slot.booking.candidate.candidateName;
  return title ? `${title} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
};

export const getTime = (slot: any): string => slot.slotDetail.start;

export const isCandidateCommentsEmpty = (slot: any): boolean => {
  return isEmpty(slot.booking.previousCancellation);
};

export const getCandidateId = (slot: any): string => slot.booking.candidate.candidateId;
export const isCandidateSpecialNeeds = (slot: any): boolean => !isEmpty(slot.booking.application.specialNeeds);
export const isCandidateCheckNeeded = (slot: any): boolean => slot.booking.application.entitlementCheck;
export const getEntitlementCheckText = (): string => 'Entitlement check is required. Call deployment';
export const getSlotChanged = (slot: any): boolean => slot.hasSlotChanged;

export const getPhoneNumber = (candidate: any): string => {
  if (!isEmpty(candidate.mobileTelephone)) return candidate.mobileTelephone;
  if (!isEmpty(candidate.primaryTelephone)) return candidate.primaryTelephone;
  if (!isEmpty(candidate.secondaryTelephone)) return candidate.secondaryTelephone;
  return 'No phone number provided';
};

export const getApplicationRef = (application: Application): string => {
  const applicationReference: ApplicationReference = {
    applicationId: application.applicationId,
    bookingSequence: application.bookingSequence,
    checkDigit: application.checkDigit,
  };

  return formatApplicationReference(applicationReference);
};

export const processSpecialNeeds = (slot: any): string | string[] => {
  return slot.booking.application.specialNeeds ? slot.booking.application.specialNeeds.split(';') : 'None';
};

export const getDetails = (slot: any): Details => {
  const details: Details = {
    testCategory: `Category ${slot.booking.application.testCategory}`,
    slotType: getSlotType(slot),
    meetingPlace: slot.booking.application.meetingPlace,
    driverNumber: slot.booking.candidate.driverNumber,
    applicationRef: getApplicationRef(slot.booking.application),
    specialNeeds: processSpecialNeeds(slot),
    candidateComments: {
      isSectionEmpty: isCandidateCommentsEmpty(slot),
      previousCancellations: slot.booking.previousCancellation,
    },
    entitlementCheck: {
      show: isCandidateCheckNeeded(slot),
    },
    phoneNumber: getPhoneNumber(slot.booking.candidate),

    // TODO: remove the string literal when e-mail address is configured in the service
    email: slot.booking.candidate.emailAddress || 'e-mail unavailable',
    address: slot.booking.candidate.candidateAddress,
  };
  return details;
};

export const getBusiness = (slot: any) => slot.booking.business;
