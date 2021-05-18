import {
  Component, OnDestroy, OnInit, Input,
} from '@angular/core';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { Observable, Subscription, merge } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { map } from 'rxjs/operators';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { get } from 'lodash';
import {
  ToggleUncoupleRecouple,
  UncoupleRecoupleAddDangerousFault,
  UncoupleRecoupleAddDrivingFault,
  UncoupleRecoupleAddSeriousFault,
  UncoupleRecoupleRemoveFault,
} from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { ToggleDangerousFaultMode, ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isDangerousMode, isRemoveFaultMode, isSeriousMode } from '../../test-report.selector';

interface UncoupleRecoupleComponentState {
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  selectedUncoupleRecouple$: Observable<boolean>;
  uncoupleRecoupleOutcome$: Observable<CompetencyOutcome>;
}

@Component({
  selector: 'uncouple-recouple',
  templateUrl: 'uncouple-recouple.html',
  styleUrls: ['uncouple-recouple.scss'],
})

export class UncoupleRecoupleComponent implements OnInit, OnDestroy {

  @Input()
  category: CategoryCode;

  componentState: UncoupleRecoupleComponentState;
  subscription: Subscription;

  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;

  selectedUncoupleRecouple: boolean = false;
  uncoupleRecoupleOutcome: CompetencyOutcome;
  merged$: Observable<boolean | CompetencyOutcome>;

  constructor(
    private store$: Store<StoreModel>,
    private testDataByCategory: TestDataByCategoryProvider,
  ) {
  }

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
      selectedUncoupleRecouple$: currentTest$.pipe(
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.category)(data)),
        select((testData) => get(testData, 'uncoupleRecouple.selected')),
      ),
      uncoupleRecoupleOutcome$: currentTest$.pipe(
        map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.category)(data)),
        select((testData) => get(testData, 'uncoupleRecouple.fault')),
      ),
    };

    const {
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      selectedUncoupleRecouple$,
      uncoupleRecoupleOutcome$,
    } = this.componentState;

    this.subscription = merge(
      isRemoveFaultMode$.pipe(map((toggle) => this.isRemoveFaultMode = toggle)),
      isSeriousMode$.pipe(map((toggle) => this.isSeriousMode = toggle)),
      isDangerousMode$.pipe(map((toggle) => this.isDangerousMode = toggle)),
      selectedUncoupleRecouple$.pipe(map((value) => this.selectedUncoupleRecouple = value)),
      uncoupleRecoupleOutcome$.pipe(map((outcome) => this.uncoupleRecoupleOutcome = outcome)),
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

  toggleUncoupleRecouple = (): void => {
    if (this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }
    this.store$.dispatch(ToggleUncoupleRecouple());
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
      this.store$.dispatch(UncoupleRecoupleAddDangerousFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(UncoupleRecoupleAddSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(UncoupleRecoupleAddDrivingFault());
    }
  };

  removeFault = (): void => {

    if (this.hasDangerousFault() && this.isDangerousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(UncoupleRecoupleRemoveFault());
      this.store$.dispatch(ToggleDangerousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(UncoupleRecoupleRemoveFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }

    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount() > 0) {
      this.store$.dispatch(UncoupleRecoupleRemoveFault());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  };

  faultCount = (): number => this.uncoupleRecoupleOutcome === CompetencyOutcome.DF ? 1 : 0;

  hasSeriousFault = (): boolean => this.uncoupleRecoupleOutcome === CompetencyOutcome.S;

  hasDangerousFault = (): boolean => this.uncoupleRecoupleOutcome === CompetencyOutcome.D;

}
