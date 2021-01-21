import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';

export const categoryCTestResultMock : CatCUniqueTypes.TestResult = {
  version: '0.0.1',
  category: 'C',
  activityCode: '2',
  rekey: true,
  rekeyDate: '2019-08-05T09:00:00',
  rekeyReason: {
    ipadIssue: {
      selected: true,
      broken: false,
      lost: true,
      technicalFault: false,
      stolen: false,
    },
    transfer: {
      selected: false,
    },
    other: {
      selected: true,
      reason: 'I do not like the app',
    },
  },
  changeMarker: false,
  examinerBooked: 12345678,
  examinerConducted: 12345678,
  examinerKeyed: 12345678,
  journalData: {
    applicationReference: {
      applicationId: 1234567,
      bookingSequence: 20,
      checkDigit: 13,
    },
    candidate: {
      candidateName: {
        title: 'Miss',
        firstName: 'Florence',
        lastName: 'Pearson',
      },
      driverNumber: 'PEARSL6767655777BN',
      emailAddress: 'candidate@candidate.com',
      dateOfBirth: '01-01-2020',
      gender: 'F',
      primaryTelephone: '1234567890',
      mobileTelephone: '2345678901',
      candidateAddress: {
        addressLine1: '999 Letsby Avenue',
        addressLine2: 'Someplace',
        addressLine3: 'Sometown',
        postcode: 'AB67 8CD',
      },
      businessName: 'Logistic and Distribution Training Limited',
      businessAddress: {
        addressLine1: '18 Bridge Street',
        addressLine2: 'Horncastle',
        addressLine3: 'Lincolnshire',
        postcode: 'LN9 5JA',
      },
      businessTelephone: '07988 674 536',
    },
    examiner: {
      individualId: 1,
      staffNumber: '12345678',
    },
    testCentre: {
      centreId: 1,
      costCode: 'EXTC1',
      centreName: 'Example Test Centre',
    },
    testSlotAttributes: {
      slotId: 1,
      start: '2019-07-05T09:00:00',
      extendedTest: false,
      specialNeeds: false,
      specialNeedsArray: ['Candidate is heavily pregnant', 'Candidate whishes to be called a different name'],
      entitlementCheck: true,
      slotType: 'Double Slot Special Needs',
      previousCancellation: ['Act of nature', 'DSA'],
      welshTest: false,
      examinerVisiting: false,
      vehicleTypeCode: 'mock-vehicle-type-code',
    },
  },
  communicationPreferences: {
    communicationMethod: 'Email',
    conductedLanguage: 'English',
    updatedEmail: 'candidate@updated-candidate.com',
  },
  vehicleDetails: {
    gearboxCategory: 'Manual',
    registrationNumber: 'AB12 XYZ',
    vehicleWidth: 3,
    vehicleLength: 10,
  },
  accompaniment: {
    ADI: true,
    interpreter: true,
    other: false,
    supervisor: false,
  },
  passCompletion: {
    passCertificateNumber: 'A123456X',
    provisionalLicenceProvided: true,
    code78Present: true,
  },
  testSummary: {
    D255: false,
    candidateDescription: 'Candidate liked tall cute girls.',
    debriefWitnessed: true,
    independentDriving: 'Sat nav',
    routeNumber: 12345,
    weatherConditions: ['Bright / dry roads', 'Icy'],
    additionalInformation: 'Had time for an extra coffee',
  },
  testData: {
    dangerousFaults: {
      ancillaryControls: true,
      ancillaryControlsComments: 'Candidate did not stop and continued to drive eratically',
    },
    drivingFaults: {
      awarenessPlanning: 2,
      awarenessPlanningComments: 'Candidate nearly killed a dog',
    },
    eco: {
      completed: true,
      adviceGivenControl: true,
      adviceGivenPlanning: false,
    },
    ETA: {
      physical: false,
      verbal: true,
    },
    manoeuvres: {
      reverseLeft: {
        selected: true,
        controlFault: 'DF',
        observationFault: 'S',
        observationFaultComments: 'Candidate nearly hit a little old lady crossing the road',
      },
    },
    seriousFaults: {
      clearance: true,
      clearanceComments: 'Candidate lost the right wing mirror',
    },
    testRequirements: {
      angledStartControlledStop: true,
      downhillStart: true,
      normalStart1: true,
      normalStart2: true,
      uphillStart: true,
    },
    vehicleChecks: {
      showMeQuestions: [
        {
          code: 'S1',
          description: 'Driving indicators',
          outcome: 'P',
        },
        {
          code: 'S2',
          description: 'Doors secure',
          outcome: 'P',
        },
        {
          code: 'S4',
          description: 'Parking brake',
          outcome: 'DF',
        },
      ],
      tellMeQuestions: [
        {
          code: 'T2',
          description: 'Safety factors while loading',
          outcome: 'P',
        },
        {
          code: 'T6',
          description: 'Head restraint',
          outcome: 'P',
        },
      ],
    },
  },
};
