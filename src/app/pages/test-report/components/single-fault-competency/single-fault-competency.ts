import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { SingleFaultCompetencyNames } from '@store/tests/test-data/test-data.constants';
import { Observable, Subscription, merge } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getTestData } from '@store/tests/test-data/cat-a-mod1/test-data.cat-a-mod1.reducer';
import {
  RemoveSingleDangerousFaultCompetencyOutcome,
  RemoveSingleFaultCompetencyOutcome,
  RemoveSingleSeriousFaultCompetencyOutcome,
  SetSingleFaultCompetencyOutcome,
} from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import {
  getSingleFaultCompetencies,
  hasCompetencyDangerousFault,
  hasCompetencyDrivingFault,
  hasCompetencySeriousFault,
} from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';

interface SingleFaultCompetencyState {
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;

  hasDrivingFault$: Observable<boolean>;
  hasSeriousFault$: Observable<boolean>;
  hasDangerousFault$: Observable<boolean>;
}

@Component({
  selector: 'single-fault-competency',
  templateUrl: 'single-fault-competency.html',
  styleUrls: ['single-fault-competency.scss'],
})
export class SingleFaultCompetencyComponent implements OnInit, OnDestroy {
  @Input()
  competency: SingleFaultCompetencyNames;

  singleFaultCompetencyState: SingleFaultCompetencyState;
  subscription: Subscription;

  isRemoveFaultMode = false;
  hasDrivingFault = false;

  isSeriousMode = false;
  hasSeriousFault = false;

  isDangerousMode = false;
  hasDangerousFault = false;

  allowRipple = true;

  constructor(private store$: Store<StoreModel>) {}

  ngOnInit(): void {
    const singleFaultCompetencies$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getSingleFaultCompetencies)
    );

    this.singleFaultCompetencyState = {
      isRemoveFaultMode$: this.store$.pipe(select(getTestReportState), select(isRemoveFaultMode)),
      isSeriousMode$: this.store$.pipe(select(getTestReportState), select(isSeriousMode)),
      isDangerousMode$: this.store$.pipe(select(getTestReportState), select(isDangerousMode)),
      hasDrivingFault$: singleFaultCompetencies$.pipe(
        select((singleFaultCompetencies) => hasCompetencyDrivingFault(singleFaultCompetencies, this.competency))
      ),
      hasSeriousFault$: singleFaultCompetencies$.pipe(
        select((singleFaultCompetencies) => hasCompetencySeriousFault(singleFaultCompetencies, this.competency))
      ),
      hasDangerousFault$: singleFaultCompetencies$.pipe(
        select((singleFaultCompetencies) => hasCompetencyDangerousFault(singleFaultCompetencies, this.competency))
      ),
    };

    const {
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      hasDrivingFault$,
      hasSeriousFault$,
      hasDangerousFault$,
    } = this.singleFaultCompetencyState;

    const merged$ = merge(
      isRemoveFaultMode$.pipe(map((toggle) => (this.isRemoveFaultMode = toggle))),
      isSeriousMode$.pipe(map((toggle) => (this.isSeriousMode = toggle))),
      isDangerousMode$.pipe(map((toggle) => (this.isDangerousMode = toggle))),
      hasDrivingFault$.pipe(map((hasfault) => (this.hasDrivingFault = hasfault))),
      hasSeriousFault$.pipe(map((hasfault) => (this.hasSeriousFault = hasfault))),
      hasDangerousFault$.pipe(map((hasfault) => (this.hasDangerousFault = hasfault)))
    ).pipe(tap(this.canButtonRipple));

    this.subscription = merged$.pipe(takeUntil(trDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onTap = () => {
    this.addOrRemoveFault();
  };

  onPress = () => {
    this.addOrRemoveFault(true);
  };

  canButtonRipple = (): void => {
    if (this.isRemoveFaultMode) {
      if (this.hasDangerousFault && this.isDangerousMode) {
        this.allowRipple = true;
        return;
      }

      if (this.hasSeriousFault && this.isSeriousMode) {
        this.allowRipple = true;
        return;
      }

      if (!this.isSeriousMode && !this.isDangerousMode && this.hasDrivingFault) {
        this.allowRipple = true;
        return;
      }

      this.allowRipple = false;
      return;
    }

    if (this.competencyHasFault()) {
      this.allowRipple = false;
      return;
    }

    this.allowRipple = true;
  };

  getLabel = (): string => competencyLabels[this.competency];

  addOrRemoveFault = (wasPress = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  removeFault = (): void => {
    if (this.hasDangerousFault && this.isDangerousMode) {
      this.store$.dispatch(RemoveSingleDangerousFaultCompetencyOutcome(this.competency));
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault && this.isSeriousMode) {
      this.store$.dispatch(RemoveSingleSeriousFaultCompetencyOutcome(this.competency));
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (!this.isSeriousMode && !this.isDangerousMode && this.hasDrivingFault) {
      this.store$.dispatch(RemoveSingleFaultCompetencyOutcome(this.competency));
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.competencyHasFault()) {
      return;
    }

    if (this.isDangerousMode) {
      this.store$.dispatch(SetSingleFaultCompetencyOutcome(this.competency, CompetencyOutcome.D));
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(SetSingleFaultCompetencyOutcome(this.competency, CompetencyOutcome.S));
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(SetSingleFaultCompetencyOutcome(this.competency, CompetencyOutcome.DF));
    }
  };

  competencyHasFault = (): boolean => {
    return this.hasDangerousFault || this.hasSeriousFault || this.hasDrivingFault;
  };

  getFaultCount = (): number => {
    return this.hasDrivingFault ? 1 : 0;
  };
}
