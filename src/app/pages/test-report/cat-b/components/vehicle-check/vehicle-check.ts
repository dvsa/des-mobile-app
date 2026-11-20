import { NgClass } from '@angular/common';
import { Component, computed } from '@angular/core';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { IonCol, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getVehicleChecks } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  ShowMeQuestionDangerousFault,
  ShowMeQuestionDrivingFault,
  ShowMeQuestionPassed,
  ShowMeQuestionRemoveFault,
  ShowMeQuestionSeriousFault,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { isEmpty } from 'lodash-es';
import { CompetencyButtonComponent } from '../../../components/competency-button/competency-button';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../../test-report.actions';
import { getTestReportState } from '../../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../../test-report.selector';

@Component({
  selector: 'vehicle-check',
  templateUrl: 'vehicle-check.html',
  styleUrls: ['./vehicle-check.scss'],
  standalone: true,
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
export class VehicleCheckComponent {
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  private readonly vehicleChecks = computed(() => getVehicleChecks(this.testData()));
  private readonly testReportState = this.store$.selectSignal(getTestReportState);

  tellMeQuestionFault = computed(() => this.vehicleChecks().tellMeQuestion.outcome);
  showMeQuestionFault = computed(() => this.vehicleChecks().showMeQuestion.outcome);
  selectedShowMeQuestion = computed(() => !isEmpty(this.showMeQuestionFault()));
  isRemoveFaultMode = computed(() => isRemoveFaultMode(this.testReportState()));
  isSeriousMode = computed(() => isSeriousMode(this.testReportState()));
  isDangerousMode = computed(() => isDangerousMode(this.testReportState()));

  constructor(private store$: Store<StoreModel>) {}

  onTap = () => {
    this.addOrRemoveFault();
  };

  onPress = () => {
    this.addOrRemoveFault(true);
  };

  toggleShowMeQuestion = (): void => {
    if (this.hasShowMeDrivingFault() || this.hasSeriousFault() || this.hasDangerousFault()) {
      return;
    }

    if (this.showMeQuestionFault() === CompetencyOutcome.P) {
      this.store$.dispatch(ShowMeQuestionRemoveFault(CompetencyOutcome.P));
      return;
    }

    this.store$.dispatch(ShowMeQuestionPassed());
  };

  canButtonRipple = () => {
    if (this.isRemoveFaultMode()) {
      if (this.hasDangerousFault() && this.isDangerousMode()) {
        return true;
      }

      if (this.hasSeriousFault() && this.isSeriousMode()) {
        return true;
      }

      if (this.hasShowMeDrivingFault() && !this.isSeriousMode() && !this.isDangerousMode()) {
        return true;
      }

      return false;
    }

    return !(this.hasDangerousFault() || this.hasSeriousFault() || this.hasShowMeDrivingFault());
  };

  addOrRemoveFault = (wasPress = false): void => {
    if (this.isRemoveFaultMode()) {
      this.removeFault();
      return;
    }

    this.addFault(wasPress);
  };

  removeFault = (): void => {
    if (this.hasDangerousFault() && this.isDangerousMode() && this.isRemoveFaultMode()) {
      this.store$.dispatch(ShowMeQuestionRemoveFault(CompetencyOutcome.D));
      this.store$.dispatch(ShowMeQuestionPassed());
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode() && this.isRemoveFaultMode()) {
      this.store$.dispatch(ShowMeQuestionRemoveFault(CompetencyOutcome.S));
      this.store$.dispatch(ShowMeQuestionPassed());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (!this.isSeriousMode() && !this.isDangerousMode() && this.isRemoveFaultMode() && this.hasShowMeDrivingFault()) {
      this.store$.dispatch(ShowMeQuestionRemoveFault(CompetencyOutcome.DF));
      this.store$.dispatch(ShowMeQuestionPassed());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.hasShowMeDrivingFault() || this.hasSeriousFault() || this.hasDangerousFault()) {
      return;
    }

    if (this.isDangerousMode()) {
      this.store$.dispatch(ShowMeQuestionDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode()) {
      this.store$.dispatch(ShowMeQuestionSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(ShowMeQuestionDrivingFault());
    }
  };

  getDrivingFaultCount = (): number => {
    if (this.hasDangerousFault() || this.hasSeriousFault()) {
      return 0;
    }

    if (this.hasShowMeDrivingFault() || this.hasTellMeDrivingFault()) {
      return 1;
    }

    return 0;
  };

  hasShowMeDrivingFault = (): boolean => {
    return this.showMeQuestionFault() === CompetencyOutcome.DF;
  };

  hasTellMeDrivingFault = (): boolean => {
    return this.tellMeQuestionFault() === CompetencyOutcome.DF;
  };

  hasSeriousFault = (): boolean => {
    return this.showMeQuestionFault() === CompetencyOutcome.S;
  };

  hasDangerousFault = (): boolean => {
    return this.showMeQuestionFault() === CompetencyOutcome.D;
  };
}
