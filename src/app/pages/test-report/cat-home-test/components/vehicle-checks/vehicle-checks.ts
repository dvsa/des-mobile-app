import { Component, Input, computed } from '@angular/core';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { StoreModel } from '@shared/models/store.model';
import { getVehicleChecksCatHomeTest } from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

@Component({
  selector: 'vehicle-checks-home',
  templateUrl: 'vehicle-checks.html',
  styleUrls: ['vehicle-checks.scss'],
  imports: [DrivingFaultsBadgeComponent, SeriousFaultBadgeComponent],
})
export class VehicleChecksComponent {
  @Input()
  testCategory: TestCategory | CategoryCode;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly vehicleChecks = computed(() =>
    getVehicleChecksCatHomeTest(
      this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(this.currentTest())
    )
  );
  vehicleChecksDrivingFaultCount = computed(
    () => this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory, this.vehicleChecks()).drivingFaults
  );
  vehicleChecksSeriousFaultCount = computed(
    () => this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory, this.vehicleChecks()).seriousFaults
  );

  constructor(
    private store$: Store<StoreModel>,
    public faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider
  ) {}
}
