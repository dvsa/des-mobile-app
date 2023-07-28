import { flatten, isNil } from 'lodash';
import { ActivityCode, SearchResultTestSchema } from '@dvsa/mes-search-schema';

import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { JournalModel } from './journal.model';

export const getSlots = (journal: JournalModel) => journal.slots;

export const getSlotsOnSelectedDate = (journal: JournalModel) => journal.slots[journal.selectedDate];

export const getSlotsOnDate = (
  journal: JournalModel,
  date: string = null,
) => journal.slots[date];

export const getError = (journal: JournalModel) => journal.error;

export const getIsLoading = (journal: JournalModel) => journal.isLoading;

export const getLastRefreshed = (journal: JournalModel) => journal.lastRefreshed;

export const getLastRefreshedTime = (date: Date) => (isNil(date) ? '--:--' : DateTime.at(date)
  .format('hh:mma'));

export const getSelectedDate = (journal: JournalModel) => journal.selectedDate;

export const canNavigateToPreviousDay = (journal: JournalModel, today: DateTime): boolean => {
  const { selectedDate } = journal;
  const lookbackLimit = today.subtract(14, Duration.DAY)
    .format('YYYY-MM-DD');

  return selectedDate > lookbackLimit;
};

export const canNavigateToNextDay = (journal: JournalModel): boolean => {
  const nextDayAsDate = DateTime.at(journal.selectedDate)
    .add(1, Duration.DAY)
    .format('YYYY-MM-DD');
  const fourteenDaysAhead = DateTime.at(DateTime.today())
    .add(14, Duration.DAY)
    .format('YYYY-MM-DD');

  return (nextDayAsDate < fourteenDaysAhead);
};

export const getPermittedSlotIdsBeforeToday = (
  journal: JournalModel,
  today: DateTime,
  slotProvider: SlotProvider,
): SlotItem[] => {
  const slots = getSlots(journal);
  const arrayOfDateStrings = Object.keys(slots)
    .filter((date: string) => {
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

export const getCompletedTestOutcome = (completedTests: SearchResultTestSchema[], appRef: string): ActivityCode => {
  return completedTests
    .find((test) => test.applicationReference === parseInt(appRef, 10))
    ?.activityCode;
};

export const getCompletedPassCerts = (journalModel: JournalModel): string[] => {
  const { completedTests } = journalModel;
  if (!completedTests) {
    return [];
  }

  return completedTests
    .map((test) => test.passCertificateNumber)
    .filter((passCertificate) => !!passCertificate);
};
