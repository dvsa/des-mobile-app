import { TestBed } from '@angular/core/testing';
import { SlotSelectorProvider } from '../slot-selector';

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

  describe('hasSlotBeenTested', () => {
    it('should return null if completedTest is empty', () => {
      expect(slotSelector.hasSlotBeenTested(null, null))
        .toEqual(null);
    });
    it('should return activity code of the searched test entry', () => {
      expect(slotSelector.hasSlotBeenTested({
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
      }]))
        .toEqual('4');
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
      }]))
        .toEqual('123456789');
    });
  });
});
