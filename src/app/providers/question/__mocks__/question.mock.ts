/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { VehicleChecksQuestion } from '../vehicle-checks-question.model';

function generateQuestionResult(code: string, description: string, outcome: QuestionOutcome) {
  return {
    code,
    description,
    outcome,
  };
}

export class QuestionProviderMock {
  getTellMeQuestions(testCategory: TestCategory): VehicleChecksQuestion[] {
    return [
      { code: 'T1', description: 'What time is it?', shortName: 'What' },
      { code: 'T2', description: 'Where are we?', shortName: 'Where' },
    ];
  }

  getShowMeQuestions(testCategory: TestCategory): VehicleChecksQuestion[] {
    return [
      { code: 'S1', description: 'Who are we?', shortName: 'Who' },
      { code: 'S2', description: 'Why are we here?', shortName: 'Why' },
    ];
  }
}
