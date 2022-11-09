import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { JournalSlotComponent } from '@pages/journal/components/journal-slot/journal-slot';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { SlotItem } from '@providers/slot-selector/slot-item';

fdescribe('JournalSlotComponent', () => {
  let fixture: ComponentFixture<JournalSlotComponent>;
  let component: JournalSlotComponent;
  let slotSelector: SlotSelectorProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JournalSlotComponent,
      ],
      imports: [
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: SlotSelectorProvider, useClass: SlotSelectorProviderMock },
      ],
    });

    fixture = TestBed.createComponent(JournalSlotComponent);
    component = fixture.componentInstance;
    slotSelector = TestBed.inject(SlotSelectorProvider);
  }));

  describe('derivedTestStatus', () => {
    it('should return null when hasSlotBeenTested returns null', () => {
      spyOn(slotSelector, 'hasSlotBeenTested').and.returnValue(null);
      expect(component.derivedTestStatus({} as TestSlot, [])).toEqual(null);
    });
    it('should return Submitted when hasSlotBeenTested returns an activity code', () => {
      spyOn(slotSelector, 'hasSlotBeenTested').and.returnValue('1');
      expect(component.derivedTestStatus({} as TestSlot, [])).toEqual(TestStatus.Submitted);
    });
  });
  describe('hasSlotBeenTested', () => {
    it('should return null when hasSlotBeenTested returns null', () => {
      spyOn(slotSelector, 'hasSlotBeenTested').and.returnValue(null);
      expect(component.hasSlotBeenTested({} as TestSlot, [])).toEqual(null);
    });
    it('should return the activity code from the completed test when hasSlotBeenTested', () => {
      spyOn(slotSelector, 'hasSlotBeenTested').and.returnValue('1');
      expect(component.hasSlotBeenTested({} as TestSlot, [])).toEqual('1');
    });
  });
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
      expect(component.showLocation(
        { slotData: { testCentre: { centreName: 'Centre A' } } } as SlotItem,
        { slotData: { testCentre: { centreName: 'Centre A' } } } as SlotItem,
      )).toEqual(false);
    });
    it('should return true when current slot item is different to previous', () => {
      expect(component.showLocation(
        { slotData: { testCentre: { centreName: 'Centre A' } } } as SlotItem,
        { slotData: { testCentre: { centreName: 'Centre B' } } } as SlotItem,
      )).toEqual(true);
    });
  });
  describe('trackBySlotID', () => {
    it('should return the slotId from the slotDetail', () => {
      const slotItem = { slotData: { slotDetail: { slotId: 1234 } } } as SlotItem;
      expect(component.trackBySlotID(null, slotItem)).toEqual(1234);
    });
  });
});
