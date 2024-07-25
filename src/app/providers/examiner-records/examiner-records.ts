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
   * Handler for loading spinner while pulling backend data.
   *
   * This method manages the UI state for a loading spinner based on the `isLoading` parameter.
   * It updates the `currentlyLoading` state and invokes the `handleUILoading` method of the `loadingProvider`
   * to show or hide the loading spinner with specific options.
   *
   * @param {boolean} isLoading - Indicates whether the loading spinner should be displayed
   * (`true`) or hidden (`false`).
   * @returns {Promise<null>} A promise that resolves to `null` after the loading state is handled.
   */
  handleLoadingUI = async (isLoading: boolean): Promise<null> => {
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
   * Get the date from a set date range ago in order to display on screen.
   *
   * This method calculates the date based on the provided date range.
   * It returns the current date for 'today', one week ago for 'week',
   * two weeks ago for 'fortnight', 90 days ago for '90 days',
   * one year ago for '1 year', and 18 months ago for '18 months'.
   *
   * @param {DateRange} range - The date range to calculate the date from.
   * @returns {moment.Moment} The calculated date based on the provided range.
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
   * Converts a test result to the ExaminerRecordModel format.
   *
   * This method transforms the provided test result into the format required for examiner records.
   * It extracts various fields from the test result and assigns them to the corresponding properties
   * of the ExaminerRecordModel. The method handles optional fields and ensures they are only added
   * if they exist in the test result.
   *
   * @param {TestResultSchemasUnion} testResult - The test result to be formatted.
   * @returns {ExaminerRecordModel} The formatted examiner record.
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
