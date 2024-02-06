import { Injectable } from '@angular/core';
import { SearchProvider } from '@providers/search/search';
import { CompressionProvider } from '@providers/compression/compression';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { CallBackendRecords } from '@pages/examiner-records/examiner-records.actions';
import { selectExaminerRecords } from '@store/app-info/app-info.selectors';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { get } from 'lodash-es';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { DateRange } from '@shared/helpers/date-time';
import { ChartType } from 'ng-apexcharts';

export interface StaticColourScheme { colours: string[], average: string }
export interface VariableColourScheme { bar: string[], pie: string[], average: string }

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
export type DESChartTypes = Extract<ChartType, 'bar' | 'pie'>;
@Injectable()
export class ExaminerRecordsProvider {
  public colours: {
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

  public dateFilterOptions: SelectableDateRange[] = [
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


  constructor(
    public searchProvider: SearchProvider,
    public compressionProvider: CompressionProvider,
    public store$: Store<StoreModel>,
  ) {
  }


  async cacheOnlineRecords(staffNumber: string) {
    console.log('before cacheCall');
    this.store$.dispatch(CallBackendRecords(staffNumber));
    console.log('online:', this.store$.selectSignal(selectExaminerRecords)());
  }

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
