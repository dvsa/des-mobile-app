import { Component, Input, computed } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store } from '@ngrx/store';

import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { StoreModel } from '@shared/models/store.model';
import { getSafetyQuestionsCatD } from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

@Component({
  selector: 'safety-questions-cat-d',
  templateUrl: 'safety-questions.cat-d.html',
  styleUrls: ['safety-questions.cat-d.scss'],
  imports: [DrivingFaultsBadgeComponent],
})
export class SafetyQuestionsCatDComponent {
  @Input()
  testCategory: TestCategory | CategoryCode;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly safetyQuestions = computed(() =>
    getSafetyQuestionsCatD(this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(this.currentTest()))
  );
  safetyQuestionsDrivingFaultCount = computed(
    () =>
      this.faultCountProvider.getSafetyQuestionsFaultCount(this.testCategory as TestCategory, this.safetyQuestions())
        .drivingFaults
  );

  constructor(
    private store$: Store<StoreModel>,
    public faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider
  ) {}
}
