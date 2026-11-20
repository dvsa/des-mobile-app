import { Component, computed } from '@angular/core';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getManoeuvres } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { RecordManoeuvresSelection } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { some } from 'lodash-es';
import { ManoeuvreCompetencyComponent } from '../../../components/manoeuvre-competency/manoeuvre-competency';

interface ManoeuvresFaultState {
  reverseRight: boolean;
  reverseParkRoad: boolean;
  reverseParkCarpark: boolean;
  forwardPark: boolean;
  reverseLeft?: boolean;
}

@Component({
  selector: 'manoeuvres-popover',
  templateUrl: 'manoeuvres-popover.html',
  styleUrls: ['./manoeuvres-popover.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, ManoeuvreCompetencyComponent],
})
export class ManoeuvresPopoverComponent {
  manoeuvreTypes = ManoeuvreTypes;
  competencies = ManoeuvreCompetencies;
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  manoeuvres = computed(() => getManoeuvres(this.testData()));
  manoeuvresWithFaults = computed<ManoeuvresFaultState>(() => {
    const manoeuvres = this.manoeuvres();
    return {
      reverseRight: this.manoeuvreHasFaults(manoeuvres.reverseRight),
      reverseParkRoad: this.manoeuvreHasFaults(manoeuvres.reverseParkRoad),
      reverseParkCarpark: this.manoeuvreHasFaults(manoeuvres.reverseParkCarpark),
      forwardPark: this.manoeuvreHasFaults(manoeuvres.forwardPark),
    };
  });

  constructor(private store$: Store<StoreModel>) {}

  recordManoeuvreSelection(manoeuvre: ManoeuvreTypes): void {
    this.store$.dispatch(RecordManoeuvresSelection(manoeuvre));
  }

  /**
   * @param  {string} manoeuvre
   * @returns Observable<boolean>
   * Called by the manoeuvre input elements in manoeuvres-popover.html
   * Tells the input whether it needs to be disabled based on whether
   * or not another manoeuvre has a fault recorded
   */
  shouldManoeuvreDisable(manoeuvre: Exclude<ManoeuvreTypes, ManoeuvreTypes.reverseManoeuvre>): boolean {
    const { [manoeuvre]: manoeuvreToOmit, ...otherManoeuvres } = this.manoeuvresWithFaults();
    return some(otherManoeuvres, (value: boolean) => value);
  }

  manoeuvreHasFaults = (manoeuvre): boolean =>
    manoeuvre && (manoeuvre.controlFault != null || manoeuvre.observationFault != null);

  getId = (manoeuvre: ManoeuvreTypes, competency: ManoeuvreCompetencies) => `${manoeuvre}-${competency}`;
}
