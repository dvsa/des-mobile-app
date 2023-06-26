import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { StoreModel } from '@shared/models/store.model';
import { map } from 'rxjs/operators';
import {
  getVehicleChecksCatHomeTest,
} from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.selector';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { Observable } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

interface ComponentState {
  vehicleChecksDrivingFaultCount$: Observable<number>;
  vehicleChecksSeriousFaultCount$: Observable<number>;
}

@Component({
  selector: 'vehicle-checks-home',
  templateUrl: 'vehicle-checks.html',
  styleUrls: ['vehicle-checks.scss'],
})
export class VehicleChecksComponent implements OnInit {

  @Input()
  testCategory: TestCategory | CategoryCode;

  componentState: ComponentState;

  constructor(
    private store$: Store<StoreModel>,
    public faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider,
  ) {
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.componentState = {
      vehicleChecksDrivingFaultCount$: currentTest$.pipe(
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getVehicleChecksCatHomeTest),
        map((vehicleChecks) => {
          return this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory, vehicleChecks).drivingFaults;
        }),
      ),
      vehicleChecksSeriousFaultCount$: currentTest$.pipe(
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getVehicleChecksCatHomeTest),
        map((vehicleChecks) => {
          return this.faultCountProvider.getVehicleChecksFaultCount(this.testCategory, vehicleChecks).seriousFaults;
        }),
      ),
    };
  }
}
