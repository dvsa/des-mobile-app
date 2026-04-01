import { Component, Input } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { StoreModel } from '@shared/models/store.model';
import { TestDataUnion } from '@shared/unions/test-schema-unions';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';

@Component({
  selector: 'test-report-toolbar',
  templateUrl: 'test-report-toolbar.html',
  styleUrls: ['test-report-toolbar.scss'],
  standalone: false,
})
export class ToolbarComponent {
  @Input()
  showDrivingFaultCounter = true;

  @Input()
  category: CategoryCode;
  @Input()
  isRemoveFaultMode = false;
  @Input()
  isSeriousMode = false;
  @Input()
  isDangerousMode = false;
  @Input()
  testData: TestDataUnion = null;

  shouldDisableRemove = false;

  constructor(
    private store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider
  ) {}

  ngOnChanges() {
    console.log('changes');
    this.shouldDisableRemove = this.currentTestHasFaults(this.category as TestCategory, this.testData);
  }

  toggleRemoveFaultMode(shouldDisable = false): void {
    if (shouldDisable) {
      return;
    }
    this.store$.dispatch(ToggleRemoveFaultMode(true));
  }

  toggleSeriousMode(): void {
    console.log('toggle serious');
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
    console.log(data);
    const drivingFaultCount: number = this.faultCountProvider.getDrivingFaultSumCount(category, data);
    const seriousFaultCount: number = this.faultCountProvider.getSeriousFaultSumCount(category, data);
    const dangerousFaultCount: number = this.faultCountProvider.getDangerousFaultSumCount(category, data);

    return dangerousFaultCount === 0 && seriousFaultCount === 0 && drivingFaultCount === 0;
  };
}
