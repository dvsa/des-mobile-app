import { TestBed } from '@angular/core/testing';
import { TestSlot, NonTestActivity } from '@dvsa/mes-journal-schema';
import { ActivitySlotComponent } from '@pages/journal/components/activity-slot/activity-slot';
import { EmptySlotComponent } from '@pages/journal/components/empty-slot/empty-slot';
import { TestSlotComponent } from '@components/test-slot/test-slot/test-slot';

import { Slot } from '@store/journal/journal.model';
import { SlotSelectorProvider } from '../slot-selector';
import { SlotItem } from '../slot-item';

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

  const singleSlotItemWithActivityCode = (code) => {
    const travelSlot: NonTestActivity = {
      activityCode: code,
    };
    const journalSlots = [
      new SlotItem(travelSlot, false, false),
    ];
    return journalSlots;
  };

  const expectNonTestActivitySlotComponentResolvedForActivityCode = (code) => {
    const journalSlots = singleSlotItemWithActivityCode(code);
    const response = slotSelector.getSlotTypes(journalSlots);
    expect(response[0].component).toBe(ActivitySlotComponent);
  };

  const singleSlotItemWithVehicleTypeCode = (vehicleTypeCode: string): SlotItem[] => {
    const slot: TestSlot = {
      vehicleTypeCode,
      booking: {
        application: {
          applicationId: 1234567,
          bookingSequence: 3,
          checkDigit: 1,
        },
      },
    };
    const journalSlots = [
      new SlotItem(slot, false, false),
    ];
    return journalSlots;
  };

  const expectTestSlotComponentResolvedForVehicleSlotType = (code) => {
    const journalSlots = singleSlotItemWithVehicleTypeCode(code);
    const response = slotSelector.getSlotTypes(journalSlots);

    expect(response.length).toBe(1);
    expect(response[0].component).toBe(TestSlotComponent);
    expect(response[0].slotData).toBe(journalSlots[0].slotData);
    expect(response[0].hasSlotChanged).toBe(false);
  };

  describe('SlotSelectorProvider', () => {

    it('should compile', () => {
      expect(slotSelector).toBeDefined();
    });

    describe('getSlotTypes', () => {
      it('should return empty array if data is missing or incorrectly formatted', () => {
        expect(slotSelector.getSlotTypes([]).length).toBe(0);
        expect(slotSelector.getSlotTypes(null).length).toBe(0);
        expect(slotSelector.getSlotTypes(undefined).length).toBe(0);
      });

      it('should provide correct component when test type is in vehicleSlotType codes', () => {
        expectTestSlotComponentResolvedForVehicleSlotType('B57mins');
        expectTestSlotComponentResolvedForVehicleSlotType('B86mins');
        expectTestSlotComponentResolvedForVehicleSlotType('B114mins');
        expectTestSlotComponentResolvedForVehicleSlotType('Voc90mins');
        expectTestSlotComponentResolvedForVehicleSlotType('HomeTest');
        expectTestSlotComponentResolvedForVehicleSlotType('ADI2-90mins');
        expectTestSlotComponentResolvedForVehicleSlotType('ADI3-90mins');
        expectTestSlotComponentResolvedForVehicleSlotType('CPCBUS30');
        expectTestSlotComponentResolvedForVehicleSlotType('M1Bike30m');
        expectTestSlotComponentResolvedForVehicleSlotType('M1BikSNX45m');
        expectTestSlotComponentResolvedForVehicleSlotType('M2Bike57min');
        expectTestSlotComponentResolvedForVehicleSlotType('M2BikSNEX86');
        expectTestSlotComponentResolvedForVehicleSlotType('M2BikeEx114');
        expectTestSlotComponentResolvedForVehicleSlotType('M1BikeEx30m');
        expectTestSlotComponentResolvedForVehicleSlotType('CPCLORRY30');
        expectTestSlotComponentResolvedForVehicleSlotType('OffRdTr30m');
        expectTestSlotComponentResolvedForVehicleSlotType('CPC30');
        expectTestSlotComponentResolvedForVehicleSlotType('Sc');
      });

      it('should provide the NonTestActivitySlotComponent for NTA activity codes', () => {
        expectNonTestActivitySlotComponentResolvedForActivityCode('091');
        expectNonTestActivitySlotComponentResolvedForActivityCode('094');
        expectNonTestActivitySlotComponentResolvedForActivityCode('096');
        expectNonTestActivitySlotComponentResolvedForActivityCode('142');
      });

      it('should provide the EmptySlotComponent for slots that have no booking or activity code', () => {
        const slot = {};
        const journalSlots = [
          new SlotItem(slot, false, false),
        ];
        const response = slotSelector.getSlotTypes(journalSlots);

        expect(response.length).toBe(1);
        expect(response[0].component).toBe(EmptySlotComponent);
        expect(response[0].slotData).toBe(journalSlots[0].slotData);
        expect(response[0].hasSlotChanged).toBe(false);
      });

    });
  });
  describe('hasSlotBeenTested', () => {
    it('should return null if completedTest is empty', () => {
      expect(slotSelector.hasSlotBeenTested(null, null)).toEqual(null);
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
      }])).toEqual('4');
    });
  });

  describe('didSlotPass', () => {
    it('should return null if completedTest is empty', () => {
      expect(slotSelector.didSlotPass(null, null)).toEqual(null);
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
      }])).toEqual(undefined);
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
      }])).toEqual('123456789');
    });
  });

  describe('isTestSlot', () => {
    it('should return true if test slot', () => {
      const slotItem = singleSlotItemWithVehicleTypeCode('C')[0];
      const { slotData } = slotItem;
      const slot: Slot = {
        booking: (<TestSlot>slotData).booking,
        slotDetail: slotItem.slotData.slotDetail,
        testCentre: slotItem.slotData.testCentre,
        vehicleTypeCode: (<TestSlot>slotData).vehicleTypeCode,
        activityCode: slotItem.activityCode,
      };

      const response = slotSelector.isTestSlot(slot);
      expect(response).toEqual(true);
    });
    it('should return false if not a test slot', () => {
      const slotItem = singleSlotItemWithActivityCode(1)[0];
      const slot: Slot = {
        slotDetail: slotItem.slotData.slotDetail,
        testCentre: slotItem.slotData.testCentre,
        activityCode: slotItem.activityCode,
      };

      const response = slotSelector.isTestSlot(slot);
      expect(response).toEqual(false);
    });
  });
});
