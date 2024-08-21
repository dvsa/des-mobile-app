import { Component, Input, OnInit } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { StoreModel } from '@shared/models/store.model';
import { getSafetyQuestionsCatD } from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

interface ComponentState {
  safetyQuestionsDrivingFaultCount$: Observable<number>;
}

@Component({
  selector: 'safety-questions-cat-d',
  templateUrl: 'safety-questions.cat-d.html',
  styleUrls: ['safety-questions.cat-d.scss'],
})
export class SafetyQuestionsCatDComponent implements OnInit {
  @Input()
  testCategory: TestCategory | CategoryCode;

  componentState: ComponentState;

  constructor(
    private store$: Store<StoreModel>,
    public faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider
  ) {}

  ngOnInit(): void {
    const testCategory = this.testCategory as TestCategory;

    this.componentState = {
      safetyQuestionsDrivingFaultCount$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getSafetyQuestionsCatD),
        map(
          (safetyQuestions) =>
            this.faultCountProvider.getSafetyQuestionsFaultCount(testCategory, safetyQuestions).drivingFaults
        )
      ),
    };
  }
}
