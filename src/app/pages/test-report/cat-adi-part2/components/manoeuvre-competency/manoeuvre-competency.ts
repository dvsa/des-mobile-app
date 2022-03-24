import { Observable, Subscription, merge } from 'rxjs';
import { StoreModel } from '@shared/models/store.model';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import {
  AddManoeuvreDrivingFault,
  AddManoeuvreSeriousFault,
  AddManoeuvreDangerousFault,
  RemoveManoeuvreFault,
} from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import { getTests } from '@store/tests/tests.reducer';
import {
  getManoeuvresADI2,
} from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.selector';
import { getTestReportState } from '../../../test-report.reducer';
import { isRemoveFaultMode, isSeriousMode, isDangerousMode } from '../../../test-report.selector';
import { manoeuvreCompetencyLabels } from '@shared/constants/competencies/catadi2-manoeuvres';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ManoeuvreOutcome } from '@dvsa/mes-test-schema/categories/common';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { ToggleSeriousFaultMode, ToggleDangerousFaultMode, ToggleRemoveFaultMode } from '../../../test-report.actions';

interface ManoeuvreCompetencyComponentState {
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  manoeuvreCompetencyOutcome$: Observable<ManoeuvreOutcome | null>;
}

@Component({
  selector: 'manoeuvre-competency-adi-part2',
  templateUrl: 'manoeuvre-competency.html',
  styleUrls: ['manoeuvre-competency.scss'],
})
export class ManoeuvreCompetencyComponentAdiPart2 implements OnInit, OnDestroy {
  @Input()
  index: number;

  @Input()
  competency: ManoeuvreCompetencies;

  @Input()
  manoeuvre: ManoeuvreTypes;

  touchStateDelay: number = 100;

  touchState: boolean = false;
  rippleState: boolean = false;

  rippleTimeout: any;
  touchTimeout: any;

  rippleEffectAnimationDuration: number = 300;

  componentState: ManoeuvreCompetencyComponentState;
  subscription: Subscription;

  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;
  manoeuvreCompetencyOutcome: ManoeuvreOutcome | null;
  label: string;

  constructor(
      private store$: Store<StoreModel>,
  ) { }

  ngOnInit(): void {
    this.label = manoeuvreCompetencyLabels[this.competency];

    const currentTest$ = this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
    );

    this.componentState = {
      isRemoveFaultMode$: this.store$.pipe(
          select(getTestReportState),
          select(isRemoveFaultMode),
      ),
      isSeriousMode$: this.store$.pipe(
          select(getTestReportState),
          select(isSeriousMode),
      ),
      isDangerousMode$: this.store$.pipe(
          select(getTestReportState),
          select(isDangerousMode),
      ),
      manoeuvreCompetencyOutcome$: currentTest$.pipe(
          select(getTestData),
          select(getManoeuvresADI2),
          map(manoeuvres => manoeuvres[this.index]),
          select((manoeuvres: CatADI2UniqueTypes.Manoeuvres) => {
            if (manoeuvres) {
              const manoeuvre = manoeuvres[this.manoeuvre];
              if (typeof manoeuvre !== 'undefined') {
                return manoeuvre[this.competency];
              }
            }
            return null;
          }),
      ),
    };

    const {
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      manoeuvreCompetencyOutcome$,
    } = this.componentState;

    const merged$ = merge(
        isRemoveFaultMode$.pipe(map((toggle) => this.isRemoveFaultMode = toggle)),
        isSeriousMode$.pipe(map((toggle) => this.isSeriousMode = toggle)),
        isDangerousMode$.pipe(map((toggle) => this.isDangerousMode = toggle)),
        manoeuvreCompetencyOutcome$.pipe(map((outcome) => this.manoeuvreCompetencyOutcome = outcome)),
    );

    this.subscription = merged$.subscribe();

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Not a very good practice to use a boolean variable like wasPress
  // Because at this point it takes effort to understand what does it represents
  addOrRemoveFault = (wasPress: boolean = false): void => {
    if (wasPress) {
      this.applyRippleEffect();
    }
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
      this.store$.dispatch(AddManoeuvreDangerousFault(payload, this.index));
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(AddManoeuvreSeriousFault(payload, this.index));
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(AddManoeuvreDrivingFault(payload, this.index));
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
      this.store$.dispatch(RemoveManoeuvreFault(payload, this.index));
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(RemoveManoeuvreFault(payload, this.index));
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (
        !this.isSeriousMode
        && !this.isDangerousMode
        && this.isRemoveFaultMode
        && this.manoeuvreCompetencyOutcome === CompetencyOutcome.DF
    ) {
      this.store$.dispatch(RemoveManoeuvreFault(payload, this.index));
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  hasDrivingFault = (): number => this.manoeuvreCompetencyOutcome === CompetencyOutcome.DF ? 1 : 0;

  hasSeriousFault = (): boolean => this.manoeuvreCompetencyOutcome === CompetencyOutcome.S;

  hasDangerousFault = (): boolean => this.manoeuvreCompetencyOutcome === CompetencyOutcome.D;

  /**
   * Manages the addition and removal of the ripple effect animation css class
   * @returns any
   */
  applyRippleEffect = (): any => {
    this.rippleState = true;
    this.rippleTimeout = setTimeout(() => this.removeRippleEffect(), this.rippleEffectAnimationDuration);
  };

  removeRippleEffect = (): any => {
    this.rippleState = false;
    clearTimeout(this.rippleTimeout);
  };

  onTouchStart(): void {
    clearTimeout(this.touchTimeout);
    this.touchState = true;
  }

  onTouchEnd(): void {
    // defer the removal of the touch state to allow the page to render
    this.touchTimeout = setTimeout(() => this.touchState = false, this.touchStateDelay);
  }
}
