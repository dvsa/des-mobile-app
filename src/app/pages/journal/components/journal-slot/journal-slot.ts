import { Component, Input } from '@angular/core';
import { ActivityCode, SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { get, has, isEmpty } from 'lodash';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';

@Component({
  selector: 'journal-slots',
  templateUrl: 'journal-slot.html',
})
export class JournalSlotComponent {

  @Input()
  completedTests: SearchResultTestSchema[] = [];

  @Input()
  slots: SlotItem[] = [];

  @Input()
  isTeamJournal: boolean = false;

  @Input()
  isPortrait: boolean = false;

  constructor(
    private slotSelector: SlotSelectorProvider,
  ) {
    console.log('Journal-slot | slots on journal-slots component:', this.slots);
    console.log('Journal-slot | completed Tests on journal-slots component:', this.completedTests);
  }

  derivedTestStatus = (
    slotData: TestSlot,
    completedTests: SearchResultTestSchema[],
  ): TestStatus | null => this.slotSelector.hasSlotBeenTested(slotData, completedTests) ? TestStatus.Submitted : null;

  hasSlotBeenTested = (
    slotData: TestSlot,
    completedTests: SearchResultTestSchema[],
  ): ActivityCode | null => this.slotSelector.hasSlotBeenTested(slotData, completedTests);

  didSlotPass = (
    slotData: TestSlot,
    completedTests: SearchResultTestSchema[],
  ): string | null => this.slotSelector.didSlotPass(slotData, completedTests);

  slotType = (slot: SlotItem): string => {
    const {
      slotData,
      personalCommitment,
    } = slot;

    if (!isEmpty(personalCommitment)) {
      return 'personal';
    }

    if (has(slotData, 'activityCode')) {
      return 'activity';
    }

    if (this.slotSelector.isBookingEmptyOrNull(slot)) {
      return 'empty';
    }

    return 'test-slot';
  };

  getSlots() {
    return this.slots.map((data) => data.slotData);
  }

  showLocation = (
    slot: SlotItem,
    prevSlot: SlotItem,
  ): boolean => get(slot, 'slotData.testCentre.centreName') !== get(prevSlot, 'slotData.testCentre.centreName', null);

  trackBySlotID = (_: number, slot: SlotItem) => get(slot, 'slotData.slotDetail.slotId', null);

}
