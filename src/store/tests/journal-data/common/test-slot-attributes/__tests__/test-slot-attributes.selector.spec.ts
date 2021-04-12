import { TestSlot } from '@dvsa/mes-journal-schema';
import { Initiator, TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import {
  getTestTime,
  getSlotId,
  isWelshTest,
  isSpecialNeeds,
  isExtendedTest,
  extractTestSlotAttributes,
  getTestDate,
  getTestStartDateTime,
} from '../test-slot-attributes.selector';
import { DateTime } from '../../../../../../app/shared/helpers/date-time';
import { SlotTypes } from '../../../../../../app/shared/models/slot-types';

const testTime = new DateTime().toString();
const formattedTime = DateTime.at(testTime).format('HH:mm');

describe('testSlotAttributes selector', () => {
  const testSlotAttributes: TestSlotAttributes = {
    slotId: 1234,
    specialNeeds: true,
    start: testTime,
    vehicleTypeCode: 'C',
    extendedTest: true,
    welshTest: true,
  };

  describe('getTestTime', () => {
    // @TODO: INVESTIGATE WHY THIS IS CAUSING A MOMENT DEPRECATION WARNING;
    it('should return the time of the test', () => {
      expect(getTestTime(testSlotAttributes)).toBe(formattedTime);
    });
  });

  describe('getTestDate', () => {
    it('should return the date of the test', () => {
      expect(getTestDate({
        ...testSlotAttributes,
        start: '2021-01-15',
      })).toBe('15/01/2021');
    });
  });

  describe('getTestStartDateTime', () => {
    it('should return the start date and time of the test as string', () => {
      const startDateTime = '2021-01-15T08:10:00.000Z';
      expect(getTestStartDateTime({
        ...testSlotAttributes,
        start: '2021-01-15T08:10:00.000Z',
      })).toBe(startDateTime);
    });
  });

  describe('isExtendedTest', () => {
    it('should return true if test is an extended test', () => {
      expect(isExtendedTest(testSlotAttributes)).toEqual(true);
    });
  });

  describe('isSpecialNeeds', () => {
    it('should return true if special needs', () => {
      expect(isSpecialNeeds(testSlotAttributes)).toEqual(true);
    });
  });

  describe('getSlotId', () => {
    it('should return the slot id of the test', () => {
      expect(getSlotId(testSlotAttributes)).toBe(1234);
    });
  });

  describe('isWelshTest', () => {
    it('should return if the test is welsh', () => {
      expect(isWelshTest(testSlotAttributes)).toEqual(true);
    });
  });

  describe('extractTestSlotAttributes', () => {
    const slotData = {
      booking: {
        application: {
          applicationId: 1234567,
          bookingSequence: 3,
          checkDigit: 1,
          welshTest: true,
          specialNeeds: 'special need 1;special need 2',
          specialNeedsCode: 'YES',
          extendedTest: true,
          entitlementCheck: true,
          specialNeedsExtendedTest: false,
        },
        previousCancellation: ['Act of nature'],
      },
      slotDetail: {
        slotId: 12345,
        start: 'now',
      },
      vehicleSlotTypeCode: 6,
      vehicleTypeCode: 'B',
      examinerVisiting: true,
    } as TestSlot;

    it('should return a TestSlotAttributes object from slot data', () => {
      const mockTestSlotAttributes = extractTestSlotAttributes(slotData);

      expect(mockTestSlotAttributes.welshTest).toBe(slotData.booking.application.welshTest);
      expect(mockTestSlotAttributes.slotId).toBe(slotData.slotDetail.slotId);
      expect(mockTestSlotAttributes.start).toBe(slotData.slotDetail.start);
      expect(mockTestSlotAttributes.specialNeeds).toBe(true);
      expect(mockTestSlotAttributes.specialNeedsCode).toBe(slotData.booking.application.specialNeedsCode);
      expect(mockTestSlotAttributes.specialNeedsArray).toEqual(['special need 1', 'special need 2']);
      expect(mockTestSlotAttributes.vehicleTypeCode).toBe(slotData.vehicleTypeCode);
      expect(mockTestSlotAttributes.extendedTest).toBe(slotData.booking.application.extendedTest);
      expect(mockTestSlotAttributes.examinerVisiting).toBe(slotData.examinerVisiting);
      expect(mockTestSlotAttributes.previousCancellation).toBe(slotData.booking.previousCancellation as Initiator[]);
      expect(mockTestSlotAttributes.entitlementCheck).toBe(slotData.booking.application.entitlementCheck);
      expect(mockTestSlotAttributes.slotType).toBe(SlotTypes.SINGLE_SLOT_SPECIAL_NEEDS);
    });

    it('should populate specialNeedsArray with only one element: None', () => {
      const slotDataWithNoSpecialNeeds = slotData;
      const mockTestSlotAttributes = extractTestSlotAttributes({
        ...slotDataWithNoSpecialNeeds,
        booking: {
          ...slotDataWithNoSpecialNeeds.booking,
          application: {
            ...slotDataWithNoSpecialNeeds.booking.application,
            specialNeeds: null,
          },
        },
      });
      expect(mockTestSlotAttributes.specialNeedsArray).toEqual(['None']);
    });
  });

});
