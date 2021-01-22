import {
// flatten,
  isEmpty,
  isNil,
} from 'lodash';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { JournalModel } from './journal.model';
import { DateTime, Duration } from '../../shared/helpers/date-time';
import { SlotItem } from '../../providers/slot-selector/slot-item';
// import { SlotProvider } from '../../providers/slot/slot';

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
  const sevenDaysAhead = DateTime.at(DateTime.today()).add(7, Duration.DAY).format('YYYY-MM-DD');

  return (nextDayAsDate < sevenDaysAhead);
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

// TODO Re-introduce in MES-6242
// export const getPermittedSlotIdsBeforeToday = (
//   journal: JournalModel, today: DateTime, slotProvider: SlotProvider): number[] => {
//   const slots = getSlots(journal);
//   const arrayOfDateStrings = Object.keys(slots).filter((date: string) => {
//     const thisDate = new DateTime(date);
//     return thisDate.isBefore(today.format('YYYY-MM-DD'));
//   });
//   return flatten((arrayOfDateStrings.map(date => slots[date].filter(slot => slotProvider.canStartTest(slot.slotData))
//     .map(slot => slot.slotData.slotDetail.slotId))));
// };

export const getCompletedTests = (journalModel: JournalModel): SearchResultTestSchema[] => {
  return journalModel.completedTests;
};
