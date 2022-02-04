import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { StoreModel } from '@shared/models/store.model';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getManoeuvres } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { map } from 'rxjs/operators';
import { RecordManoeuvresSelection } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { some } from 'lodash';

interface ManoeuvresFaultState {
  reverseRight: boolean;
  reverseParkRoad: boolean;
  reverseParkCarpark: boolean;
  forwardPark: boolean;
  reverseLeft?: boolean;
  reverseManoeuvre?: boolean;
}

@Component({
  selector: 'manoeuvres-popover',
  templateUrl: 'manoeuvres-popover.html',
  styleUrls: ['./manoeuvres-popover.scss'],
})
export class ManoeuvresPopoverComponent {

  manoeuvreTypes = ManoeuvreTypes;
  manoeuvres$: Observable<CatBUniqueTypes.Manoeuvres>;
  competencies = ManoeuvreCompetencies;
  manoeuvresWithFaults$: Observable<ManoeuvresFaultState>;

  constructor(private store$: Store<StoreModel>) { }

  ngOnInit(): void {
    this.manoeuvres$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getManoeuvres),
    );
    this.manoeuvresWithFaults$ = this.manoeuvres$.pipe(
      map((manoeuvres: CatBUniqueTypes.Manoeuvres) => ({
        reverseRight: this.manoeuvreHasFaults(manoeuvres.reverseRight),
        reverseParkRoad: this.manoeuvreHasFaults(manoeuvres.reverseParkRoad),
        reverseParkCarpark: this.manoeuvreHasFaults(manoeuvres.reverseParkCarpark),
        forwardPark: this.manoeuvreHasFaults(manoeuvres.forwardPark),
      })),
    );
  }

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
  shouldManoeuvreDisable(manoeuvre: ManoeuvreTypes): Observable<boolean> {
    return this.manoeuvresWithFaults$.pipe(
      map((manoeuvresWithFaults: ManoeuvresFaultState) => {
        const { [manoeuvre]: manoeuvreToOmit, ...otherManoeuvres } = manoeuvresWithFaults;
        return some(otherManoeuvres, (value: boolean) => value);
      }),
    );
  }

  manoeuvreHasFaults = (manoeuvre): boolean => (
    manoeuvre && (manoeuvre.controlFault != null
    || manoeuvre.observationFault != null));

  getId = (manoeuvre: ManoeuvreTypes, competency: ManoeuvreCompetencies) => `${manoeuvre}-${competency}`;
}
