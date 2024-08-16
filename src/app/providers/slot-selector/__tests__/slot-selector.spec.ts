import { TestBed } from '@angular/core/testing';
import { Application } from '@dvsa/mes-journal-schema';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotSelectorProvider } from '../slot-selector';

describe('SlotSelectorProvider', () => {
  let slotSelector: SlotSelectorProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SlotSelectorProvider],
    });

    slotSelector = TestBed.inject(SlotSelectorProvider);
  });

  describe('isBookingEmptyOrNull', () => {
    it('should return true if slotData has no booking property', () => {
      const slot = { slotData: {} } as SlotItem;
      expect(slotSelector.isBookingEmptyOrNull(slot)).toBe(true);
    });

    it('should return true if slotData.booking is empty', () => {
      const slot = { slotData: { booking: {} } } as SlotItem;
      expect(slotSelector.isBookingEmptyOrNull(slot)).toBe(true);
    });

    it('should return true if slotData.booking properties are null or empty', () => {
      const slot = { slotData: { booking: { application: null } } } as SlotItem;
      expect(slotSelector.isBookingEmptyOrNull(slot)).toBe(true);
    });

    it('should return false if slotData.booking has non-null properties', () => {
      const slot = { slotData: { booking: { application: { applicationId: 123 } } } } as SlotItem;
      expect(slotSelector.isBookingEmptyOrNull(slot)).toBe(false);
    });
  });

  describe('didSlotPass', () => {
    it('should return null if completedTest is empty', () => {
      expect(slotSelector.didSlotPass(null, null)).toEqual(null);
    });
    it('should return undefined if the searched test entry has no pass certificate', () => {
      expect(
        slotSelector.didSlotPass(
          {
            booking: {
              application: {
                applicationId: 111,
                bookingSequence: 222,
                checkDigit: 333,
              },
            },
          },
          [
            {
              costCode: '123456',
              testDate: '11/1/11',
              driverNumber: '1234',
              candidateName: { firstName: 'name' },
              applicationReference: 111222333,
              category: 'A',
              activityCode: '4',
              autosave: 1,
            },
          ]
        )
      ).toEqual(undefined);
    });
    it('should return pass certificate if the searched test entry has a pass certificate', () => {
      expect(
        slotSelector.didSlotPass(
          {
            booking: {
              application: {
                applicationId: 111,
                bookingSequence: 222,
                checkDigit: 333,
              },
            },
          },
          [
            {
              costCode: '123456',
              testDate: '11/1/11',
              driverNumber: '1234',
              candidateName: { firstName: 'name' },
              applicationReference: 111222333,
              category: 'A',
              activityCode: '4',
              passCertificateNumber: '123456789',
              autosave: 1,
            },
          ]
        )
      ).toEqual('123456789');
    });
  });

  describe('isBookingEmptyOrNull', () => {
    it('should return true if slotData does not have booking', () => {
      const slotData: SlotItem = { slotData: {} } as SlotItem;
      expect(slotSelector.isBookingEmptyOrNull(slotData)).toBeTrue();
    });

    it('should call checkPropertiesHaveValues if booking has relevant properties with values', () => {
      spyOn(slotSelector, 'checkPropertiesHaveValues').and.returnValue(true);
      const slotData: SlotItem = {
        slotData: {
          booking: {
            application: {
              applicationId: 123,
            } as Application,
          },
        },
      } as SlotItem;
      slotSelector.isBookingEmptyOrNull(slotData);
      expect(slotSelector.checkPropertiesHaveValues).toHaveBeenCalled();
    });
  });

  describe('checkPropertiesHaveValues', () => {
    it('should return false for an empty object', () => {
      expect(slotSelector.checkPropertiesHaveValues({})).toBeFalse();
    });

    it('should return true for an object with non-ignored properties', () => {
      const obj = { applicationId: 123 };
      expect(slotSelector.checkPropertiesHaveValues(obj)).toBeTrue();
    });

    it('should return false for an object with only ignored properties', () => {
      const obj = { entitlementCheck: true };
      expect(slotSelector.checkPropertiesHaveValues(obj)).toBeFalse();
    });

    it('should return true for nested objects with non-ignored properties', () => {
      const obj = { booking: { application: { applicationId: 123 } } };
      expect(slotSelector.checkPropertiesHaveValues(obj)).toBeTrue();
    });

    it('should return false for nested objects with only ignored properties', () => {
      const obj = { booking: { entitlementCheck: true } };
      expect(slotSelector.checkPropertiesHaveValues(obj)).toBeFalse();
    });

    it('should return false for an object with all values set to null', () => {
      const obj = { applicationId: null };
      expect(slotSelector.checkPropertiesHaveValues(obj)).toBeFalse();
    });

    it('should return true for an object with mixed ignored and non-ignored properties', () => {
      const obj = { applicationId: 123, entitlementCheck: true };
      expect(slotSelector.checkPropertiesHaveValues(obj)).toBeTrue();
    });
  });
});
