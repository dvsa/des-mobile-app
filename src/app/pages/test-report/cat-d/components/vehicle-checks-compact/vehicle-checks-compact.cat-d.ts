import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { StoreModel } from '@shared/models/store.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { getVehicleChecksCatD } from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.selector';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

interface ComponentState {
  vehicleChecksDrivingFaultCount$: Observable<number>;
  vehicleChecksSeriousFaultCount$: Observable<number>;
}

@Component({
  selector: 'vehicle-checks-compact-cat-d',
  templateUrl: 'vehicle-checks-compact.cat-d.html',
  styleUrls: ['vehicle-checks-compact.cat-d.scss'],
})
export class VehicleChecksCompactCatDComponent implements OnInit {

  @Input()
  testCategory: TestCategory | CategoryCode;

  componentState: ComponentState;

  constructor(
    private store$: Store<StoreModel>,
    public faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider,
  ) {}

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    const testCategory = this.testCategory as TestCategory;

    this.componentState = {
      vehicleChecksDrivingFaultCount$: currentTest$.pipe(
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getVehicleChecksCatD),
        map((vehicleChecks) =>
          this.faultCountProvider.getVehicleChecksFaultCount(testCategory, vehicleChecks).drivingFaults),
      ),
      vehicleChecksSeriousFaultCount$: currentTest$.pipe(
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getVehicleChecksCatD),
        map((vehicleChecks) =>
          this.faultCountProvider.getVehicleChecksFaultCount(testCategory, vehicleChecks).seriousFaults),
      ),
    };
  }
}
