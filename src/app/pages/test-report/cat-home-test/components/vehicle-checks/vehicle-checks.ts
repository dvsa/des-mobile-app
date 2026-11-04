import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { StoreModel } from '@shared/models/store.model';
import { getVehicleChecksCatHomeTest } from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ComponentState {
  vehicleChecksDrivingFaultCount$: Observable<number>;
  vehicleChecksSeriousFaultCount$: Observable<number>;
}

@Component({
  selector: 'vehicle-checks-home',
  templateUrl: 'vehicle-checks.html',
  styleUrls: ['vehicle-checks.scss'],
  imports: [DrivingFaultsBadgeComponent, SeriousFaultBadgeComponent, AsyncPipe],
})
export class VehicleChecksComponent implements OnInit {
  @Input()
  testCategory: TestCategory | CategoryCode;

  componentState: ComponentState;

  constructor(
    private store$: Store<StoreModel>,
    public faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider
  ) {}

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.componentState = {
      vehicleChecksDrivingFaultCount$: currentTest$.pipe(
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getVehicleChecksCatHomeTest),
        map((vehicleChecks) => {
          return this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory, vehicleChecks).drivingFaults;
        })
      ),
      vehicleChecksSeriousFaultCount$: currentTest$.pipe(
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getVehicleChecksCatHomeTest),
        map((vehicleChecks) => {
          return this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory, vehicleChecks).seriousFaults;
        })
      ),
    };
  }
}
