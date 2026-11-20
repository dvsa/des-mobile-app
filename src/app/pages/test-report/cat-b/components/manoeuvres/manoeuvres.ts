import { NgClass } from '@angular/common';
import { Component, Input, computed } from '@angular/core';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { Manoeuvres } from '@dvsa/mes-test-schema/categories/B/partial';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { OverlayCallback } from '@pages/test-report/test-report.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getManoeuvres } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

@Component({
  selector: 'manoeuvres',
  templateUrl: 'manoeuvres.html',
  styleUrls: ['./manoeuvres.scss'],
  standalone: true,
  imports: [
    NgClass,
    TickIndicatorComponent,
    DrivingFaultsBadgeComponent,
    IonIcon,
    SeriousFaultBadgeComponent,
    DangerousFaultBadgeComponent,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class ManoeuvresComponent {
  @Input()
  controlLabel: string;
  @Input()
  completed: boolean;

  @Input()
  clickCallback: OverlayCallback;

  displayPopover: boolean;
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  manoeuvres = computed(() => getManoeuvres(this.testData()));
  drivingFaults = computed(() =>
    this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres>(TestCategory.B, this.manoeuvres(), CompetencyOutcome.DF)
  );
  hasSeriousFault = computed(
    () =>
      this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres>(
        TestCategory.B,
        this.manoeuvres(),
        CompetencyOutcome.S
      ) > 0
  );
  hasDangerousFault = computed(
    () =>
      this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres>(
        TestCategory.B,
        this.manoeuvres(),
        CompetencyOutcome.D
      ) > 0
  );

  constructor(
    private store$: Store<StoreModel>,
    private faultCountProvider: FaultCountProvider
  ) {
    this.displayPopover = false;
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
