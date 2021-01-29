import { TestResultCatAM2Schema } from '@dvsa/mes-test-schema/categories/AM2';

export const categoryAM2TestResultMock: TestResultCatAM2Schema = {
  rekey: false,
  version: '3.21.2',
  category: 'EUAM2',
  testData: {
    ETA: {
      verbal: false,
    },
    eco: {
      completed: true,
      adviceGivenControl: true,
    },
    eyesightTest: {
      complete: true,
      seriousFault: false,
    },
    drivingFaults: {
      controlsClutch: 1,
    },
    seriousFaults: {},
    dangerousFaults: {},
    testRequirements: {
      hillStart: true,
      angledStart: true,
      normalStart1: true,
      normalStart2: true,
    },
    safetyAndBalanceQuestions: {
      safetyQuestions: [
        {
          code: 'SQ2',
          outcome: 'P',
          description: 'Horn working',
        },
        {
          code: 'SQ6',
          outcome: 'DF',
          description: 'Chain',
        },
      ],
      balanceQuestions: [
        {
          code: 'BQ2',
          outcome: 'DF',
          description: 'Carrying a passenger',
        },
      ],
    },
  },
  journalData: {
    examiner: {
      staffNumber: '10000000',
      individualId: 10000000,
    },
    candidate: {
      gender: 'M',
      candidateId: 3200,
      dateOfBirth: '1982-06-25',
      driverNumber: 'CATA123456789DO4',
      emailAddress: 'mobexaminer@gmail.com',
      candidateName: {
        title: 'Dr',
        lastName: 'Farrell',
        firstName: 'Fox',
      },
      ethnicityCode: 'D',
      mobileTelephone: '(999) 454-3317',
      candidateAddress: {
        postcode: 'BR82 0DE',
        addressLine1: '55 Pierrepont Street',
        addressLine2: 'Clifford Place',
        addressLine3: 'Provost Street',
        addressLine4: 'Bascom',
        addressLine5: 'Address Line 5',
      },
      primaryTelephone: '(805) 405-2289',
    },
    testCentre: {
      centreId: 54321,
      costCode: 'EXTC1',
      centreName: 'Example Test Centre',
    },
    testSlotAttributes: {
      start: '2020-03-05T10:40:00',
      slotId: 1033,
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
      applicationId: 10123433,
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
    D255: false,
    debriefWitnessed: false,
  },
  activityCode: '1',
  changeMarker: false,
  accompaniment: {},
  examinerKeyed: 10000000,
  examinerBooked: 10000000,
  passCompletion: {
    passCertificateNumber: 'c123456x',
    provisionalLicenceProvided: false,
  },
  vehicleDetails: {
    gearboxCategory: 'Manual',
    registrationNumber: '',
  },
  examinerConducted: 10000000,
  preTestDeclarations: {
    preTestSignature: '',
    DL196CBTCertNumber: '',
    insuranceDeclarationAccepted: true,
    residencyDeclarationAccepted: true,
  },
  postTestDeclarations: {
    postTestSignature: '',
    healthDeclarationAccepted: true,
    passCertificateNumberReceived: true,
  },
  communicationPreferences: {
    updatedEmail: 'mobexaminer@gmail.com',
    conductedLanguage: 'English',
    communicationMethod: 'Post',
  },
};
