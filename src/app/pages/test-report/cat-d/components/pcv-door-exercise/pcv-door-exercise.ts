import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, merge } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { get } from 'lodash';

import { StoreModel } from '@shared/models/store.model';
import {
  PcvDoorExerciseAddDangerousFault,
  PcvDoorExerciseAddDrivingFault,
  PcvDoorExerciseAddSeriousFault,
  PcvDoorExerciseRemoveSeriousFault,
  PcvDoorExerciseRemoveDangerousFault,
  PcvDoorExerciseRemoveDrivingFault,
} from '@store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.actions';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-d/test-data.cat-d.reducer';
import { getPcvDoorExercise } from '@store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { PcvDoorExerciseTypes } from '@providers/fault-summary/cat-d/fault-summary.cat-d';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { getTestReportState } from '../../../test-report.reducer';
import { isRemoveFaultMode, isSeriousMode, isDangerousMode } from '../../../test-report.selector';
import { ToggleRemoveFaultMode, ToggleSeriousFaultMode, ToggleDangerousFaultMode } from '../../../test-report.actions';

interface CompetencyState {
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  pcvDoorExercise$: Observable<PcvDoorExerciseTypes>;
}

@Component({
  selector: 'pcv-door-exercise',
  templateUrl: 'pcv-door-exercise.html',
  styleUrls: ['pcv-door-exercise.scss'],
})
export class PcvDoorExerciseComponent {

  @Input()
  oneFaultLimit: boolean = false;

  competencyState: CompetencyState;
  subscription: Subscription;
  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;
  pcvDoorExercise: PcvDoorExerciseTypes;
  allowRipple: boolean = true;

  constructor(
    private store$: Store<StoreModel>,
  ) { }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.competencyState = {
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
      pcvDoorExercise$: currentTest$.pipe(
        select(getTestData),
        select(getPcvDoorExercise),
      ),
    };

    const {
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      pcvDoorExercise$,
    } = this.competencyState;

    const merged$ = merge(
      isRemoveFaultMode$.pipe(map((toggle) => this.isRemoveFaultMode = toggle)),
      isSeriousMode$.pipe(map((toggle) => this.isSeriousMode = toggle)),
      isDangerousMode$.pipe(map((toggle) => this.isDangerousMode = toggle)),
      pcvDoorExercise$.pipe(map((toggle) => this.pcvDoorExercise = toggle)),
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
      if (this.hasDangerousFault() && this.isDangerousMode) {
        this.allowRipple = true;
        return;
      }

      if (this.hasSeriousFault() && this.isSeriousMode) {
        this.allowRipple = true;
        return;
      }

      if (!this.isSeriousMode && !this.isDangerousMode && this.hasDrivingFault()) {
        this.allowRipple = true;
        return;
      }
      this.allowRipple = false;
    } else {

      if (this.hasDangerousFault()) {
        this.allowRipple = false;
        return;
      }

      if (this.isDangerousMode) {
        this.allowRipple = true;
        return;
      }

      if (this.hasSeriousFault()) {
        this.allowRipple = false;
        return;
      }

      if (this.isSeriousMode) {
        this.allowRipple = true;
        return;
      }
      this.allowRipple = true;
    }
  };

  addOrRemoveFault = (wasPress: boolean = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  addFault = (wasPress: boolean): void => {

    if (this.hasDangerousFault()) {
      return;
    }

    if (this.isDangerousMode) {
      this.store$.dispatch(PcvDoorExerciseAddDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.hasSeriousFault()) {
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(PcvDoorExerciseAddSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(PcvDoorExerciseAddDrivingFault());
    }
  };

  removeFault = (): void => {
    if (this.hasDangerousFault() && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(PcvDoorExerciseRemoveDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(PcvDoorExerciseRemoveSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());

      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.hasDrivingFault()) {
      this.store$.dispatch(PcvDoorExerciseRemoveDrivingFault());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  competencyHasFault = (): boolean => {
    return this.hasDangerousFault() || this.hasSeriousFault() || this.hasDrivingFault();
  };

  hasDrivingFault = (): boolean => {
    return get(this.pcvDoorExercise, 'drivingFault', false);
  };

  hasSeriousFault = (): boolean => {
    return get(this.pcvDoorExercise, 'seriousFault', false);
  };

  hasDangerousFault = (): boolean => {
    return get(this.pcvDoorExercise, 'dangerousFault', false);
  };
}
