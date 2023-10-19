import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getStartedTests, StartedTests } from '@store/tests/tests.selector';
import { ExaminerStatsViewDidEnter } from '@pages/examiner-stats/examiner-stats.actions';
import {
  ExaminerStatData,
  getControlledStopCount,
  getManoeuvresUsed,
  getPassedTestCount,
  getRouteNumbers,
  getShowMeQuestions,
  getStartedTestCount,
  getTellMeQuestions,
} from '@pages/examiner-stats/examiner-stats.selector';
import { DateRange } from '@shared/helpers/date-time';

export enum BaseManoeuvreTypeLabels {
  reverseLeft = 'Reverse left',
  reverseRight = 'Reverse right',
  reverseParkRoad = 'Reverse park (road)',
  reverseParkCarpark = 'Reverse park (car park)',
  forwardPark = 'Forward park',
  reverseManoeuvre = 'Reverse',
}

export enum AlternativeManoeuvreTypeLabels {
  reverseLeft = 'Reverse',
  reverseRight = 'Reverse right',
  reverseParkRoad = 'Reverse park (road)',
  reverseParkCarpark = 'Reverse park (car park)',
  forwardPark = 'Forward park',
  reverseManoeuvre = 'Reverse',
}

interface ExaminerStatsState {
  routeNumbers$: Observable<ExaminerStatData[]>;
  manoeuvres$: Observable<ExaminerStatData[]>;
  showMeQuestions$: Observable<ExaminerStatData[]>;
  tellMeQuestions$: Observable<ExaminerStatData[]>;
  testCount$: Observable<number>;
  passPercentage$: Observable<string>;
  controlledStopPercentage$: Observable<string>;
}

export const enum FilterEnum {
  Both = 'Both',
  Data_Only = 'Data',
  Chart_Only = 'Chart',
}

@Component({
  selector: 'examiner-stats',
  templateUrl: './examiner-stats.page.html',
  styleUrls: ['./examiner-stats.page.scss'],
})
export class ExaminerStatsPage implements OnInit {

  merged$: Observable<any>;
  form: UntypedFormGroup = new UntypedFormGroup({});

  constructor(
    public store$: Store<StoreModel>,
  ) {
  }

  rangeSubject$ = new BehaviorSubject<DateRange | null>(null);
  pageState: ExaminerStatsState;
  filterOption: FilterEnum = FilterEnum.Both;
  colors: string[] = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];
  controlledStopTotal: number;
  selectFilterOptions: { display: string; val: DateRange }[] = [
    {
      display: 'Today',
      val: 'today',
    },
    {
      display: 'Last 7 days',
      val: 'week',
    },
    {
      display: 'Last 14 days',
      val: 'fortnight',
    },
  ];
  private calculatePercentage = (
    [startedTestCount, comparatorCount],
  ) => `${((comparatorCount / startedTestCount) * 100).toFixed(2)}%`;

  // wrapper used to reduce/centralise code
  // take in a dynamic type, and a function with signature of fn(test, date)
  private filterUsingDateRange = <T>(fn: (tests: StartedTests, range: DateRange) => T): Observable<T> => combineLatest(
    [
      // get the startedTests once per change detection cycle
      this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        take(1),
      ),
      // listen for changes to the range
      this.rangeSubject$.asObservable(),
    ])
    .pipe(
      // return an observable using the generic `fn`
      switchMap(([tests, range]) => of(fn(tests, range))),
    );

  ngOnInit(): void {
    this.pageState = {
      routeNumbers$: this.filterUsingDateRange(getRouteNumbers),
      manoeuvres$: this.filterUsingDateRange(getManoeuvresUsed),
      showMeQuestions$: this.filterUsingDateRange(getShowMeQuestions),
      tellMeQuestions$: this.filterUsingDateRange(getTellMeQuestions),
      testCount$: this.filterUsingDateRange(getStartedTestCount),
      passPercentage$: this.filterUsingDateRange(getStartedTestCount)
        .pipe(
          withLatestFrom(
            this.filterUsingDateRange(getPassedTestCount),
          ),
          map(this.calculatePercentage),
        ),
      controlledStopPercentage$: this.filterUsingDateRange(getStartedTestCount)
        .pipe(
          withLatestFrom(
            this.filterUsingDateRange(getControlledStopCount),
          ),
          tap(([, controlledStop]) => this.controlledStopTotal = controlledStop),
          map(this.calculatePercentage),
        ),
    };
  }

  ionViewDidEnter() {
    this.store$.dispatch(ExaminerStatsViewDidEnter());
  }

  handleGrid(object: { item: string, count: number }[]): [string, number][] {
    return object.map((val) => [val.item, val.count]);
  }

  handleFilter(event: CustomEvent) {
    const range = event.detail?.value ?? null;
    this.rangeSubject$.next(range);
  }
}
