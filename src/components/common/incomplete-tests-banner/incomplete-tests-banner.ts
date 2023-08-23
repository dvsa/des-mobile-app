import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime } from '@shared/helpers/date-time';
import { map } from 'rxjs/operators';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { Observable } from 'rxjs';
import { unsubmittedTestSlots$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { AppConfigProvider } from '@providers/app-config/app-config';

interface IncompleteTestsBannerComponentState {
  count$: Observable<SlotItem[]>;
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
      /* get incomplete tests and filter out any older than 14 days */
      count$: unsubmittedTestSlots$(this.store$, this.dateTimeProvider, this.slotProvider)
        .pipe(
          map((data: SlotItem[]) => data.filter((value) => {
            return new DateTime(value.slotData.slotDetail.start).daysDiff(new DateTime())
              <= this.appConfProvider.getAppConfig()?.journal?.numberOfDaysToView;
          })),
        ),
    };
  }

  getIncompleteText(count: number): string {
    if (count > 1) {
      return CountDescription.MULTIPLE;
    }
    return CountDescription.SINGLE;
  }

}
