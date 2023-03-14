import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable } from 'rxjs';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { getTests } from '@store/tests/tests.reducer';
import { getIncompleteTestsSlotOlderThanADay } from '@store/tests/tests.selector';
import { map, withLatestFrom } from 'rxjs/operators';
import { getJournalState } from '@store/journal/journal.reducer';
import { getJournalSlotsBySlotIDs } from '@store/journal/journal.selector';

export const unsubmittedTestSlots$ = (store$: Store<StoreModel>): Observable<SlotItem[]> => store$.pipe(
  select(getTests),
  // get all slot ids regarded as incomplete from 'tests' slice of state before today's date
  select(getIncompleteTestsSlotOlderThanADay),
  withLatestFrom(store$.pipe(select(getJournalState))), // grab 'journal' slice
  // filter journal slots by incomplete slot ids inside 'tests' part of state
  map(([slotIDs, journal]) => getJournalSlotsBySlotIDs(journal, slotIDs)),
);

export const unsubmittedTestSlotsInDateOrder$ = (
  store$: Store<StoreModel>,
): Observable<SlotItem[]> => unsubmittedTestSlots$(store$).pipe(
  map((slotItems) =>
    // sort oldest to newest
    slotItems.sort((a, b) =>
      new Date(a.slotData.slotDetail.start).getTime() - new Date(b.slotData.slotDetail.start).getTime())),
);
