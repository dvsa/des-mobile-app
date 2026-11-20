import { Component, computed } from '@angular/core';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getSafetyAndBalanceQuestions } from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.selector';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

@Component({
  selector: 'safety-and-balance',
  templateUrl: 'safety-and-balance.html',
  styleUrls: ['safety-and-balance.scss'],
  imports: [DrivingFaultsBadgeComponent],
})
export class SafetyAndBalanceComponent {
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly categorySignal = computed(() => getTestCategory(this.currentTest()) as TestCategory);
  private readonly testData = computed(() => getTestData(this.currentTest()));
  private readonly safetyAndBalance = computed(() => getSafetyAndBalanceQuestions(this.testData()));
  safetyAndBalanceDrivingFaultCount = computed(
    () =>
      this.faultCountProvider.getSafetyAndBalanceFaultCount(this.categorySignal(), this.safetyAndBalance())
        .drivingFaults
  );

  constructor(
    private store$: Store<StoreModel>,
    public faultCountProvider: FaultCountProvider
  ) {}
}
