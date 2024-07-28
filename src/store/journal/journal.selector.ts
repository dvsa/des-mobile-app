import { flatten, get, isNil } from 'lodash-es';

import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { JournalModel } from './journal.model';

export const getSlots = (journal: JournalModel) => journal.slots;

export const getAllSlots = (journal: JournalModel): SlotItem[] => {
  let allSlots: SlotItem[] = [];
  Object.keys(journal.slots).forEach((date) => {
    allSlots = [...allSlots, ...journal.slots[date]];
  });
  return allSlots;
};

export const getSlotsOnSelectedDate = (journal: JournalModel): SlotItem[] => journal.slots[journal.selectedDate] || [];

export const getSlotBySlotID = (slotItems: SlotItem[], slotId: number): SlotItem =>
  slotItems.find((slotItem) => get(slotItem, 'slotData.slotDetail.slotId') === slotId);

export const getAppRefFromSlot = (slotItem: SlotItem): ApplicationReference | null => {
  if (!slotItem || !('booking' in slotItem?.slotData)) {
    return null;
  }

  return {
    applicationId: get(slotItem, 'slotData.booking.application.applicationId'),
    bookingSequence: get(slotItem, 'slotData.booking.application.bookingSequence'),
    checkDigit: get(slotItem, 'slotData.booking.application.checkDigit'),
  };
};

export const getSlotsOnDate = (journal: JournalModel, date: string = null) => journal.slots[date];

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

export const canNavigateToNextDay = (journal: JournalModel): boolean => {
  const nextDayAsDate = DateTime.at(journal.selectedDate).add(1, Duration.DAY).format('YYYY-MM-DD');
  const fourteenDaysAhead = DateTime.at(DateTime.today()).add(14, Duration.DAY).format('YYYY-MM-DD');

  return nextDayAsDate < fourteenDaysAhead;
};

export const getPermittedSlotIdsBeforeToday = (
  journal: JournalModel,
  today: DateTime,
  slotProvider: SlotProvider
): SlotItem[] => {
  const slots = getSlots(journal);
  const arrayOfDateStrings = Object.keys(slots).filter((date: string) => {
    return new DateTime(date).isBefore(today.format('YYYY-MM-DD'));
  });
  return flatten(
    arrayOfDateStrings.map((date: string) =>
      slots[date]
        .filter((slotItem: SlotItem) => slotProvider.canStartTest(slotItem.slotData))
        .filter((slotItem: SlotItem) => 'booking' in slotItem.slotData)
    )
  );
};
