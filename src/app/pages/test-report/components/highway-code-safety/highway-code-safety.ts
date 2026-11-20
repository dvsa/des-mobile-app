import { Component, Input, computed } from '@angular/core';

import { NgClass } from '@angular/common';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { StoreModel } from '@shared/models/store.model';
import * as highwayCodeSafetyAction from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.actions';
import { getHighwayCodeSafety } from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.reducer';
import {
  getHighwayCodeSafetyDrivingFault,
  getHighwayCodeSafetySeriousFault,
  isHighwayCodeSafetySelected,
} from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.selectors';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';
import { CompetencyButtonComponent } from '../competency-button/competency-button';

@Component({
  selector: 'highway-code-safety',
  templateUrl: 'highway-code-safety.html',
  styleUrls: ['highway-code-safety.scss'],
  imports: [
    IonRow,
    IonCol,
    CompetencyButtonComponent,
    NgClass,
    TickIndicatorComponent,
    DrivingFaultsBadgeComponent,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
  ],
})
export class HighwayCodeSafetyComponent {
  @Input()
  testCategory: TestCategory | CategoryCode;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() =>
    this.testDataByCategoryProvider.getTestDataByCategoryCode(this.testCategory)(this.currentTest())
  );
  private readonly highwayCodeSafety = computed(() => getHighwayCodeSafety(this.testData()));
  private readonly testReportState = this.store$.selectSignal(getTestReportState);

  get isRemoveFaultMode(): boolean {
    return isRemoveFaultMode(this.testReportState());
  }
  get isSeriousMode(): boolean {
    return isSeriousMode(this.testReportState());
  }
  get isDangerousMode(): boolean {
    return isDangerousMode(this.testReportState());
  }
  get selectedHighwayCodeSafety(): boolean {
    return isHighwayCodeSafetySelected(this.highwayCodeSafety());
  }
  get highwayCodeSafetySeriousFault(): boolean {
    return getHighwayCodeSafetySeriousFault(this.highwayCodeSafety());
  }
  get highwayCodeSafetyDrivingFault(): boolean {
    return getHighwayCodeSafetyDrivingFault(this.highwayCodeSafety());
  }

  constructor(
    private store$: Store<StoreModel>,
    private testDataByCategoryProvider: TestDataByCategoryProvider
  ) {}

  onTap = () => {
    this.addOrRemoveFault();
  };

  onPress = () => {
    this.addOrRemoveFault(true);
  };

  canButtonRipple = (): boolean => {
    if (this.isRemoveFaultMode) {
      if (this.hasDangerousFault() && this.isDangerousMode) {
        return true;
      }

      if (this.hasSeriousFault() && this.isSeriousMode) {
        return true;
      }

      if (!this.isSeriousMode && !this.isDangerousMode && this.faultCount() > 0) {
        return true;
      }
      return false;
    }
    return !(this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0);
  };

  toggleHighwayCodeSafety = (): void => {
    if (this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }
    this.store$.dispatch(highwayCodeSafetyAction.ToggleHighwayCodeSafety());
  };

  addOrRemoveFault = (wasPress = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }

    if (this.isDangerousMode) {
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(highwayCodeSafetyAction.HighwayCodeSafetyAddSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(highwayCodeSafetyAction.HighwayCodeSafetyAddDrivingFault());
    }
  };

  removeFault = (): void => {
    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(highwayCodeSafetyAction.HighwayCodeSafetyRemoveFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount() > 0) {
      this.store$.dispatch(highwayCodeSafetyAction.HighwayCodeSafetyRemoveFault());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  faultCount = (): number => (this.highwayCodeSafetyDrivingFault ? 1 : 0);

  hasSeriousFault = (): boolean => this.highwayCodeSafetySeriousFault;

  hasDangerousFault = (): boolean => false;
}
