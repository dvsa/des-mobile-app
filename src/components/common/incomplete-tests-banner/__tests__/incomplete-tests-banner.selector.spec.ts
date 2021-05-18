import { DateTime } from '@shared/helpers/date-time';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { JournalModel } from '@store/journal/journal.model';
import { SlotProvider } from '@providers/slot/slot';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { configureTestSuite } from 'ng-bullet';
import { getIncompleteTestsCount } from '../incomplete-tests-banner.selector';

class MockStore {
}

describe('IncompleteTestsBannerSelector', () => {
  let slotProvider: SlotProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SlotProvider, useClass: SlotProvider },
        { provide: Store, useClass: MockStore },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
      ],
    });
  });

  beforeEach(() => {
    slotProvider = TestBed.inject(SlotProvider);
  });

  describe('getIncompleteTestsCount', () => {
    it('should get a count of incomplete tests', () => {
      const journal: JournalModel = {
        isLoading: true,
        lastRefreshed: new Date(0),
        completedTests: [],
        slots: {
          '2019-01-12': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {
                slotDetail: {
                  slotId: 1001,
                  start: '2019-01-12T09:14:00',
                },
                booking: {
                  application: {
                    applicationId: 1234561,
                    bookingSequence: 1,
                    checkDigit: 4,
                    welshTest: false,
                    extendedTest: false,
                    meetingPlace: '',
                    progressiveAccess: false,
                    specialNeeds: '',
                    entitlementCheck: false,
                    testCategory: 'B',
                    vehicleGearbox: 'Manual',
                  },
                  candidate: null,
                  previousCancellation: null,
                  business: null,
                },
              },
            },
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: true,
              slotData: {
                slotDetail: {
                  slotId: 1003,
                  start: '2019-01-12T10:11:00',
                },
                booking: {
                  application: {
                    applicationId: 1234562,
                    bookingSequence: 1,
                    checkDigit: 4,
                    welshTest: false,
                    extendedTest: false,
                    meetingPlace: '',
                    progressiveAccess: false,
                    specialNeeds: '',
                    entitlementCheck: false,
                    testCategory: 'B',
                    vehicleGearbox: 'Manual',
                  },
                  candidate: null,
                  previousCancellation: null,
                  business: null,
                },
              },
            },
          ],
          '2019-01-13': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {
                slotDetail: {
                  slotId: 2001,
                  start: '2019-01-13T09:14:00',
                },
                booking: {
                  application: {
                    applicationId: 1234563,
                    bookingSequence: 1,
                    checkDigit: 4,
                    welshTest: false,
                    extendedTest: false,
                    meetingPlace: '',
                    progressiveAccess: false,
                    specialNeeds: '',
                    entitlementCheck: false,
                    testCategory: 'B',
                    vehicleGearbox: 'Manual',
                  },
                  candidate: null,
                  previousCancellation: null,
                  business: null,
                },
              },
            },
          ],
          '2019-01-14': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {
                slotDetail: {
                  slotId: 3001,
                  start: '2019-01-14T09:14:00',
                },
                booking: {
                  application: {
                    applicationId: 1234564,
                    bookingSequence: 1,
                    checkDigit: 4,
                    welshTest: false,
                    extendedTest: false,
                    meetingPlace: '',
                    progressiveAccess: false,
                    specialNeeds: '',
                    entitlementCheck: false,
                    testCategory: 'B',
                    vehicleGearbox: 'Manual',
                  },
                  candidate: null,
                  previousCancellation: null,
                  business: null,
                },
              },
            },
          ],
        },
        selectedDate: '2019-01-14',
        examiner: { staffNumber: '123', individualId: 456 },
      };
      const tests: TestsModel = {
        currentTest: {
          slotId: '1003',
        },
        startedTests: {
          1003: {
            version: '0.0.1',
            category: 'B',
            changeMarker: false,
            examinerBooked: 123,
            examinerConducted: 123,
            examinerKeyed: 123,
            vehicleDetails: {},
            accompaniment: {},
            testData: {
              dangerousFaults: {},
              drivingFaults: {},
              manoeuvres: {},
              seriousFaults: {},
              testRequirements: {},
              ETA: {},
              eco: {},
              vehicleChecks: {},
              eyesightTest: {},
            },
            activityCode: '28',
            journalData: {
              examiner: {
                staffNumber: '01234567',
                individualId: 9000000,
              },
              testCentre: {
                centreId: 54321,
                costCode: 'EXTC1',
                centreName: 'Example Test Centre',
              },
              testSlotAttributes: {
                welshTest: true,
                slotId: 1003,
                start: '2019-01-12T10:14:00',
                specialNeeds: false,
                specialNeedsArray: [
                  'None',
                ],
                vehicleTypeCode: 'C',
                extendedTest: false,
                examinerVisiting: false,
                previousCancellation: [
                  'DSA',
                  'Act of nature',
                ],
                entitlementCheck: false,
                slotType: 'Special Needs Extra Time',
              },
              candidate: {
                candidateAddress: {
                  addressLine1: 'My House',
                  addressLine2: 'Someplace',
                  addressLine3: 'Sometown',
                  postcode: 'AB45 6CD',
                },
                candidateId: 103,
                candidateName: {
                  firstName: 'Jane',
                  lastName: 'Doe',
                  title: 'Mrs',
                },
                driverNumber: 'DOEXX625220A99HC',
                gender: 'F',
                mobileTelephone: '07654 123456',
                emailAddress: 'test@test.com',
                dateOfBirth: '1979-10-20',
                ethnicityCode: 'A',
              },
              applicationReference: {
                applicationId: 1234569,
                bookingSequence: 1,
                checkDigit: 9,
              },
            },
            rekey: false,
          },
        },
        testStatus: {
          1003: TestStatus.WriteUp,
        },
      };

      const count = getIncompleteTestsCount(journal, tests, DateTime.at('2019-01-14'), slotProvider);

      expect(count).toBe(3);
    });
  });

});
