import { Component, Input } from '@angular/core';
import { ActivityCode, SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { get, has, isEmpty } from 'lodash-es';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { formatApplicationReference } from '@shared/helpers/formatters';

export interface RehydrationDetails {
  applicationReference: number,
  activityCode: ActivityCode,
  autosave: boolean,
  passCertificateNumber: string,
  hasBeenTested: TestStatus.Submitted | null,
}

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

  completedDetails: RehydrationDetails[] = []


  constructor(
    private slotSelector: SlotSelectorProvider,
  ) {
  }

  ngOnInit() {
    this.getListOfRehydratedTests();
  }

  getListOfRehydratedTests() {
    let tempArray1 = this.slots.map((slot: SlotItem) => {
      return parseInt(formatApplicationReference({
        applicationId: (slot.slotData as TestSlot).booking.application.applicationId,
        bookingSequence: (slot.slotData as TestSlot).booking.application.bookingSequence,
        checkDigit: (slot.slotData as TestSlot).booking.application.checkDigit,
      } as ApplicationReference), 10);
    })

    let matchingTests = tempArray1
      .filter(element => this.completedTests
        .map(value => value.applicationReference).includes(element));

    this.completedDetails = this.completedTests
      .filter(value => matchingTests.includes(value.applicationReference))
      .map(value => {
        return {
          applicationReference: value.applicationReference,
          activityCode: value.activityCode,
          autosave: !!(value.autosave),
          passCertificateNumber: value.passCertificateNumber,
          hasBeenTested: !!(value.activityCode) ? TestStatus.Submitted : null,
        };
      });
  }

  getRehydratedTest(
    slotData: TestSlot
  ) {
    let tempAppRef = parseInt(formatApplicationReference({
      applicationId: slotData.booking.application.applicationId,
      bookingSequence: slotData.booking.application.bookingSequence,
      checkDigit: slotData.booking.application.checkDigit,
    } as ApplicationReference), 10);

    return this.completedDetails.find(value => value.applicationReference === tempAppRef)
  }

  derivedTestStatus = (
    slotData: TestSlot,
    completedTests: SearchResultTestSchema[],
  ): TestStatus | null => this.slotSelector.hasSlotBeenTested(slotData, completedTests) ? TestStatus.Submitted : null;

  derivedAutosaveStatus = (
    slotData: TestSlot,
    completedTests: SearchResultTestSchema[],
  ): boolean | null =>
    this.slotSelector.hasSlotBeenPartiallyCompleted(slotData, completedTests) ? true : null;

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
    return (this.slots || []).map((data) => data.slotData);
  }

  showLocation = (
    slot: SlotItem,
    prevSlot: SlotItem,
  ): boolean => get(slot, 'slotData.testCentre.centreName') !== get(prevSlot, 'slotData.testCentre.centreName', null);

  trackBySlotID = (_: number, slot: SlotItem) => get(slot, 'slotData.slotDetail.slotId', null);
}
