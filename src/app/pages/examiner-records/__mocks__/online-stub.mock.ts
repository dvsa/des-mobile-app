import { Injectable } from '@angular/core';
import { demonstrationMock } from '@pages/examiner-records/__mocks__/test-result.mock';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { get } from 'lodash';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { ExaminerRecord } from '@pages/examiner-records/examiner-records.page';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/C/partial';

@Injectable({
  providedIn: 'root',
})
export class ExaminerRecordsOnlineStub {
  getResults(role, startDate, endDate, staffNumber): ExaminerRecord[] {
    let results: ExaminerRecord[] = Object.values(demonstrationMock).filter(
      (testResult) => testResult.journalData.examiner.staffNumber === staffNumber &&
        new Date(testResult.journalData.testSlotAttributes.start) > new Date(startDate) &&
        new Date(testResult.journalData.testSlotAttributes.start) < new Date(endDate),
    ).map(testResult => {
      return {
        appRef: formatApplicationReference(get(testResult, 'journalData.applicationReference')),
        testCategory: get(testResult, 'category') as TestCategory,
        testCentre: get(testResult, 'journalData.testCentre') as TestCentre,
        routeNumber: Number(get(testResult, 'testSummary.routeNumber')),
        startDate: testResult.journalData.testSlotAttributes.start,
        controlledStop: get(testResult, 'testData.controlledStop.selected'),
        independentDriving: get(testResult, 'testSummary.independentDriving'),
        circuit: get(testResult, 'testSummary.circuit'),
        safetyQuestions: get(testResult, 'testData.safetyAndBalanceQuestions.safetyQuestions') as QuestionResult[],
        balanceQuestions: get(testResult, 'testData.safetyAndBalanceQuestions.balanceQuestions') as QuestionResult[],
        manoeuvres: get(testResult, 'testData.manoeuvres'),
        showMeQuestions: [
          ...[get(testResult, 'testData.vehicleChecks.showMeQuestion', null)] as [QuestionResult],
          ...get(testResult, 'testData.vehicleChecks.showMeQuestions', []) as QuestionResult[],
        ],
        tellMeQuestions: [
          ...[get(testResult, 'testData.vehicleChecks.tellMeQuestion', null)] as [QuestionResult],
          ...get(testResult, 'testData.vehicleChecks.tellMeQuestions', []) as QuestionResult[],
        ],
      };
    });
    console.log(results);
    return results;
  }
}
