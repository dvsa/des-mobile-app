import { Injectable } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  CombinationCodes, Question, Question5, TestData,
} from '@dvsa/mes-test-schema/categories/CPC';

import { lgvQuestion5, lgvQuestions } from '@shared/constants/cpc-questions/cpc-lgv-questions.constants';
import { pcvQuestion5, pcvQuestions } from '@shared/constants/cpc-questions/cpc-pcv-questions.constants';
import {
  Combination,
  questionCombinations, QuestionNumber,
} from '@shared/constants/cpc-questions/cpc-question-combinations.constants';

@Injectable()
export class CPCQuestionProvider {

  private getQuestionCombination = (combinationCode: CombinationCodes): Combination => {
    return questionCombinations.find((question: Combination) => question.code === combinationCode);
  };

  private getQuestionsByVehicleType = (combinationCode: CombinationCodes): Question[] => {
    return combinationCode.includes('LGV') ? lgvQuestions : pcvQuestions;
  };

  getQuestionScore = (question: Question | Question5, questionNumber: QuestionNumber): number => {
    let scorePerAnswer: number = 5;

    if (questionNumber === QuestionNumber.FIVE) {
      scorePerAnswer = 2;
    }

    const result: number = Object.keys(question).reduce((sum: number, key: string): number => {
      if (key.indexOf('answer') > -1) {
        return sum + (question[key].selected ? scorePerAnswer : 0);
      }
      return sum;
    }, 0);

    if (questionNumber === QuestionNumber.FIVE) {
      return this.roundToNearestFive(result);
    }
    return result;
  };

  roundToNearestFive = (sum: number): number => Math.round(sum / 5) * 5;

  getTotalQuestionScore = (testData: TestData): number => {
    return Object.keys(testData).reduce((sum: number, key: string): number => {
      if (key.indexOf('question') > -1 && typeof testData[key] === 'object') {
        return sum + (testData[key].score || 0);
      }
      return sum;
    }, 0);
  };

  getQuestion5ByVehicleType = (combinationCode: CombinationCodes): Question5 => {
    return combinationCode.includes('LGV') ? lgvQuestion5 : pcvQuestion5;
  };

  getQuestionsBank = (combinationCode: CombinationCodes): Question[] => {
    const { questions } = this.getQuestionCombination(combinationCode);

    return this.getQuestionsByVehicleType(combinationCode)
      .filter((item: Question) => questions.includes(item.questionCode))
      .sort((a: Question, b: Question) => questions.indexOf(a.questionCode) - questions.indexOf(b.questionCode));
  };

  getCombinations = (testCategory: TestCategory): Combination[] => {
    switch (testCategory) {
      case TestCategory.CCPC:
        return questionCombinations.filter((questions: Combination) => questions.code.includes('LGV'));
      case TestCategory.DCPC:
        return questionCombinations.filter((questions: Combination) => questions.code.includes('PCV'));
      default:
        return [];
    }
  };
}
