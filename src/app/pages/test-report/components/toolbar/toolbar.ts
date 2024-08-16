import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { StoreModel } from '@shared/models/store.model';
import { TestDataUnion } from '@shared/unions/test-schema-unions';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable, Subscription, merge } from 'rxjs';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';

interface ToolbarComponentState {
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  isRemoveFaultMode$: Observable<boolean>;
  shouldDisableRemove$: Observable<boolean>;
}

@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.html',
  styleUrls: ['toolbar.scss'],
})
export class ToolbarComponent {
  @Input()
  showDrivingFaultCounter = true;

  componentState: ToolbarComponentState;
  subscription: Subscription;

  isRemoveFaultMode = false;
  isSeriousMode = false;
  isDangerousMode = false;
  shouldDisableRemove = false;

  constructor(
    private store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider
  ) {}

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));
    this.componentState = {
      isRemoveFaultMode$: this.store$.pipe(select(getTestReportState), select(isRemoveFaultMode)),
      isSeriousMode$: this.store$.pipe(select(getTestReportState), select(isSeriousMode)),
      isDangerousMode$: this.store$.pipe(select(getTestReportState), select(isDangerousMode)),
      shouldDisableRemove$: currentTest$.pipe(
        select(getTestData),
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        map(([data, category]) => this.currentTestHasFaults(category as TestCategory, data))
      ),
    };

    const { isRemoveFaultMode$, isSeriousMode$, isDangerousMode$, shouldDisableRemove$ } = this.componentState;

    const merged$ = merge(
      isRemoveFaultMode$.pipe(map((result) => (this.isRemoveFaultMode = result))),
      isSeriousMode$.pipe(map((result) => (this.isSeriousMode = result))),
      isDangerousMode$.pipe(map((result) => (this.isDangerousMode = result))),
      shouldDisableRemove$.pipe(map((result) => (this.shouldDisableRemove = result)))
    );

    this.subscription = merged$.pipe(takeUntil(trDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleRemoveFaultMode(shouldDisable = false): void {
    if (shouldDisable) {
      return;
    }
    this.store$.dispatch(ToggleRemoveFaultMode(true));
  }

  toggleSeriousMode(): void {
    if (this.isDangerousMode) {
      this.store$.dispatch(ToggleDangerousFaultMode());
    }
    this.store$.dispatch(ToggleSeriousFaultMode(true));
  }

  toggleDangerousMode(): void {
    if (this.isSeriousMode) {
      this.store$.dispatch(ToggleSeriousFaultMode());
    }
    this.store$.dispatch(ToggleDangerousFaultMode(true));
  }

  currentTestHasFaults = (category: TestCategory, data: TestDataUnion): boolean => {
    const drivingFaultCount: number = this.faultCountProvider.getDrivingFaultSumCount(category, data);
    const seriousFaultCount: number = this.faultCountProvider.getSeriousFaultSumCount(category, data);
    const dangerousFaultCount: number = this.faultCountProvider.getDangerousFaultSumCount(category, data);

    return dangerousFaultCount === 0 && seriousFaultCount === 0 && drivingFaultCount === 0;
  };
}
