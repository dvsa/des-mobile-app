import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime } from '@shared/helpers/date-time';
import { map } from 'rxjs/operators';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { Observable } from 'rxjs';
import {
  unsubmittedTestSlotsCount$,
  unsubmittedTestSlotsInDateOrder$,
} from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { AppConfigProvider } from '@providers/app-config/app-config';

interface IncompleteTestsBannerComponentState {
  count$: Observable<number>;
  unsubmittedTestsInOrder$: Observable<SlotItem[]>
}

enum CountDescription {
  MULTIPLE = 'You have incomplete tests',
  SINGLE = 'You have an incomplete test',
}

@Component({
  selector: 'incomplete-tests-banner',
  templateUrl: 'incomplete-tests-banner.html',
  styleUrls: ['incomplete-tests-banner.scss'],
})

export class IncompleteTestsBanner implements OnInit {

  @Input()
  public todaysDate: DateTime;

  componentState: IncompleteTestsBannerComponentState;

  constructor(
    private store$: Store<StoreModel>,
    private slotProvider: SlotProvider,
    private dateTimeProvider: DateTimeProvider,
    private appConfProvider: AppConfigProvider,
  ) {
  }

  ngOnInit() {
    this.componentState = {
      unsubmittedTestsInOrder$: unsubmittedTestSlotsInDateOrder$(this.store$, this.dateTimeProvider, this.slotProvider)
        .pipe(
          map((data: SlotItem[]) => data.filter((value) => {
            return new DateTime(value.slotData.slotDetail.start).daysDiff(new DateTime())
              > this.appConfProvider.getAppConfig()?.journal?.numberOfDaysToView;
          })),
        ),
      /* Sum all individual counts to determine, overall count */
      count$: unsubmittedTestSlotsCount$(this.store$, this.dateTimeProvider, this.slotProvider),
    };
  }

  getIncompleteText(count: number): string {
    if (count > 1) {
      return CountDescription.MULTIPLE;
    }
    return CountDescription.SINGLE;
  }

  displayIncompleteBanner(tests: SlotItem[]): boolean {
    return tests.length === 0;
  }

}
