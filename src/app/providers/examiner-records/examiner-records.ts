import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store } from '@ngrx/store';
import { CompressionProvider } from '@providers/compression/compression';
import { LoadingProvider } from '@providers/loader/loader';
import { SearchProvider } from '@providers/search/search';
import { DateRange, DateTime } from '@shared/helpers/date-time';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { StoreModel } from '@shared/models/store.model';
import { get } from 'lodash-es';
import moment from 'moment';
import { ChartType } from 'ng-apexcharts';

export interface ColourScheme {
  name: ColourEnum;
  bar: string[];
  pie: string[];
  emergencyStop?: string[];
  average: string;
}

export enum ColourEnum {
  DEFAULT = 'Default',
  GREYSCALE = 'Greyscale',
}

export interface SelectableDateRange {
  display: string;
  val: DateRange;
}
export type DESChartTypes = Extract<ChartType, 'bar' | 'pie'>;
@Injectable()
export class ExaminerRecordsProvider {
  public colours: {
    default: ColourScheme;
    greyscale: ColourScheme;
  } = {
    default: {
      name: ColourEnum.DEFAULT,
      pie: ['#008FFB', '#ED6926', '#FF526F', '#007C42', '#a05195'],
      bar: ['#008FFB'],
      emergencyStop: ['#ED6926', '#777777'],
    },
    greyscale: {
      name: ColourEnum.GREYSCALE,
      pie: ['#474747', '#6E6E6E', '#222222', '#606060', '#949494'],
      bar: ['#777777'],
    },
  };

  public localFilterOptions: SelectableDateRange[] = [
    {
      display: 'Today',
      val: DateRange.TODAY,
    },
    {
      display: 'Last 7 days',
      val: DateRange.WEEK,
    },
    {
      display: 'Last 14 days',
      val: DateRange.FORTNIGHT,
    },
  ];
  public onlineFilterOptions: SelectableDateRange[] = [
    {
      display: 'Last 30 days',
      val: DateRange.THIRTY_DAYS,
    },
    {
      display: 'Last 90 days',
      val: DateRange.NINETY_DAYS,
    },
    {
      display: 'Last 1 year',
      val: DateRange.ONE_YEAR,
    },
    {
      display: 'Last 18 months',
      val: DateRange.EIGHTEEN_MONTHS,
    },
  ];

  currentlyLoading = false;

  constructor(
    public searchProvider: SearchProvider,
    public compressionProvider: CompressionProvider,
    public store$: Store<StoreModel>,
    public router: Router,
    public loadingProvider: LoadingProvider
  ) {}

  /**
   * Handler for loading spinner while pulling remote data.
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
        message: 'Loading...',
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
    switch (range) {
      case DateRange.TODAY:
        return moment(new Date());
      case DateRange.WEEK:
        return moment(new Date()).subtract(1, 'week');
      case DateRange.FORTNIGHT:
        return moment(new Date()).subtract(2, 'week');
      case DateRange.THIRTY_DAYS:
        return moment(new Date()).subtract(30, 'days');
      case DateRange.NINETY_DAYS:
        return moment(new Date()).subtract(90, 'days');
      case DateRange.ONE_YEAR:
        return moment(new Date()).subtract(1, 'year');
      case DateRange.EIGHTEEN_MONTHS:
        return moment(new Date()).subtract(18, 'months');
      default:
        return null;
    }
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
      startDate: new DateTime(testResult.journalData.testSlotAttributes.start).format('YYYY-MM-DD'),
    };

    [
      { field: 'controlledStop', value: get(testResult, 'testData.controlledStop.selected') },
      { field: 'extendedTest', value: get(testResult, 'journalData.testSlotAttributes.extendedTest') },
      { field: 'independentDriving', value: get(testResult, 'testSummary.independentDriving') },
      { field: 'circuit', value: get(testResult, 'testSummary.circuit') },
      { field: 'safetyQuestions', value: get(testResult, 'testData.safetyAndBalanceQuestions.safetyQuestions') },
      { field: 'balanceQuestions', value: get(testResult, 'testData.safetyAndBalanceQuestions.balanceQuestions') },
      { field: 'manoeuvres', value: get(testResult, 'testData.manoeuvres') },
    ].forEach((item) => {
      if (item.value) {
        result = { ...result, [item.field]: item.value };
      }
    });

    const routeNumber = get(testResult, 'testSummary.routeNumber');
    if (routeNumber) {
      result = {
        ...result,
        routeNumber: Number(routeNumber),
      };
    }

    const showQuestion = get(testResult, 'testData.vehicleChecks.showMeQuestion');
    const showQuestions = get(testResult, 'testData.vehicleChecks.showMeQuestions');
    if (showQuestion) {
      result = {
        ...result,
        showMeQuestions: [showQuestion],
      };
    } else if (
      showQuestions &&
      (showQuestions as QuestionResult[]).filter((question) => Object.keys(question).length > 0).length !== 0
    ) {
      result = {
        ...result,
        showMeQuestions: (showQuestions as QuestionResult[]).filter((question) => Object.keys(question).length > 0),
      };
    }
    const tellQuestion = get(testResult, 'testData.vehicleChecks.tellMeQuestion');
    const tellQuestions = get(testResult, 'testData.vehicleChecks.tellMeQuestions');
    if (tellQuestion) {
      result = {
        ...result,
        tellMeQuestions: [tellQuestion],
      };
    } else if (
      tellQuestions &&
      (tellQuestions as QuestionResult[]).filter((question) => Object.keys(question).length > 0).length !== 0
    ) {
      result = {
        ...result,
        tellMeQuestions: (tellQuestions as QuestionResult[]).filter((question) => Object.keys(question).length > 0),
      };
    }
    return result;
  };
}
