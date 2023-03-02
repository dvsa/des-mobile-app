import { Component, OnInit } from '@angular/core';
import { selectEmployeeId, selectEmployeeName, selectVersionNumber } from '@store/app-info/app-info.selectors';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { map, withLatestFrom } from 'rxjs/operators';
import { selectRole } from '@store/app-config/app-config.selectors';
import { ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getIncompleteTestsSlotOlderThanADay } from '@store/tests/tests.selector';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { getJournalState } from '@store/journal/journal.reducer';
import { getJournalSlotsBySlotIDs } from '@store/journal/journal.selector';
import { UnuploadedTestsViewDidEnter } from '@pages/unuploaded-tests/unuploaded-tests.actions';

interface UnunploadedTestsPageState {
  appVersion$: Observable<string>;
  employeeName$: Observable<string>;
  employeeId$: Observable<string>;
  role$: Observable<string>;

  unSubmittedTestSlots$?: Observable<SlotItem[]>;
}

@Component({
  selector: 'unuploaded-tests',
  templateUrl: 'unuploaded-tests.page.html',
  styleUrls: ['unuploaded-tests.page.scss'],
})
export class UnuploadedTestsPage implements OnInit {
  pageState: UnunploadedTestsPageState;

  constructor(
    private store$: Store<StoreModel>,
  ) {
  }

  ngOnInit() {
    this.pageState = {
      appVersion$: this.store$.select(selectVersionNumber),
      employeeName$: this.store$.select(selectEmployeeName),
      employeeId$: this.store$.select(selectEmployeeId).pipe(map(this.getEmployeeNumberDisplayValue)),
      role$: this.store$.select(selectRole).pipe(map(this.getRoleDisplayValue)),
      unSubmittedTestSlots$: this.store$.pipe(
        select(getTests),
        // get all slot ids regarded as incomplete from 'tests' slice of state older than 1 day
        select(getIncompleteTestsSlotOlderThanADay),
        withLatestFrom(
          this.store$.pipe(
            select(getJournalState), // grab 'journal' slice
          ),
        ),
        // filter journal slots by incomplete slot ids inside tests
        map(([slotIDs, journal]) => getJournalSlotsBySlotIDs(journal, slotIDs)),
        map((slotItems) =>
          slotItems.sort((a, b) =>
            new Date(a.slotData.slotDetail.start).getTime() - new Date(b.slotData.slotDetail.start).getTime())),
      ),
    };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(UnuploadedTestsViewDidEnter());
  }

  getRoleDisplayValue = (role: string): string => ExaminerRoleDescription[role] || 'Unknown Role';

  getEmployeeNumberDisplayValue = (employeeNumber: string): string => employeeNumber || 'NOT_KNOWN';

  getTestsText = (tests: number): string => tests === 1 ? 'test' : 'tests';
}
