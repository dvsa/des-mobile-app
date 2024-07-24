import { TestBed } from '@angular/core/testing';
import { SlotSelectorProvider } from '../slot-selector';
import { Application } from '@dvsa/mes-journal-schema';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { SlotItem } from '@providers/slot-selector/slot-item';

describe('SlotSelectorProvider', () => {
  let slotSelector: SlotSelectorProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SlotSelectorProvider,
      ],
    });

    slotSelector = TestBed.inject(SlotSelectorProvider);
  });

  describe('hasSlotBeenPartiallyCompleted', () => {
    it('should return null if completedTest is empty', () => {
      expect(slotSelector.hasSlotBeenPartiallyCompleted(null, null))
        .toEqual(null);
    });

    it('should return autosave status if the searched test entry exists', () => {
      expect(slotSelector.hasSlotBeenPartiallyCompleted({
        booking: {
          application: {
            applicationId: 111,
            bookingSequence: 222,
            checkDigit: 333,
          },
        },
      }, [{
        costCode: '123456',
        testDate: '11/1/11',
        driverNumber: '1234',
        candidateName: { firstName: 'name' },
        applicationReference: 111222333,
        category: 'A',
        activityCode: '4',
        autosave: 1,
      }]))
        .toEqual(1);
    });

    it('should return null if the searched test entry does not exist', () => {
      expect(slotSelector.hasSlotBeenPartiallyCompleted({
        booking: {
          application: {
            applicationId: 111,
            bookingSequence: 222,
            checkDigit: 333,
          },
        },
      }, [{
        costCode: '123456',
        testDate: '11/1/11',
        driverNumber: '1234',
        candidateName: { firstName: 'name' },
        applicationReference: 999999999,
        category: 'A',
        activityCode: '4',
        autosave: 1,
      }]))
        .toEqual(null);
    });
  });

  describe('didSlotPass', () => {
    it('should return null if completedTest is empty', () => {
      expect(slotSelector.didSlotPass(null, null))
        .toEqual(null);
    });
    it('should return undefined if the searched test entry has no pass certificate', () => {
      expect(slotSelector.didSlotPass({
        booking: {
          application: {
            applicationId: 111,
            bookingSequence: 222,
            checkDigit: 333,
          },
        },
      }, [{
        costCode: '123456',
        testDate: '11/1/11',
        driverNumber: '1234',
        candidateName: { firstName: 'name' },
        applicationReference: 111222333,
        category: 'A',
        activityCode: '4',
        autosave: 1,
      }]))
        .toEqual(undefined);
    });
    it('should return pass certificate if the searched test entry has a pass certificate', () => {
      expect(slotSelector.didSlotPass({
        booking: {
          application: {
            applicationId: 111,
            bookingSequence: 222,
            checkDigit: 333,
          },
        },
      }, [{
        costCode: '123456',
        testDate: '11/1/11',
        driverNumber: '1234',
        candidateName: { firstName: 'name' },
        applicationReference: 111222333,
        category: 'A',
        activityCode: '4',
        passCertificateNumber: '123456789',
        autosave: 1,
      }]))
        .toEqual('123456789');
    });
  });

  describe('hasSlotBeenTested', () => {
    it('should return null when completedTest is not found', () => {
      spyOn(slotSelector, 'getCompletedTest').and.returnValue(null);
      expect(slotSelector.hasSlotBeenTested(null, [])).toBeNull();
    });

    it('should return activity code when completedTest is found', () => {
      spyOn(slotSelector, 'getCompletedTest').and.returnValue({
        activityCode: '1',
      } as SearchResultTestSchema);
      expect(slotSelector.hasSlotBeenTested(null, [])).toEqual('1');
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
