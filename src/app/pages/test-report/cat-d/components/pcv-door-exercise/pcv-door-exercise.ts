import { Component, Input, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { get } from 'lodash-es';

import { NgClass } from '@angular/common';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { PcvDoorExerciseTypes } from '@providers/fault-summary/cat-d/fault-summary.cat-d';
import { StoreModel } from '@shared/models/store.model';
import {
  PcvDoorExerciseAddDangerousFault,
  PcvDoorExerciseAddDrivingFault,
  PcvDoorExerciseAddSeriousFault,
  PcvDoorExerciseRemoveDangerousFault,
  PcvDoorExerciseRemoveDrivingFault,
  PcvDoorExerciseRemoveSeriousFault,
} from '@store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.actions';
import { getPcvDoorExercise } from '@store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.reducer';
import { getTestData } from '@store/tests/test-data/cat-d/test-data.cat-d.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { CompetencyButtonComponent } from '../../../components/competency-button/competency-button';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../../test-report.actions';
import { getTestReportState } from '../../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../../test-report.selector';

@Component({
  selector: 'pcv-door-exercise',
  templateUrl: 'pcv-door-exercise.html',
  styleUrls: ['pcv-door-exercise.scss'],
  imports: [
    CompetencyButtonComponent,
    NgClass,
    DrivingFaultsBadgeComponent,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
  ],
})
export class PcvDoorExerciseComponent {
  @Input()
  oneFaultLimit = false;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  private readonly pcvDoorExerciseState = computed(() => getPcvDoorExercise(this.testData()));
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
  get pcvDoorExercise(): PcvDoorExerciseTypes {
    return this.pcvDoorExerciseState();
  }
  get allowRipple(): boolean {
    return this.canButtonRipple();
  }

  constructor(private store$: Store<StoreModel>) {}

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

      if (!this.isSeriousMode && !this.isDangerousMode && this.hasDrivingFault()) {
        return true;
      }
      return false;
    }

    if (this.hasDangerousFault()) {
      return false;
    }

    if (this.isDangerousMode) {
      return true;
    }

    return !this.hasSeriousFault();
  };

  addOrRemoveFault = (wasPress = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.hasDangerousFault()) {
      return;
    }

    if (this.isDangerousMode) {
      this.store$.dispatch(PcvDoorExerciseAddDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.hasSeriousFault()) {
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(PcvDoorExerciseAddSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(PcvDoorExerciseAddDrivingFault());
    }
  };

  removeFault = (): void => {
    if (this.hasDangerousFault() && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(PcvDoorExerciseRemoveDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(PcvDoorExerciseRemoveSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());

      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.hasDrivingFault()) {
      this.store$.dispatch(PcvDoorExerciseRemoveDrivingFault());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  competencyHasFault = (): boolean => {
    return this.hasDangerousFault() || this.hasSeriousFault() || this.hasDrivingFault();
  };

  hasDrivingFault = (): boolean => {
    return get(this.pcvDoorExercise, 'drivingFault', false);
  };

  hasSeriousFault = (): boolean => {
    return get(this.pcvDoorExercise, 'seriousFault', false);
  };

  hasDangerousFault = (): boolean => {
    return get(this.pcvDoorExercise, 'dangerousFault', false);
  };
}
