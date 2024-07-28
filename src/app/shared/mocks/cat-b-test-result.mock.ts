import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

export const categoryBTestResultMock: CatBUniqueTypes.TestResult = {
  version: '0.0.1',
  category: 'B',
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
      reason: 'mock reason',
    },
  },
  changeMarker: false,
  examinerBooked: 1,
  examinerConducted: 1,
  examinerKeyed: 1,
  journalData: {
    applicationReference: {
      applicationId: 1,
      bookingSequence: 23,
      checkDigit: 4,
    },
    candidate: {
      candidateName: {
        title: 'Miss',
        firstName: 'Doris',
        lastName: 'Pearson',
      },
      driverNumber: 'mock-driver-number',
    },
    examiner: {
      individualId: 1,
      staffNumber: 'mock-staff-number',
    },
    testCentre: {
      centreId: 1,
      costCode: 'mock-cost-code',
      centreName: 'mock-centre-name',
    },
    testSlotAttributes: {
      slotId: 1,
      start: '2019-07-05T09:00:00',
      extendedTest: false,
      specialNeeds: false,
      specialNeedsArray: ['special need 1', 'special need 2'],
      entitlementCheck: true,
      slotType: 'slot-type-mock',
      previousCancellation: ['Act of nature', 'DSA'],
      welshTest: false,
      examinerVisiting: false,
      vehicleTypeCode: 'mock-vehicle-type-code',
    },
  },
  vehicleDetails: {
    gearboxCategory: 'Manual',
    registrationNumber: 'mock-vehicle-registration-number',
    dualControls: true,
    schoolCar: true,
  },
  instructorDetails: {
    registrationNumber: 1,
  },
  accompaniment: {
    ADI: true,
    interpreter: true,
    other: false,
    supervisor: false,
  },
  passCompletion: {
    passCertificateNumber: 'mock-pass-cert-number',
    provisionalLicenceProvided: true,
  },
  testSummary: {
    D255: false,
    candidateDescription: 'mock-candidate-description',
    debriefWitnessed: true,
    independentDriving: 'Sat nav',
    routeNumber: 12345,
    weatherConditions: ['Bright / dry roads', 'Icy'],
  },
  testData: {
    controlledStop: {
      selected: true,
      fault: 'S',
      faultComments: 'mock-controlled-stop-comments',
    },
    dangerousFaults: {
      ancillaryControls: true,
      ancillaryControlsComments: 'mock-ancillary-controls-comment',
    },
    drivingFaults: {
      awarenessPlanning: 2,
      awarenessPlanningComments: 'mock-awareness-planning-comment',
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
    eyesightTest: {
      complete: true,
      seriousFault: false,
      faultComments: 'mock-eyesight-test-comments',
    },
    manoeuvres: {
      forwardPark: {
        selected: true,
      },
      reverseParkCarpark: {
        selected: false,
      },
      reverseRight: {
        selected: true,
      },
    },
    seriousFaults: {
      clearance: true,
      clearanceComments: 'mock-clearance-comments',
    },
    testRequirements: {
      angledStart: true,
      hillStart: false,
      normalStart1: true,
      normalStart2: false,
    },
    vehicleChecks: {
      showMeQuestion: {
        code: 'S1',
      },
      tellMeQuestion: {
        code: 'T2',
      },
    },
  },
};
