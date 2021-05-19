import {
  Component, Input, OnDestroy, OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getTests } from '@store/tests/tests.reducer';
import {
  RecordManoeuvresDeselection,
  RecordManoeuvresSelection,
} from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { getCurrentTest } from '@store/tests/tests.selector';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { StoreModel } from '@shared/models/store.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import {
  ManoeuvresByCategoryProvider,
} from '@providers/manoeuvres-by-category/manoeuvres-by-category';
import { ManoeuvreUnion } from '@shared/unions/test-schema-unions';
import { getReverseLeftSelected } from '@store/tests/test-data/common/manoeuvres/manoeuvres.selectors';
import { map } from 'rxjs/operators';
import { OverlayCallback } from '../../test-report.model';
import { ReverseLeftPopoverClosed, ReverseLeftPopoverOpened } from './reverse-left.actions';

@Component({
  selector: 'reverse-left',
  templateUrl: 'reverse-left.html',
  styleUrls: ['reverse-left.scss'],
})
export class ReverseLeftComponent implements OnInit, OnDestroy {

  @Input()
  completed: boolean;

  @Input()
  controlLabel: string;

  @Input()
  testCategory: TestCategory;

  @Input()
  clickCallback: OverlayCallback;

  completedReverseLeft: boolean = false;

  drivingFaults: number = 0;
  hasSeriousFault: boolean = false;
  hasDangerousFault: boolean = false;

  subscription: Subscription;

  displayPopover: boolean = false;

  constructor(
    private store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
    private testDataByCategory: TestDataByCategoryProvider,
    private manoeuvresByCategory: ManoeuvresByCategoryProvider,
  ) {}

  ngOnInit(): void {
    const manoeuvres$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      map((data) => this.testDataByCategory.getTestDataByCategoryCode(this.testCategory)(data)),
      select(this.manoeuvresByCategory.getManoeuvresByCategoryCode(this.testCategory)),
    );

    this.subscription = manoeuvres$.subscribe((manoeuvres: ManoeuvreUnion) => {
      this.drivingFaults = this.faultCountProvider.getManoeuvreFaultCount<ManoeuvreUnion>(
        this.testCategory, manoeuvres, CompetencyOutcome.DF,
      );
      this.hasSeriousFault = this.faultCountProvider.getManoeuvreFaultCount<ManoeuvreUnion>(
        this.testCategory, manoeuvres, CompetencyOutcome.S,
      ) > 0;
      this.hasDangerousFault = this.faultCountProvider.getManoeuvreFaultCount<ManoeuvreUnion>(
        this.testCategory, manoeuvres, CompetencyOutcome.D,
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
