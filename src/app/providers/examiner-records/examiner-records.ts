import { Injectable } from '@angular/core';
import { SearchProvider } from '@providers/search/search';
import { CompressionProvider } from '@providers/compression/compression';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  GetExaminerRecords,
  LoadingExaminerRecords,
} from '@pages/examiner-records/examiner-records.actions';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { get } from 'lodash-es';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { DateRange, DateTime } from '@shared/helpers/date-time';
import { ChartType } from 'ng-apexcharts';
import {
  selectCachedExaminerRecords,
  selectLastCachedDate,
} from '@store/examiner-records/examiner-records.selectors';
import { Router } from '@angular/router';
import { LoadingProvider } from '@providers/loader/loader';

export interface ColourScheme {
  name: ColourEnum,
  bar: string[],
  pie: string[],
  emergencyStop?: string[],
  average: string
}

export const enum ColourEnum {
  Default = 'Default',
  Monochrome = 'Monochrome',
}

export type ExaminerRecordsTestLimits = '100';
export type ExaminerRecordsRange = DateRange | ExaminerRecordsTestLimits;

export interface SelectableDateRange {
  display: string;
  val: ExaminerRecordsRange;
}
export type DESChartTypes = Extract<ChartType, 'bar' | 'pie'>;
@Injectable()
export class ExaminerRecordsProvider {

  public colours: {
    default: ColourScheme,
    monochrome: ColourScheme,
  } = {
    default: {
      name: ColourEnum.Default,
      pie: [
        '#008FFB',
        '#ED6926',
        '#FF526F',
        '#007C42',
        '#a05195',
      ],
      bar: ['#008FFB'],
      emergencyStop: [
        '#ED6926',
        '#777777'
      ],
      average: '#000000',
    },
    monochrome: {
      name: ColourEnum.Monochrome,
      pie: ['#474747',
        '#5A5A5A',
        '#6E6E6E',
        '#818181',
        '#949494',
      ],
      bar: ['#777777'],
      average: '#000000',
    },
  };

  public localFilterOptions: SelectableDateRange[] = [
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
  public onlineFilterOptions: SelectableDateRange[] = [
    {
      display: 'Last 1 year',
      val: '1 year',
    },
    {
      display: 'Last 2 years',
      val: '2 years',
    },
  ];


  constructor(
    public searchProvider: SearchProvider,
    public compressionProvider: CompressionProvider,
    public store$: Store<StoreModel>,
    public router: Router,
    public loadingProvider: LoadingProvider,
  ) {
  }

  /**
   * checks if user has already successfully cached examiner records today, if not, dispatches the effect to do so
   */
  async cacheOnlineRecords(staffNumber: string) {
    if (
      !this.store$.selectSignal(selectCachedExaminerRecords)() ||
      this.store$.selectSignal(selectLastCachedDate)() !== new DateTime().format('DD/MM/YYYY')
    ) {
      this.store$.dispatch(LoadingExaminerRecords());
      this.store$.dispatch(GetExaminerRecords(staffNumber));
    }
  }

  /**
   * handler for loading spinner while pulling backend data
   */
  currentlyLoading: boolean = false;
  handleLoadingUI = async (isLoading: boolean) => {
    if ((isLoading && !this.currentlyLoading) || (!isLoading && this.currentlyLoading)) {
      this.currentlyLoading = isLoading;
      await this.loadingProvider.handleUILoading(isLoading, {
        id: 'examinerRecord_loading_spinner',
        spinner: 'circles',
        backdropDismiss: false,
        translucent: false,
        message: 'Loading...'
      });

    }
    return null;
  };

  /**
   * changes test result to the ExaminerRecordModel format, which we then use for examiner records
   */
  formatForExaminerRecords = (testResult: TestResultSchemasUnion): ExaminerRecordModel => {
    let result: ExaminerRecordModel = {
      appRef: Number(formatApplicationReference(testResult.journalData.applicationReference)),
      testCategory: testResult.category as TestCategory,
      testCentre: testResult.journalData.testCentre,
      startDate: testResult.journalData.testSlotAttributes.start,
    };

    [
      { field: 'controlledStop', value: get(testResult, 'testData.controlledStop.selected') },
      { field: 'independentDriving', value: get(testResult, 'testSummary.independentDriving') },
      { field: 'circuit', value: get(testResult, 'testSummary.circuit') },
      { field: 'safetyQuestions', value: get(testResult, 'testData.safetyAndBalanceQuestions.safetyQuestions') },
      { field: 'balanceQuestions', value: get(testResult, 'testData.safetyAndBalanceQuestions.balanceQuestions') },
      { field: 'manoeuvres', value: get(testResult, 'testData.manoeuvres') },
    ].forEach(item => {
      if (item.value) {
        result = { ...result, [item.field]: item.value, };
      }
    });

    let routeNumber = get(testResult, 'testSummary.routeNumber');
    if (routeNumber) {
      result = {
        ...result,
        routeNumber: Number(routeNumber),
      };
    }

    let showQuestion = get(testResult, 'testData.vehicleChecks.showMeQuestion');
    let showQuestions = get(testResult, 'testData.vehicleChecks.showMeQuestions');
    if (showQuestion) {
      result = {
        ...result,
        showMeQuestions: [showQuestion],
      };
    } else if (
      showQuestions &&
      (showQuestions as QuestionResult[]).filter((question) => Object.keys(question).length > 0).length !== 0) {

      result = {
        ...result,
        showMeQuestions: (showQuestions as QuestionResult[]).filter(
          (question) => Object.keys(question).length > 0),
      };
    }
    let tellQuestion = get(testResult, 'testData.vehicleChecks.tellMeQuestion');
    let tellQuestions = get(testResult, 'testData.vehicleChecks.tellMeQuestions');
    if (tellQuestion) {
      result = {
        ...result,
        tellMeQuestions: [tellQuestion],
      };
    } else if (
      tellQuestions &&
      (tellQuestions as QuestionResult[]).filter((question) => Object.keys(question).length > 0).length !== 0) {

      result = {
        ...result,
        tellMeQuestions: (tellQuestions as QuestionResult[]).filter(
          (question) => Object.keys(question).length > 0),
      };
    }
    return result;
  };

}
