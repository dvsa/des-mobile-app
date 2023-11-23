import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getStartedTests, StartedTests } from '@store/tests/tests.selector';
import {
  AccordionChanged,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerStatsViewDidEnter,
  HideChartsChanged,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-stats/examiner-stats.actions';
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
import { mockLocalData } from '@pages/examiner-stats/__mocks__/test-result.mock';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { Router } from '@angular/router';
import { selectColourScheme, selectHideCharts } from '@store/app-info/app-info.selectors';

type DESChartTypes = Extract<ChartType, 'bar' | 'pie'>;

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

  private static readonly BLACK = '#000000';
  private static readonly WHITE = '#FFFFFF';

  merged$: Observable<any>;
  form: UntypedFormGroup = new UntypedFormGroup({});
  rangeSubject$ = new BehaviorSubject<DateRange | null>(null);
  locationSubject$ = new BehaviorSubject<number | null>(null);
  categorySubject$ = new BehaviorSubject<TestCategory | null>(null);
  pageState: ExaminerStatsState;
  hideChart = this.store$.selectSignal(selectHideCharts)();
  colourOption = this.store$.selectSignal(selectColourScheme)();
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
  public defaultDate: { display: string; val: DateRange } = this.dateFilterOptions[2];
  public dateFilter: string = this.defaultDate.display;
  public locationFilter: string;
  public categoryDisplay: string;
  public currentCategory: string;
  accordionOpen: boolean = false;
  categorySelectPristine: boolean = true;
  currentTestCentre: TestCentre;
  locationSelectPristine: boolean = true;


  constructor(
    public store$: Store<StoreModel>,
    public router: Router,
  ) {
  }

  blurElement(event: EventTarget) {
    if (!((event as HTMLElement).id?.includes('input'))) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }

  private calculatePercentage = (
    [startedTestCount, comparatorCount],
  ) => `${((comparatorCount / startedTestCount) * 100).toFixed(1)}%`;

  // wrapper used to reduce/centralise code
  // take in a dynamic type, and a function with signature of fn(test, date)
  private filterByParameters = <T>(fn: (
    tests: StartedTests,
    range: DateRange,
    location: number,
    category: string,
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
      switchMap(([tests]) => of(fn(
        tests,
        this.rangeSubject$.value,
        this.locationSubject$.value,
        this.categorySubject$.value))),
    );

  ngOnInit(): void {
    this.handleDateFilter({ detail: { value: this.defaultDate } } as CustomEvent);

    this.pageState = {
      routeNumbers$: this.filterByParameters(getRouteNumbers),
      manoeuvres$: this.filterByParameters(getManoeuvresUsed),
      safetyAndBalanceQuestions$: this.filterByParameters(getSafetyAndBalanceQuestions),
      independentDriving$: this.filterByParameters(getIndependentDrivingStats),
      showMeQuestions$: this.filterByParameters(getShowMeQuestions),
      tellMeQuestions$: this.filterByParameters(getTellMeQuestions),
      testCount$: this.filterByParameters(getStartedTestCount),
      outcomes$: this.filterByParameters(getOutcome),
      locationList$: this.filterByParameters(getLocations)
        .pipe(
          tap((value) => {
            this.locationFilterOptions = [];

            value.forEach((val) => {
              this.locationFilterOptions.push(val.item);
            });

            if (!this.locationFilterOptions.map(({ centreId }) => centreId)
              .includes(this.locationSubject$.value)) {
              const mostUsed = this.setDefault(value);
              if (!!mostUsed) {
                this.locationPlaceholder = mostUsed.item.centreName;
                this.handleLocationFilter(mostUsed.item);
                this.locationSelectPristine = true;
              }
            }
          }),
        ),
      categoryList$: this.filterByParameters(getCategories)
        .pipe(
          tap((value: Omit<ExaminerStatData<TestCategory>, 'percentage'>[]) => {
            this.categoryFilterOptions = [];

            value.forEach((val) => {
              this.categoryFilterOptions.push(val.item);
            });

            if (!this.categoryFilterOptions.includes(this.categorySubject$.value)) {
              const mostUsed = this.setDefault(value);

              if (!!mostUsed) {
                this.categoryPlaceholder = mostUsed.item;
                this.handleCategoryFilter(mostUsed.item);
                this.categorySelectPristine = true;
              }
            }
          }),
        ),
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
        ),
      passPercentage$: this.filterByParameters(getStartedTestCount)
        .pipe(
          withLatestFrom(this.filterByParameters(getPassedTestCount)),
          map(this.calculatePercentage),
        ),
    };

    this.setLocationFilter();
  }

  ionViewDidEnter() {
    this.store$.dispatch(ExaminerStatsViewDidEnter());
  }

  setLocationFilter() {
    if (!this.locationFilterOptions) {
      this.locationFilterOptions = [];
      let mostUsed = null;

      this.pageState.locationList$.subscribe(value => {
        value.forEach((val) => {
          this.locationFilterOptions.push(val.item);
        });
        mostUsed = this.setDefault(value);
      })
        .unsubscribe();

      if (!!mostUsed) {
        this.locationPlaceholder = mostUsed.item.centreName;
        this.handleLocationFilter(mostUsed.item);
      }
    }
  }

  setDefault<T>(data: Omit<ExaminerStatData<T>, 'percentage'>[]): Omit<ExaminerStatData<T>, 'percentage'> {
    if (!data || data?.length === 0) {
      return null;
    }
    return data.reduce((max, obj) => (obj.count > max.count) ? obj : max);
  }

  handleDateFilter(event: CustomEvent): void {
    this.dateFilter = event.detail?.value.display ?? null;
    this.rangeSubject$.next(event.detail?.value.val ?? null);

    this.store$.dispatch(DateRangeChanged(this.dateFilter));
  }

  handleLocationFilter(event: TestCentre, ionSelectTriggered: boolean = false): void {
    if (ionSelectTriggered) {
      this.locationSelectPristine = false;
    }

    if (event && (event.centreName !== this.locationFilter)) {
      this.locationFilter = event.centreName ?? null;
      this.locationSubject$.next(event.centreId ?? null);
      this.currentTestCentre = event;

      this.store$.dispatch(LocationChanged(this.locationFilter));
    }
  }

  handleCategoryFilter(event: TestCategory, ionSelectTriggered: boolean = false): void {
    if (ionSelectTriggered) {
      this.categorySelectPristine = false;
    }
    if (this.categorySubject$.value !== event) {
      this.categoryDisplay = `Test category: ${event}`;
      this.currentCategory = event;
      this.categorySubject$.next(event ?? null);

      this.store$.dispatch(TestCategoryChanged(event));
    }
  }

  colourFilterChanged(colour: ColourEnum): void {
    this.colourOption = colour;
    this.store$.dispatch(ColourFilterChanged(colour));
  }

  toggleChart(): void {
    this.hideChart = !this.hideChart;
    this.store$.dispatch(HideChartsChanged(this.hideChart));
  }

  colourSelect(chartType?: ChartType): string[] {
    const charType: DESChartTypes = (chartType === 'bar') ? 'bar' : 'pie';

    switch (this.colourOption) {
      case ColourEnum.Monochrome:
        return this.colors.monochrome[charType];
      case ColourEnum.Amethyst:
        return this.colors.amethyst;
      case ColourEnum.Navy:
        return this.colors.navy;
      default:
        return this.colors.default[charType];
    }
  }

  filterDataForGrid<T>(examinerStatData: ExaminerStatData<T>[]): T[][] {
    if (!!examinerStatData) {
      return examinerStatData.map((obj) => Object.values(obj) as T[]);
    }
    return [[]];
  }

  getTotal = <T>(
    value: ExaminerStatData<T>[],
  ): number => value.reduce((total, val) => total + Number(val.count), 0);

  getLabelColour(value: string[], type: DESChartTypes) {
    if (value === this.colors.navy) {
      return (type === 'bar') ? ExaminerStatsPage.WHITE : ExaminerStatsPage.BLACK;
    }
    return ExaminerStatsPage.BLACK;
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

  accordionSelect() {
    this.accordionOpen = !this.accordionOpen;
    this.store$.dispatch(AccordionChanged(this.accordionOpen));
  }

  async goToDashboard(): Promise<void> {
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }
}
