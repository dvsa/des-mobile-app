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
import { Initiator, TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
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
    it('should return the time of the test', () => {
      expect(getTestTime(testSlotAttributes)).toBe(formattedTime);
    });
  });

  describe('getTestDate', () => {
    it('should return the date of the test', () => {
      const startDateTime = '2021-01-15T08:10:00.000Z';
      testSlotAttributes.start = startDateTime;
      expect(getTestDate(testSlotAttributes)).toBe('15/01/2021');
    });
  });

  describe('getTestStartDateTime', () => {
    it('should return the start date and time of the test as string', () => {
      const startDateTime = '2021-01-15T08:10:00.000Z';
      testSlotAttributes.start = startDateTime;
      expect(getTestStartDateTime(testSlotAttributes)).toBe(startDateTime);
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
    };

    it('should return a TestSlotAttributes object from slot data', () => {
      const testSlotAttributes = extractTestSlotAttributes(slotData);

      expect(testSlotAttributes.welshTest).toBe(slotData.booking.application.welshTest);
      expect(testSlotAttributes.slotId).toBe(slotData.slotDetail.slotId);
      expect(testSlotAttributes.start).toBe(slotData.slotDetail.start);
      expect(testSlotAttributes.specialNeeds).toBe(true);
      expect(testSlotAttributes.specialNeedsCode).toBe(slotData.booking.application.specialNeedsCode);
      expect(testSlotAttributes.specialNeedsArray).toEqual(['special need 1', 'special need 2']);
      expect(testSlotAttributes.vehicleTypeCode).toBe(slotData.vehicleTypeCode);
      expect(testSlotAttributes.extendedTest).toBe(slotData.booking.application.extendedTest);
      expect(testSlotAttributes.examinerVisiting).toBe(slotData.examinerVisiting);
      expect(testSlotAttributes.previousCancellation).toBe(slotData.booking.previousCancellation as Initiator[]);
      expect(testSlotAttributes.entitlementCheck).toBe(slotData.booking.application.entitlementCheck);
      expect(testSlotAttributes.slotType).toBe(SlotTypes.SINGLE_SLOT_SPECIAL_NEEDS);
    });

    it('should populate specialNeedsArray with only one element: None', () => {
      const slotDataWithNoSpecialNeeds = slotData;
      slotDataWithNoSpecialNeeds.booking.application.specialNeeds = null;
      const testSlotAttributes = extractTestSlotAttributes(slotDataWithNoSpecialNeeds);
      expect(testSlotAttributes.specialNeedsArray).toEqual(['None']);
    });
  });

});
