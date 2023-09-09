import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivityCode, SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { get, has, isEmpty } from 'lodash';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { JournalColSizing } from '@store/journal/journal.model';

@Component({
  selector: 'journal-slots',
  templateUrl: 'journal-slot.html',
})
export class JournalSlotComponent {
  store$ = inject<Store<StoreModel>>(Store);

  @Input()
  completedTests: SearchResultTestSchema[] = [];

  @Input()
  slots: SlotItem[] = [];

  @Input()
  isTeamJournal: boolean = false;

  @Input()
  isPracticeMode: boolean = false;

  @Input()
  isPortrait: boolean = false;

  @Input()
  savedColSizes: JournalColSizing[] = [];

  @Output()
  colSizeChange = new EventEmitter<{ data: JournalColSizing; action: 'update' | 'add' }>();

  formatAppRef = formatApplicationReference;

  constructor(
    private slotSelector: SlotSelectorProvider,
  ) {
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
    console.log(slot);
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

  getWidthData(passedAppRef: string) {
    if (!this.savedColSizes) return;
    return this.savedColSizes[this.savedColSizes.findIndex(({ appRef }) => appRef === passedAppRef)];
  }

  saveWidthDetails(data: { appRef: string; width: number; zoomLevel?: string }) {
    if (this.savedColSizes.some(({ appRef }) => appRef === data.appRef)) {
      this.colSizeChange.emit({
        data,
        action: 'update',
      });
    } else {
      this.colSizeChange.emit({
        data,
        action: 'add',
      });
    }
  }

}
