import { Component, Input } from '@angular/core';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { get, has, isEmpty } from 'lodash';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';

@Component({
  selector: 'journal-slots',
  templateUrl: 'journal-slot.html',
  styleUrls: ['journal-slot.scss'],
})
export class JournalSlotComponent {

  @Input()
  completedTests: SearchResultTestSchema[] = [];

  @Input()
  slots: SlotItem[] = [];

  constructor(
    public slotSelector: SlotSelectorProvider,
  ) {
  }

  derivedTestStatus = (
    slotData: TestSlot,
    completedTests: SearchResultTestSchema[],
  ): TestStatus | null => this.slotSelector.hasSlotBeenTested(slotData, completedTests) ? TestStatus.Submitted : null;

  slotType = (slot: SlotItem): string => {
    const { slotData, personalCommitment } = slot;

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

  showLocation = (slot: SlotItem, prevSlot: SlotItem): boolean => {
    return get(slot, 'slotData.testCentre.centreName') !== get(prevSlot, 'slotData.testCentre.centreName', null);
  };

}
