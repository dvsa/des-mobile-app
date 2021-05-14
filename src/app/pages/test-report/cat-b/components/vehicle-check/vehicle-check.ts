import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { merge, Observable, Subscription } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getVehicleChecks } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { isEmpty } from 'lodash';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { map } from 'rxjs/operators';
import { StoreModel } from '@shared/models/store.model';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import {
  ShowMeQuestionDangerousFault,
  ShowMeQuestionDrivingFault,
  ShowMeQuestionPassed,
  ShowMeQuestionRemoveFault,
  ShowMeQuestionSeriousFault,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { ToggleSeriousFaultMode, ToggleDangerousFaultMode, ToggleRemoveFaultMode } from '../../../test-report.actions';
import { isSeriousMode, isDangerousMode, isRemoveFaultMode } from '../../../test-report.selector';
import { getTestReportState } from '../../../test-report.reducer';

@Component({
  selector: 'vehicle-check',
  templateUrl: 'vehicle-check.html',
})
export class VehicleCheckComponent implements OnInit, OnDestroy {

  selectedShowMeQuestion: boolean = false;

  tellMeQuestionFault: string;
  showMeQuestionFault: string;

  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;

  merged$: Observable<void | boolean>;

  subscription: Subscription;

  constructor(private store$: Store<StoreModel>) { }

  ngOnInit(): void {

    const vehicleChecks$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getVehicleChecks),
    );

    const isSeriousMode$ = this.store$.pipe(
      select(getTestReportState),
      select(isSeriousMode),
    );

    const isDangerousMode$ = this.store$.pipe(
      select(getTestReportState),
      select(isDangerousMode),
    );

    const isRemoveFaultMode$ = this.store$.pipe(
      select(getTestReportState),
      select(isRemoveFaultMode),
    );

    this.subscription = merge(
      vehicleChecks$.pipe(map((vehicleChecks: CatBUniqueTypes.VehicleChecks) => {
        this.tellMeQuestionFault = vehicleChecks.tellMeQuestion.outcome;
        this.showMeQuestionFault = vehicleChecks.showMeQuestion.outcome;
        this.selectedShowMeQuestion = !isEmpty(vehicleChecks.showMeQuestion.outcome);
      })),
      isSeriousMode$.pipe(map((toggle) => this.isSeriousMode = toggle)),
      isDangerousMode$.pipe(map((toggle) => this.isDangerousMode = toggle)),
      isRemoveFaultMode$.pipe(map((toggle) => this.isRemoveFaultMode = toggle)),
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

  toggleShowMeQuestion = (): void => {
    if (this.hasShowMeDrivingFault() || this.hasSeriousFault() || this.hasDangerousFault()) {
      return;
    }

    if (this.showMeQuestionFault === CompetencyOutcome.P) {
      this.store$.dispatch(ShowMeQuestionRemoveFault());
      return;
    }

    this.store$.dispatch(ShowMeQuestionPassed());
  };

  canButtonRipple = () => {
    if (this.isRemoveFaultMode) {
      if (this.hasDangerousFault() && this.isDangerousMode) {
        return true;
      }

      if (this.hasSeriousFault() && this.isSeriousMode) {
        return true;
      }

      if (this.hasShowMeDrivingFault() && !this.isSeriousMode && !this.isDangerousMode) {
        return true;
      }

      return false;
    }

    return !(this.hasDangerousFault() || this.hasSeriousFault() || this.hasShowMeDrivingFault());
  };

  addOrRemoveFault = (wasPress: boolean = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
      return;
    }

    this.addFault(wasPress);
  };

  removeFault = (): void => {
    if (this.hasDangerousFault() && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(ShowMeQuestionPassed());
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(ShowMeQuestionPassed());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.hasShowMeDrivingFault()) {
      this.store$.dispatch(ShowMeQuestionPassed());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  addFault = (wasPress: boolean): void => {
    if (this.hasShowMeDrivingFault() || this.hasSeriousFault() || this.hasDangerousFault()) {
      return;
    }

    if (this.isDangerousMode) {
      this.store$.dispatch(ShowMeQuestionDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(ShowMeQuestionSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(ShowMeQuestionDrivingFault());
    }
  };

  getDrivingFaultCount = (): number => {
    if (this.hasDangerousFault() || this.hasSeriousFault()) {
      return 0;
    }

    if (this.hasShowMeDrivingFault() || this.hasTellMeDrivingFault()) {
      return 1;
    }

    return 0;
  };

  hasShowMeDrivingFault = (): boolean => {
    return this.showMeQuestionFault === CompetencyOutcome.DF;
  };

  hasTellMeDrivingFault = (): boolean => {
    return this.tellMeQuestionFault === CompetencyOutcome.DF;
  };

  hasSeriousFault = (): boolean => {
    return this.showMeQuestionFault === CompetencyOutcome.S;
  };

  hasDangerousFault = (): boolean => {
    return this.showMeQuestionFault === CompetencyOutcome.D;
  };
}
