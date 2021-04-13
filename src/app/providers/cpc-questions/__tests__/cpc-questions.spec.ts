import { configureTestSuite } from 'ng-bullet';
import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestData } from '@dvsa/mes-test-schema/categories/CPC';
import { lgvQuestion5 } from '@shared/constants/cpc-questions/cpc-lgv-questions.constants';
import { pcvQuestion5 } from '@shared/constants/cpc-questions/cpc-pcv-questions.constants';
import {
  Combination,
  QuestionNumber,
} from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { CPCQuestionProvider } from '../cpc-questions';
import { question, question5 } from '../../../../store/tests/test-data/cat-cpc/__tests__/test-data.cat-cpc.mock';

describe('CPC Question Provider', () => {
  let cpcQuestionProvider: CPCQuestionProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        CPCQuestionProvider,
      ],
    });
  });

  beforeEach(() => {
    cpcQuestionProvider = TestBed.inject(CPCQuestionProvider);
  });

  describe('getQuestionsBank', () => {
    it('should return 4 questions for given lgv combination code', () => {
      const questions = cpcQuestionProvider.getQuestionsBank('LGV1');
      expect(questions.length).toEqual(4);
    });
    it('should return 4 questions for given pcv combination code', () => {
      const questions = cpcQuestionProvider.getQuestionsBank('PCV8');
      expect(questions.length).toEqual(4);
    });
  });

  describe('getQuestion5ByVehicleType', () => {
    it('should return the question 5 for the LGV', () => {
      const questionFive = cpcQuestionProvider.getQuestion5ByVehicleType('LGV1');
      expect(questionFive).toEqual(lgvQuestion5);
    });
    it('should return the question 5 for the PSV', () => {
      const questionFive = cpcQuestionProvider.getQuestion5ByVehicleType('PCV8');
      expect(questionFive).toEqual(pcvQuestion5);
    });
  });

  describe('getCombinations', () => {
    it('should return a list of only LGV codes for CCPC', () => {
      const combinations = cpcQuestionProvider.getCombinations(TestCategory.CCPC);
      const allCodesLGV = combinations
        .every((combination: Combination) => combination.code.indexOf('LGV') > -1);
      const shortCodes = combinations.map((combination: Combination) => combination.code);
      expect(allCodesLGV).toBe(true);
      expect(shortCodes).toEqual(['LGV1', 'LGV2', 'LGV3', 'LGV4', 'LGV5', 'LGV6', 'LGV7', 'LGV8']);
    });
    it('should return a list of only PCV codes for DCPC', () => {
      const combinations = cpcQuestionProvider.getCombinations(TestCategory.DCPC);
      const allCodesPCV = combinations
        .every((combination: Combination) => combination.code.indexOf('PCV') > -1);
      const shortCodes = combinations.map((combination: Combination) => combination.code);
      expect(allCodesPCV).toBe(true);
      expect(shortCodes).toEqual(['PCV1', 'PCV2', 'PCV3', 'PCV4', 'PCV5', 'PCV6', 'PCV7', 'PCV8']);
    });
  });

  describe('getQuestionScore', () => {
    beforeEach(() => {
      spyOn(cpcQuestionProvider, 'roundToNearestFive').and.callThrough();
    });

    it('should increment the total question score by 5 for every answer that is true', () => {
      const score: number = cpcQuestionProvider.getQuestionScore(question('1'), QuestionNumber.ONE);
      expect(cpcQuestionProvider.roundToNearestFive).not.toHaveBeenCalled();
      expect(score).toEqual(10);
    });

    it('should increment the total question5 score by 2 for every answer that is true and round to closest 5', () => {
      const score: number = cpcQuestionProvider.getQuestionScore(question5(), QuestionNumber.FIVE);
      // 8 trues with a score of 2 each = 16
      expect(cpcQuestionProvider.roundToNearestFive).toHaveBeenCalledWith(16);
      // score then gets rounded to nearest 5 from 16 down to 15
      expect(score).toEqual(15);
    });
  });

  describe('getTotalQuestionScore', () => {
    it('should sum the score value in each', () => {
      const testData: TestData = {
        combination: 'LGV1',
        question1: question('3'),
        question2: question('8'),
        question3: question('2'),
        question4: question('6'),
        question5: question5(),
        totalPercent: null,
      };
      const score: number = cpcQuestionProvider.getTotalQuestionScore(testData);
      expect(score).toEqual(95);
    });
  });
});
