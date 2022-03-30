import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { Store, select } from '@ngrx/store';
import {
  Observable, of, Subscription, merge,
} from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import {
  getManoeuvresADI2,
} from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.selector';
import { getTests } from '@store/tests/tests.reducer';
import { StoreModel } from '@shared/models/store.model';
import {
  RecordManoeuvresSelection, RecordManoeuvresDeselection,
} from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { map, tap } from 'rxjs/operators';
import { omit, some } from 'lodash';

interface ManoeuvresFaultState {
  reverseRight: boolean;
  reverseParkRoad: boolean;
  reverseParkCarpark: boolean;
  forwardPark: boolean;
}

@Component({
  selector: 'manoeuvres-popover-adi-part2',
  templateUrl: 'manoeuvres-popover.html',
  styleUrls: ['manoeuvres-popover.scss'],
})
export class ManoeuvresPopoverComponentAdiPart2 implements OnInit, OnDestroy {

  manoeuvreTypes = ManoeuvreTypes;
  manoeuvres$: Observable<CatADI2UniqueTypes.Manoeuvres[]>;
  competencies = ManoeuvreCompetencies;
  manoeuvresWithFaults$: Observable<ManoeuvresFaultState[]>;
  selectedManoeuvreTypes$: Observable<ManoeuvreTypes[]>;
  subscription: Subscription;
  merged$: Observable<ManoeuvreTypes[]>;

  constructor(private store$: Store<StoreModel>) { }

  ngOnInit(): void {
    this.manoeuvres$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getManoeuvresADI2),
    );

    this.manoeuvresWithFaults$ = this.manoeuvres$.pipe(
      map((manoeuvres: CatADI2UniqueTypes.Manoeuvres[]) => {
        return manoeuvres.map((manoeuvre) => ({
          reverseRight: this.manoeuvreHasFaults(manoeuvre.reverseRight),
          reverseParkRoad: this.manoeuvreHasFaults(manoeuvre.reverseParkRoad),
          reverseParkCarpark: this.manoeuvreHasFaults(manoeuvre.reverseParkCarpark),
          forwardPark: this.manoeuvreHasFaults(manoeuvre.forwardPark),
        }));
      }),
    );

    this.merged$ = merge(
      this.manoeuvres$.pipe(
        map((manoeuvres: CatADI2UniqueTypes.Manoeuvres[]) => {
          return [
            ...manoeuvres.map((manoeuvre) => {
              return Object.keys(manoeuvre).find((manoeuvreType: ManoeuvreTypes) => {
                return manoeuvre[manoeuvreType].selected === true;
              });
            }),
          ];
        }),
        tap((selectedManouevreTypes: ManoeuvreTypes[]) => {
          if (
            selectedManouevreTypes[0]
            && selectedManouevreTypes[1]
            && selectedManouevreTypes[0] === selectedManouevreTypes[1]
          ) {
            this.store$.dispatch(RecordManoeuvresDeselection(selectedManouevreTypes[0], 1));
          }
        }),
      ),
    );

    this.subscription = this.merged$.subscribe();
  }

  recordManoeuvreSelection(manoeuvreType: ManoeuvreTypes, index: number): void {
    this.store$.dispatch(RecordManoeuvresSelection(manoeuvreType, index));
  }

  /**
   * @param  {string} manoeuvre
   * @param index
   * @returns Observable<boolean>
   * Called by the manoeuvre input elements in manoeuvres-popover.html
   * Tells the input whether it needs to be disabled based on whether
   * or not another manoeuvre has a fault recorded
   */
  shouldManoeuvreDisable(manoeuvre: ManoeuvreTypes, index: number): Observable<boolean> {
    return this.manoeuvresWithFaults$.pipe(
      map((manoeuvresWithFaults: ManoeuvresFaultState[]) => {
        if (manoeuvre === ManoeuvreTypes.reverseLeft) { return true; }

        const otherManoeuvres = omit(manoeuvresWithFaults[index], manoeuvre);
        return some(otherManoeuvres, (value: boolean) => value);
      }),
    );
  }

  /**
   * @param  {string} manoeuvre
   * @param index
   * @returns Observable<boolean>
   * Called by the manoeuvre input elements in manoeuvres-popover.html
   * Tells the input whether the same ManoeuvreType has selected in the preceeding Manoeuvre
   */
  shouldHideManoeuvre(manoeuvre: ManoeuvreTypes, index: number): Observable<boolean> {
    if (index === 0) { return of(false); }

    let prerequisiteManoeuvreSelected: string;

    return this.manoeuvres$.pipe(
      map((manoeuvres) => {
        prerequisiteManoeuvreSelected = Object.keys(manoeuvres[0]).find(
          (manoeuvreName) => manoeuvres[0][manoeuvreName].selected,
        );

        return !prerequisiteManoeuvreSelected || manoeuvre === prerequisiteManoeuvreSelected;
      }),
    );
  }

  manoeuvreHasFaults = (manoeuvre): boolean => (
    manoeuvre
    && (manoeuvre.controlFault != null
    || manoeuvre.observationFault != null)
  );

  getId = (manoeuvre: ManoeuvreTypes, competency: ManoeuvreCompetencies, index: number) => {
    return `${manoeuvre}-${competency}${index}`;
  };

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
