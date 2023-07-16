import { isEmpty } from 'lodash';
import { Application, Candidate, TestSlot } from '@dvsa/mes-journal-schema';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { Details } from '@pages/candidate-details/candidate-details.page.model';
import { getSlotType } from '@shared/helpers/get-slot-type';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { SlotComponent } from '@components/test-slot/slot/slot';

export const getTime = (slot: any): string => slot.slotDetail.start;

export const isCandidateCommentsEmpty = (slot: any): boolean => {
  return isEmpty(slot.booking.previousCancellation);
};

export const getCandidateId = (slot: TestSlot): string => slot.booking.candidate.candidateId?.toString();
export const isCandidateSpecialNeeds = (slot: TestSlot): boolean => !isEmpty(slot.booking.application.specialNeeds);
export const isCandidateCheckNeeded = (slot: TestSlot): boolean => slot.booking.application.entitlementCheck;
export const getEntitlementCheckText = (): string => 'Entitlement check is required. Call deployment';
export const getSlotChanged = (slot: SlotComponent): boolean => slot.hasSlotChanged;
export const getFitMarker = (slot: TestSlot): boolean => slot.booking.application.fitMarker;
export const getFitCaseNumber = (slot: TestSlot): string => slot.booking.application.fitCaseNumber;
export const isCategoryEntitlementChecked = (
  slot: TestSlot,
): boolean => slot.booking.application.categoryEntitlementCheck;
export const getCategoryEntitlementCheckText = (slot: TestSlot): string =>
  `Check DVLA email confirming entitlement for Cat ${slot.booking.application.testCategory} test.`;

export const getPhoneNumber = (candidate: Candidate): string => {
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

    email: slot.booking.candidate.emailAddress || 'e-mail unavailable',
    address: slot.booking.candidate.candidateAddress,
  };
  return details;
};

export const getBusiness = (slot: any) => slot.booking.business;
