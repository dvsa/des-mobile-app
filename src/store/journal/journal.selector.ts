import {
  flatten,
  isEmpty,
  isNil,
} from 'lodash';
import { createSelector } from '@ngrx/store';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';

import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { JournalModel } from './journal.model';

export const selectJournal = (state: StoreModel): JournalModel => state.journal;

export const selectSlots = createSelector(
  selectJournal,
  (journal: JournalModel): { [k: string]: SlotItem[] } => journal.slots,
);

export const getSlots = (journal: JournalModel) => journal.slots;

export const getSlotsOnSelectedDate = (journal: JournalModel) => journal.slots[journal.selectedDate];

export const getAvailableDays = (journal: JournalModel) => Object.keys(journal.slots);

export const getError = (journal: JournalModel) => journal.error;

export const getIsLoading = (journal: JournalModel) => journal.isLoading;

export const getLastRefreshed = (journal: JournalModel) => journal.lastRefreshed;

export const getLastRefreshedTime = (date: Date) => (isNil(date) ? '--:--' : DateTime.at(date).format('hh:mma'));

export const getSelectedDate = (journal: JournalModel) => journal.selectedDate;

export const canNavigateToPreviousDay = (journal: JournalModel, today: DateTime): boolean => {
  const { selectedDate } = journal;
  const lookbackLimit = today.subtract(14, Duration.DAY).format('YYYY-MM-DD');

  return selectedDate > lookbackLimit;
};

export const hasSlotsAfterSelectedDate = (journal: JournalModel): boolean => {
  let allowNavigationToFutureDate: boolean = false;

  Object.keys(journal.slots)
    .forEach((slot: string) => {
      if (DateTime.at(journal.selectedDate).isBefore(DateTime.at(slot)) && !isEmpty(journal.slots[slot])) {
        allowNavigationToFutureDate = true;
      }
    });
  return allowNavigationToFutureDate;
};

export const canNavigateToNextDay = (journal: JournalModel): boolean => {
  const nextDayAsDate = DateTime.at(journal.selectedDate).add(1, Duration.DAY).format('YYYY-MM-DD');
  const fourteenDaysAhead = DateTime.at(DateTime.today()).add(14, Duration.DAY).format('YYYY-MM-DD');

  return (nextDayAsDate < fourteenDaysAhead);
};

export const getAllSlots = (journal: JournalModel): SlotItem[] => {
  const slotArray: SlotItem[] = [];
  Object.values(journal.slots)
    .forEach((dayOfSlots) => {
      dayOfSlots.forEach((slot) => {
        slotArray.push(slot);
      });
    });
  return slotArray;
};

export const getJournalSlotsBySlotIDs = (journal: JournalModel, slotIDs: string[]): SlotItem[] => {
  const completedTestAppRefs = journal.completedTests.map((test) => test.applicationReference);

  const allSlots = getAllSlots(journal);
  return allSlots
    .filter((slot) => !completedTestAppRefs.includes(Number(formatApplicationReference({
      applicationId: (slot.slotData.slotDetail as TestSlot)?.booking?.application.applicationId,
      bookingSequence: (slot.slotData.slotDetail as TestSlot)?.booking?.application.bookingSequence,
      checkDigit: (slot.slotData.slotDetail as TestSlot)?.booking?.application.checkDigit,
    } as ApplicationReference))))
    .filter((slot) => slotIDs.includes(slot.slotData?.slotDetail?.slotId?.toString()));
};

export const getPermittedSlotIdsBeforeToday = (
  journal: JournalModel,
  today: DateTime,
  slotProvider: SlotProvider,
): SlotItem[] => {
  const slots = getSlots(journal);
  const arrayOfDateStrings = Object.keys(slots).filter((date: string) => {
    const thisDate = new DateTime(date);
    return thisDate.isBefore(today.format('YYYY-MM-DD'));
  });
  return flatten(
    (arrayOfDateStrings.map(
      (date: string) => slots[date]
        .filter((slotItem: SlotItem) => slotProvider.canStartTest(slotItem.slotData))
        .filter((slotItem: SlotItem) => {
          if (!('booking' in slotItem.slotData)) { // NonTestActivity
            return false;
          }
          const testSlot = slotItem.slotData as TestSlot;
          const applicationReference = formatApplicationReference({
            applicationId: testSlot.booking.application.applicationId,
            bookingSequence: testSlot.booking.application.bookingSequence,
            checkDigit: testSlot.booking.application.checkDigit,
          } as ApplicationReference);
          // allow through if appRef is not already in completedTest list
          return !journal.completedTests
            .map((testResult: SearchResultTestSchema) => testResult.applicationReference)
            .includes(Number(applicationReference));
        }),
    )),
  );
};

export const getCompletedTests = (journalModel: JournalModel): SearchResultTestSchema[] => {
  return journalModel.completedTests;
};
