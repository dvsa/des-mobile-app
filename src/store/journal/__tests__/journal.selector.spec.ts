import { MesError } from '@shared/models/mes-error.model';
import { DateTime } from '@shared/helpers/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { TestBed } from '@angular/core/testing';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import {
  getSlotsOnSelectedDate,
  getLastRefreshed,
  getIsLoading,
  getError,
  getLastRefreshedTime,
  canNavigateToNextDay,
  canNavigateToPreviousDay,
  getPermittedSlotIdsBeforeToday,
  hasSlotsAfterSelectedDate,
  getCompletedTests,
} from '../journal.selector';
import { JournalModel } from '../journal.model';
import { baseJournalData } from '../__mocks__/journal-slots-data.mock';

class MockStore { }

describe('JournalSelector', () => {
  let slotProvider: SlotProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        SlotProvider,
        { provide: SlotProvider, useClass: SlotProvider },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: Store, useClass: MockStore },
      ],
    });
  });

  beforeEach(() => {
    slotProvider = TestBed.get(SlotProvider);
  });

  const state: JournalModel = {
    isLoading: true,
    lastRefreshed: new Date(0),
    slots: {
      '2019-01-17': [
        {
          hasSlotChanged: false,
          hasSeenCandidateDetails: false,
          slotData: {},
        },
      ],
    },
    error: {
      message: 'something failed',
      status: 404,
      statusText: 'HTTP 404',
    },
    selectedDate: '2019-01-17',
    examiner: { staffNumber: '123', individualId: 456 },
    completedTests: [],
  };

  describe('getIsLoading', () => {
    it('should fetch the loading status from the state', () => {
      expect(getIsLoading(state)).toEqual(true);
    });
  });

  describe('getSlots', () => {
    it('should select the test slots from the state', () => {
      const selectedSlots = getSlotsOnSelectedDate(state);
      expect(selectedSlots.length).toBe(1);
      expect(selectedSlots[0].hasSlotChanged).toBe(false);
      expect(selectedSlots[0].slotData).toBeDefined();
    });
  });

  describe('getLastRefreshed', () => {
    it('should select the last refreshed date from the state', () => {
      expect(getLastRefreshed(state).getUTCMilliseconds()).toBe(0);
    });
  });

  describe('getLastRefreshedTime', () => {
    it('should transform a nil date to the placeholder', () => {
      expect(getLastRefreshedTime(null)).toBe('--:--');
      expect(getLastRefreshedTime(undefined)).toBe('--:--');
    });
    it('should format the date to 24hr format with lowercase am/pm', () => {
      expect(getLastRefreshedTime(new Date('2019-01-16T09:24:00'))).toBe('09:24am');
      expect(getLastRefreshedTime(new Date('2019-01-16T15:45:10'))).toBe('03:45pm');
    });
  });

  describe('getError', () => {
    it('should select the MesError from the state', () => {
      const error: MesError = getError(state);
      expect(error.status).toBe(404);
    });
  });

  describe('canNavigateToNextDay', () => {
    beforeEach(() => {
      spyOn(DateTime, 'today').and.returnValue(new Date('2019-01-29'));
    });

    it('should return true if there are any next days', () => {
      const journal: JournalModel = {
        isLoading: true,
        lastRefreshed: new Date(0),
        slots: {
          '2019-01-29': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
          '2019-01-30': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
        },
        selectedDate: '2019-01-29',
        examiner: { staffNumber: '123', individualId: 456 },
        completedTests: [],
      };

      const result = canNavigateToNextDay(journal);

      expect(result).toBe(true);
    });

    it('should return true if the current selected date is in the past', () => {
      const journal: JournalModel = {
        isLoading: true,
        lastRefreshed: new Date(0),
        slots: {
          '2019-01-28': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
          '2019-01-29': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
        },
        selectedDate: '2019-01-28',
        examiner: { staffNumber: '123', individualId: 456 },
        completedTests: [],
      };

      const result = canNavigateToNextDay(journal);

      expect(result).toBe(true);
    });

    it('should return false if the current selected date is not a weekend and in the future', () => {
      const journal: JournalModel = {
        isLoading: true,
        lastRefreshed: new Date(0),
        slots: {
          '2019-01-28': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
          '2019-01-29': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
        },
        selectedDate: '2019-02-04',
        examiner: { staffNumber: '123', individualId: 456 },
        completedTests: [],
      };

      const result = canNavigateToNextDay(journal);

      expect(result).toBe(false);
    });
  });

  describe('canNavigateToPreviousDay', () => {
    it('should return false if selected day is 14 days from today', () => {
      const journal: JournalModel = {
        isLoading: true,
        lastRefreshed: new Date(0),
        slots: {
          '2019-01-01': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
        },
        selectedDate: '2019-01-01',
        examiner: { staffNumber: '123', individualId: 456 },
        completedTests: [],
      };

      const result = canNavigateToPreviousDay(journal, DateTime.at('2019-01-15'));

      expect(result).toBe(false);
    });

    it('should return true if selected day is not today and we have days to go to', () => {
      const journal: JournalModel = {
        isLoading: true,
        lastRefreshed: new Date(0),
        slots: {
          '2019-01-13': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
          '2019-01-14': [
            {
              hasSlotChanged: false,
              hasSeenCandidateDetails: false,
              slotData: {},
            },
          ],
        },
        selectedDate: '2019-01-14',
        examiner: { staffNumber: '123', individualId: 456 },
        completedTests: [],
      };

      const result = canNavigateToPreviousDay(journal, DateTime.at('2019-01-13'));

      expect(result).toBe(true);
    });
  });

  describe('getPermittedSlotIdsBeforeToday', () => {
    it('should select the startable test slots from the state', () => {
      const journal: JournalModel = {
        isLoading: true,
        lastRefreshed: new Date(0),
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
        },
        selectedDate: '2019-01-14',
        examiner: { staffNumber: '123', individualId: 456 },
        completedTests: [
          {
            costCode: '1',
            testDate: '2021-03-12',
            driverNumber: 'AAAA',
            candidateName: { firstName: 'Name' },
            applicationReference: 1234561014,
            category: 'B',
            activityCode: '1',
          },
        ],
      };

      const slotIds = getPermittedSlotIdsBeforeToday(journal, DateTime.at('2019-01-14'), slotProvider);

      expect(slotIds.length).toBe(1);
      expect(slotIds).toEqual([2001]);
    });
  });

  describe('hasSlotsAfterSelectedDate', () => {
    it('should return TRUE if slots DO EXIST after journal selected date', () => {
      expect(hasSlotsAfterSelectedDate(baseJournalData)).toEqual(true);
    });

    it('should return FALSE if slots DO NOT EXIST after journal selected date', () => {
      const journalWithoutSlotsAfterSelectedDate = cloneDeep(baseJournalData);
      journalWithoutSlotsAfterSelectedDate.slots['2019-01-03'] = [];
      expect(hasSlotsAfterSelectedDate(journalWithoutSlotsAfterSelectedDate)).toEqual(false);
    });
  });
  describe('getCompletedTests', () => {
    it('should return correct data', () => {
      const journalModel: JournalModel = {
        isLoading: false,
        lastRefreshed: new Date(0),
        slots: { },
        selectedDate: '2019-01-01',
        examiner: { staffNumber: '123', individualId: 456 },
        completedTests: [
          {
            costCode: 'costCode',
            testDate: 'testDate',
            driverNumber: 'diverNumber',
            candidateName: {},
            applicationReference: 1234567031,
            category: 'category',
            activityCode: '2',
          },
          {
            costCode: 'costCode',
            testDate: 'testDate',
            driverNumber: 'diverNumber',
            candidateName: {},
            applicationReference: 1234569019,
            category: 'category',
            activityCode: '11',
          },
        ],
      };

      const data = getCompletedTests(journalModel);

      expect(data).toEqual(journalModel.completedTests);
    });
  });

});
