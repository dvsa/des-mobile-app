import { Injectable } from '@angular/core';
import { SearchProvider } from '@providers/search/search';
import { CompressionProvider } from '@providers/compression/compression';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { get } from 'lodash-es';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { DateRange } from '@shared/helpers/date-time';
import { ChartType } from 'ng-apexcharts';
import { Router } from '@angular/router';
import { LoadingProvider } from '@providers/loader/loader';
import moment from 'moment';

export interface ColourScheme {
  name: ColourEnum,
  bar: string[],
  pie: string[],
  emergencyStop?: string[],
  average: string
}

export const enum ColourEnum {
  DEFAULT = 'Default',
  GREYSCALE = 'Greyscale',
}

export type ExaminerRecordsRange = DateRange;

export interface SelectableDateRange {
  display: string;
  val: ExaminerRecordsRange;
}
export type DESChartTypes = Extract<ChartType, 'bar' | 'pie'>;
@Injectable()
export class ExaminerRecordsProvider {

  public colours: {
    default: ColourScheme,
    greyscale: ColourScheme,
  } = {
    default: {
      name: ColourEnum.DEFAULT,
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
    greyscale: {
      name: ColourEnum.GREYSCALE,
      pie: [
        '#474747',
        '#6E6E6E',
        '#222222',
        '#606060',
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
      display: 'Last 90 days',
      val: '90 days',
    },
    {
      display: 'Last 1 year',
      val: '1 year',
    },
    {
      display: 'Last 18 months',
      val: '18 months',
    },
  ];

  currentlyLoading: boolean = false;


  constructor(
    public searchProvider: SearchProvider,
    public compressionProvider: CompressionProvider,
    public store$: Store<StoreModel>,
    public router: Router,
    public loadingProvider: LoadingProvider,
  ) {
  }

  /**
   * handler for loading spinner while pulling backend data
   */
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
  Get the date from a set date range ago in order to display on screen
   */
  getRangeDate(range: DateRange): moment.Moment {
    let dateRange: moment.Moment = null;

    switch (range) {
      case 'today':
        dateRange = moment(new Date());
        break;
      case 'week':
        dateRange = moment(new Date())
          .subtract(1, 'week');
        break;
      case 'fortnight':
        dateRange = moment(new Date())
          .subtract(2, 'week');
        break;
      case '90 days':
        dateRange = moment(new Date())
          .subtract(90, 'days');
        break;
      case '1 year':
        dateRange = moment(new Date())
          .subtract(1, 'year');
        break;
      case '18 months':
        dateRange = moment(new Date())
          .subtract(18, 'months');
        break;
    }

    return dateRange;
  }

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
      { field: 'extendedTest', value: get(testResult, 'journalData.testSlotAttributes.extendedTest') },
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
