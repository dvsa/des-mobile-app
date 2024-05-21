import { Component, Input } from '@angular/core';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { get, has, isEmpty } from 'lodash-es';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { formatApplicationReference } from '@shared/helpers/formatters';



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
  }

  /**
   * Find the completed test for the given slot if exists
   * @param slotData
   */
  findCompletedTest(slotData: TestSlot): SearchResultTestSchema | null {
    if (!!get(slotData, 'booking')) {
      const tempAppRef = parseInt(formatApplicationReference({
        applicationId: slotData.booking.application.applicationId,
        bookingSequence: slotData.booking.application.bookingSequence,
        checkDigit: slotData.booking.application.checkDigit,
      } as ApplicationReference), 10);
      return this.completedTests.find(value => value.applicationReference === tempAppRef)
    }
    return null;
  }

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
    return (this.slots || []).map((data) => data.slotData);
  }

  showLocation = (
    slot: SlotItem,
    prevSlot: SlotItem,
  ): boolean => get(slot, 'slotData.testCentre.centreName') !== get(prevSlot, 'slotData.testCentre.centreName', null);

  trackBySlotID = (_: number, slot: SlotItem) => get(slot, 'slotData.slotDetail.slotId', null);
}
