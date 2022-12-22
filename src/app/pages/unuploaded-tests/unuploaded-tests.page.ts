import { Component, OnInit } from '@angular/core';
import { selectEmployeeId, selectEmployeeName, selectVersionNumber } from '@store/app-info/app-info.selectors';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { map } from 'rxjs/operators';
import { selectRole } from '@store/app-config/app-config.selectors';
import { ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getAllIncompleteTests } from '@store/tests/tests.selector';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { Candidate } from '@dvsa/mes-test-schema/categories/common';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { ActivateTest } from '@store/tests/tests.actions';
import { ResumingWriteUp } from '@store/journal/journal.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

interface UnunploadedTestsPageState {
  appVersion$: Observable<string>;
  employeeName$: Observable<string>;
  employeeId$: Observable<string>;
  role$: Observable<string>;

  testsInWriteUp$: Observable<TestResultSchemasUnion[]>;
  slots$?: Observable<SlotItem[]>;
}

@Component({
  selector: 'unuploaded-tests',
  templateUrl: 'unuploaded-tests.page.html',
  styleUrls: ['unuploaded-tests.page.scss'],
})
export class UnuploadedTestsPage implements OnInit {

  formatAppRef = formatApplicationReference;

  pageState: UnunploadedTestsPageState;

  constructor(
    private store$: Store<StoreModel>,
    private routeByCat: RouteByCategoryProvider,
  ) {
  }

  ngOnInit() {
    this.pageState = {
      appVersion$: this.store$.select(selectVersionNumber),
      employeeName$: this.store$.select(selectEmployeeName),
      employeeId$: this.store$.select(selectEmployeeId).pipe(map(this.getEmployeeNumberDisplayValue)),
      role$: this.store$.select(selectRole).pipe(map(this.getRoleDisplayValue)),
      testsInWriteUp$: this.store$.pipe(
        select(getTests),
        select(getAllIncompleteTests),
      ),
    };
  }

  startTestInWriteUp = async ({ slotID, category }: { slotID: number, category: string }) => {
    this.store$.dispatch(ActivateTest(slotID, category as TestCategory));
    this.store$.dispatch(ResumingWriteUp(slotID.toString()));
    await this.routeByCat.navigateToPage(TestFlowPageNames.OFFICE_PAGE, category as TestCategory);
  };

  getRoleDisplayValue = (role: string): string => ExaminerRoleDescription[role] || 'Unknown Role';

  getEmployeeNumberDisplayValue = (employeeNumber: string): string => employeeNumber || 'NOT_KNOWN';

  getName(candidate: Candidate): string {
    const { candidateName: name } = candidate;
    return name.title ? `${name.title} ${name.firstName} ${name.lastName}` : `${name.firstName} ${name.lastName}`;
  }

}
