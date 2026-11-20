import { NgClass } from '@angular/common';
import { Component, Input, computed } from '@angular/core';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import * as controlledStopAction from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import { getControlledStop } from '@store/tests/test-data/common/controlled-stop/controlled-stop.reducer';
import {
  getControlledStopFault,
  isControlledStopSelected,
} from '@store/tests/test-data/common/controlled-stop/controlled-stop.selectors';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';
import { CompetencyButtonComponent } from '../competency-button/competency-button';

@Component({
  selector: 'controlled-stop',
  templateUrl: 'controlled-stop.html',
  styleUrls: ['controlled-stop.scss'],
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
export class ControlledStopComponent {
  @Input()
  testCategory: CategoryCode;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() =>
    this.testDataByCategoryProvider.getTestDataByCategoryCode(this.testCategory)(this.currentTest())
  );
  private readonly controlledStop = computed(() => getControlledStop(this.testData()));
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
  get selectedControlledStop(): boolean {
    return isControlledStopSelected(this.controlledStop());
  }
  get controlledStopOutcome(): CompetencyOutcome {
    return getControlledStopFault(this.controlledStop());
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

  toggleControlledStop = (): void => {
    if (this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }
    this.store$.dispatch(controlledStopAction.ToggleControlledStop());
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
      this.store$.dispatch(controlledStopAction.ControlledStopAddDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(controlledStopAction.ControlledStopAddSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(controlledStopAction.ControlledStopAddDrivingFault());
    }
  };

  removeFault = (): void => {
    if (this.hasDangerousFault() && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(controlledStopAction.ControlledStopRemoveFault(CompetencyOutcome.D));
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(controlledStopAction.ControlledStopRemoveFault(CompetencyOutcome.S));
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount() > 0) {
      this.store$.dispatch(controlledStopAction.ControlledStopRemoveFault(CompetencyOutcome.DF));
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  faultCount = (): number => (this.controlledStopOutcome === CompetencyOutcome.DF ? 1 : 0);

  hasSeriousFault = (): boolean => this.controlledStopOutcome === CompetencyOutcome.S;

  hasDangerousFault = (): boolean => this.controlledStopOutcome === CompetencyOutcome.D;

  shouldDisplayEmergencyLabel() {
    return [TestCategory.B, TestCategory.ADI2, TestCategory.H, TestCategory.F, TestCategory.G, TestCategory.K].includes(
      this.testCategory as TestCategory
    )
      ? 'Emergency'
      : 'Controlled';
  }
}
