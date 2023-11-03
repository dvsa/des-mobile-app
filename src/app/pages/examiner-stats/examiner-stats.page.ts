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
  ExaminerStatData, getCategories,
  getControlledStopCount, getIndependentDrivingStats,
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
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { mockLocalData } from '@pages/examiner-stats/test-result.mock';

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
  independentDriving$: Observable<ExaminerStatData[]>;
  testCount$: Observable<number>;
  passPercentage$: Observable<string>;
  outcomes$: Observable<ExaminerStatData[]>;
  controlledStopPercentage$: Observable<string>;
  locationList$: Observable<{ item: TestCentre, count: number }[]>;
  categoryList$: Observable<{ item: TestCategory, count: number }[]>;
}

export const enum FilterEnum {
  Both = 'Both',
  Data_Only = 'Data',
  Chart_Only = 'Chart',
}

export const enum ColourEnum {
  Default = 'Default',
  Monochrome = 'Monochrome',
  DVSA = 'DVSA',
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
  categorySubject$ = new BehaviorSubject<TestCategory | null>(null);
  pageState: ExaminerStatsState;
  filterOption: FilterEnum = FilterEnum.Both;
  colourOption: ColourEnum = ColourEnum.Default;
  colors: { default: string[], monochrome: string[], dvsa: string[] } = {
    default: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    monochrome: ['#008ffbd9', '#1c9bfbd9', '#37a7fcd9', '#53b3fcd9', '#6fc0fdd9'],
    dvsa: ['#FFD600', '#2187C9', '#E0177D', '#3BAB36', '#ED6926'],
  };
  controlledStopTotal: number;
  categoryPlaceholder: string;
  locationPlaceholder: string;
  globalChartType: ChartType;
  locationFilterOptions: TestCentre[] = null;
  categoryFilterOptions: TestCategory[] = null;
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
  ];
  public dateFilter: string = 'Last 14 days';
  public locationFilter: string;
  public categoryFilter: string;

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
    tests: StartedTests, range: DateRange, location: number, category: string,
  ) => T): Observable<T> => combineLatest(
    [
      // get the startedTests once per change detection cycle
      this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        map(() => {
          return mockLocalData;
        }),
        take(1),
      ),
      // listen for changes to the range
      this.rangeSubject$.asObservable(),
      this.locationSubject$.asObservable(),
      this.categorySubject$.asObservable(),
    ])
    .pipe(
      // return an observable using the generic `fn`
      switchMap(([tests, range, location, category]) => of(fn(tests, range, location, category))),
    );

  ngOnInit(): void {
    this.pageState = {
      routeNumbers$: this.filterByParameters(getRouteNumbers),
      manoeuvres$: this.filterByParameters(getManoeuvresUsed),
      safetyAndBalanceQuestions$: this.filterByParameters(getSafetyAndBalanceQuestions),
      independentDriving$: this.filterByParameters(getIndependentDrivingStats),
      showMeQuestions$: this.filterByParameters(getShowMeQuestions),
      tellMeQuestions$: this.filterByParameters(getTellMeQuestions),
      testCount$: this.filterByParameters(getStartedTestCount),
      outcomes$: this.filterByParameters(getOutcome),
      locationList$: this.filterByParameters(getLocations),
      categoryList$: this.filterByParameters(getCategories),
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
    if (!this.locationFilterOptions) {
      this.locationFilterOptions = [];
      let locationList = [];

      this.pageState.locationList$.subscribe(value => {
        locationList = value;
      }).unsubscribe();

      let tempArray: TestCentre[] = [];
      locationList.forEach((val) => {
        tempArray.push(val.item);
      });

      this.locationFilterOptions = tempArray;
      let mostUsed = this.setDefault(locationList);
      this.locationPlaceholder = mostUsed.item.centreName;
      this.handleLocationFilter(mostUsed.item);
    }
    if (!this.categoryFilterOptions) {
      this.categoryFilterOptions = [];
      let tempCatList = [];

      this.pageState.categoryList$.subscribe(value => {
        tempCatList = value;
      }).unsubscribe();

      let tempArray: TestCategory[] = [];
      tempCatList.forEach((val) => {
        tempArray.push(val.item);
      });

      this.categoryFilterOptions = tempArray;
      let mostUsed = this.setDefault(tempCatList);
      this.categoryPlaceholder = mostUsed.item;
      this.handleCategoryFilter(mostUsed.item);
    }
  }

  ionViewDidEnter() {
    this.store$.dispatch(ExaminerStatsViewDidEnter());
  }

  setDefault( data: { item: any, count: number }[]) {
    return data.reduce(function (max, obj) {
      return obj.count > max.count ? obj : max;
    });
  }

  handleGrid(object: ExaminerStatData[], indexLabel: string = null, useValueAsIndex: boolean = false) {
    if (indexLabel) {
      return object.map((val, index) =>
        [
          useValueAsIndex ? `${indexLabel} ${val.item}` : `${indexLabel}${index + 1} - ${val.item}`,
          val.count,
          val.percentage,
        ] as [string, number, string])
        .sort(([item1], [item2]) => this.getIndex(item1) - this.getIndex(item2));
    } else {
      return object
        .map((val) => ([val.item, val.count, val.percentage] as [string, number, string]))
        .sort(([item1], [item2]) => this.getIndex(item1) - this.getIndex(item2));
    }
  }

  private getIndex = (item: string) => {
    const regex = /[A-Za-z]{0,}(\d+)/;
    const match = item.match(regex);
    return match && match[1] ? Number(match[1]) : null;
  };

  handleDateFilter(event: CustomEvent) {
    this.dateFilter = event.detail?.value.display ?? null;
    this.rangeSubject$.next(event.detail?.value.val ?? null);
  }

  handleLocationFilter(event) {
    this.locationFilter = event.centreName ?? null;
    this.locationSubject$.next(event.centreId ?? null);
  }

  handleCategoryFilter(event) {
    this.categoryFilter = `Test category: ${event}`;
    this.categorySubject$.next(event ?? null);
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
      case 'DVSA':
        return this.colors.dvsa;
    }
  }

  headerSelect(slot1: string) {
    switch (this.filterOption) {
      default:
        return [];
      case 'Chart':
        return [slot1];
      case 'Both':
        return [slot1, 'Amount'];
      case 'Data':
        return [slot1, 'Amount', 'Percentage of total'];
    }
  }

  getTotal(routeGrid: (string | number)[][]) {
    let total: number = 0;
    routeGrid.forEach(value => {
      total += Number(value[1]);
    });
    return total;
  }
  calculateGraphHeight(data): number {
    let finalValue = data.length * 39;
    return finalValue < 300 ? 300 : finalValue;
  }
}
