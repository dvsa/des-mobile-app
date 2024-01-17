import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { StoreModel } from '@shared/models/store.model';
import {
  AccordionChanged,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerRecordsViewDidEnter,
  ShowDataChanged,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import {
  ExaminerRecordData,
  getBalanceQuestions,
  getCategories,
  getCircuits,
  getEmergencyStopCount,
  getIndependentDrivingStats,
  getLocations,
  getManoeuvresUsed,
  getRouteNumbers,
  getSafetyQuestions,
  getShowMeQuestions,
  getStartedTestCount,
  getTellMeQuestions,
} from '@pages/examiner-records/examiner-records.selector';
import { DateRange } from '@shared/helpers/date-time';
import { ChartType } from 'ng-apexcharts';
import { IndependentDriving, TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { Router } from '@angular/router';
import {
  selectColourScheme,
  selectHideCharts,
} from '@store/app-info/app-info.selectors';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { ExaminerRecordsOnlineStub } from '@pages/examiner-records/__mocks__/online-stub.mock';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/C/partial';
import { Circuit } from '@dvsa/mes-test-schema/categories/AM1';

type DESChartTypes = Extract<ChartType, 'bar' | 'pie'>;

interface ExaminerRecordsState {
  routeNumbers$: Observable<ExaminerRecordData<string>[]>;
  manoeuvres$: Observable<ExaminerRecordData<string>[]>;
  showMeQuestions$: Observable<ExaminerRecordData<string>[]>;
  tellMeQuestions$: Observable<ExaminerRecordData<string>[]>;
  safetyQuestions$: Observable<ExaminerRecordData<string>[]>;
  balanceQuestions$: Observable<ExaminerRecordData<string>[]>;
  independentDriving$: Observable<ExaminerRecordData<string>[]>;
  testCount$: Observable<number>;
  locationList$: Observable<{ item: TestCentre, count: number }[]>;
  categoryList$: Observable<{ item: TestCategory, count: number }[]>;
  emergencyStops$: Observable<ExaminerRecordData<string>[]>;
  circuits$: Observable<ExaminerRecordData<string>[]>;
}

export const enum ColourEnum {
  Default = 'Default',
  Monochrome = 'Monochrome',
  Navy = 'Navy',
  Amethyst = 'Amethyst',
}

export interface SelectableDateRange {
  display: string;
  val: DateRange;
}

export interface ExaminerRecord {
  appRef: string,
  testCategory: TestCategory,
  testCentre: TestCentre,
  routeNumber: number,
  startDate: string,
  controlledStop: boolean,
  independentDriving: IndependentDriving,
  circuit: Circuit,
  safetyQuestions: QuestionResult[],
  balanceQuestions: QuestionResult[],
  manoeuvres: any,
  showMeQuestions: QuestionResult[],
  tellMeQuestions: QuestionResult[],
}

export interface StaticColourScheme { colours: string[], average: string }
export interface VariableColourScheme { bar: string[], pie: string[], average: string }
@Component({
  selector: 'examiner-records',
  templateUrl: './examiner-records.page.html',
  styleUrls: ['./examiner-records.page.scss'],
})
export class ExaminerRecordsPage implements OnInit {

  private static readonly BLACK = '#000000';
  private static readonly WHITE = '#FFFFFF';

  merged$: Observable<any>;
  form: UntypedFormGroup = new UntypedFormGroup({});
  rangeSubject$ = new BehaviorSubject<DateRange | null>(null);
  locationSubject$ = new BehaviorSubject<number | null>(null);
  categorySubject$ = new BehaviorSubject<TestCategory | null>(null);
  pageState: ExaminerRecordsState;
  showData = this.store$.selectSignal(selectHideCharts)();
  colourOption = this.store$.selectSignal(selectColourScheme)();
  colours: {
    default: VariableColourScheme,
    monochrome: VariableColourScheme,
    navy: StaticColourScheme,
    amethyst: StaticColourScheme,
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
      average: '#000000',
    },
    monochrome: {
      pie: ['#616161',
        '#757575',
        '#898989',
        '#bdbdbd',
        '#e0e0e0',
      ],
      bar: ['#777777'],
      average: '#000000',
    },
    amethyst: {
      colours: [
        '#f95d6a',
        '#d45087',
        '#665191',
        '#2f4b7c',
        '#003f5c',
      ],
      average: '#00FF00',
    },
    navy: {
      colours: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#9070ff',
      ],
      average: '#FF0000',
    },
  };
  categoryPlaceholder: string;
  locationPlaceholder: string;
  locationFilterOptions: TestCentre[] = null;
  categoryFilterOptions: TestCategory[] = null;
  dateFilterOptions: SelectableDateRange[] = [
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
  public testResults: ExaminerRecord[];



  constructor(
    public store$: Store<StoreModel>,
    public router: Router,
    public orientationProvider: OrientationMonitorProvider,
    public accessibilityService: AccessibilityService,
    public examinerRecordsOnlineStub : ExaminerRecordsOnlineStub,
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
    tests: ExaminerRecord[],
    range: DateRange,
    location: number,
    category: string,
  ) => T): Observable<T> => combineLatest(
    [
      // get the startedTests once per change detection cycle
      // this.store$.pipe(
      //   select(getTests),
      //   map(getStartedTests),
      //   map(() => {
      //     return demonstrationMock;
      //   }),
      //   take(1),
      // ),
      // listen for changes to the range
      this.rangeSubject$.asObservable(),
      this.locationSubject$.asObservable(),
      this.categorySubject$.asObservable(),
    ])
    .pipe(
      // return an observable using the generic `fn`
      switchMap(() => of(fn(
        this.testResults,
        this.rangeSubject$.value,
        this.locationSubject$.value,
        this.categorySubject$.value))),
    );

  getResults(): ExaminerRecord[] {
    return this.examinerRecordsOnlineStub.getResults(
      new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toString(),
      new Date(Date.now()).toString(),
      '1234567');
  }

  ngOnInit(): void {
    this.testResults = this.getResults();

    this.handleDateFilter({ detail: { value: this.defaultDate } } as CustomEvent);
    if (!!this.categorySubject$.value) {
      this.categorySelectPristine = false;
    }
    if (!!this.locationSubject$.value) {
      this.locationSelectPristine = false;
    }

    this.pageState = {
      routeNumbers$: this.filterByParameters(getRouteNumbers),
      manoeuvres$: this.filterByParameters(getManoeuvresUsed),
      balanceQuestions$: this.filterByParameters(getBalanceQuestions),
      safetyQuestions$: this.filterByParameters(getSafetyQuestions),
      independentDriving$: this.filterByParameters(getIndependentDrivingStats),
      showMeQuestions$: this.filterByParameters(getShowMeQuestions),
      tellMeQuestions$: this.filterByParameters(getTellMeQuestions),
      testCount$: this.filterByParameters(getStartedTestCount),
      circuits$: this.filterByParameters(getCircuits),
      locationList$: this.filterByParameters(getLocations)
        .pipe(
          tap((value) => {
            this.locationFilterOptions = [];

            console.log(value);

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
              } else if (value.length === 0) {
                this.locationPlaceholder = '';
                this.handleLocationFilter({ centreId: null, centreName: '', costCode: '' });
                this.locationSelectPristine = true;
              }
            }

          }),
        ),
      categoryList$: this.filterByParameters(getCategories)
        .pipe(
          tap((value: Omit<ExaminerRecordData<TestCategory>, 'percentage'>[]) => {
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
      emergencyStops$: this.filterByParameters(getStartedTestCount)
        .pipe(
          withLatestFrom(this.filterByParameters(getEmergencyStopCount)),
          map(([testCount, emergencyStopCount]) => ([
            {
              item: 'Stop',
              count: emergencyStopCount,
              percentage: `${((emergencyStopCount / testCount) * 100).toFixed(1)}%`,
            },
            {
              item: 'No stop',
              count: testCount - emergencyStopCount,
              percentage: `${(((testCount - emergencyStopCount) / testCount) * 100).toFixed(1)}%`,
            },
          ])),
        ),
    };

    this.setLocationFilter();
  }

  async ionViewDidEnter() {
    await this.orientationProvider.monitorOrientation();
    this.store$.dispatch(ExaminerRecordsViewDidEnter());
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

  setDefault<T>(data: Omit<ExaminerRecordData<T>, 'percentage'>[]): Omit<ExaminerRecordData<T>, 'percentage'> {
    if (!data || data?.length === 0) {
      return null;
    }
    return data.reduce((max, obj) => (obj.count > max.count) ? obj : max);
  }

  handleDateFilter(event: CustomEvent): void {
    this.dateFilter = event.detail?.value.display ?? null;
    this.rangeSubject$.next(event.detail?.value.val ?? null);

    this.store$.dispatch(DateRangeChanged(event.detail?.value));
  }

  handleLocationFilter(event: TestCentre, ionSelectTriggered: boolean = false): void {
    if (ionSelectTriggered) {
      this.locationSelectPristine = false;
    }

    if (event && (event.centreName !== this.locationFilter)) {
      this.locationFilter = event.centreName ?? null;
      this.locationSubject$.next(event.centreId ?? null);
      this.currentTestCentre = event;

      this.store$.dispatch(LocationChanged(event));
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

  toggleData(): void {
    this.showData = !this.showData;
    this.store$.dispatch(ShowDataChanged(this.showData));
  }

  colourSelect(chartType?: ChartType): string[] {
    const charType: DESChartTypes = (chartType === 'bar') ? 'bar' : 'pie';

    switch (this.colourOption) {
      case ColourEnum.Monochrome:
        return this.colours.monochrome[charType];
      case ColourEnum.Amethyst:
        return this.colours.amethyst.colours;
      case ColourEnum.Navy:
        return this.colours.navy.colours;
      default:
        return this.colours.default[charType];
    }
  }

  public isBike = (): boolean => isAnyOf(this.currentCategory, [
    // Cat Mod1
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1,
    // Cat Mod2
    TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2,
  ]);

  getColour(): { bar: string[], pie: string[], average: string } | { colours: string[], average: string } {
    switch (this.colourOption) {
      case ColourEnum.Monochrome:
        return this.colours.monochrome;
      case ColourEnum.Amethyst:
        return this.colours.amethyst;
      case ColourEnum.Navy:
        return this.colours.navy;
      default:
        return this.colours.default;
    }
  }

  averageSelect(): string {
    switch (this.colourOption) {
      case ColourEnum.Monochrome:
        return this.colours.monochrome.average;
      case ColourEnum.Amethyst:
        return this.colours.amethyst.average;
      case ColourEnum.Navy:
        return this.colours.navy.average;
      default:
        return this.colours.default.average;
    }
  }

  filterDataForGrid<T>(examinerRecordData: ExaminerRecordData<T>[]): T[][] {
    if (!!examinerRecordData) {
      return examinerRecordData.map((obj) => Object.values(obj) as T[]);
    }
    return [[]];
  }

  getTotal = <T>(
    value: ExaminerRecordData<T>[],
  ): number => value.reduce((total, val) => total + Number(val.count), 0);

  getLabelColour(value: VariableColourScheme | StaticColourScheme, type: DESChartTypes) {
    if (value === this.colours.navy) {
      return (type === 'bar') ? ExaminerRecordsPage.WHITE : ExaminerRecordsPage.BLACK;
    }
    return ExaminerRecordsPage.BLACK;
  }

  showEmergencyStop() {
    return isAnyOf(this.currentCategory, [
      TestCategory.B,
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
