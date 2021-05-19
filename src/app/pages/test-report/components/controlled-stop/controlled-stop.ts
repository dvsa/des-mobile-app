import {
  Component, OnInit, OnDestroy, Input,
} from '@angular/core';
import { Observable, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import * as controlledStopAction
  from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getControlledStop } from '@store/tests/test-data/common/controlled-stop/controlled-stop.reducer';
import {
  isControlledStopSelected,
  getControlledStopFault,
} from '@store/tests/test-data/common/controlled-stop/controlled-stop.selectors';
import { ToggleRemoveFaultMode, ToggleSeriousFaultMode, ToggleDangerousFaultMode } from '../../test-report.actions';
import { isRemoveFaultMode, isSeriousMode, isDangerousMode } from '../../test-report.selector';
import { getTestReportState } from '../../test-report.reducer';

interface ControlledStopComponentState {
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;

  selectedControlledStop$: Observable<boolean>;
  controlledStopOutcome$: Observable<CompetencyOutcome>;
}

@Component({
  selector: 'controlled-stop',
  templateUrl: 'controlled-stop.html',
  styleUrls: ['controlled-stop.scss'],
})
export class ControlledStopComponent implements OnInit, OnDestroy {

  @Input()
  testCategory: TestCategory;

  componentState: ControlledStopComponentState;
  subscription: Subscription;

  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;

  selectedControlledStop: boolean = false;
  controlledStopOutcome: CompetencyOutcome;
  merged$: Observable<boolean | CompetencyOutcome>;

  constructor(
    private store$: Store<StoreModel>,
    private testDataByCategoryProvider : TestDataByCategoryProvider,
  ) { }

  ngOnInit(): void {
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
      selectedControlledStop$: currentTest$.pipe(
        map((data) => this.testDataByCategoryProvider.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getControlledStop),
        select(isControlledStopSelected),
      ),
      controlledStopOutcome$: currentTest$.pipe(
        map((data) => this.testDataByCategoryProvider.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getControlledStop),
        select(getControlledStopFault),
      ),
    };

    const {
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      selectedControlledStop$,
      controlledStopOutcome$,
    } = this.componentState;

    this.subscription = merge(
      isRemoveFaultMode$.pipe(map((toggle) => this.isRemoveFaultMode = toggle)),
      isSeriousMode$.pipe(map((toggle) => this.isSeriousMode = toggle)),
      isDangerousMode$.pipe(map((toggle) => this.isDangerousMode = toggle)),
      selectedControlledStop$.pipe(map((value) => this.selectedControlledStop = value)),
      controlledStopOutcome$.pipe(map((outcome) => this.controlledStopOutcome = outcome)),
    ).subscribe();

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

  canButtonRipple = (): boolean => {
    if (this.isRemoveFaultMode) {
      if (this.hasDangerousFault() && this.isDangerousMode) {
        return true;
      }

      if (this.hasSeriousFault() && this.isSeriousMode) {
        return true;
      }

      if (!this.isSeriousMode && !this.isDangerousMode && this.faultCount() > 0) {
        return true;
      }
      return false;
    }
    return !(this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0);
  };

  toggleControlledStop = (): void => {
    if (this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }
    this.store$.dispatch(controlledStopAction.ToggleControlledStop());
  };

  addOrRemoveFault = (wasPress: boolean = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }

    if (this.isDangerousMode) {
      this.store$.dispatch(controlledStopAction.ControlledStopAddDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(controlledStopAction.ControlledStopAddSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(controlledStopAction.ControlledStopAddDrivingFault());
    }
  };

  removeFault = (): void => {

    if (this.hasDangerousFault() && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(controlledStopAction.ControlledStopRemoveFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(controlledStopAction.ControlledStopRemoveFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount() > 0) {
      this.store$.dispatch(controlledStopAction.ControlledStopRemoveFault());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  faultCount = (): number => this.controlledStopOutcome === CompetencyOutcome.DF ? 1 : 0;

  hasSeriousFault = (): boolean => this.controlledStopOutcome === CompetencyOutcome.S;

  hasDangerousFault = (): boolean => this.controlledStopOutcome === CompetencyOutcome.D;
}
