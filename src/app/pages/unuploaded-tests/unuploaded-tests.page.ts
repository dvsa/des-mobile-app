import { Component, OnInit } from '@angular/core';
import { selectEmployeeId, selectEmployeeName, selectVersionNumber } from '@store/app-info/app-info.selectors';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { map } from 'rxjs/operators';
import { selectRole } from '@store/app-config/app-config.selectors';
import { ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { UnuploadedTestsViewDidEnter } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { TestSlot } from '@dvsa/mes-journal-schema';
import {
  unsubmittedTestSlotsInDateOrder$,
} from '@pages/unuploaded-tests/unuploaded-tests.selector';
interface UnunploadedTestsPageState {

  unSubmittedTestSlotData$: Observable<TestSlot[]>;
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
      unSubmittedTestSlots$: unsubmittedTestSlotsInDateOrder$(this.store$),
      unSubmittedTestSlotData$: unsubmittedTestSlotsInDateOrder$(this.store$).pipe(
        map((data) => data.map((slot) => slot.slotData)),
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
