import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getStartedTests, StartedTests } from '@store/tests/tests.selector';
import { ExaminerStatsViewDidEnter } from '@pages/examiner-stats/examiner-stats.actions';
import {
  ExaminerStatData,
  getCategories,
  getControlledStopCount,
  getIndependentDrivingStats,
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
import { isAnyOf } from '@shared/helpers/simplifiers';

interface ExaminerStatsState {
  routeNumbers$: Observable<ExaminerStatData<string>[]>;
  manoeuvres$: Observable<ExaminerStatData<string>[]>;
  showMeQuestions$: Observable<ExaminerStatData<string>[]>;
  tellMeQuestions$: Observable<ExaminerStatData<string>[]>;
  safetyAndBalanceQuestions$: Observable<ExaminerStatData<string>[]>;
  independentDriving$: Observable<ExaminerStatData<string>[]>;
  testCount$: Observable<number>;
  passPercentage$: Observable<string>;
  outcomes$: Observable<ExaminerStatData<string>[]>;
  locationList$: Observable<{ item: TestCentre, count: number }[]>;
  categoryList$: Observable<{ item: TestCategory, count: number }[]>;
  controlledStops$: Observable<ExaminerStatData<string>[]>;
}

export const enum ColourEnum {
  Default = 'Default',
  Monochrome = 'Monochrome',
  Navy = 'Navy',
  Amethyst = 'Amethyst',
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
    hideChart: boolean = false;
    colourOption: ColourEnum = ColourEnum.Default;
    colors: {
      default: { bar: string[], pie: string[] },
      monochrome: { bar: string[], pie: string[] },
      navy: string[],
      amethyst: string[],
    } = {
      default: {
        pie: [
          '#008FFB',
          '#ED6926',
          '#FF526F',
          '#007C42',
          '#a05195',
        ],
        bar: ['#008FFB'],
      },
      monochrome: {
        pie: ['#616161',
          '#757575',
          '#898989',
          '#bdbdbd',
          '#e0e0e0',
        ],
        bar: ['#777777'],
      },
      amethyst: [
        '#f95d6a',
        '#d45087',
        '#665191',
        '#2f4b7c',
        '#003f5c',
      ],
      navy: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#9070ff',
      ],
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
      {
        display: 'Default',
        val: null,
      },
      {
        display: 'Bar',
        val: 'bar',
      },
      {
        display: 'Pie',
        val: 'pie',
      },
    ];
    public dateFilter: string = 'Last 14 days';
    public locationFilter: string;
    public categoryDisplay: string;
    private currentCategory: string;

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
    ) => `${((comparatorCount / startedTestCount) * 100).toFixed(1)}%`;

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
        controlledStops$: this.filterByParameters(getStartedTestCount)
          .pipe(
            withLatestFrom(this.filterByParameters(getControlledStopCount)),
            map(([testCount, controllerStopCount]) => ([
              {
                item: 'Controlled stop',
                count: controllerStopCount,
                percentage: `${((controllerStopCount / testCount) * 100).toFixed(1)}%`,
              },
              {
                item: 'No controlled stop',
                count: testCount - controllerStopCount,
                percentage: `${(((testCount - controllerStopCount) / testCount) * 100).toFixed(1)}%`,
              },
            ])),
          ),        passPercentage$: this.filterByParameters(getStartedTestCount)
          .pipe(
            withLatestFrom(
              this.filterByParameters(getPassedTestCount),
            ),
            map(this.calculatePercentage),
          ),
      };

      this.setFilterLists();
    }

    ionViewDidEnter() {
      this.store$.dispatch(ExaminerStatsViewDidEnter());
    }

    setFilterLists() {
      if (!this.locationFilterOptions) {
        this.locationFilterOptions = [];
        let locationList = [];

        this.pageState.locationList$.subscribe(value => {
          locationList = value;
        })
          .unsubscribe();

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
        })
          .unsubscribe();

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

    setDefault(data: { item: any, count: number }[]) {
      return data.reduce(function (max, obj) {
        return obj.count > max.count ? obj : max;
      });
    }

    handleDateFilter(event: CustomEvent) {
      this.dateFilter = event.detail?.value.display ?? null;
      this.rangeSubject$.next(event.detail?.value.val ?? null);
    }

    handleLocationFilter(event) {
      this.locationFilter = event.centreName ?? null;
      this.locationSubject$.next(event.centreId ?? null);
    }

    handleCategoryFilter(event) {
      this.categoryDisplay = `Test category: ${event}`;
      this.currentCategory = event;
      this.categorySubject$.next(event ?? null);
    }

    handleChartFilter($event: any) {
      this.globalChartType = $event.detail.value;
    }

    colourSelect(chartType?: ChartType) {
      switch (this.colourOption) {
        default:
        case 'Default':
          if (chartType === 'bar') {
            return this.colors.default.bar;
          }
          return this.colors.default.pie;
        case 'Monochrome':
          if (chartType === 'bar') {
            return this.colors.monochrome.bar;
          }
          return this.colors.monochrome.pie;
        case 'Amethyst':
          return this.colors.amethyst;
        case 'Navy':
          return this.colors.navy;
      }
    }

    filterDataForGrid(examinerStatData: ExaminerStatData<any>[]) {
      return examinerStatData.map(obj => {
        return Object.values(obj);
      });
    }

    getTotal(value: ExaminerStatData<any>[]) {
      let total: number = 0;
      value.forEach((val) => {
        total += Number(val.count);
      });
      return total;
    }

    toggleChart() {
      this.hideChart = !this.hideChart;
    }

    getLabelColour(value: string[], type: 'bar' | 'pie') {
      if (value === this.colors.navy) {
        if (type === 'bar') {
          return '#FFFFFF';
        } else {
          return '#000000';
        }
      } else {
        return '#000000';
      }
    }

    showControlledStop() {
      return isAnyOf(this.currentCategory, [
        TestCategory.B,
        TestCategory.ADI2,
        TestCategory.F,
        TestCategory.G,
        TestCategory.H,
        TestCategory.K,
      ]);
    }

    getControlledStopData(): ExaminerStatData<string>[] {
      let testCount = 0;
      this.pageState.testCount$.subscribe(value => {
        testCount = value;
      });

      return [
        {
          item: 'Controlled stop',
          count: this.controlledStopTotal,
          percentage: `${((this.controlledStopTotal / testCount) * 100).toFixed(1)}%`,
        },
        {
          item: 'No controlled stop',
          count: testCount - this.controlledStopTotal,
          percentage: `${(((testCount - this.controlledStopTotal) / testCount) * 100).toFixed(1)}%`,
        },
      ];
    }
}
