import { Component, Input } from '@angular/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { IonList } from '@ionic/angular';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { getFormattedApplicationReference } from '@shared/helpers/formatters';
import { get, has, isEmpty } from 'lodash-es';
import { TestSlotComponent } from '../../../../../components/test-slot/test-slot/test-slot';
import { ActivitySlotComponent } from '../activity-slot/activity-slot';
import { EmptySlotComponent } from '../empty-slot/empty-slot';
import { PersonalCommitmentSlotComponent } from '../personal-commitment/personal-commitment';

@Component({
  selector: 'journal-slots',
  templateUrl: 'journal-slot.html',
  styleUrls: ['journal-slot.scss'],
  imports: [IonList, PersonalCommitmentSlotComponent, ActivitySlotComponent, EmptySlotComponent, TestSlotComponent],
})
export class JournalSlotComponent {
  @Input()
  completedTests: SearchResultTestSchema[] = [];

  @Input()
  slots: SlotItem[] = [];

  @Input()
  isTeamJournal = false;

  @Input()
  isPortrait = false;

  constructor(private slotSelector: SlotSelectorProvider) {}

  /**
   * Find the completed test for the given slot if exists
   * @param slotData
   */
  findCompletedTest(slotData: TestSlot): SearchResultTestSchema {
    if (get(slotData, 'booking')) {
      const tempAppRef = getFormattedApplicationReference(slotData.booking.application);
      return this.completedTests.find((value: SearchResultTestSchema) => value.applicationReference === tempAppRef);
    }
    return null;
  }

  didSlotPass = (slotData: TestSlot, completedTests: SearchResultTestSchema[]): string | null =>
    this.slotSelector.didSlotPass(slotData, completedTests);

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

  getSlots() {
    return (this.slots || []).map((data) => data.slotData);
  }

  showLocation = (slot: SlotItem, prevSlot: SlotItem): boolean =>
    get(slot, 'slotData.testCentre.centreName') !== get(prevSlot, 'slotData.testCentre.centreName', null);

  trackBySlotID = (_: number, slot: SlotItem) => get(slot, 'slotData.slotDetail.slotId', null);
}
