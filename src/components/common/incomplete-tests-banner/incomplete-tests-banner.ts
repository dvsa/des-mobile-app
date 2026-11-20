import { Component, computed } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { getUnsubmittedTestSlots } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { StoreModel } from '@shared/models/store.model';
import { getJournalState } from '@store/journal/journal.reducer';
import { getTests } from '@store/tests/tests.reducer';
enum CountDescription {
  MULTIPLE = 'You have incomplete tests',
  SINGLE = 'You have an incomplete test',
}

@Component({
  selector: 'incomplete-tests-banner',
  templateUrl: 'incomplete-tests-banner.html',
  styleUrls: ['incomplete-tests-banner.scss'],
  imports: [IonIcon],
})
export class IncompleteTestsBanner {
  private readonly journal = this.store$.selectSignal(getJournalState);
  private readonly tests = this.store$.selectSignal(getTests);
  readonly count = computed(
    () =>
      getUnsubmittedTestSlots(
        this.journal(),
        this.tests(),
        this.dateTimeProvider,
        this.slotProvider,
        this.appConfProvider.getAppConfig()?.journal?.numberOfDaysToView
      ).length
  );

  constructor(
    private store$: Store<StoreModel>,
    private slotProvider: SlotProvider,
    private dateTimeProvider: DateTimeProvider,
    private appConfProvider: AppConfigProvider
  ) {}

  getIncompleteText(count: number): string {
    if (count > 1) {
      return CountDescription.MULTIPLE;
    }
    return CountDescription.SINGLE;
  }
}
