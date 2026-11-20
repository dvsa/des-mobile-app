import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { ManoeuvreOutcome } from '@dvsa/mes-test-schema/categories/common';
import { IonCol } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  ToggleDangerousFaultMode,
  ToggleRemoveFaultMode,
  ToggleSeriousFaultMode,
} from '@pages/test-report/test-report.actions';
import { getTestReportState } from '@pages/test-report/test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '@pages/test-report/test-report.selector';
import { manoeuvreCompetencyLabels } from '@shared/constants/competencies/catb-manoeuvres';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getTestData } from '@store/tests/test-data/cat-manoeuvres/test-data.cat-manoeuvres.reducer';
import { getManoeuvres } from '@store/tests/test-data/cat-manoeuvres/test-data.cat-manoeuvres.selector';
import {
  AddManoeuvreDangerousFault,
  AddManoeuvreSeriousFault,
  RemoveManoeuvreFault,
} from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { CompetencyButtonComponent } from '../../../components/competency-button/competency-button';

@Component({
  selector: 'reverse-manoeuvres',
  templateUrl: 'reverse-manoeuvre.html',
  styleUrls: ['./reverse-manoeuvre.scss'],
  imports: [CompetencyButtonComponent, NgClass, IonCol, SeriousFaultBadgeComponent, DangerousFaultBadgeComponent],
})
export class ReverseManoeuvreComponent {
  @Input()
  competency: ManoeuvreCompetencies;

  @Input()
  manoeuvre: ManoeuvreTypes;

  @Output()
  competencyClicked = new EventEmitter<void>();

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

  addOrRemoveFault = (wasPress = false): void => {
    if (!this.isDangerousMode && !this.isSeriousMode) {
      this.competencyClicked.emit();
      return;
    }

    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault();
    }
  };

  addFault = (): void => {
    if (this.hasSeriousFault() || this.hasDangerousFault()) {
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
    }
  };

  removeFault = (): void => {
    // Toggle modes off appropriately if competency outcome doesn't exist, then exit
    if (this.manoeuvreCompetencyOutcome == null) {
      this.store$.dispatch(ToggleRemoveFaultMode());

      if (this.isSeriousMode) {
        this.store$.dispatch(ToggleSeriousFaultMode());
      }
      if (this.isDangerousMode) {
        this.store$.dispatch(ToggleDangerousFaultMode());
      }
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
    }
  };

  hasSeriousFault = (): boolean => this.manoeuvreCompetencyOutcome === CompetencyOutcome.S;

  hasDangerousFault = (): boolean => this.manoeuvreCompetencyOutcome === CompetencyOutcome.D;
}
