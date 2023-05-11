import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { select, Store } from '@ngrx/store';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-manoeuvres/test-data.cat-manoeuvres.reducer';
import { getManoeuvres } from '@store/tests/test-data/cat-manoeuvres/test-data.cat-manoeuvres.selector';
import { merge, Observable, Subscription } from 'rxjs';
import { ManoeuvreOutcome } from '@dvsa/mes-test-schema/categories/common';
import { manoeuvreCompetencyLabels } from '@shared/constants/competencies/catb-manoeuvres';
import { getTestReportState } from '@pages/test-report/test-report.reducer';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { map, takeUntil } from 'rxjs/operators';
import {
  AddManoeuvreDangerousFault,
  AddManoeuvreSeriousFault,
  RemoveManoeuvreFault,
} from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import {
  ToggleDangerousFaultMode,
  ToggleRemoveFaultMode,
  ToggleSeriousFaultMode,
} from '@pages/test-report/test-report.actions';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '@pages/test-report/test-report.selector';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';

interface ReverseManoeuvreCompetencyComponentState {
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  manoeuvreCompetencyOutcome$: Observable<ManoeuvreOutcome | null>;
  delegatedTest$: Observable<boolean>;
}

@Component({
  selector: 'reverse-manoeuvres',
  templateUrl: 'reverse-manoeuvre.html',
  styleUrls: ['./reverse-manoeuvre.scss'],
})
export class ReverseManoeuvreComponent {
  @Input()
  competency: ManoeuvreCompetencies;

  @Input()
  manoeuvre: ManoeuvreTypes;

  @Output()
  competencyClicked = new EventEmitter<void>();

  touchStateDelay: number = 100;
  touchState: boolean = false;
  rippleState: boolean = false;
  rippleTimeout: any;
  touchTimeout: any;
  rippleEffectAnimationDuration: number = 300;
  componentState: ReverseManoeuvreCompetencyComponentState;
  subscription: Subscription;
  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;
  isDelegated: boolean = false;
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
        select(getManoeuvres),
        select((manoeuvres: CatCMUniqueTypes.Manoeuvres) => {
          if (manoeuvres) {
            const manoeuvre = manoeuvres[this.manoeuvre];
            if (typeof manoeuvre !== 'undefined') {
              return manoeuvre[this.competency];
            }
          }
          return null;
        }),
      ),
      delegatedTest$: currentTest$.pipe(
        select(getDelegatedTestIndicator),
        select(isDelegatedTest),
      ),
    };

    const {
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      manoeuvreCompetencyOutcome$,
      delegatedTest$,
    } = this.componentState;

    const merged$ = merge(
      isRemoveFaultMode$.pipe(map((toggle) => this.isRemoveFaultMode = toggle)),
      isSeriousMode$.pipe(map((toggle) => this.isSeriousMode = toggle)),
      isDangerousMode$.pipe(map((toggle) => this.isDangerousMode = toggle)),
      delegatedTest$.pipe(map((toggle) => this.isDelegated = toggle)),
      manoeuvreCompetencyOutcome$.pipe(map((outcome) => this.manoeuvreCompetencyOutcome = outcome)),
    );

    this.subscription = merged$.pipe(takeUntil(trDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addOrRemoveFault = (wasPress: boolean = false): void => {
    if (!this.isDangerousMode && !this.isSeriousMode) {
      this.competencyClicked.emit();
      return;
    }

    if (wasPress) {
      this.applyRippleEffect();
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
