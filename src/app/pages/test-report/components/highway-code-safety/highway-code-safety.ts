import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import * as highwayCodeSafetyAction
  from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.actions';
import { getTestReportState } from '../../test-report.reducer';
import { isRemoveFaultMode, isSeriousMode, isDangerousMode } from '../../test-report.selector';
import { ToggleRemoveFaultMode, ToggleSeriousFaultMode } from '../../test-report.actions';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  getHighwayCodeSafety,
} from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.reducer';
import {
  isHighwayCodeSafetySelected,
  getHighwayCodeSafetySeriousFault,
  getHighwayCodeSafetyDrivingFault,
} from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.selectors';
interface HighwayCodeSafetyComponentState {
  isRemoveFaultMode$: Observable<boolean>;
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  selectedHighwayCodeSafety$: Observable<boolean>;
  highwayCodeSafetySeriousFault$: Observable<boolean>;
  highwayCodeSafetyDrivingFault$: Observable<boolean>;
}

@Component({
  selector: 'highway-code-safety',
  templateUrl: 'highway-code-safety.html',
  styleUrls: ['highway-code-safety.scss'],
})
export class HighwayCodeSafetyComponent implements OnInit, OnDestroy {

  @Input()
  testCategory: TestCategory;

  componentState: HighwayCodeSafetyComponentState;
  subscription: Subscription;

  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;

  selectedHighwayCodeSafety: boolean = false;
  highwayCodeSafetySeriousFault: boolean = false;
  highwayCodeSafetyDrivingFault: boolean = false;
  merged$: Observable<boolean>;

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
        select(isRemoveFaultMode)),
      isSeriousMode$: this.store$.pipe(
        select(getTestReportState),
        select(isSeriousMode)),
      isDangerousMode$: this.store$.pipe(
        select(getTestReportState),
        select(isDangerousMode)),
      selectedHighwayCodeSafety$: currentTest$.pipe(
        map(data => this.testDataByCategoryProvider.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getHighwayCodeSafety),
        select(isHighwayCodeSafetySelected),
      ),
      highwayCodeSafetySeriousFault$: currentTest$.pipe(
        map(data => this.testDataByCategoryProvider.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getHighwayCodeSafety),
        select(getHighwayCodeSafetySeriousFault),
      ),
      highwayCodeSafetyDrivingFault$: currentTest$.pipe(
        map(data => this.testDataByCategoryProvider.getTestDataByCategoryCode(this.testCategory)(data)),
        select(getHighwayCodeSafety),
        select(getHighwayCodeSafetyDrivingFault),
      ),
    };

    const {
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      selectedHighwayCodeSafety$,
      highwayCodeSafetySeriousFault$,
      highwayCodeSafetyDrivingFault$,
    } = this.componentState;

    this.subscription = merge(
      isRemoveFaultMode$.pipe(map(toggle => this.isRemoveFaultMode = toggle)),
      isSeriousMode$.pipe(map(toggle => this.isSeriousMode = toggle)),
      isDangerousMode$.pipe(map(toggle => this.isDangerousMode = toggle)),
      selectedHighwayCodeSafety$.pipe(map(value => this.selectedHighwayCodeSafety = value)),
      highwayCodeSafetySeriousFault$.pipe(map(value => this.highwayCodeSafetySeriousFault = value)),
      highwayCodeSafetyDrivingFault$.pipe(map(value => this.highwayCodeSafetyDrivingFault = value)),
    ).subscribe();

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onTap = () => {
    this.addOrRemoveFault();
  }

  onPress = () => {
    this.addOrRemoveFault(true);
  }

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
  }

  toggleHighwayCodeSafety = (): void => {
    if (this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }
    this.store$.dispatch(highwayCodeSafetyAction.ToggleHighwayCodeSafety());
  }

  addOrRemoveFault = (wasPress: boolean = false): void => {
    if (this.isRemoveFaultMode) {
      this.removeFault();
    } else {
      this.addFault(wasPress);
    }
  }

  addFault = (wasPress: boolean): void => {
    if (this.hasDangerousFault() || this.hasSeriousFault() || this.faultCount() > 0) {
      return;
    }

    if (this.isDangerousMode) {
      return;
    }

    if (this.isSeriousMode) {
      this.store$.dispatch(highwayCodeSafetyAction.HighwayCodeSafetyAddSeriousFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      return;
    }

    if (wasPress) {
      this.store$.dispatch(highwayCodeSafetyAction.HighwayCodeSafetyAddDrivingFault());
    }
  }

  removeFault = (): void => {

    if (this.hasSeriousFault() && this.isSeriousMode && this.isRemoveFaultMode) {
      this.store$.dispatch(highwayCodeSafetyAction.HighwayCodeSafetyRemoveFault());
      this.store$.dispatch(ToggleSeriousFaultMode());
      this.store$.dispatch(ToggleRemoveFaultMode());
      return;
    }
    if (!this.isSeriousMode && !this.isDangerousMode && this.isRemoveFaultMode && this.faultCount() > 0) {
      this.store$.dispatch(highwayCodeSafetyAction.HighwayCodeSafetyRemoveFault());
      this.store$.dispatch(ToggleRemoveFaultMode());
    }
  }

  faultCount = (): number => this.highwayCodeSafetyDrivingFault ? 1 : 0;

  hasSeriousFault = (): boolean => this.highwayCodeSafetySeriousFault;

  hasDangerousFault = (): boolean => false;
}
