import { Component, OnInit } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable, Subscription } from 'rxjs';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';

enum driverType {
  R = 'R',
  D = 'D',
}

interface DrivingFaultSummaryState {
  count$: Observable<number>;
  driverRiderFlag$: Observable<driverType>;
}

@Component({
  selector: 'driving-fault-summary',
  templateUrl: 'driving-fault-summary.html',
  styleUrls: ['driving-fault-summary.scss'],
})
export class DrivingFaultSummaryComponent implements OnInit {
  componentState: DrivingFaultSummaryState;
  subscription: Subscription;

  constructor(
    private store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider
  ) {}

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));
    const category$ = currentTest$.pipe(select(getTestCategory));
    this.componentState = {
      count$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(category$),
        map(([testData, category]) => {
          return this.faultCountProvider.getDrivingFaultSumCount(category as TestCategory, testData);
        })
      ),
      driverRiderFlag$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => {
          return this.driverTypeSwitch(category as TestCategory);
        })
      ),
    };
  }

  ionViewWillEnter(): void {
    if (this.componentState && this.componentState.count$) {
      this.subscription = this.componentState.count$.pipe(takeUntil(trDestroy$)).subscribe();
    }
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  driverTypeSwitch(cat: TestCategory): driverType {
    // switch to determine Driver or Rider based upon category
    if (cat.includes('EUA')) {
      return driverType.R;
    }
    return driverType.D;
  }
}
