import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { SlotProvider } from '@providers/slot/slot';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { Observable } from 'rxjs';
import { unsubmittedTestSlotsCount$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';

interface IncompleteTestsBannerComponentState {
  count$: Observable<number>;
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
      count$: unsubmittedTestSlotsCount$(
        this.store$,
        this.dateTimeProvider,
        this.slotProvider,
        this.appConfProvider.getAppConfig()?.journal?.numberOfDaysToView
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
