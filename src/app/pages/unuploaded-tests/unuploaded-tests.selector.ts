import { combineLatest, Observable } from 'rxjs';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { map } from 'rxjs/operators';
import { getIncompleteTests } from '@components/common/incomplete-tests-banner/incomplete-tests-banner.selector';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { TestsModel } from '@store/tests/tests.model';
import { JournalModel } from '@store/journal/journal.model';

export const unsubmittedTestSlots$ = (
  journal$: Observable<JournalModel>,
  tests$: Observable<TestsModel>,
  dateTimeProvider: DateTimeProvider,
  slotProvider: SlotProvider,
  daysToView: number = 14,
): Observable<SlotItem[]> => {
  return combineLatest(([
    journal$,
    tests$,
  ])).pipe(map(([journal, tests]) => {
    return getIncompleteTests(journal, tests, dateTimeProvider.now(), slotProvider, daysToView).sort((a, b) =>
      // sort oldest to newest
      new Date(a.slotData.slotDetail.start).getTime() - new Date(b.slotData.slotDetail.start).getTime());
  }));
};

export const unsubmittedTestSlotsCount$ = (
  journal$: Observable<JournalModel>,
  tests$: Observable<TestsModel>,
  dateTimeProvider: DateTimeProvider,
  slotProvider: SlotProvider,
  daysToView: number,
): Observable<number> =>
  unsubmittedTestSlots$(journal$, tests$, dateTimeProvider, slotProvider, daysToView).pipe(
    map((slotItems: SlotItem[]) => slotItems.length),
  );
