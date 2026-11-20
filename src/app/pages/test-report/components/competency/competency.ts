import { Component, Input, computed } from '@angular/core';
import { Store } from '@ngrx/store';

import { NgClass } from '@angular/common';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { StoreModel } from '@shared/models/store.model';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getDrivingFaultCount } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  AddDangerousFault,
  RemoveDangerousFault,
} from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import {
  RemoveDrivingFault,
  ThrottleAddDrivingFault,
} from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import {
  AddSeriousFault,
  RemoveSeriousFault,
} from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { hasDangerousFault, hasSeriousFault } from '@store/tests/test-data/common/test-data.selector';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';
import { CompetencyButtonComponent } from '../competency-button/competency-button';

@Component({
  selector: 'competency',
  templateUrl: 'competency.html',
  styleUrls: ['competency.scss'],
  standalone: true,
  imports: [
    CompetencyButtonComponent,
    NgClass,
    DrivingFaultsBadgeComponent,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
  ],
})
export class CompetencyComponent {
  @Input()
  competency: Competencies;
  @Input()
  labelOverride: Competencies;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  private readonly testReportState = this.store$.selectSignal(getTestReportState);
  private readonly drivingFaultCount = computed(() => getDrivingFaultCount(this.testData(), this.competency));
  private readonly seriousFault = computed(() => hasSeriousFault(this.testData(), this.competency));
  private readonly dangerousFault = computed(() => hasDangerousFault(this.testData(), this.competency));
  private readonly delegated = computed(() => isDelegatedTest(getDelegatedTestIndicator(this.currentTest())));

  get isRemoveFaultMode(): boolean {
    return isRemoveFaultMode(this.testReportState());
  }
  get faultCount(): number {
    return this.drivingFaultCount();
  }
  get isSeriousMode(): boolean {
    return isSeriousMode(this.testReportState());
  }
  get hasSeriousFault(): boolean {
    return this.seriousFault();
  }
  get isDangerousMode(): boolean {
    return isDangerousMode(this.testReportState());
  }
  get hasDangerousFault(): boolean {
    return this.dangerousFault();
  }
  get isDelegated(): boolean {
    return this.delegated();
  }
  get allowRipple(): boolean {
    return this.canButtonRipple();
  }
  get label(): string {
    return this.getLabel();
  }

  constructor(private store$: Store<StoreModel>) {}

  onTap = () => {
    this.addOrRemoveFault(this.isDelegated);
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

      if (!this.isSeriousMode && !this.isDangerousMode && this.faultCount > 0) {
        return true;
      }

      return false;
    }

    if (this.hasDangerousFault) {
      return false;
    }

    if (this.isDangerousMode) {
      return true;
    }

    if (this.hasSeriousFault) {
      return false;
    }

    if (this.isSeriousMode) {
      return true;
    }

    return true;
  };

  getLabel = (): string => {
    if (this.labelOverride) {
      return competencyLabels[this.labelOverride];
    }
    return competencyLabels[this.competency];
  };

  addOrRemoveFault = (wasPress = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.hasDangerousFault) {
      return;
    }

    if (this.isDangerousMode) {
      this.store$.dispatch(AddDangerousFault(this.competency));
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.hasSeriousFault) {
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(AddSeriousFault(this.competency));
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      const { competency } = this;
      this.store$.dispatch(
        ThrottleAddDrivingFault({
          competency,
          newFaultCount: this.faultCount ? this.faultCount + 1 : 1,
        })
      );
      return;
    }
  };

  removeFault = (): void => {
    if (this.hasDangerousFault && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(RemoveDangerousFault(this.competency));
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(RemoveSeriousFault(this.competency));
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount > 0) {
      this.store$.dispatch(
        RemoveDrivingFault({
          competency: this.competency,
          newFaultCount: this.faultCount ? this.faultCount - 1 : 0,
        })
      );
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  competencyHasFault = (): boolean => {
    return this.hasDangerousFault || this.hasSeriousFault || this.hasDrivingFault();
  };

  hasDrivingFault = (): boolean => {
    return this.faultCount !== undefined;
  };
}
