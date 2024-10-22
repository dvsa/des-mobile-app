import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ScrollDetail } from '@ionic/core';
import { Store, select } from '@ngrx/store';
import { ExaminerReportsCardClick } from '@pages/examiner-records/components/examiner-reports-card/examiner-reports-card';
import {
  ClickDataCard,
  ColourFilterChanged,
  DateRangeChanged,
  DisplayPartialBanner,
  ExaminerRecordsViewDidEnter,
  GetExaminerRecords,
  HideChartsChanged,
  LoadingExaminerRecords,
  LocationChanged,
  ReturnToDashboardPressed,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import {
  ExaminerRecordData,
  ExaminerRecordDataWithPercentage,
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
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { CompressionProvider } from '@providers/compression/compression';
import {
  ColourEnum,
  ColourScheme,
  ExaminerRecordsProvider,
  SelectableDateRange,
} from '@providers/examiner-records/examiner-records';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { SearchProvider } from '@providers/search/search';
import { DateRange, DateTime } from '@shared/helpers/date-time';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { StoreModel } from '@shared/models/store.model';
import { selectEmployeeId } from '@store/app-info/app-info.selectors';
import {
  getIsLoadingRecords,
  selectCachedExaminerRecords,
  selectColourScheme,
  selectLastCachedDate,
} from '@store/examiner-records/examiner-records.selectors';
import { getTests } from '@store/tests/tests.reducer';
import { getStartedTests } from '@store/tests/tests.selector';
import { BehaviorSubject, Observable, Subscription, combineLatest, merge, of } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

export interface ExaminerRecordsPageStateData {
  routeGrid: ExaminerRecordDataWithPercentage<string>[];
  manoeuvresGrid: ExaminerRecordDataWithPercentage<string>[];
  showMeQuestionsGrid: ExaminerRecordDataWithPercentage<string>[];
  independentDrivingGrid: ExaminerRecordDataWithPercentage<string>[];
  tellMeQuestionsGrid: ExaminerRecordDataWithPercentage<string>[];
  safetyGrid: ExaminerRecordDataWithPercentage<string>[];
  balanceGrid: ExaminerRecordDataWithPercentage<string>[];
  testCount: number;
  emergencyStops: ExaminerRecordDataWithPercentage<string>[];
  circuits: ExaminerRecordDataWithPercentage<string>[];
  locationList: ExaminerRecordData<TestCentre>[];
  categoryList: ExaminerRecordData<TestCategory>[];
}

interface ExaminerRecordsState {
  cachedRecords$: Observable<ExaminerRecordModel[]>;
  isLoadingRecords$: Observable<boolean>;
  routeNumbers$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
  manoeuvres$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
  showMeQuestions$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
  tellMeQuestions$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
  safetyQuestions$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
  balanceQuestions$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
  independentDriving$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
  testCount$: Observable<number>;
  locationList$: Observable<ExaminerRecordData<TestCentre>[]>;
  categoryList$: Observable<ExaminerRecordData<TestCategory>[]>;
  emergencyStops$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
  circuits$: Observable<ExaminerRecordDataWithPercentage<string>[]>;
}

@Component({
  selector: 'examiner-records',
  templateUrl: './examiner-records.page.html',
  styleUrls: ['./examiner-records.page.scss'],
})
export class ExaminerRecordsPage implements OnInit {
  merged$: Observable<any>;
  form: UntypedFormGroup = new UntypedFormGroup({});
  testSubject$: BehaviorSubject<ExaminerRecordModel[]> = new BehaviorSubject<ExaminerRecordModel[]>(null);
  testsInRangeSubject$: BehaviorSubject<ExaminerRecordModel[]> = new BehaviorSubject<ExaminerRecordModel[]>(null);
  eligTestSubject$: BehaviorSubject<ExaminerRecordModel[]> = new BehaviorSubject<ExaminerRecordModel[]>(null);
  rangeSubject$: BehaviorSubject<DateRange> = new BehaviorSubject<DateRange>(null);
  locationSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  categorySubject$: BehaviorSubject<TestCategory> = new BehaviorSubject<TestCategory>(null);
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
  isLoading = false;

  public defaultDate: SelectableDateRange = this.examinerRecordsProvider.localFilterOptions[2];
  public dateFilter: string = this.defaultDate.display;
  public locationFilter: TestCentre = { centreName: null, centreId: null, costCode: null };
  public categoryDisplay: string;
  public currentCategory: string;
  accordionOpen = false;
  displayScrollBanner = false;
  categorySelectPristine = true;
  currentTestCentre: TestCentre;
  locationSelectPristine = true;
  showExpandedData = false;
  public testResults: ExaminerRecordModel[];
  subscription: Subscription;

  labelColour: string = this.getColourSchemeDefault('Opposing');
  strokeColour: string = this.getColourSchemeDefault('Main');
  dataLabelBackgroundColour: string = this.getColourSchemeDefault('Opposing');
  averageColour: string = this.getColourSchemeDefault('Opposing');
  dataLabelFontColour: string = this.getColourSchemeDefault('Main');

  darkModeListener: EventListener = null;
  windowMedia: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(
    public store$: Store<StoreModel>,
    public router: Router,
    public compressionProvider: CompressionProvider,
    public orientationProvider: OrientationMonitorProvider,
    public accessibilityService: AccessibilityService,
    public examinerRecordsProvider: ExaminerRecordsProvider,
    public searchProvider: SearchProvider,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Retrieves the default color scheme value based on the specified color type.
   *
   * This method uses the `getComputedStyle` function to get the value of CSS variables
   * that define the main and opposing colors of the current theme. If the specified color type
   * is not recognized, it returns a default color value of white.
   *
   * @param {'Main' | 'Opposing'} colourNeeded - The type of color needed ('Main' or 'Opposing').
   * @returns {string} The color value associated with the specified color type.
   */
  getColourSchemeDefault(colourNeeded: 'Main' | 'Opposing'): string {
    //Switch has been commented out to force light mode,
    // comment back in and delete the switch below if dark mode is fully integrated
    // switch (colourNeeded) {
    //   case 'Main':
    //     return getComputedStyle(document.documentElement).getPropertyValue('--mes-theme-main-colour').trim();
    //   case 'Opposing':
    //     return getComputedStyle(document.documentElement).getPropertyValue('--mes-theme-opposing-colour').trim();
    //   default:
    //     return getComputedStyle(document.documentElement).getPropertyValue('--gds-white').trim();
    // }
    switch (colourNeeded) {
      case 'Main':
        return getComputedStyle(document.documentElement).getPropertyValue('--gds-white').trim();
      case 'Opposing':
        return getComputedStyle(document.documentElement).getPropertyValue('--gds-black').trim();
      default:
        return getComputedStyle(document.documentElement).getPropertyValue('--gds-white').trim();
    }
  }

  /**
   * Listens for changes in the user's device theme (dark mode) and updates
   * the component's color properties accordingly.
   *
   * This method uses the `matchMedia` API to detect changes to the `prefers-color-scheme` media query.
   * When the user switches to dark mode or light mode, the color properties of the component are updated
   * to reflect the appropriate device theme.
   */
  listenForDarkMode(): void {
    this.darkModeListener = () => {
      this.labelColour = this.getColourSchemeDefault('Opposing');
      this.strokeColour = this.getColourSchemeDefault('Main');
      this.dataLabelBackgroundColour = this.getColourSchemeDefault('Opposing');
      this.averageColour = this.getColourSchemeDefault('Opposing');
      this.dataLabelFontColour = this.getColourSchemeDefault('Main');
    };
    this.windowMedia.addEventListener('change', this.darkModeListener);
  }

  /**
   * Handles the scroll event and updates the displayScrollBanner property.
   *
   * This method is triggered when a scroll event occurs. It checks the scroll position
   * and sets the displayScrollBanner property to true if the scroll position is greater
   * than 203 pixels, otherwise sets it to false.
   *
   * @param {CustomEvent<ScrollDetail>} ev - The scroll event containing the scroll details.
   */
  handleScroll(ev: CustomEvent<ScrollDetail>) {
    this.displayScrollBanner = ev.detail.scrollTop > 203;
  }

  /**
   * Fetches online examiner records if they have not been cached today.
   *
   * This method checks if the examiner records have already been cached for today.
   * If not, it dispatches actions to load the examiner records from the online source.
   *
   * @returns {Promise<void>} A promise that resolves when the records have been checked and potentially fetched.
   **/
  async getOnlineRecords(): Promise<void> {
    if (
      !this.store$.selectSignal(selectCachedExaminerRecords)() ||
      this.store$.selectSignal(selectLastCachedDate)() !== new DateTime().format('DD/MM/YYYY')
    ) {
      const staffNumber: string = this.store$.selectSignal(selectEmployeeId)();
      this.store$.dispatch(LoadingExaminerRecords());
      this.store$.dispatch(GetExaminerRecords(staffNumber));
    }
  }

  /**
   * Updates the eligible tests based on the current filter criteria.
   *
   * This method retrieves the eligible tests using the current values of
   * `testSubject$`, `categorySubject$`, `rangeSubject$`, and `locationSubject$`,
   * and updates the `eligTestSubject$` with the filtered results.
   */
  changeEligibleTests() {
    this.eligTestSubject$.next(
      getEligibleTests(
        this.testSubject$.value,
        this.categorySubject$.value,
        this.rangeSubject$.value,
        this.locationSubject$.value
      )
    );
  }

  /**
   * Filters and updates the tests that are within the selected date range.
   *
   * This method retrieves the eligible tests using the current values of
   * `testSubject$` and `rangeSubject$`, and updates the `testsInRangeSubject$`
   * with the filtered results.
   */
  filterDates() {
    this.testsInRangeSubject$.next(getEligibleTests(this.testSubject$.value, null, this.rangeSubject$.value, null));
  }

  /**
   * Retrieves and processes eligible tests based on the provided function and current category.
   *
   * This method combines the latest values from `eligTestSubject$` and applies the provided function `fn`
   * to the eligible tests and current category, returning the result as an observable.
   *
   * @template T The type of the result returned by the provided function `fn`.
   * @param {function(ExaminerRecordModel[], string): T} fn - The function to apply to the eligible tests
   * and current category.
   * @returns {Observable<T>} An observable that emits the result of applying the function `fn` to the
   * eligible tests and current category.
   */
  getTestsByParameters = <T>(fn: (tests: ExaminerRecordModel[], category: string) => T): Observable<T> =>
    combineLatest([this.eligTestSubject$.asObservable()]).pipe(
      // return an observable using the generic `fn`
      switchMap(() => of(fn(this.eligTestSubject$.value, this.categorySubject$.value)))
    );

  /**
   * Wrapper used to reduce/centralize code.
   * Takes in a dynamic type and a function with the signature `fn(tests, date, location, category)`.
   *
   * This method combines the latest values from `locationSubject$` and `testsInRangeSubject$`,
   * and applies the provided function `fn` to the eligible tests, date range, category, and location,
   * returning the result as an observable.
   *
   * @template T The type of the result returned by the provided function `fn`.
   * @param {function(ExaminerRecordModel[], DateRange, string, number): T} fn - The function to apply to the eligible
   * tests, date range, category, and location.
   * @returns {Observable<T>} An observable that emits the result of applying the function `fn` to the eligible tests,
   * date range, category, and location.
   */
  private getCategoriesByParameters = <T>(
    fn: (tests: ExaminerRecordModel[], range: DateRange, category: string, location: number) => T
  ): Observable<T> =>
    combineLatest([this.locationSubject$.asObservable(), this.testsInRangeSubject$.asObservable()]).pipe(
      // return an observable using the generic `fn`
      switchMap(() => {
        return of(
          fn(
            this.testsInRangeSubject$.value,
            this.rangeSubject$.value,
            this.categorySubject$.value,
            this.locationSubject$.value
          )
        );
      })
    );

  /**
   * Wrapper used to reduce/centralize code.
   * Takes in a dynamic type and a function with the signature `fn(tests, date, location, category)`.
   *
   * This method combines the latest values from `testsInRangeSubject$`,
   * and applies the provided function `fn` to the eligible tests, date range, category, and location,
   * returning the result as an observable.
   *
   * @template T The type of the result returned by the provided function `fn`.
   * @param {function(ExaminerRecordModel[], DateRange, string, number): T} fn - The function to apply to the eligible
   * tests, date range, category, and location.
   * @returns {Observable<T>} An observable that emits the result of applying the function `fn` to the eligible tests,
   * date range, category, and location.
   */
  getLocationsByParameters = <T>(
    fn: (tests: ExaminerRecordModel[], range: DateRange, category: string, location: number) => T
  ): Observable<T> =>
    combineLatest([this.testsInRangeSubject$.asObservable()]).pipe(
      // return an observable using the generic `fn`
      switchMap(() => {
        return of(
          fn(
            this.testsInRangeSubject$.value,
            this.rangeSubject$.value,
            this.categorySubject$.value,
            this.locationSubject$.value
          )
        );
      })
    );

  /**
   * Merges local records with cached online records.
   *
   * This method combines the local records with the cached online records.
   * If there are no cached online records, it dispatches an action to display a partial banner.
   *
   * @param {ExaminerRecordModel[]} localRecords - The local records to be merged.
   * @param {ExaminerRecordModel[]} cachedExaminerRecords - The cached online records to be merged.
   * @returns {ExaminerRecordModel[]} The merged array of local and cached online records.
   */
  mergeWithOnlineResults(
    localRecords: ExaminerRecordModel[],
    cachedExaminerRecords: ExaminerRecordModel[]
  ): ExaminerRecordModel[] {
    this.cachedExaminerRecords = cachedExaminerRecords;
    if (!this.cachedExaminerRecords) {
      this.store$.dispatch(DisplayPartialBanner());
    }

    return [...localRecords, ...(cachedExaminerRecords === null ? [] : cachedExaminerRecords)];
  }

  /**
   * Removes duplicate entries from an array and sorts the content by the most recent date.
   *
   * This method filters out duplicate entries in the provided array based on the `appRef` property
   * and then sorts the remaining entries in descending order by the `startDate` property.
   *
   * @param {ExaminerRecordModel[]} result - The array of examiner records to be processed.
   * @returns {ExaminerRecordModel[]} The filtered and sorted array of examiner records.
   */
  removeDuplicatesAndSort(result: ExaminerRecordModel[]): ExaminerRecordModel[] {
    //remove duplicates from array
    return (
      result
        .filter((item, index, self) => {
          return self.findIndex((item2) => item2.appRef === item.appRef) === index;
        })
        //put final array in date order by most recent
        .sort((a, b) => {
          return Date.parse(b.startDate) - Date.parse(a.startDate);
        })
    );
  }

  /**
   * Pulls local tests from the store and performs the following functions:
   * 1. Filters them so that only tests conducted by the examiner are used,
   *    excluding tests they rekeyed on other examiner's behalf.
   * 2. Formats the tests into the ExaminerRecordModel format.
   *
   * @returns {ExaminerRecordModel[]} The array of formatted examiner records.
   */
  getLocalResults(): ExaminerRecordModel[] {
    let result: ExaminerRecordModel[] = [];
    this.store$
      .pipe(
        select(getTests),
        map(getStartedTests),
        take(1),
        map((value) => Object.values(value)),
        map((value) => {
          const employeeId = this.store$.selectSignal(selectEmployeeId)();
          //Filter out tests the user rekeyd for other users
          return value.filter((test) => {
            return test?.examinerConducted ? test.examinerConducted.toString() === employeeId : true;
          });
        }),
        map((value) => {
          const recordArray: ExaminerRecordModel[] = [];
          //format tests into ExaminerRecordModel
          value.forEach((test) => {
            recordArray.push(this.examinerRecordsProvider.formatForExaminerRecords(test));
          });
          return recordArray;
        })
      )
      .subscribe((value) => {
        result = value;
      })
      .unsubscribe();
    return result;
  }

  /**
   * Sets up the category select list with the provided values.
   *
   * This method performs the following actions:
   * 1. Initializes the `categoryFilterOptions` array.
   * 2. Adds every completed category to the `categoryFilterOptions` array.
   * 3. Checks if the current category is included in the `categoryFilterOptions`.
   *    - If not, finds the most common category and sets it as the default.
   *    - If yes, calls `changeEligibleTests` to update the eligible tests.
   *
   * @param {ExaminerRecordData<TestCategory>[]} categories - The array of category data to
   * set up the select list.
   */
  setupCategorySelectList(categories: ExaminerRecordData<TestCategory>[]) {
    this.categoryFilterOptions = [];

    //add every completed category to category array
    this.categoryFilterOptions = categories.map((val) => val.item);

    if (!this.categoryFilterOptions.includes(this.categorySubject$.value)) {
      //find most common category and set it as the default
      const mostUsed: ExaminerRecordData<TestCategory> = this.setDefault(categories);

      if (mostUsed) {
        this.categoryPlaceholder = mostUsed.item;
        this.handleCategoryFilter(mostUsed.item);
        this.categorySelectPristine = true;
      }
    } else {
      this.changeEligibleTests();
    }
  }

  /**
   * Sets up the location select list with the provided values.
   *
   * This method performs the following actions:
   * 1. Initializes the `locationFilterOptions` array.
   * 2. Adds every visited location to the `locationFilterOptions` array.
   * 3. Checks if the current location is included in the `locationFilterOptions`.
   *    - If not, finds the most common location and sets it as the default.
   *
   * @param {ExaminerRecordData<TestCentre>[]} locations - The array of location data to
   * set up the select list.
   */
  setupLocationSelectList(locations: ExaminerRecordData<TestCentre>[]) {
    this.locationFilterOptions = [];

    //add every visited location to location array
    locations.forEach((val: ExaminerRecordData<TestCentre>) => {
      if (!val.item?.centreName) {
        // Should there be no centre name available, display cost code or centre id,
        // depending on whether cost code is available
        val.item = {
          ...val.item,
          centreName: `Limited details - ${val.item.costCode ? val.item.costCode : val.item.centreId.toString()}`,
        };
      }
      this.locationFilterOptions.push(val.item);
    });

    if (!this.locationFilterOptions.map(({ centreId }) => centreId).includes(this.locationSubject$.value)) {
      //find most common location and set it as the default
      const mostUsed: ExaminerRecordData<TestCentre> = this.setDefault(locations);
      if (mostUsed) {
        this.locationPlaceholder = mostUsed.item.centreName;
        this.handleLocationFilter(mostUsed.item);
        this.locationSelectPristine = true;
      } else if (locations.length === 0) {
        this.locationPlaceholder = '';
        this.handleLocationFilter({ centreId: null, centreName: '', costCode: '' });
        this.locationSelectPristine = true;
      }
    }
  }

  /**
   * Initializes the component and sets up the necessary data and subscriptions.
   *
   * This method performs the following actions:
   * 1. Retrieves and sorts local test results.
   * 2. Sets the default date filter.
   * 3. Initializes the page state with various observables.
   * 4. Sets up subscriptions to handle changes in test results and loading state.
   * 5. Sets the location filter and fetches online records if necessary.
   *
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async ngOnInit(): Promise<void> {
    //Commented out to force light mode, comment back in if dark mode is fully integrated
    this.listenForDarkMode();
    this.testResults = this.removeDuplicatesAndSort(this.getLocalResults());
    if (this.testResults.length > 0) {
      this.testSubject$.next(this.testResults);
    }
    //Set default date
    this.handleDateFilter({ detail: { value: this.defaultDate } } as CustomEvent);
    if (this.categorySubject$.value) {
      this.categorySelectPristine = false;
    }
    if (this.locationSubject$.value) {
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
      locationList$: this.getLocationsByParameters(getLocations).pipe(
        tap((value: ExaminerRecordData<TestCentre>[]) => {
          this.setupLocationSelectList(value);
        })
      ),
      categoryList$: this.getCategoriesByParameters(getCategories).pipe(
        tap((value: ExaminerRecordData<TestCategory>[]) => {
          this.setupCategorySelectList(value);
        })
      ),
      emergencyStops$: this.getTestsByParameters(getStartedTestCount).pipe(
        withLatestFrom(this.getTestsByParameters(getEmergencyStopCount)),
        //Turn emergency stop count into two objects containing tests with stops and tests without
        map(([testCount, emergencyStopCount]) => [
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
        ])
      ),
    };

    const { cachedRecords$, isLoadingRecords$ } = this.pageState;

    this.merged$ = merge(
      //listen for changes to test result and send the result to the behaviour subject
      cachedRecords$.pipe(
        tap((value) => {
          this.testResults = this.removeDuplicatesAndSort(this.mergeWithOnlineResults(this.testResults, value));
          if (this.testResults.length > 0) {
            this.testSubject$.next(this.testResults);
          }
        })
      ),
      //deactivate loading ui when no longer loading
      isLoadingRecords$.pipe(
        map((value) => {
          this.examinerRecordsProvider.handleLoadingUI(value);
        })
      )
    );
    if (this.merged$) {
      this.subscription = this.merged$.subscribe();
    }

    this.setLocationFilter();
    await this.getOnlineRecords();
  }

  /**
   * Deactivates subscriptions and listeners when the view is about to leave.
   *
   * This method performs the following actions:
   * 1. Unsubscribes from the current subscription if it exists.
   * 2. Removes all listeners from the ScreenOrientation.
   *
   * @returns {Promise<void>} A promise that resolves when the cleanup is complete.
   */
  async ionViewWillLeave(): Promise<void> {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    await ScreenOrientation.removeAllListeners();
    this.windowMedia.removeAllListeners();
  }

  /**
   * Dispatches the ExaminerRecordsViewDidEnter action and monitors screen orientation.
   *
   * This method performs the following actions:
   * 1. Dispatches the ExaminerRecordsViewDidEnter action to the store.
   * 2. Calls the monitorOrientation method of the orientationProvider to start monitoring screen orientation changes.
   *
   * @returns {Promise<void>} A promise that resolves when the orientation monitoring is complete.
   */
  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(ExaminerRecordsViewDidEnter());
    await this.orientationProvider.monitorOrientation();
  }

  /**
   * Pulls the list of the current locations where tests have been conducted, then sets the most common location
   * as the default.
   *
   * This method performs the following actions:
   * 1. Initializes the location filter options if they are not already set.
   * 2. Subscribes to the location list observable and populates the location filter options.
   * 3. Determines the most used location and sets it as the default.
   */
  setLocationFilter() {
    if (!this.locationFilterOptions) {
      this.locationFilterOptions = [];
      let mostUsed = null;

      this.pageState.locationList$
        .subscribe((value) => {
          //populate location filter options
          this.locationFilterOptions = value.map((val) => val.item);
          //find most common location and set it as the default
          mostUsed = this.setDefault(value);
        })
        .unsubscribe();

      if (mostUsed) {
        this.locationPlaceholder = mostUsed.item.centreName;
        this.handleLocationFilter(mostUsed.item);
      }
    }
  }

  /**
   * Find the most used element in an array and return it.
   *
   * This method performs the following actions:
   * 1. Checks if the input data array is null or empty.
   * 2. Uses the reduce function to find the element with the highest count.
   *
   * @template T The type of the elements in the data array.
   * @param {ExaminerRecordData<T>[]} data - The array of data elements to search.
   * @returns {ExaminerRecordData<T>} The element with the highest count, or null if the
   * input data is null or empty.
   */
  setDefault<T>(data: ExaminerRecordData<T>[]): ExaminerRecordData<T> {
    if (!data || data?.length === 0) {
      return null;
    }
    return data.reduce((max, obj) => (obj.count > max.count ? obj : max));
  }

  /**
   * Sets the date range filter to the event value and sends that value to the behavior subject.
   *
   * This method performs the following actions:
   * 1. Updates the `dateFilter` with the display value from the event.
   * 2. Updates the `rangeSubject$` with the value from the event.
   * 3. Formats and sets the `startDateFilter` using the range value from the event.
   * 4. Filters the tests based on the updated date range.
   * 5. Dispatches the `DateRangeChanged` action to the store with the event value.
   *
   * @param {CustomEvent} event - The event containing the new date range value.
   */
  handleDateFilter(event: CustomEvent) {
    this.dateFilter = event.detail?.value.display ?? null;
    this.rangeSubject$.next(event.detail?.value.val ?? null);
    this.startDateFilter = this.examinerRecordsProvider.getRangeDate(event.detail?.value.val).format('DD/MM/YYYY');
    this.filterDates();

    this.store$.dispatch(DateRangeChanged(event.detail?.value));
  }

  /**
   * Sets the current location to the selected value, updates relevant variables for
   * displaying the new value, and sends that value to the behavior subject.
   *
   * This method performs the following actions:
   * 1. Sets `locationSelectPristine` to false if the selection was triggered by the user.
   * 2. Updates the `locationFilter` and `currentTestCentre` with the selected location if it is different
   * from the current one.
   * 3. Sends the selected location's ID to the `locationSubject$` behavior subject.
   * 4. Dispatches the `LocationChanged` action to the store with the selected location.
   *
   * @param {TestCentre} event - The selected location.
   * @param {boolean} [ionSelectTriggered=false] - Indicates if the selection was triggered by the user.
   */
  handleLocationFilter(event: TestCentre, ionSelectTriggered = false) {
    if (ionSelectTriggered) {
      this.locationSelectPristine = false;
    }

    if (event && event.centreId !== this.locationFilter.centreId) {
      this.locationFilter = event;
      this.locationSubject$.next(event.centreId ?? null);
      this.currentTestCentre = event;

      this.store$.dispatch(LocationChanged(event));
    }
  }

  /**
   * Sets the current category to the selected value, updates relevant variables for
   * displaying the new value, and sends that value to the behavior subject.
   *
   * This method performs the following actions:
   * 1. Sets `categorySelectPristine` to false if the selection was triggered by the user.
   * 2. Updates the `categoryDisplay` and `currentCategory` with the selected category if
   * it is different from the current one.
   * 3. Sends the selected category to the `categorySubject$` behavior subject.
   * 4. Calls `changeEligibleTests` to update the eligible tests based on the new category.
   * 5. Dispatches the `TestCategoryChanged` action to the store with the selected category.
   *
   * @param {TestCategory} event - The selected category.
   * @param {boolean} [ionSelectTriggered=false] - Indicates if the selection was triggered by the user.
   */
  handleCategoryFilter(event: TestCategory, ionSelectTriggered = false): void {
    if (ionSelectTriggered) {
      this.categorySelectPristine = false;
    }
    if (event && this.categorySubject$.value !== event) {
      this.categoryDisplay = `Test category: ${event}`;
      this.currentCategory = event;
      this.categorySubject$.next(event ?? null);
      this.changeEligibleTests();

      this.store$.dispatch(TestCategoryChanged(event));
    }
  }

  /**
   * Updates the colour filter to the selected value and triggers change detection.
   *
   * This method performs the following actions:
   * 1. Dispatches the `ColourFilterChanged` action to the store with the selected colour.
   * 2. Updates the `colourOption` with the new colour scheme.
   * 3. Triggers change detection to update the view.
   *
   * @param {ColourEnum} colour - The selected colour scheme.
   */
  colourFilterChanged(colour: ColourEnum) {
    this.store$.dispatch(ColourFilterChanged(colour));
    this.colourOption = this.getColour(colour);
    this.cdr.detectChanges();
  }

  /**
   * Toggles the visibility of the main content and expanded data, and dispatches the `HideChartsChanged` action.
   *
   * This method performs the following actions:
   * 1. Toggles the `hideMainContent` and `showExpandedData` properties.
   * 2. Dispatches the `HideChartsChanged` action to the store with the updated `hideMainContent` value.
   */
  hideChart(): void {
    this.hideMainContent = !this.hideMainContent;
    this.showExpandedData = !this.showExpandedData;
    this.store$.dispatch(HideChartsChanged(this.hideMainContent));
  }

  /**
   * Returns the colour scheme associated with the given colour option.
   *
   * This method performs the following actions:
   * 1. Checks if the provided colour option is `GREYSCALE`.
   * 2. If it is, returns the greyscale colour scheme from the `examinerRecordsProvider`.
   * 3. If it is not, returns the default colour scheme from the `examinerRecordsProvider`.
   *
   * @param {ColourEnum} colourOption - The colour option to get the colour scheme for.
   * @returns {ColourScheme} The colour scheme associated with the given colour option.
   */
  getColour(colourOption: ColourEnum): ColourScheme {
    switch (colourOption) {
      case ColourEnum.GREYSCALE:
        return this.examinerRecordsProvider.colours.greyscale;
      default:
        return this.examinerRecordsProvider.colours.default;
    }
  }

  /**
   * Returns whether the current category uses an optional emergency stop.
   *
   * This method checks if the `currentCategory` is one of the categories that use an optional emergency stop.
   *
   * @returns {boolean} `true` if the current category uses an optional emergency stop, otherwise `false`.
   */
  showEmergencyStop(): boolean {
    return isAnyOf(this.currentCategory, [
      TestCategory.B,
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K,
    ]);
  }

  /**
   * Toggles the state of the accordion between open and closed.
   *
   * This method performs the following actions:
   * 1. Toggles the `accordionOpen` property.
   */
  accordionSelect() {
    this.accordionOpen = !this.accordionOpen;
  }

  /**
   * Navigate back to the dashboard.
   *
   * This method performs the following actions:
   * 1. Dispatches the `ReturnToDashboardPressed` action to the store.
   * 2. Navigates to the dashboard page and replaces the current URL.
   *
   * @returns {Promise<void>} A promise that resolves when the navigation is complete.
   */
  async goToDashboard(): Promise<void> {
    this.store$.dispatch(ReturnToDashboardPressed());
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }

  /**
   * Returns whether the current category is a mod1 test.
   *
   * This method checks if the `currentCategory` is one of the mod1 test categories.
   *
   * @returns {boolean} `true` if the current category is a mod1 test, otherwise `false`.
   */
  public isMod1 = (): boolean =>
    isAnyOf(this.currentCategory, [
      // Cat Mod1
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAM1,
      TestCategory.EUAMM1,
    ]);

  /**
   * Returns whether the current category is a bike test (mod1/mod2).
   *
   * This method checks if the `currentCategory` is one of the bike test categories.
   *
   * @returns {boolean} `true` if the current category is a bike test, otherwise `false`.
   */
  public isBike = (): boolean =>
    isAnyOf(this.currentCategory, [
      // Cat Mod1
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAM1,
      TestCategory.EUAMM1,
      // Cat Mod2
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAM2,
      TestCategory.EUAMM2,
    ]);

  /**
   * Get the total number of individual instances of data.
   *
   * This method takes an array of `ExaminerRecordData` objects and calculates the total count
   * by summing up the `count` property of each object in the array.
   *
   * @template T The type of the data in the `ExaminerRecordData` objects.
   * @param {ExaminerRecordDataWithPercentage<T>[]} value - The array of `ExaminerRecordData` objects.
   * @returns {number} The total count of individual instances of data.
   */
  getTotal = <T>(value: ExaminerRecordDataWithPercentage<T>[]): number =>
    value.reduce((total, val) => total + Number(val.count), 0);

  /**
   * Determines if the "No Data" card should be displayed.
   *
   * This method checks if there is no data available in the provided `ExaminerRecordsPageStateData` object.
   * It iterates over the keys of the data object and checks if the total count of each key is greater than 0.
   * If any key has a total count greater than 0, it sets `noData` to false.
   * Additionally, it checks if the `categoryList` or `locationList` arrays are empty.
   *
   * @param {ExaminerRecordsPageStateData} data - The data object containing various examiner records.
   * @returns {boolean} `true` if the "No Data" card should be displayed, otherwise `false`.
   */
  displayNoDataCard(data: ExaminerRecordsPageStateData): boolean {
    let noData = true;

    Object.keys(data).forEach((key) => {
      if (!isAnyOf(key, ['testCount', 'locationList', 'categoryList'])) {
        if (this.getTotal(data[key]) > 0) {
          noData = false;
        }
      }
    });
    return noData || data.categoryList?.length === 0 || data.locationList?.length === 0;
  }

  /**
   * Returns the text used on the sticky label.
   *
   * This method retrieves the test count from the `testCount$` observable and constructs a string
   * that displays the number of tests, the current category, the date range, and the location.
   *
   * @returns {string} The formatted label text.
   */
  getLabelText(): string {
    let testCount = 0;
    this.pageState.testCount$.subscribe((value) => (testCount = value)).unsubscribe();

    return `Displaying <strong>${testCount}</strong> Category <strong>${this.currentCategory}</strong> test${testCount > 1 ? '<ion-text>s</ion-text>' : ''}, from <strong>${this.startDateFilter}</strong> to <strong>${this.endDateFilter}</strong>${this.accessibilityService.getTextZoomClass() !== 'text-zoom-x-large' ? '<ion-text> <br /></ion-text>' : ''} at <strong>${this.locationFilter.centreName}</strong>`;
  }

  /**
   * Handles the click event on an examiner reports card.
   *
   * This method dispatches the `ClickDataCard` action to the store with the provided event.
   *
   * @param {ExaminerReportsCardClick} event - The event object containing details of the card click.
   */
  cardClicked(event: ExaminerReportsCardClick) {
    this.store$.dispatch(ClickDataCard(event));
  }
}
