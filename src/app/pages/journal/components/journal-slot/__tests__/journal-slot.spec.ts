import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { IonicModule } from '@ionic/angular';
import { JournalSlotComponent } from '@pages/journal/components/journal-slot/journal-slot';
import { CompletedJournalSlot } from '@pages/journal/journal.page';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';

describe('JournalSlotComponent', () => {
  let fixture: ComponentFixture<JournalSlotComponent>;
  let component: JournalSlotComponent;
  let slotSelector: SlotSelectorProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JournalSlotComponent],
      imports: [IonicModule, ComponentsModule],
      providers: [{ provide: SlotSelectorProvider, useClass: SlotSelectorProviderMock }],
    });

    fixture = TestBed.createComponent(JournalSlotComponent);
    component = fixture.componentInstance;
    slotSelector = TestBed.inject(SlotSelectorProvider);
  }));

  describe('slotType', () => {
    it('should return `personal` when personalCommitment is empty', () => {
      const slotItem = { personalCommitment: [{}], slotData: null } as SlotItem;
      expect(component.slotType(slotItem)).toEqual('personal');
    });
    it('should return `activity` when activity exists inside slotData', () => {
      const slotItem = { personalCommitment: [], slotData: { activityCode: '1' } } as SlotItem;
      expect(component.slotType(slotItem)).toEqual('activity');
    });
    it('should return `empty` when isBookingEmptyOrNull returns true', () => {
      spyOn(slotSelector, 'isBookingEmptyOrNull').and.returnValue(true);
      expect(component.slotType({} as SlotItem)).toEqual('empty');
    });
    it('should return `test-slot` when isBookingEmptyOrNull returns false', () => {
      spyOn(slotSelector, 'isBookingEmptyOrNull').and.returnValue(false);
      expect(component.slotType({} as SlotItem)).toEqual('test-slot');
    });
  });
  describe('showLocation', () => {
    it('should return false when current slot item is same as previous', () => {
      expect(
        component.showLocation(
          { slotData: { testCentre: { centreName: 'Centre A' } } } as SlotItem,
          { slotData: { testCentre: { centreName: 'Centre A' } } } as SlotItem
        )
      ).toEqual(false);
    });
    it('should return true when current slot item is different to previous', () => {
      expect(
        component.showLocation(
          { slotData: { testCentre: { centreName: 'Centre A' } } } as SlotItem,
          { slotData: { testCentre: { centreName: 'Centre B' } } } as SlotItem
        )
      ).toEqual(true);
    });
  });
  describe('trackBySlotID', () => {
    it('should return the slotId from the slotDetail', () => {
      const slotItem = { slotData: { slotDetail: { slotId: 1234 } } } as SlotItem;
      expect(component.trackBySlotID(null, slotItem)).toEqual(1234);
    });
  });
  describe('findCompletedTest', () => {
    it('should return null when booking is not present in slotData', () => {
      const slotData = {} as TestSlot;
      expect(component.findCompletedTest(slotData)).toBeNull();
    });

    it('should return undefined when no completed test matches the application reference', () => {
      const slotData = {
        booking: {
          application: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
        },
      } as TestSlot;
      component.completedTests = [{ applicationReference: 9999 }] as CompletedJournalSlot[];
      expect(component.findCompletedTest(slotData)).toBeUndefined();
    });

    it('should return the completed test when it matches the application reference', () => {
      const slotData = {
        booking: {
          application: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
        },
      } as TestSlot;
      const completedTest = { applicationReference: 1023 } as CompletedJournalSlot;
      component.completedTests = [completedTest];
      expect(component.findCompletedTest(slotData)).toEqual(completedTest);
    });
  });
  describe('getSlots', () => {
    it('should return an array of TestSlots from Slots', () => {
      component.slots = [
        { slotData: { vehicleTypeCode: 'test1' } },
        { slotData: { vehicleTypeCode: 'test2' } },
      ] as SlotItem[];
      expect(component.getSlots()).toEqual([{ vehicleTypeCode: 'test1' }, { vehicleTypeCode: 'test2' }]);
    });
  });
});
