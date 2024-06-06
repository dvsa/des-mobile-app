import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { StoreModel } from '@shared/models/store.model';
import {
  AccordionChanged,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerRecordsViewDidEnter,
  GetExaminerRecords,
  HideChartsChanged,
  LoadingExaminerRecords,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import {
  ExaminerRecordData,
  getBalanceQuestions,
  getCategories,
  getCircuits,
  getEligibleTests,
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
import { DateRange, DateTime } from '@shared/helpers/date-time';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { Router } from '@angular/router';
import {
  getIsLoadingRecords,
  selectCachedExaminerRecords,
  selectColourScheme,
  selectLastCachedDate,
} from '@store/examiner-records/examiner-records.selectors';
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
  ExaminerRecordsProvider,
  SelectableDateRange,
  ColourScheme,
} from '@providers/examiner-records/examiner-records';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { ScrollDetail } from '@ionic/core';

interface ExaminerRecordsState {
  cachedRecords$: Observable<ExaminerRecordModel[]>;
  isLoadingRecords$: Observable<boolean>;
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

  merged$: Observable<any>;
  form: UntypedFormGroup = new UntypedFormGroup({});
  testSubject$ = new BehaviorSubject<ExaminerRecordModel[] | null>(null);
  testsInRangeSubject$ = new BehaviorSubject<ExaminerRecordModel[] | null>(null);
  eligTestSubject$ = new BehaviorSubject<ExaminerRecordModel[] | null>(null);
  rangeSubject$ = new BehaviorSubject<DateRange | null>(null);
  locationSubject$ = new BehaviorSubject<number | null>(null);
  categorySubject$ = new BehaviorSubject<TestCategory | null>(null);
  pageState: ExaminerRecordsState;
  hideMainContent = false;
  colourOption: ColourScheme = this.getColour(this.store$.selectSignal(selectColourScheme)());
  categoryPlaceholder: string;
  locationPlaceholder: string;
  locationFilterOptions: TestCentre[] = null;
  categoryFilterOptions: TestCategory[] = null;
  cachedExaminerRecords: ExaminerRecordModel[] = null;
  startDateFilter: string;
  endDateFilter: string = new DateTime().format('DD/MM/YYYY');
  scrollValue: number = 0;
  isLoading: boolean = false;

  public defaultDate: SelectableDateRange = this.examinerRecordsProvider.localFilterOptions[2];
  public dateFilter: string = this.defaultDate.display;
  public locationFilter: string;
  public categoryDisplay: string;
  public currentCategory: string;
  accordionOpen: boolean = false;
  displayScrollBanner: boolean = false;
  categorySelectPristine: boolean = true;
  currentTestCentre: TestCentre;
  locationSelectPristine: boolean = true;
  showExpandedData: boolean = false;
  public testResults: ExaminerRecordModel[];
  subscription: Subscription;

  constructor(
    public store$: Store<StoreModel>,
    public router: Router,
    public compressionProvider: CompressionProvider,
    public orientationProvider: OrientationMonitorProvider,
    public accessibilityService: AccessibilityService,
    public examinerRecordsProvider: ExaminerRecordsProvider,
    public searchProvider: SearchProvider,
    private cdr: ChangeDetectorRef,
  ) {
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    this.displayScrollBanner = (ev.detail.scrollTop > 203)
  }

  /**
   * checks if user has already successfully cached examiner records today, if not, dispatches the effect to do so
   */
  async getOnlineRecords() {
    let staffNumber: string = '55555555';
    if (
      !this.store$.selectSignal(selectCachedExaminerRecords)() ||
      this.store$.selectSignal(selectLastCachedDate)() !== new DateTime().format('DD/MM/YYYY')
    ) {
      this.store$.dispatch(LoadingExaminerRecords());
      this.store$.dispatch(GetExaminerRecords(staffNumber));
    }
  }

  /**
   * get and save the tests we will use to get the data used for record cards
   */
  changeEligibleTests() {
    this.eligTestSubject$.next(
      getEligibleTests(
        this.testSubject$.value,
        this.categorySubject$.value,
        this.rangeSubject$.value,
        this.locationSubject$.value,
      ));
  }

  /**
   * get and save the tests that are within the selected date range
   */
  filterDates() {
    this.testsInRangeSubject$.next(
      getEligibleTests(
        this.testSubject$.value,
        null,
        this.rangeSubject$.value,
        null,
      ));
  }

  /**
   * wrapper used to reduce/centralise code
   * take in a dynamic type, and a function with signature of fn(tests, date, location, category)
   */
  getTestsByParameters = <T>(fn: (
    tests: ExaminerRecordModel[],
    category: string,
  ) => T,
  ): Observable<T> => combineLatest(
    [
      this.eligTestSubject$.asObservable(),
    ])
    .pipe(
      // return an observable using the generic `fn`
      switchMap(() => of(fn(
        this.eligTestSubject$.value,
        this.categorySubject$.value,
      ))),
    );

  /**
   * wrapper used to reduce/centralise code
   * take in a dynamic type, and a function with signature of fn(tests, date, location, category)
   */
  private getCategoriesByParameters = <T>(fn: (
    tests: ExaminerRecordModel[],
    range: DateRange,
    category: string,
    location: number,
  ) => T,
  ): Observable<T> => combineLatest(
    [
      this.locationSubject$.asObservable(),
      this.testsInRangeSubject$.asObservable(),

    ])
    .pipe(
      // return an observable using the generic `fn`
      switchMap(() => {
        return of(fn(
          this.testsInRangeSubject$.value,
          this.rangeSubject$.value,
          this.categorySubject$.value,
          this.locationSubject$.value,
        ));
      }),
    );
  /**
   * wrapper used to reduce/centralise code
   * take in a dynamic type, and a function with signature of fn(tests, date, location, category)
   */
  private getLocationsByParameters = <T>(fn: (
    tests: ExaminerRecordModel[],
    range: DateRange,
    category: string,
    location: number,
  ) => T,
  ): Observable<T> => combineLatest(
    [
      this.testsInRangeSubject$.asObservable(),
    ])
    .pipe(
      // return an observable using the generic `fn`
      switchMap(() => {
        return of(fn(
          this.testsInRangeSubject$.value,
          this.rangeSubject$.value,
          this.categorySubject$.value,
          this.locationSubject$.value,
        ));
      }),
    );

  /**
   * merge the local records pulled from the store with the cached online records, if they exist
   */
  mergeWithOnlineResults(localRecords: ExaminerRecordModel[], cachedExaminerRecords: ExaminerRecordModel[]) {
    this.cachedExaminerRecords = cachedExaminerRecords;

    return [
      ...localRecords,
      ...cachedExaminerRecords === null ? [] : cachedExaminerRecords,
    ];
  }

  /**
   * removes duplicate entries from an array and sort it's content by most recent
   */
  removeDuplicatesAndSort(result: ExaminerRecordModel[]) {
    //remove duplicates from array
    return result.filter((item, index, self) => {
      return self.findIndex(item2 => item2.appRef === item.appRef) === index;
    })
      //put final array in date order by most recent
      .sort((a, b) => {
        return Date.parse(b.startDate) - Date.parse(a.startDate);
      });
  }

  /**
   * Pull local tests from the store and perform the following functions
   * 1. Filter them so that we only use tests conducted by the examiner
   *    and not tests they rekeyed on other examiner's behalf.
   * 2. Format the tests into the ExaminerRecordModel format
   */
  getLocalResults(): ExaminerRecordModel[] {

    let result: ExaminerRecordModel[] = [];
    this.store$.pipe(
      select(getTests),
      map(getStartedTests),
      take(1),
      map(() => {
        return demonstrationMock;
      }),
      map((value) => Object.values(value)),
      map((value) => {
        //Filter out rekeyd tests for other users
        return value.filter((test) => (
          ([
            test.examinerBooked,
            test.examinerKeyed,
            test.examinerConducted,
          ].every((val, i, arr) => val === arr[0]))));
      }),
      map(value => {
        const recordArray: ExaminerRecordModel[] = [];
        //format tests into ExaminerRecordModel
        value.forEach((test) => {
          recordArray.push(this.examinerRecordsProvider.formatForExaminerRecords(test));
        });
        return recordArray;
      }),
    ).subscribe((value) => {
      result = value;
    }).unsubscribe();
    return result;
  }

  async ngOnInit() {
    this.testResults = this.removeDuplicatesAndSort(this.getLocalResults());
    if (this.testResults.length > 0) {
      this.testSubject$.next(this.testResults);
    }
    //Set default date
    this.handleDateFilter({ detail: { value: this.defaultDate } } as CustomEvent);
    if (!!this.categorySubject$.value) {
      this.categorySelectPristine = false;
    }
    if (!!this.locationSubject$.value) {
      this.locationSelectPristine = false;
    }

    this.pageState = {
      cachedRecords$: this.store$.select(selectCachedExaminerRecords),
      isLoadingRecords$: this.store$.select(getIsLoadingRecords),
      routeNumbers$: this.getTestsByParameters(getRouteNumbers),
      manoeuvres$: this.getTestsByParameters(getManoeuvresUsed),
      balanceQuestions$: this.getTestsByParameters(getBalanceQuestions),
      safetyQuestions$: this.getTestsByParameters(getSafetyQuestions),
      independentDriving$: this.getTestsByParameters(getIndependentDrivingStats),
      showMeQuestions$: this.getTestsByParameters(getShowMeQuestions),
      tellMeQuestions$: this.getTestsByParameters(getTellMeQuestions),
      testCount$: this.getTestsByParameters(getStartedTestCount),
      circuits$: this.getTestsByParameters(getCircuits),
      locationList$: this.getLocationsByParameters(getLocations)
        .pipe(
          tap((value) => {
            this.locationFilterOptions = [];

            //add every visited location to location array
            value.forEach((val) => {
              this.locationFilterOptions.push(val.item);
            });


            if (!this.locationFilterOptions.map(({ centreId }) => centreId)
              .includes(this.locationSubject$.value)) {
              //find most common location and set it as the default
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
      categoryList$: this.getCategoriesByParameters(getCategories)
        .pipe(
          tap((value: Omit<ExaminerRecordData<TestCategory>, 'percentage'>[]) => {
            this.categoryFilterOptions = [];

            //add every completed category to category array
            value.forEach((val) => {
              this.categoryFilterOptions.push(val.item);
            });

            if (!this.categoryFilterOptions.includes(this.categorySubject$.value)) {
              //find most common category and set it as the default
              const mostUsed = this.setDefault(value);

              if (!!mostUsed) {
                this.categoryPlaceholder = mostUsed.item;
                this.handleCategoryFilter(mostUsed.item);
                this.categorySelectPristine = true;
              }
            } else {
              this.changeEligibleTests();
            }
          }),
        ),
      emergencyStops$: this.getTestsByParameters(getStartedTestCount)
        .pipe(
          withLatestFrom(this.getTestsByParameters(getEmergencyStopCount)),
          //Turn emergency stop count into two objects containing tests with stops and tests without
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

    const {
      cachedRecords$,
      isLoadingRecords$,
    } = this.pageState;

    this.merged$ = merge(
      //listen for changes to test result and send the result to the behaviour subject
      cachedRecords$.pipe(tap((value) => {
        this.testResults = this.removeDuplicatesAndSort(this.mergeWithOnlineResults(this.testResults, value));
        if (this.testResults.length > 0) {
          this.testSubject$.next(this.testResults);
        }
      })),
      //deactivate loading ui when no longer loading
      isLoadingRecords$.pipe(map((value) => {
        this.examinerRecordsProvider.handleLoadingUI(value);
      })),
    );
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }

    this.setLocationFilter();
    await this.getOnlineRecords();
  }

  /**
   * deactivate subscriptions and listeners
   */
  async ionViewWillLeave(): Promise<void> {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    await ScreenOrientation.removeAllListeners();
  }

  /**
   * monitor orientation to manipulate graphs and fire analytics
   */
  async ionViewDidEnter() {
    this.store$.dispatch(ExaminerRecordsViewDidEnter());
    await this.orientationProvider.monitorOrientation();
  }

  /**
   * pull the list of the current locations where tests have been conducted, then sets the most common location
   * as the default
   */
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

  /**
   * Find the most used element in an array and return it
   */
  setDefault<T>(data: Omit<ExaminerRecordData<T>, 'percentage'>[]): Omit<ExaminerRecordData<T>, 'percentage'> {
    if (!data || data?.length === 0) {
      return null;
    }
    return data.reduce((max, obj) => (obj.count > max.count) ? obj : max);
  }

  /**
   * set date range filter to the event value and send that value to the behaviour subject
   */
  handleDateFilter(event: CustomEvent) {
    this.dateFilter = event.detail?.value.display ?? null;
    this.rangeSubject$.next(event.detail?.value.val ?? null);
    this.startDateFilter = this.examinerRecordsProvider.getRangeDate(event.detail?.value.val).format('DD/MM/YYYY');
    this.filterDates();

    this.store$.dispatch(DateRangeChanged(event.detail?.value));
  }

  /**
   * set the current location to the selected value, change relevant variables for
   * displaying the new value and send that value to the behaviour subject
   */
  handleLocationFilter(event: TestCentre, ionSelectTriggered: boolean = false) {
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

  /**
   * set the current category to the selected value, change relevant variables for
   * displaying the new value and send that value to the behaviour subject
   */
  handleCategoryFilter(event: TestCategory, ionSelectTriggered: boolean = false): void {
    if (ionSelectTriggered) {
      this.categorySelectPristine = false;
    }
    if (this.categorySubject$.value !== event) {
      this.categoryDisplay = `Test category: ${event}`;
      this.currentCategory = event;
      this.categorySubject$.next(event ?? null);
      this.changeEligibleTests();


      this.store$.dispatch(TestCategoryChanged(event));
    }
  }

  /**
   * set the current selected colourScheme to the selected value and send that value to the behaviour subject
   */
  colourFilterChanged(colour: ColourEnum) {
    this.store$.dispatch(ColourFilterChanged(colour));
    this.colourOption = this.getColour(colour);
    this.cdr.detectChanges();
  }

  /**
   * set the variables determining whether a card is expanded and the graphs are hidden
   */
  hideChart(): void {
    this.hideMainContent = !this.hideMainContent;
    this.showExpandedData = !this.showExpandedData;
    this.store$.dispatch(HideChartsChanged(this.hideMainContent));
  }

  /**
   * return the colour scheme associated with the name passed
   */
  getColour(colourOption: ColourEnum): ColourScheme {
    switch (colourOption) {
      case ColourEnum.Greyscale:
        return this.examinerRecordsProvider.colours.greyscale;
      default:
        return this.examinerRecordsProvider.colours.default;
    }
  }

  /**
   * returns whether the category uses optional emergency stop
   */
  showEmergencyStop() {
    return isAnyOf(this.currentCategory, [
      TestCategory.B,
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K,
    ]);
  }

  /**
   * toggle whether the accordion is open
   */
  accordionSelect() {
    this.accordionOpen = !this.accordionOpen;
    this.store$.dispatch(AccordionChanged(this.accordionOpen));
  }

  /**
   * Navigate back to dashboard
   */
  async goToDashboard(): Promise<void> {
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }

  /**
   * returns whether the current category is a mod1 test
   */
  public isMod1 = (): boolean => isAnyOf(this.currentCategory, [
    // Cat Mod1
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1,
  ]);

  /**
   * returns whether the current category is a bike test (mod1/mod2)
   */
  public isBike = (): boolean => isAnyOf(this.currentCategory, [
    // Cat Mod1
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1,
    // Cat Mod2
    TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2,
  ]);
}
