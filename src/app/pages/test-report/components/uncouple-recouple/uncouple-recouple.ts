import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import {
  ToggleUncoupleRecouple,
  UncoupleRecoupleAddDangerousFault,
  UncoupleRecoupleAddDrivingFault,
  UncoupleRecoupleAddSeriousFault,
  UncoupleRecoupleRemoveFault,
} from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { get } from 'lodash-es';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';
import { CompetencyButtonComponent } from '../competency-button/competency-button';

@Component({
  selector: 'uncouple-recouple',
  templateUrl: 'uncouple-recouple.html',
  styleUrls: ['uncouple-recouple.scss'],
  imports: [
    IonGrid,
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
export class UncoupleRecoupleComponent {
  @Input()
  category: CategoryCode;

  @Input()
  disableDrivingFaults?: boolean = false;

  @Input()
  buttonFloatAbove = false;

  @Output()
  competencyClicked = new EventEmitter<void>();

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() =>
    this.testDataByCategory.getTestDataByCategoryCode(this.category)(this.currentTest())
  );
  private readonly uncoupleRecouple = computed(() => get(this.testData(), 'uncoupleRecouple'));
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
  get selectedUncoupleRecouple(): boolean {
    return get(this.uncoupleRecouple(), 'selected');
  }
  get uncoupleRecoupleOutcome(): CompetencyOutcome {
    return get(this.uncoupleRecouple(), 'fault') as CompetencyOutcome;
  }

  constructor(
    private store$: Store<StoreModel>,
    private testDataByCategory: TestDataByCategoryProvider
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

  toggleUncoupleRecouple = (): void => {
    if (this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }
    this.store$.dispatch(ToggleUncoupleRecouple());
  };

  addOrRemoveFault = (wasPress = false): void => {
    // buttonFloatAbove used for manoeuvre categories to alter display and stop DF being added;
    if (this.buttonFloatAbove && !this.isDangerousMode && !this.isSeriousMode) {
      this.competencyClicked.emit();
      return;
    }

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
      this.store$.dispatch(UncoupleRecoupleAddDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(UncoupleRecoupleAddSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress && !this.disableDrivingFaults) {
      this.store$.dispatch(UncoupleRecoupleAddDrivingFault());
    }
  };

  removeFault = (): void => {
    if (this.hasDangerousFault() && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(UncoupleRecoupleRemoveFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(UncoupleRecoupleRemoveFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount() > 0) {
      this.store$.dispatch(UncoupleRecoupleRemoveFault());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  faultCount = (): number => (this.uncoupleRecoupleOutcome === CompetencyOutcome.DF ? 1 : 0);

  hasSeriousFault = (): boolean => this.uncoupleRecoupleOutcome === CompetencyOutcome.S;

  hasDangerousFault = (): boolean => this.uncoupleRecoupleOutcome === CompetencyOutcome.D;
}
