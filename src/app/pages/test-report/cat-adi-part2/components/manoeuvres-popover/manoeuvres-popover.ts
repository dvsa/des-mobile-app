import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
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
import { Observable, Subscription, merge, of } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Manoeuvres } from '@dvsa/mes-test-schema/categories/ADI2/partial';
import { IonRadio } from '@ionic/angular';

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
  subscription: Subscription;
  merged$: Observable<ManoeuvreTypes[]>;

  constructor(private store$: Store<StoreModel>) {}

  ngOnInit(): void {
    this.manoeuvres$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getManoeuvresADI2)
    );

    this.manoeuvresWithFaults$ = this.manoeuvres$.pipe(
      map((manoeuvres: CatADI2UniqueTypes.Manoeuvres[]) => {
        return manoeuvres.map((manoeuvre) => ({
          reverseRight: this.manoeuvreHasFaults(manoeuvre.reverseRight),
          reverseParkRoad: this.manoeuvreHasFaults(manoeuvre.reverseParkRoad),
          reverseParkCarpark: this.manoeuvreHasFaults(manoeuvre.reverseParkCarpark),
          forwardPark: this.manoeuvreHasFaults(manoeuvre.forwardPark),
        }));
      })
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
  shouldManoeuvreDisable(manoeuvre: ManoeuvreTypes, index: number): Observable<boolean> {
    return this.manoeuvresWithFaults$.pipe(
      map((manoeuvresWithFaults: ManoeuvresFaultState[]) => {
        if (manoeuvre === ManoeuvreTypes.reverseLeft) {
          return true;
        }

        const otherManoeuvres = omit(manoeuvresWithFaults[index], manoeuvre);
        return some(otherManoeuvres, (value: boolean) => value);
      })
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
    if (index === 0) {
      return of(false);
    }

    let prerequisiteManoeuvreSelected: string;

    return this.manoeuvres$.pipe(
      map((manoeuvres) => {
        prerequisiteManoeuvreSelected = Object.keys(manoeuvres[0]).find(
          (manoeuvreName) => manoeuvres[0][manoeuvreName].selected
        );

        return !prerequisiteManoeuvreSelected || manoeuvre === prerequisiteManoeuvreSelected;
      })
    );
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

  /**
   * Finds the selected manoeuvre from the provided data.
   *
   * @param {Object} asyncData - The data containing manoeuvres.
   * @param {Manoeuvres} asyncData.manoeuvres - The manoeuvres object.
   * @returns {string | null} - The selected manoeuvre type if only one is selected, otherwise null.
   */
  getSelectedManoeuvre(asyncData: { manoeuvres: Manoeuvres }): ManoeuvreTypes | null {
    // Get the keys of the manoeuvres object as an array of strings.
    const manoeuvres: string[] = Object.keys(asyncData.manoeuvres);

    // Filter the manoeuvres to find the one that is selected.
    const filtered = manoeuvres.filter((manoeuvre: string) => {
      if (asyncData.manoeuvres[manoeuvre].selected) {
        return manoeuvre;
      }
    });

    // If exactly one manoeuvre is selected, return it. Otherwise, return null.
    if (filtered.length === 1) {
      return filtered[0] as ManoeuvreTypes;
    }
    return null;
  }

  /**
   * Manages the focus within a radio group.
   *
   * @param {EventTarget} radioGroup - The radio group element.
   * @param {number} radioGroupIndex - The index of the radio group.
   */
  manageGroupFocus(
    radioGroup: EventTarget,
    radioGroupIndex: number,
  ): void {
    // Get all ion-radio elements within the radio group
    const radios: HTMLIonRadioElement[] = Array.from((radioGroup as Element).querySelectorAll('ion-radio'));

    // Find the radio element that is checked
    const selectedRadio: HTMLIonRadioElement = radios.find((radio: HTMLIonRadioElement) => {
      return radio.classList.contains('radio-checked');
    });

    // If a checked radio is found, focus on it
    if (selectedRadio) {
      selectedRadio.focus();
    } else {
      // If no radio is checked, focus on the first radio in the sequence based on the group index
      switch (radioGroupIndex) {
        case 0:
          radios[0].focus();
          return;
        case 1:
          // If the first radio in the second sequence is disabled, focus on the second radio
          if (radios[0].classList.contains('radio-disabled')) {
            radios[1].focus();
            return;
          }
          radios[0].focus();
          return;
      }
    }
  }

  /**
   * Manages the focus of a radio element.
   *
   * @param {EventTarget} radio - The radio element to manage focus for.
   */
  manageRadioFocus(radio: EventTarget): void {
    if ((radio as Element).classList.contains('radio-disabled')) {
      (radio as HTMLIonRadioElement).blur();
    }
  }
}
