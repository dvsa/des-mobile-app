import { Application, Candidate } from '@dvsa/mes-journal-schema';
import { end2endPracticeSlotId, testReportPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';

export const testApplicationMock: Application = {
  applicationId: 12345692,
  bookingSequence: 1,
  checkDigit: 9,
  entitlementCheck: false,
  extendedTest: false,
  progressiveAccess: false,
  testCategory: 'B',
  vehicleGearbox: 'Manual',
  welshTest: false,
};

export const candidateMock: Candidate = {
  candidateAddress: {
    addressLine1: 'My House',
    addressLine2: 'Someplace',
    addressLine3: 'Sometown',
    postcode: 'AB45 6CD',
  },
  candidateId: 1,
  candidateName: {
    firstName: 'Practice',
    lastName: 'Mode',
    title: 'Miss',
  },
  driverNumber: 'MODEX625220A99HC',
  mobileTelephone: '07654 123456',
  emailAddress: 'practice@mode.com',
};

export const testReportPracticeModeSlot = {
  slotDetail: {
    slotId: testReportPracticeSlotId,
    duration: 57,
    start: '2019-01-01T10:14:00+00:00',
  },
  booking: {
    application: testApplicationMock,
    candidate: candidateMock,
  },
};

export const end2endPracticeModeSlot = {
  slotDetail: {
    slotId: end2endPracticeSlotId,
    duration: 57,
    start: '2019-01-01T10:14:00+00:00',
  },
  booking: {
    application: testApplicationMock,
    candidate: candidateMock,
  },
};
