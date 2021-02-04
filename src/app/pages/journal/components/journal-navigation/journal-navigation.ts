import { Component, OnInit } from '@angular/core';
import {
  Store,
  select,
} from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StoreModel } from '../../../../shared/models/store.model';
import { getJournalState } from '../../../../../store/journal/journal.reducer';
import {
  canNavigateToNextDay,
  canNavigateToPreviousDay,
  getSelectedDate,
} from '../../../../../store/journal/journal.selector';
import { DateTimeProvider } from '../../../../providers/date-time/date-time';
import * as journalActions from '../../../../../store/journal/journal.actions';

interface JournalNavigationPageState {
  selectedDate$: Observable<string>;
  canNavigateToPreviousDay$: Observable<boolean>;
  canNavigateToNextDay$: Observable<boolean>;
  isSelectedDateToday$: Observable<boolean>;
}

@Component({
  selector: 'journal-navigation',
  templateUrl: 'journal-navigation.html',
  styleUrls: ['journal-navigation.scss'],
})
export class JournalNavigationComponent implements OnInit {

  pageState: JournalNavigationPageState;

  constructor(
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
  ) {}

  ngOnInit(): void {
    this.pageState = {
      selectedDate$: this.store$.pipe(
        select(getJournalState),
        map(getSelectedDate),
      ),
      canNavigateToPreviousDay$: this.store$.pipe(
        select(getJournalState),
        map((journal) => canNavigateToPreviousDay(journal, this.dateTimeProvider.now())),
      ),
      canNavigateToNextDay$: this.store$.pipe(
        select(getJournalState),
        map(canNavigateToNextDay),
      ),
      isSelectedDateToday$: this.store$.pipe(
        select(getJournalState),
        map(getSelectedDate),
        map((selectedDate) => selectedDate === this.dateTimeProvider.now().format('YYYY-MM-DD')),
      ),
    };
  }

  onPreviousDayClick(): void {
    this.store$.dispatch(journalActions.SelectPreviousDay());
  }

  onNextDayClick(): void {
    this.store$.dispatch(journalActions.SelectNextDay());
  }
}
