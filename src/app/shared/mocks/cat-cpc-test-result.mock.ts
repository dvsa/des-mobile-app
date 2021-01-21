import { TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';

export const categoryCPCTestResultMock: TestResultCatCPCSchema = {
  version: '0.0.1',
  category: 'CCPC',
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
  },
  accompaniment: {
    interpreter: true,
    supervisor: false,
  },
  passCompletion: {
    passCertificateNumber: 'A123456X',
  },
  testSummary: {
    D255: false,
    candidateDescription: 'Candidate liked tall cute girls.',
    debriefWitnessed: true,
    additionalInformation: 'Had time for an extra coffee',
  },
  testData: {
    combination: 'LGV8',
    question1: {
      questionCode: '',
      title: '',
      subtitle: '',
      additionalItems: [],
      answer1: {
        selected: true,
        label: '',
      },
      answer2: {
        selected: true,
        label: '',
      },
      answer3: {
        selected: true,
        label: '',
      },
      answer4: {
        selected: true,
        label: '',
      },
      score: 20,
    },
    question2: {
      questionCode: '',
      title: '',
      subtitle: '',
      additionalItems: [],
      answer1: {
        selected: true,
        label: '',
      },
      answer2: {
        selected: true,
        label: '',
      },
      answer3: {
        selected: true,
        label: '',
      },
      answer4: {
        selected: true,
        label: '',
      },
      score: 20,
    },
    question3: {
      questionCode: '',
      title: '',
      subtitle: '',
      additionalItems: [],
      answer1: {
        selected: true,
        label: '',
      },
      answer2: {
        selected: true,
        label: '',
      },
      answer3: {
        selected: true,
        label: '',
      },
      answer4: {
        selected: true,
        label: '',
      },
      score: 20,
    },
    question4: {
      questionCode: '',
      title: '',
      subtitle: '',
      additionalItems: [],
      answer1: {
        selected: true,
        label: '',
      },
      answer2: {
        selected: true,
        label: '',
      },
      answer3: {
        selected: true,
        label: '',
      },
      answer4: {
        selected: true,
        label: '',
      },
      score: 20,
    },
    question5: {
      questionCode: '',
      title: '',
      subtitle: '',
      additionalItems: [],
      answer1: {
        selected: true,
        label: '',
      },
      answer2: {
        selected: true,
        label: '',
      },
      answer3: {
        selected: true,
        label: '',
      },
      answer4: {
        selected: true,
        label: '',
      },
      answer5: {
        selected: true,
        label: '',
      },
      answer6: {
        selected: true,
        label: '',
      },
      answer7: {
        selected: true,
        label: '',
      },
      answer8: {
        selected: true,
        label: '',
      },
      answer9: {
        selected: true,
        label: '',
      },
      answer10: {
        selected: true,
        label: '',
      },
      score: 20,
    },
    totalPercent: 100,
  },
};
