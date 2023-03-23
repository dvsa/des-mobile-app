import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime } from '@shared/helpers/date-time';
import { map } from 'rxjs/operators';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { combineLatest, Observable } from 'rxjs';
import { unsubmittedTestSlotsCount$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { sumFlatArray } from '@shared/helpers/sum-number-array';

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

  @Input()
  public todaysDate: DateTime;

  componentState: IncompleteTestsBannerComponentState;

  constructor(
    private store$: Store<StoreModel>,
    private slotProvider: SlotProvider,
    private dateTimeProvider: DateTimeProvider,
  ) {
  }

  ngOnInit() {
    this.componentState = {
      count$: combineLatest([
        unsubmittedTestSlotsCount$(this.store$, this.dateTimeProvider, this.slotProvider),
      ]).pipe(map(sumFlatArray)), /* Sum all individual counts to determine, overall count */
    };
  }

  getIncompleteText(count: number): string {
    if (count > 1) {
      return CountDescription.MULTIPLE;
    }
    return CountDescription.SINGLE;
  }

}
