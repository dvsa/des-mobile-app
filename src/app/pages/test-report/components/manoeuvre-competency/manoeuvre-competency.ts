import { NgClass } from '@angular/common';
import { Component, Input, computed } from '@angular/core';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { ManoeuvreOutcome } from '@dvsa/mes-test-schema/categories/common';
import { Store } from '@ngrx/store';
import { manoeuvreCompetencyLabels } from '@shared/constants/competencies/catb-manoeuvres';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getManoeuvres } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  AddManoeuvreDangerousFault,
  AddManoeuvreDrivingFault,
  AddManoeuvreSeriousFault,
  RemoveManoeuvreFault,
} from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';
import { CompetencyButtonComponent } from '../competency-button/competency-button';

@Component({
  selector: 'manoeuvre-competency',
  templateUrl: 'manoeuvre-competency.html',
  styleUrls: ['manoeuvre-competency.scss'],
  standalone: true,
  imports: [
    CompetencyButtonComponent,
    NgClass,
    DrivingFaultsBadgeComponent,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
  ],
})
export class ManoeuvreCompetencyComponent {
  @Input()
  competency: ManoeuvreCompetencies;

  @Input()
  manoeuvre: ManoeuvreTypes;

  @Input()
  disableDrivingFaults?: boolean = false;

  touchStateDelay = 100;

  touchState = false;
  rippleState = false;

  rippleTimeout: NodeJS.Timeout;
  touchTimeout: NodeJS.Timeout;

  rippleEffectAnimationDuration = 300;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  private readonly manoeuvres = computed(() => getManoeuvres(this.testData()));
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
  get isDelegated(): boolean {
    return isDelegatedTest(getDelegatedTestIndicator(this.currentTest()));
  }
  get manoeuvreCompetencyOutcome(): ManoeuvreOutcome | null {
    return this.manoeuvres()?.[this.manoeuvre]?.[this.competency] ?? null;
  }
  get label(): string {
    return manoeuvreCompetencyLabels[this.competency];
  }

  constructor(private store$: Store<StoreModel>) {}

  // Not a very good practice to use a boolean variable like wasPress
  // Because at this point it takes effort to understand what does it represents
  addOrRemoveFault = (wasPress = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.hasDrivingFault() || this.hasSeriousFault() || this.hasDangerousFault()) {
      return;
    }

    const payload = {
      competency: this.competency,
      manoeuvre: this.manoeuvre,
    };

    if (this.isDangerousMode) {
      this.store$.dispatch(AddManoeuvreDangerousFault(payload));
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(AddManoeuvreSeriousFault(payload));
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress && !this.disableDrivingFaults) {
      this.store$.dispatch(AddManoeuvreDrivingFault(payload));
    }
  };

  removeFault = (): void => {
    // Toggle modes off appropriately if competency outcome doesn't exist, then exit
    if (this.manoeuvreCompetencyOutcome == null) {
      this.store$.dispatch(ToggleRemoveFaultMode());
      if (this.isSeriousMode) this.store$.dispatch(ToggleSeriousFaultMode());
      if (this.isDangerousMode) this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    const payload = {
      competency: this.competency,
      manoeuvre: this.manoeuvre,
    };

    if (this.hasDangerousFault() && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(RemoveManoeuvreFault(payload, CompetencyOutcome.D));
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(RemoveManoeuvreFault(payload, CompetencyOutcome.S));
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (
      !this.isSeriousMode &&
      !this.isDangerousMode &&
      this.isRemoveFaultMode &&
      this.manoeuvreCompetencyOutcome === CompetencyOutcome.DF
    ) {
      this.store$.dispatch(RemoveManoeuvreFault(payload, CompetencyOutcome.DF));
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  hasDrivingFault = (): number => (this.manoeuvreCompetencyOutcome === CompetencyOutcome.DF ? 1 : 0);

  hasSeriousFault = (): boolean => this.manoeuvreCompetencyOutcome === CompetencyOutcome.S;

  hasDangerousFault = (): boolean => this.manoeuvreCompetencyOutcome === CompetencyOutcome.D;
}
