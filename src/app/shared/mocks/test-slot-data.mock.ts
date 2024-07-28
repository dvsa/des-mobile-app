import { TestSlot } from '@dvsa/mes-journal-schema';

export const bookedTestSlotMock: TestSlot = {
  booking: {
    application: {
      applicationId: 1234567,
      bookingSequence: 3,
      checkDigit: 1,
      entitlementCheck: false,
      extendedTest: false,
      progressiveAccess: false,
      specialNeeds: 'Candidate has dyslexia',
      specialNeedsExtendedTest: false,
      testCategory: 'A1',
      welshTest: false,
    },
    candidate: {
      candidateAddress: {
        addressLine1: '1 Station Street',
        addressLine2: 'Someplace',
        addressLine3: 'Sometown',
        postcode: 'AB12 3CD',
      },
      candidateId: 101,
      candidateName: {
        firstName: 'Florences',
        lastName: 'Pearson',
        title: 'Miss',
      },
      driverNumber: 'PEARS015220A99HC',
      mobileTelephone: '07654 123456',
      primaryTelephone: '01234 567890',
      secondaryTelephone: '04321 098765',
      dateOfBirth: '1998-01-31',
      ethnicityCode: 'A',
    },
  },
  slotDetail: {
    duration: 57,
    slotId: 9191911223,
    start: '2019-08-08T08:10:00',
  },
  testCentre: {
    centreId: 54321,
    centreName: 'Example Test Centre',
    costCode: 'EXTC1',
  },
  vehicleTypeCode: 'C',
  vehicleSlotTypeCode: 7,
  examinerVisiting: false,
};
