import { TestSlot } from '@dvsa/mes-journal-schema';

// eslint-disable-next-line max-len
export const bookedTestMockHash: string = 'H4sIAAAAAAAAA21TwY7aMBD9lchnkJwEFsItG9i2UkurgqpWVQ/GHoi1Tpzazi5o1X/fmSTLAuop9rw345k3Ly9sZ+2jrg9s8cJE0xgtRdC2vrl+UmwRJ+lkejcbvWVs4G8LtQS2SEdMliAfl/qgAxJHDOqgg4EKvwUhbLEXxgMCxwC1ArUFH87BxtmDA+/1E+RS4uGM+AakFmYNoDDIClErrUSAqBQ+Uidv4KgFu+YVVmFP7NdqcwOs/vd2wEuBFQ/WnTArjzHpCUotDXwA4Xb2SNE22AqFkAg+g/HlRYl/OPxbW6Ta+ZIr5bpZUMn++FnXEGO5ONqETlb8OoCAVS8YCTI2toLGCBT3CkoHKNjnGpHG+iD7afP7OInSYsku2+m2xuOLyFpUXZN77XzoL+zBWEd79FjRiHP4G07vLT3TrRIjXzROg/WVw0W5dVvtwBFxlX/f8HiaJDzPso8FZlR2pw1swUBT2ppy+exuOol6C1HnTlfCna4YBEZosHnGaXEgba1uOZM0iSOezbEacmiir/t77UJJqmbZfMzjcUorhFDWWupwGtyQY+xA26eOH2iKxsGTtq1HT0kwZnD9b5bLENl9VIvQOmB/kOmNDUsIQhuSTrVu4E5nPdbLTDr7IBz6giU8zsYcu5lv+RyxBef0ZOc1/CVcb5TuRMlTGms0BAb5V0dRNQYiclo0JCEFNz5MtPq5LWKqOrh1e2pggIp3D2+wv3dkRj+gqNBJ7of2OnT/fe/iV2JTfUEJBAAA';

export const bookedTestMock: TestSlot = {
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
      testCategory: 'B',
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
    start: '2019-08-22T08:10:00',
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
