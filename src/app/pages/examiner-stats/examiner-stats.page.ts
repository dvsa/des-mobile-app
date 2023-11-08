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
import { isAnyOf } from '@shared/helpers/simplifiers';

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

export const enum ColourEnum {
  Default = 'Default',
  Monochrome = 'Monochrome',
  DVSA = 'DVSA',
  Generated = 'Generated',
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
  colors: { default: string[], monochrome: { bar: string[], pie: string[] }, dvsa: string[], generated: string[] } = {
    default: [
      '#008FFB',
      '#00E396',
      '#FEB019',
      '#FF4560',
      '#775DD0',
      '#00A7E1',
      '#00CDAC',
      '#F79F1F',
      '#FF82AB',
      '#3D5AFE',
      '#00BFFF',
      '#00FF00',
      '#FFFF00',
      '#FF0000',
      '#800080',
    ],
    monochrome: { pie: ['#616161', '#757575', '#898989', '#bdbdbd', '#e0e0e0'], bar: ['#777777'] },
    dvsa: [
      '#FFD600',
      '#2187C9',
      '#E0177D',
      '#3BAB36',
      '#ED6926',
      '#FF7F00',
      '#40E0D0',
      '#EE82EE',
      '#006400',
      '#8B0000',
      '#FFFFE0',
      '#FFB6C1',
      '#ADD8E6',
      '#E6E6FA',
      '#90EE90'],
    generated: [],
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

  calculateColourScheme(colourNum: number, seed: number) {
    let division = 360 / colourNum;
    let degreeVal = 0;
    let colourArray = [];
    for (let i = 0; i < colourNum; i = i + 1) {
      // let currentColour = [degreeVal, 100, Math.floor(Math.random() * (70 - 40 + 1) + 40)];
      let currentColour = [degreeVal, 100, 55];

      if (this.contrast(this.hslToRgb(
        currentColour[0] / 360, currentColour[1] / 100, currentColour[2] / 100),
      [255, 255, 255]) > 3) {
        colourArray.push(`hsl(${currentColour[0]}, ${currentColour[1]}%, ${currentColour[2]}%)`);
      } else {
        let newColour = [currentColour[0], currentColour[1], currentColour[2] * 0.52];
        if (this.contrast(this.hslToRgb(
          newColour[0] / 360, (newColour[1]) / 100, (newColour[2]) / 100),
        [255, 255, 255]) <= 3) {
        }
        colourArray.push(`hsl(${newColour[0]}, ${newColour[1]}%, ${newColour[2]}%)`);
      }

      degreeVal += division;
    }
    return this.shuffle(colourArray, seed);
  }

  shuffle(array: any[], seed: number) {
    let m = array.length, t: any, i: number;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(this.random(seed) * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
      ++seed;
    }

    return array;
  }

  random(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
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
    this.colors.generated = this.calculateColourScheme(this.findLargestValue(), 0);

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

  setDefault(data: { item: any, count: number }[]) {
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
        return this.colors.default;
      case 'Monochrome':
        if (chartType === 'bar') {
          return this.colors.monochrome.bar;
        }
        return this.colors.monochrome.pie;
      case 'DVSA':
        return this.colors.dvsa;
      case 'Generated':
        return this.colors.generated;
    }
  }

  getTotal(routeGrid: (string | number)[][]) {
    let total: number = 0;
    routeGrid.forEach(value => {
      total += Number(value[1]);
    });
    return total;
  }

  toggleChart() {
    this.hideChart = !this.hideChart;
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

  relativeLuminance(value: number): number {
    const ratio = value / 255;

    return ratio <= 0.04045 ? ratio / 12.92 : Math.pow((ratio + 0.055) / 1.055, 2.4);
  }
  luminance(color: [number, number, number]): number {
    const r = this.relativeLuminance(color[0]);
    const g = this.relativeLuminance(color[1]);
    const b = this.relativeLuminance(color[2]);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  contrast(c1: [number, number, number], c2: [number, number, number] = [255, 255, 255]): number {
    const l1 = this.luminance(c1);
    const l2 = this.luminance(c2);

    return Number((l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05)).toFixed(2));
  }

  hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r: number, g: number, b: number;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p: number, q: number, t: number) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [ Math.ceil(r * 255), Math.ceil(g * 255), Math.ceil(b * 255) ];
  }

  findLargestValue() {
    let lengthValue = [];

    let values = [
      this.pageState.independentDriving$,
      this.pageState.safetyAndBalanceQuestions$,
      this.pageState.showMeQuestions$,
      this.pageState.tellMeQuestions$,
      this.pageState.manoeuvres$,
      this.pageState.routeNumbers$,
    ];

    for (let i = 0; i < values.length; i = i + 1) {
      values[i].subscribe((val) => {
        lengthValue.push(val.length);
      });
    }
    return Math.max(...lengthValue);
  }
}
