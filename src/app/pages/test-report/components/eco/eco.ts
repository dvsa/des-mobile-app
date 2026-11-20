import { NgClass } from '@angular/common';
import { Component, computed } from '@angular/core';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { IonCol, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { ToggleControlEco, ToggleEco, TogglePlanningEco } from '@store/tests/test-data/common/eco/eco.actions';
import { getEco } from '@store/tests/test-data/common/test-data.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { CompetencyButtonComponent } from '../competency-button/competency-button';

@Component({
  selector: 'eco',
  templateUrl: 'eco.html',
  styleUrls: ['eco.scss'],
  imports: [IonRow, IonCol, CompetencyButtonComponent, NgClass, TickIndicatorComponent],
})
export class EcoComponent {
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  private readonly eco = computed(() => getEco(this.testData()));
  completed = computed(() => this.eco().completed);
  adviceGivenPlanning = computed(() => this.eco().adviceGivenPlanning);
  adviceGivenControl = computed(() => this.eco().adviceGivenControl);

  constructor(private store$: Store<StoreModel>) {}

  toggleEco = (): void => {
    if (this.adviceGivenPlanning() || this.adviceGivenControl()) {
      return;
    }
    this.store$.dispatch(ToggleEco());
  };

  toggleEcoPlanning = (): void => {
    this.store$.dispatch(TogglePlanningEco());
  };

  toggleEcoControl = (): void => {
    this.store$.dispatch(ToggleControlEco());
  };
}
