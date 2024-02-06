import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
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
import {
  TestCentre,
} from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { Router } from '@angular/router';
import {
  selectCachedTests,
  selectColourScheme,
  selectHideCharts,
} from '@store/app-info/app-info.selectors';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { CompressionProvider } from '@providers/compression/compression';
import { SearchProvider } from '@providers/search/search';
import { getTests } from '@store/tests/tests.reducer';
import { getStartedTests } from '@store/tests/tests.selector';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { demonstrationMock } from '@pages/examiner-records/__mocks__/test-result.mock';
import {
  ColourEnum,
  DESChartTypes,
  ExaminerRecordsProvider,
  StaticColourScheme,
  VariableColourScheme,
} from '@providers/examiner-records/examiner-records';

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
  categoryPlaceholder: string;
  locationPlaceholder: string;
  locationFilterOptions: TestCentre[] = null;
  categoryFilterOptions: TestCategory[] = null;

  public defaultDate: { display: string; val: DateRange } = this.examinerRecordsProvider.dateFilterOptions[2];
  public dateFilter: string = this.defaultDate.display;
  public locationFilter: string;
  public categoryDisplay: string;
  public currentCategory: string;
  accordionOpen: boolean = false;
  categorySelectPristine: boolean = true;
  currentTestCentre: TestCentre;
  locationSelectPristine: boolean = true;
  public testResults: ExaminerRecordModel[];



  constructor(
    public store$: Store<StoreModel>,
    public router: Router,
    public compressionProvider: CompressionProvider,
    public orientationProvider: OrientationMonitorProvider,
    public accessibilityService: AccessibilityService,
    public examinerRecordsProvider: ExaminerRecordsProvider,
    public searchProvider: SearchProvider,
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
    tests: ExaminerRecordModel[],
    range: DateRange,
    location: number,
    category: string,
  ) => T): Observable<T> => combineLatest(
    [
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

  getResults(): ExaminerRecordModel[] {

    let result: ExaminerRecordModel[] = [];

    this.store$.pipe(
      select(getTests),
      map(getStartedTests),
      take(1),
      map(() => {
        return demonstrationMock;
      }),
      map((value) => Object.values(value)),
      map(value => {
        const recordArray: ExaminerRecordModel[] = [];
        value.forEach((test) => {
          recordArray.push(this.examinerRecordsProvider.formatForExaminerRecords(test));
        });
        return recordArray;
      })
    ).subscribe(value => {
      result= [
        ...result,
        ...value,
        // ...this.compressionProvider
        //   .extract(this.store$.selectSignal(selectCachedTests)() as string) as ExaminerRecordModel[],
      ];
    });
    console.log('online:', this.store$.selectSignal(selectCachedTests)());
    console.log('final Array:', result);

    return result;
  }

  async ngOnInit() {
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
        return this.examinerRecordsProvider.colours.monochrome[charType];
      case ColourEnum.Amethyst:
        return this.examinerRecordsProvider.colours.amethyst.colours;
      case ColourEnum.Navy:
        return this.examinerRecordsProvider.colours.navy.colours;
      default:
        return this.examinerRecordsProvider.colours.default[charType];
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
        return this.examinerRecordsProvider.colours.monochrome;
      case ColourEnum.Amethyst:
        return this.examinerRecordsProvider.colours.amethyst;
      case ColourEnum.Navy:
        return this.examinerRecordsProvider.colours.navy;
      default:
        return this.examinerRecordsProvider.colours.default;
    }
  }

  averageSelect(): string {
    switch (this.colourOption) {
      case ColourEnum.Monochrome:
        return this.examinerRecordsProvider.colours.monochrome.average;
      case ColourEnum.Amethyst:
        return this.examinerRecordsProvider.colours.amethyst.average;
      case ColourEnum.Navy:
        return this.examinerRecordsProvider.colours.navy.average;
      default:
        return this.examinerRecordsProvider.colours.default.average;
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
    if (value === this.examinerRecordsProvider.colours.navy) {
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
