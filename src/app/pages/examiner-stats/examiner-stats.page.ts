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
  getLocations,
  getManoeuvresUsed,
  getOutcome,
  getPassedTestCount,
  getRouteNumbers,
  getSafetyAndBalanceQuestions,
  getShowMeQuestions,
  getStartedTestCount,
  getTellMeQuestions,
} from '@pages/examiner-stats/examiner-stats.selector';
import { DateRange } from '@shared/helpers/date-time';
import { ChartType } from 'ng-apexcharts';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';

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
  safetyAndBalanceQuestions$: Observable<ExaminerStatData[]>;
  testCount$: Observable<number>;
  passPercentage$: Observable<string>;
  outcomes$: Observable<ExaminerStatData[]>;
  controlledStopPercentage$: Observable<string>;
  locationList$: Observable<TestCentre[]>;
}

export const enum FilterEnum {
  Both = 'Both',
  Data_Only = 'Data',
  Chart_Only = 'Chart',
}

export const enum ColourEnum {
  Default = 'Default',
  Monochrome = 'Monochrome',
  Corporate = 'Corporate',
}

@Component({
  selector: 'examiner-stats',
  templateUrl: './examiner-stats.page.html',
  styleUrls: ['./examiner-stats.page.scss'],
})
export class ExaminerStatsPage implements OnInit {

  merged$: Observable<any>;
  form: UntypedFormGroup = new UntypedFormGroup({});
  rangeSubject$ = new BehaviorSubject<DateRange | null>(null);
  locationSubject$ = new BehaviorSubject<number | null>(null);
  pageState: ExaminerStatsState;
  filterOption: FilterEnum = FilterEnum.Both;
  colourOption: ColourEnum = ColourEnum.Default;
  colors: { default: string[], monochrome: string[], corporate: string[] } = {
    default: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    monochrome: ['#008ffbd9', '#1c9bfbd9', '#37a7fcd9', '#53b3fcd9', '#6fc0fdd9'],
    corporate: ['#FFD600', '#2187C9', '#E0177D', '#3BAB36', '#ED6926'],
  };
  controlledStopTotal: number;
  globalChartType: ChartType;
  locationFilterOptions: TestCentre[] = [];
  dateFilterOptions: { display: string; val: DateRange }[] = [
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
  chartFilterOptions: { display: string, val: ChartType }[] = [
    { display: 'Default', val: null },
    { display: 'Bar', val: 'bar' },
    { display: 'Pie', val: 'pie' },
    { display: 'Donut', val: 'donut' },
  ];
  public dateFilter: string = 'Last 14 days';

  constructor(
    public store$: Store<StoreModel>,
  ) {
  }

  blurElement(event: EventTarget) {
    if (!((event as HTMLElement).id.includes('input'))) {
      (document.activeElement as HTMLElement).blur();
    }
  }


  private calculatePercentage = (
    [startedTestCount, comparatorCount],
  ) => `${((comparatorCount / startedTestCount) * 100).toFixed(2)}%`;

  // wrapper used to reduce/centralise code
  // take in a dynamic type, and a function with signature of fn(test, date)
  private filterByParameters = <T>(fn: (
    tests: StartedTests, range: DateRange, location: number
  ) => T): Observable<T> => combineLatest(
    [
      // get the startedTests once per change detection cycle
      this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        take(1),
      ),
      // listen for changes to the range
      this.rangeSubject$.asObservable(),
      this.locationSubject$.asObservable(),
    ])
    .pipe(
      // return an observable using the generic `fn`
      switchMap(([tests, range, location]) => of(fn(tests, range, location))),
    );

  ngOnInit(): void {
    this.pageState = {
      routeNumbers$: this.filterByParameters(getRouteNumbers),
      manoeuvres$: this.filterByParameters(getManoeuvresUsed),
      safetyAndBalanceQuestions$: this.filterByParameters(getSafetyAndBalanceQuestions),
      showMeQuestions$: this.filterByParameters(getShowMeQuestions),
      tellMeQuestions$: this.filterByParameters(getTellMeQuestions),
      testCount$: this.filterByParameters(getStartedTestCount),
      outcomes$: this.filterByParameters(getOutcome),
      locationList$: this.filterByParameters(getLocations),
      passPercentage$: this.filterByParameters(getStartedTestCount)
        .pipe(
          withLatestFrom(
            this.filterByParameters(getPassedTestCount),
          ),
          map(this.calculatePercentage),
        ),
      controlledStopPercentage$: this.filterByParameters(getStartedTestCount)
        .pipe(
          withLatestFrom(
            this.filterByParameters(getControlledStopCount),
          ),
          tap(([, controlledStop]) => this.controlledStopTotal = controlledStop),
          map(this.calculatePercentage),
        ),
    };
    this.pageState.locationList$.subscribe(value => {
      this.locationFilterOptions = [{ costCode: null, centreName: 'All', centreId: null }];
      this.locationFilterOptions = this.locationFilterOptions.concat(value);
    });
  }

  ionViewDidEnter() {
    this.store$.dispatch(ExaminerStatsViewDidEnter());
  }

  handleGrid(object: ExaminerStatData[], indexVal: string = null) {
    return object.map((val, index) =>
      [indexVal ? `${indexVal}${index + 1} - ${val.item}` : val.item, val.count, val.percentage]).sort();
  }

  handleDateFilter(event: CustomEvent) {
    this.dateFilter = event.detail?.value.display ?? null;
    this.rangeSubject$.next(event.detail?.value.val ?? null);
  }

  handleLocationFilter(event: CustomEvent) {
    this.locationSubject$.next(event.detail?.value ?? null);
  }

  handleChartFilter($event: any) {
    this.globalChartType = $event.detail.value;
  }

  colourSelect() {
    switch (this.colourOption) {
      default:
      case 'Default':
        return this.colors.default;
      case 'Monochrome':
        return this.colors.monochrome;
      case 'Corporate':
        return this.colors.corporate;
    }
  }
}
