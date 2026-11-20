import { Component, Input, computed } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store } from '@ngrx/store';

import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { StoreModel } from '@shared/models/store.model';
import { getVehicleChecksCatD } from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

@Component({
  selector: 'vehicle-checks-compact-cat-d',
  templateUrl: 'vehicle-checks-compact.cat-d.html',
  styleUrls: ['vehicle-checks-compact.cat-d.scss'],
  imports: [DrivingFaultsBadgeComponent, SeriousFaultBadgeComponent],
})
export class VehicleChecksCompactCatDComponent {
  @Input()
  testCategory: TestCategory | CategoryCode;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly vehicleChecks = computed(() =>
    getVehicleChecksCatD(this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(this.currentTest()))
  );
  vehicleChecksDrivingFaultCount = computed(
    () =>
      this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory as TestCategory, this.vehicleChecks())
        .drivingFaults
  );
  vehicleChecksSeriousFaultCount = computed(
    () =>
      this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory as TestCategory, this.vehicleChecks())
        .seriousFaults
  );

  constructor(
    private store$: Store<StoreModel>,
    public faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider
  ) {}
}
