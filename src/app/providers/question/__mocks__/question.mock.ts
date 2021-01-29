/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { VehicleChecks } from '@dvsa/mes-test-schema/categories/BE/partial';
import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { VehicleChecksScore } from '../../../shared/models/vehicle-checks-score.model';
import { VehicleChecksQuestion } from '../vehicle-checks-question.model';

function generateQuestionResult(code: string, description: string, outcome: QuestionOutcome) {
  return {
    code,
    description,
    outcome,
  };
}

export function generateVehicleChecksScoring(drivingFaults: number, seriousFaults: number): VehicleChecksScore {
  return {
    seriousFaults,
    drivingFaults,
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

  calculateFaults(vehicleChecksQuestions: CatBEUniqueTypes.VehicleChecks): VehicleChecksScore {
    return {
      drivingFaults: 4,
      seriousFaults: 1,
    };
  }
}

export function getCatBeVehicleChecks4Faults(): VehicleChecks {
  return {
    showMeQuestions: [
      generateQuestionResult('a', 'desc', 'P'),
      generateQuestionResult('b', 'desc2', 'DF'),
      generateQuestionResult('c', 'desc3', 'DF'),
    ],
    tellMeQuestions: [
      generateQuestionResult('d', 'desc4', 'DF'),
      generateQuestionResult('e', 'desc5', 'DF'),
    ],
  };
}

export function getCatBeVehicleChecksNoFaults(): VehicleChecks {
  return {
    showMeQuestions: [
      generateQuestionResult('a', 'desc', 'P'),
      generateQuestionResult('b', 'desc2', 'P'),
      generateQuestionResult('c', 'desc3', 'P'),
    ],
    tellMeQuestions: [
      generateQuestionResult('d', 'desc4', 'P'),
      generateQuestionResult('e', 'desc5', 'P'),
    ],
  };
}

export function getCatBeVehicleChecks5Faults(): VehicleChecks {
  return {
    showMeQuestions: [
      generateQuestionResult('a', 'desc', 'DF'),
      generateQuestionResult('b', 'desc2', 'DF'),
      generateQuestionResult('c', 'desc3', 'DF'),
    ],
    tellMeQuestions: [
      generateQuestionResult('d', 'desc4', 'DF'),
      generateQuestionResult('e', 'desc5', 'DF'),
    ],
  };
}
