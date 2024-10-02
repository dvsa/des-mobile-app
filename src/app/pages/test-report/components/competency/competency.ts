import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, merge } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { StoreModel } from '@shared/models/store.model';
import { getDelegatedTestIndicator } from '@store/tests/delegated-test/delegated-test.reducer';
import { isDelegatedTest } from '@store/tests/delegated-test/delegated-test.selector';
import { getDrivingFaultCount } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  AddDangerousFault,
  RemoveDangerousFault,
} from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import {
  RemoveDrivingFault,
  ThrottleAddDrivingFault,
} from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import {
  AddSeriousFault,
  RemoveSeriousFault,
} from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import { hasDangerousFault, hasSeriousFault } from '@store/tests/test-data/common/test-data.selector';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';

interface CompetencyState {
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  drivingFaultCount$: Observable<number>;
  hasSeriousFault$: Observable<boolean>;
  hasDangerousFault$: Observable<boolean>;
  isDelegated$: Observable<boolean>;
}

@Component({
  selector: 'competency',
  templateUrl: 'competency.html',
  styleUrls: ['competency.scss'],
})
export class CompetencyComponent {
  @Input()
  competency: Competencies;
  @Input()
  labelOverride: Competencies;

  competencyState: CompetencyState;
  subscription: Subscription;

  isRemoveFaultMode = false;
  faultCount: number;
  isSeriousMode = false;
  hasSeriousFault = false;
  isDangerousMode = false;
  hasDangerousFault = false;
  isDelegated = false;

  allowRipple = true;
  label: string;

  constructor(private store$: Store<StoreModel>) {}

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.competencyState = {
      isRemoveFaultMode$: this.store$.pipe(select(getTestReportState), select(isRemoveFaultMode)),
      isSeriousMode$: this.store$.pipe(select(getTestReportState), select(isSeriousMode)),
      isDangerousMode$: this.store$.pipe(select(getTestReportState), select(isDangerousMode)),
      drivingFaultCount$: currentTest$.pipe(
        select(getTestData),
        select((testData) => getDrivingFaultCount(testData, this.competency))
      ),
      hasSeriousFault$: currentTest$.pipe(
        select(getTestData),
        select((testData) => hasSeriousFault(testData, this.competency))
      ),
      hasDangerousFault$: currentTest$.pipe(
        select(getTestData),
        select((testData) => hasDangerousFault(testData, this.competency))
      ),
      isDelegated$: currentTest$.pipe(select(getDelegatedTestIndicator), select(isDelegatedTest)),
    };

    const {
      drivingFaultCount$,
      isRemoveFaultMode$,
      isSeriousMode$,
      hasSeriousFault$,
      isDangerousMode$,
      hasDangerousFault$,
      isDelegated$,
    } = this.competencyState;

    const merged$ = merge(
      drivingFaultCount$.pipe(map((count) => (this.faultCount = count))),
      isRemoveFaultMode$.pipe(map((toggle) => (this.isRemoveFaultMode = toggle))),
      isSeriousMode$.pipe(map((toggle) => (this.isSeriousMode = toggle))),
      hasSeriousFault$.pipe(map((toggle) => (this.hasSeriousFault = toggle))),
      isDangerousMode$.pipe(map((toggle) => (this.isDangerousMode = toggle))),
      hasDangerousFault$.pipe(map((toggle) => (this.hasDangerousFault = toggle))),
      isDelegated$.pipe(map((toggle) => (this.isDelegated = toggle)))
    ).pipe(tap(this.canButtonRipple));

    this.subscription = merged$.pipe(takeUntil(trDestroy$)).subscribe();
    this.label = this.getLabel();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onTap = () => {
    this.addOrRemoveFault(this.isDelegated);
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

      if (!this.isSeriousMode && !this.isDangerousMode && this.faultCount > 0) {
        this.allowRipple = true;
        return;
      }

      this.allowRipple = false;
      return;
    }

    if (this.hasDangerousFault) {
      this.allowRipple = false;
      return;
    }

    if (this.isDangerousMode) {
      this.allowRipple = true;
      return;
    }

    if (this.hasSeriousFault) {
      this.allowRipple = false;
      return;
    }

    if (this.isSeriousMode) {
      this.allowRipple = true;
      return;
    }

    this.allowRipple = true;
  };

  getLabel = (): string => {
    if (this.labelOverride) {
      return competencyLabels[this.labelOverride];
    }
    return competencyLabels[this.competency];
  };

  addOrRemoveFault = (wasPress = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.hasDangerousFault) {
      return;
    }

    if (this.isDangerousMode) {
      this.store$.dispatch(AddDangerousFault(this.competency));
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.hasSeriousFault) {
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(AddSeriousFault(this.competency));
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      const { competency } = this;
      this.store$.dispatch(
        ThrottleAddDrivingFault({
          competency,
          newFaultCount: this.faultCount ? this.faultCount + 1 : 1,
        })
      );
      return;
    }
  };

  removeFault = (): void => {
    if (this.hasDangerousFault && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(RemoveDangerousFault(this.competency));
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(RemoveSeriousFault(this.competency));
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount > 0) {
      this.store$.dispatch(
        RemoveDrivingFault({
          competency: this.competency,
          newFaultCount: this.faultCount ? this.faultCount - 1 : 0,
        })
      );
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  competencyHasFault = (): boolean => {
    return this.hasDangerousFault || this.hasSeriousFault || this.hasDrivingFault();
  };

  hasDrivingFault = (): boolean => {
    return this.faultCount !== undefined;
  };
}
