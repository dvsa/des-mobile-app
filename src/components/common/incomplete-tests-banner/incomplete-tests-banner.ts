import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime } from '@shared/helpers/date-time';
import { getJournalState } from '@store/journal/journal.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { map, withLatestFrom } from 'rxjs/operators';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { Observable } from 'rxjs';
import { getIncompleteTests } from './incomplete-tests-banner.selector';

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
      count$: this.store$.pipe(
        select(getJournalState),
        withLatestFrom(this.store$.pipe(select(getTests))),
        map(([journal, tests]) =>
          getIncompleteTests(journal, tests, this.dateTimeProvider.now(), this.slotProvider).length),
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
