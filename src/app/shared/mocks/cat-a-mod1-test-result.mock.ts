import { TestResultCatAM1Schema } from '@dvsa/mes-test-schema/categories/AM1';

export const categoryAM1TestResultMock: TestResultCatAM1Schema = {
  rekey: false,
  version: '3.19.1',
  category: 'EUAM1',
  testData: {
    ETA: {

    },
    avoidance: {
      firstAttempt: 14,
    },
    drivingFaults: {

    },
    emergencyStop: {
      firstAttempt: 13,
    },
    seriousFaults: {

    },
    dangerousFaults: {

    },
    singleFaultCompetencies: {

    },
  },
  journalData: {
    examiner: {
      staffNumber: '10000010',
      individualId: 1000010,
    },
    candidate: {
      gender: 'F',
      candidateId: 5678,
      dateOfBirth: '1982-06-25',
      driverNumber: 'CATA112345678902',
      emailAddress: 'mobexaminer@gmail.com',
      candidateName: {
        title: 'Mr',
        lastName: 'Colon',
        firstName: 'Fred',
      },
      ethnicityCode: 'D',
      mobileTelephone: '(936) 552-2157',
      candidateAddress: {
        postcode: 'SA01 8PP',
        addressLine1: '7 Bond Street',
        addressLine2: 'James Town',
        addressLine3: 'Golden gun County',
        addressLine4: 'Thunder ball Nation',
        addressLine5: 'Sky fall Continent',
      },
      primaryTelephone: '(007) 007-7777',
    },
    testCentre: {
      centreId: 54321,
      costCode: 'EXTC1',
      centreName: 'Example Test Centre',
    },
    testSlotAttributes: {
      start: '2020-02-13T08:10:00',
      slotId: 3900,
      slotType: 'Standard Test',
      welshTest: false,
      extendedTest: false,
      specialNeeds: false,
      vehicleTypeCode: 'C',
      entitlementCheck: false,
      examinerVisiting: false,
      specialNeedsCode: 'NONE',
      specialNeedsArray: [
        'None',
      ],
      previousCancellation: [
        'Act of nature',
      ],
    },
    applicationReference: {
      checkDigit: 1,
      applicationId: 20123000,
      bookingSequence: 1,
    },
  },
  rekeyReason: {
    other: {
      reason: '',
      selected: false,
    },
    transfer: {
      selected: false,
    },
    ipadIssue: {
      lost: false,
      broken: false,
      stolen: false,
      selected: false,
      technicalFault: false,
    },
  },
  testSummary: {
    D255: true,
    debriefWitnessed: true,
  },
  activityCode: '1',
  changeMarker: false,
  accompaniment: {

  },
  examinerKeyed: 10000010,
  examinerBooked: 10000010,
  passCompletion: {
    passCertificateNumber: 'A123456x',
  },
  vehicleDetails: {
    gearboxCategory: 'Manual',
    registrationNumber: 'FHKKK',
  },
  examinerConducted: 10000010,
  communicationPreferences: {
    updatedEmail: 'test@test.com',
    conductedLanguage: 'English',
    communicationMethod: 'Email',
  },
};
