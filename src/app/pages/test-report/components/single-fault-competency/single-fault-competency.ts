import { Component, Input, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { SingleFaultCompetencyNames } from '@store/tests/test-data/test-data.constants';

import { NgClass } from '@angular/common';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getTestData } from '@store/tests/test-data/cat-a-mod1/test-data.cat-a-mod1.reducer';
import {
  RemoveSingleDangerousFaultCompetencyOutcome,
  RemoveSingleFaultCompetencyOutcome,
  RemoveSingleSeriousFaultCompetencyOutcome,
  SetSingleFaultCompetencyOutcome,
} from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import {
  getSingleFaultCompetencies,
  hasCompetencyDangerousFault,
  hasCompetencyDrivingFault,
  hasCompetencySeriousFault,
} from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';
import { CompetencyButtonComponent } from '../competency-button/competency-button';

@Component({
  selector: 'single-fault-competency',
  templateUrl: 'single-fault-competency.html',
  styleUrls: ['single-fault-competency.scss'],
  imports: [
    CompetencyButtonComponent,
    NgClass,
    DrivingFaultsBadgeComponent,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
  ],
})
export class SingleFaultCompetencyComponent {
  @Input()
  competency: SingleFaultCompetencyNames;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  private readonly singleFaultCompetencies = computed(() => getSingleFaultCompetencies(this.testData()));
  private readonly testReportState = this.store$.selectSignal(getTestReportState);

  get isRemoveFaultMode(): boolean {
    return isRemoveFaultMode(this.testReportState());
  }
  get hasDrivingFault(): boolean {
    return hasCompetencyDrivingFault(this.singleFaultCompetencies(), this.competency);
  }
  get isSeriousMode(): boolean {
    return isSeriousMode(this.testReportState());
  }
  get hasSeriousFault(): boolean {
    return hasCompetencySeriousFault(this.singleFaultCompetencies(), this.competency);
  }
  get isDangerousMode(): boolean {
    return isDangerousMode(this.testReportState());
  }
  get hasDangerousFault(): boolean {
    return hasCompetencyDangerousFault(this.singleFaultCompetencies(), this.competency);
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
      if (this.hasDangerousFault && this.isDangerousMode) {
        return true;
      }

      if (this.hasSeriousFault && this.isSeriousMode) {
        return true;
      }

      if (!this.isSeriousMode && !this.isDangerousMode && this.hasDrivingFault) {
        return true;
      }

      return false;
    }

    if (this.competencyHasFault()) {
      return false;
    }

    return true;
  };

  getLabel = (): string => competencyLabels[this.competency];

  addOrRemoveFault = (wasPress = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  removeFault = (): void => {
    if (this.hasDangerousFault && this.isDangerousMode) {
      this.store$.dispatch(RemoveSingleDangerousFaultCompetencyOutcome(this.competency));
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault && this.isSeriousMode) {
      this.store$.dispatch(RemoveSingleSeriousFaultCompetencyOutcome(this.competency));
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (!this.isSeriousMode && !this.isDangerousMode && this.hasDrivingFault) {
      this.store$.dispatch(RemoveSingleFaultCompetencyOutcome(this.competency));
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.competencyHasFault()) {
      return;
    }

    if (this.isDangerousMode) {
      this.store$.dispatch(SetSingleFaultCompetencyOutcome(this.competency, CompetencyOutcome.D));
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(SetSingleFaultCompetencyOutcome(this.competency, CompetencyOutcome.S));
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(SetSingleFaultCompetencyOutcome(this.competency, CompetencyOutcome.DF));
    }
  };

  competencyHasFault = (): boolean => {
    return this.hasDangerousFault || this.hasSeriousFault || this.hasDrivingFault;
  };

  getFaultCount = (): number => {
    return this.hasDrivingFault ? 1 : 0;
  };
}
