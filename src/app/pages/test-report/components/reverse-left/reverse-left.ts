import { NgClass } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { ManoeuvresByCategoryProvider } from '@providers/manoeuvres-by-category/manoeuvres-by-category';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { ManoeuvreUnion } from '@shared/unions/test-schema-unions';
import {
  RecordManoeuvresDeselection,
  RecordManoeuvresSelection,
} from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { getReverseLeftSelected } from '@store/tests/test-data/common/manoeuvres/manoeuvres.selectors';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
export class ReverseLeftComponent implements OnInit, OnDestroy {
  @Input()
  completed: boolean;

  @Input()
  controlLabel: string;

  @Input()
  testCategory: TestCategory | CategoryCode;

  @Input()
  clickCallback: OverlayCallback;

  completedReverseLeft = false;

  drivingFaults = 0;
  hasSeriousFault = false;
  hasDangerousFault = false;

  subscription: Subscription;

  displayPopover = false;

  constructor(
    private store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider,
    private manoeuvresByCategory: ManoeuvresByCategoryProvider
  ) {}

  ngOnInit(): void {
    const manoeuvres$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
      select(this.manoeuvresByCategory.getManoeuvresByCategoryCode(this.testCategory))
    );

    this.subscription = manoeuvres$.pipe(takeUntil(trDestroy$)).subscribe((manoeuvres: ManoeuvreUnion) => {
      this.drivingFaults = this.faultCountProvider.getManoeuvreFaultCount<ManoeuvreUnion>(
        this.testCategory,
        manoeuvres,
        CompetencyOutcome.DF
      );
      this.hasSeriousFault =
        this.faultCountProvider.getManoeuvreFaultCount<ManoeuvreUnion>(
          this.testCategory,
          manoeuvres,
          CompetencyOutcome.S
        ) > 0;
      this.hasDangerousFault =
        this.faultCountProvider.getManoeuvreFaultCount<ManoeuvreUnion>(
          this.testCategory,
          manoeuvres,
          CompetencyOutcome.D
        ) > 0;
      this.completedReverseLeft = getReverseLeftSelected(manoeuvres);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
