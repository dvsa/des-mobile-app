import { Component, OnDestroy, OnInit, computed } from '@angular/core';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { StoreModel } from '@shared/models/store.model';
import {
  RecordManoeuvresDeselection,
  RecordManoeuvresSelection,
} from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import { getManoeuvresADI2 } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.selector';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { omit, some } from 'lodash-es';
import { Observable, Subscription, merge } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ManoeuvreCompetencyComponentAdiPart2 } from '../manoeuvre-competency/manoeuvre-competency';

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
  imports: [IonGrid, IonRow, IonCol, ManoeuvreCompetencyComponentAdiPart2],
})
export class ManoeuvresPopoverComponentAdiPart2 implements OnInit, OnDestroy {
  manoeuvreTypes = ManoeuvreTypes;
  manoeuvres = computed(() => getManoeuvresADI2(this.testData()));
  competencies = ManoeuvreCompetencies;
  manoeuvresWithFaults = computed<ManoeuvresFaultState[]>(() =>
    this.manoeuvres().map((manoeuvre) => ({
      reverseRight: this.manoeuvreHasFaults(manoeuvre.reverseRight),
      reverseParkRoad: this.manoeuvreHasFaults(manoeuvre.reverseParkRoad),
      reverseParkCarpark: this.manoeuvreHasFaults(manoeuvre.reverseParkCarpark),
      forwardPark: this.manoeuvreHasFaults(manoeuvre.forwardPark),
    }))
  );
  subscription: Subscription;
  merged$: Observable<ManoeuvreTypes[]>;
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));

  constructor(private store$: Store<StoreModel>) {}

  ngOnInit(): void {
    const manoeuvres$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getManoeuvresADI2)
    );

    this.merged$ = merge(
      manoeuvres$.pipe(
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
            selectedManouevreTypes[0] &&
            selectedManouevreTypes[1] &&
            selectedManouevreTypes[0] === selectedManouevreTypes[1]
          ) {
            this.store$.dispatch(RecordManoeuvresDeselection(selectedManouevreTypes[0], 1));
          }
        })
      )
    );

    this.subscription = this.merged$.pipe(takeUntil(trDestroy$)).subscribe();
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
  shouldManoeuvreDisable(manoeuvre: ManoeuvreTypes, index: number): boolean {
    if (manoeuvre === ManoeuvreTypes.reverseLeft) {
      return true;
    }

    const otherManoeuvres = omit(this.manoeuvresWithFaults()[index], manoeuvre);
    return some(otherManoeuvres, (value: boolean) => value);
  }

  /**
   * @param  {string} manoeuvre
   * @param index
   * @returns Observable<boolean>
   * Called by the manoeuvre input elements in manoeuvres-popover.html
   * Tells the input whether the same ManoeuvreType has selected in the preceeding Manoeuvre
   */
  shouldHideManoeuvre(manoeuvre: ManoeuvreTypes, index: number): boolean {
    if (index === 0) {
      return false;
    }

    const prerequisiteManoeuvreSelected = Object.keys(this.manoeuvres()[0]).find(
      (manoeuvreName) => this.manoeuvres()[0][manoeuvreName].selected
    );
    return !prerequisiteManoeuvreSelected || manoeuvre === prerequisiteManoeuvreSelected;
  }

  manoeuvreHasFaults = (manoeuvre): boolean =>
    manoeuvre && (manoeuvre.controlFault != null || manoeuvre.observationFault != null);

  getId = (manoeuvre: ManoeuvreTypes, competency: ManoeuvreCompetencies, index: number) => {
    return `${manoeuvre}-${competency}${index}`;
  };

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
