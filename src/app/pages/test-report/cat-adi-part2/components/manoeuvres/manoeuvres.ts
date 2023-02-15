import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import {
  Component, Input, OnInit, OnDestroy,
} from '@angular/core';
import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import {
  getManoeuvresADI2,
} from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.selector';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { Subscription, Observable } from 'rxjs';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Manoeuvres } from '@dvsa/mes-test-schema/categories/ADI2/partial';
import { takeUntil } from 'rxjs/operators';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { OverlayCallback } from '../../../test-report.model';

@Component({
  selector: 'manoeuvres-adi-part2',
  templateUrl: 'manoeuvres.html',
  styleUrls: ['manoeuvres.scss'],
})
export class ManoeuvresComponent implements OnInit, OnDestroy {

  @Input()
  controlLabel: string;
  @Input()
  completed: boolean;

  @Input()
  clickCallback: OverlayCallback;

  drivingFaults: number = 0;
  hasSeriousFault: boolean = false;
  hasDangerousFault: boolean = false;

  subscription: Subscription;

  displayPopover: boolean;
  manoeuvres$: Observable<CatADI2UniqueTypes.Manoeuvres[]>;

  constructor(
    private store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider,
  ) {
    this.displayPopover = false;
  }

  ngOnInit(): void {
    this.manoeuvres$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getManoeuvresADI2),
    );

    this.subscription = this.manoeuvres$.pipe(takeUntil(trDestroy$))
      .subscribe((manoeuvres: CatADI2UniqueTypes.Manoeuvres[]) => {
        this.drivingFaults = this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres[]>(
          TestCategory.ADI2, manoeuvres, CompetencyOutcome.DF,
        );
        this.hasSeriousFault = this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres[]>(
          TestCategory.ADI2, manoeuvres, CompetencyOutcome.S,
        ) > 0;
        this.hasDangerousFault = this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres[]>(
          TestCategory.ADI2, manoeuvres, CompetencyOutcome.D,
        ) > 0;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  togglePopoverDisplay(): void {
    this.displayPopover = !this.displayPopover;
    this.toggleOverlay();
  }

  toggleOverlay(): void {
    if (this.clickCallback) {
      this.clickCallback.callbackMethod();
    }
  }
}
