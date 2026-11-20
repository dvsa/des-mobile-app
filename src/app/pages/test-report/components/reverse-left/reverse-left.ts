import { NgClass } from '@angular/common';
import { Component, Input, computed, input } from '@angular/core';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { ManoeuvresByCategoryProvider } from '@providers/manoeuvres-by-category/manoeuvres-by-category';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { ManoeuvreUnion, TestDataUnion } from '@shared/unions/test-schema-unions';
import {
  RecordManoeuvresDeselection,
  RecordManoeuvresSelection,
} from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { getReverseLeftSelected } from '@store/tests/test-data/common/manoeuvres/manoeuvres.selectors';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { OverlayCallback } from '../../test-report.model';
import { CompetencyButtonComponent } from '../competency-button/competency-button';
import { ReverseLeftPopoverClosed, ReverseLeftPopoverOpened } from './reverse-left.actions';

@Component({
  selector: 'reverse-left',
  templateUrl: 'reverse-left.html',
  styleUrls: ['reverse-left.scss'],
  imports: [
    IonRow,
    IonCol,
    CompetencyButtonComponent,
    NgClass,
    TickIndicatorComponent,
    DrivingFaultsBadgeComponent,
    IonIcon,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
    IonGrid,
  ],
})
export class ReverseLeftComponent {
  @Input()
  completed: boolean;

  @Input()
  controlLabel: string;

  readonly testCategory = input<TestCategory | CategoryCode>();

  @Input()
  clickCallback: OverlayCallback;

  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly manoeuvres = computed(() => {
    const category = this.testCategory();
    const currentTest = this.currentTest();
    if (!category || !currentTest) return undefined;
    const testData = this.testDataByCategory.getTestDataByCategoryCode(category)(currentTest) as TestDataUnion;
    return this.manoeuvresByCategory.getManoeuvresByCategoryCode(category)(testData);
  });
  get drivingFaults(): number {
    return this.countFaults(CompetencyOutcome.DF);
  }
  get hasSeriousFault(): boolean {
    return this.countFaults(CompetencyOutcome.S) > 0;
  }
  get hasDangerousFault(): boolean {
    return this.countFaults(CompetencyOutcome.D) > 0;
  }
  get completedReverseLeft(): boolean {
    return getReverseLeftSelected(this.manoeuvres());
  }

  displayPopover = false;

  constructor(
    private store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider,
    private manoeuvresByCategory: ManoeuvresByCategoryProvider
  ) {}

  private countFaults(outcome: CompetencyOutcome): number {
    const manoeuvres = this.manoeuvres();
    return manoeuvres
      ? this.faultCountProvider.getManoeuvreFaultCount<ManoeuvreUnion>(this.testCategory(), manoeuvres, outcome)
      : 0;
  }

  toggleReverseLeft = (): void => {
    if (this.completedReverseLeft && !this.hasFaults()) {
      this.store$.dispatch(RecordManoeuvresDeselection(ManoeuvreTypes.reverseLeft));
      return;
    }
    this.store$.dispatch(RecordManoeuvresSelection(ManoeuvreTypes.reverseLeft));
  };

  hasFaults = (): boolean => {
    return this.drivingFaults > 0 || this.hasSeriousFault || this.hasDangerousFault;
  };

  togglePopoverDisplay = (): void => {
    if (this.displayPopover) {
      this.store$.dispatch(ReverseLeftPopoverClosed());
      this.displayPopover = false;
    } else {
      this.store$.dispatch(ReverseLeftPopoverOpened());
      this.displayPopover = true;
    }
    this.toggleOverlay();
  };

  toggleOverlay(): void {
    if (this.clickCallback) {
      this.clickCallback.callbackMethod();
    }
  }
}
