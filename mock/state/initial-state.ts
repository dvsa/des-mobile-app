import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestsModel } from '@store/tests/tests.model';
import { StoreModel } from '@shared/models/store.model';

export const MOCK_STORE_INITIAL_STATE = {
  appInfo: { employeeId: '123456' },
  tests: {
    currentTest: {
      slotId: '123',
    },
    testStatus: {},
    startedTests: {
      // Cat D shape store data
      123: {
        version: '1',
        rekey: false,
        activityCode: '1',
        passCompletion: {
          passCertificateNumber: 'test',
          code78Present: true,
        },
        communicationPreferences: {
          conductedLanguage: 'English',
        },
        category: TestCategory.D,
        changeMarker: null,
        examinerBooked: null,
        examinerConducted: null,
        examinerKeyed: null,
        journalData: {
          candidate: {
            dateOfBirth: '2000-01-01',
            candidateName: {
              firstName: 'firstName',
              lastName: 'lastName',
            },
          },
          examiner: null,
          testCentre: null,
          testSlotAttributes: null,
          applicationReference: null,
        },
        testData: {
          vehicleChecks: {
            fullLicenceHeld: false,
            showMeQuestions: [
              {
                code: 'Q1',
                outcome: 'DF',
                description: 'All doors secure',
              },
            ],
            tellMeQuestions: [
              {
                code: 'Q3',
                outcome: 'P',
                description: 'Safety factors while loading',
              },
            ],
          },
          safetyQuestions: {
            questions: [
              {
                outcome: 'DF',
                description: 'Fire Extinguisher',
              },
              {
                outcome: 'DF',
                description: 'Emergency exit',
              },
              {
                outcome: 'P',
                description: 'Fuel cutoff',
              },
            ],
            faultComments: '',
          },
        },
      } as TestResultCommonSchema,
    },
  } as TestsModel,
} as StoreModel;
