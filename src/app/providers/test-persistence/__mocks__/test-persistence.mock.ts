import { TestsModel } from '../../../../store/tests/tests.model';
import { TestStatus } from '../../../../store/tests/test-status/test-status.model';

export class TestPersistenceProviderMock {
  persistTests = jasmine.createSpy('persistTests');
  loadPersistedTests = jasmine.createSpy('loadPersistedTests');
  clearPersistedTests = jasmine.createSpy('clearPersistedTests');
}

export const mockGenerateTestPersistenceState = (todaysDate: string): TestsModel => {
  return {
    currentTest: { slotId: '23456789' },
    startedTests: {
      12345678: {
        rekey: false,
        changeMarker: false,
        examinerBooked: 1,
        examinerConducted: 1,
        examinerKeyed: 1,
        version: '0.0.1',
        category: 'B',
        activityCode: '1',
        journalData: {
          examiner: {
            staffNumber: '12345',
          },
          candidate: {},
          testCentre: {
            centreId: 12345,
            costCode: '12345',
          },
          testSlotAttributes: {
            slotId: 1,
            welshTest: true,
            specialNeeds: true,
            extendedTest: true,
            vehicleTypeCode: '12345',
            start: '2019-01-05T18:20:58',
          },
          applicationReference: {
            applicationId: 1,
            bookingSequence: 1,
            checkDigit: 1,
          },
        },
      },
      23456789: {
        rekey: false,
        changeMarker: false,
        examinerBooked: 1,
        examinerConducted: 1,
        examinerKeyed: 1,
        version: '0.0.1',
        category: 'B',
        activityCode: '1',
        journalData: {
          examiner: {
            staffNumber: '12345',
          },
          candidate: {},
          testCentre: {
            centreId: 12345,
            costCode: '12345',
          },
          testSlotAttributes: {
            slotId: 1,
            welshTest: true,
            specialNeeds: true,
            extendedTest: true,
            vehicleTypeCode: '12345',
            start: todaysDate,
          },
          applicationReference: {
            applicationId: 1,
            bookingSequence: 1,
            checkDigit: 1,
          },
        },
      },
    },
    testStatus: {
      12345678: TestStatus.Booked,
      23456789: TestStatus.Booked,
    },
  };
};
