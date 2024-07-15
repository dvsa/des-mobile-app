import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable } from 'rxjs';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { getTests } from '@store/tests/tests.reducer';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { getJournalState } from '@store/journal/journal.reducer';
import { getIncompleteTests } from '@components/common/incomplete-tests-banner/incomplete-tests-banner.selector';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';

export const unsubmittedTestSlots$ = (
  store$: Store<StoreModel>,
  dateTimeProvider: DateTimeProvider,
  slotProvider: SlotProvider,
  daysToView: number,
): Observable<SlotItem[]> => store$.pipe(
  select(getJournalState),
  withLatestFrom(store$.pipe(select(getTests))),
  map(([journal, tests]) => getIncompleteTests(journal, tests, dateTimeProvider.now(), slotProvider, daysToView)),
  map((slotItems: SlotItem[]) =>
    // sort oldest to newest
    slotItems.sort((a, b) =>
      new Date(a.slotData.slotDetail.start).getTime() - new Date(b.slotData.slotDetail.start).getTime())),
  tap((data) => console.log('incompleteTests:', data)),
);

export const unsubmittedTestSlotsCount$ = (
  store$: Store<StoreModel>,
  dateTimeProvider: DateTimeProvider,
  slotProvider: SlotProvider,
  daysToView: number,
): Observable<number> =>
  unsubmittedTestSlots$(store$, dateTimeProvider, slotProvider, daysToView).pipe(
    map((slotItems: SlotItem[]) => slotItems.length),
  );
