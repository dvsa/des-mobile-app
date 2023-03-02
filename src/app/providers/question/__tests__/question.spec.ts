import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import tellMeQuestionsCatBConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-b.constants';
import showMeQuestionsCatBConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-b.constants';
import tellMeQuestionsVocationalConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import showMeQuestionsVocationalConstants
  from '@shared/constants/show-me-questions/show-me-questions.vocational.constants';
import tellMeQuestionsVocationalTrailerConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.vocational-trailer.constants';
import showMeQuestionsVocationalTrailerConstants
  from '@shared/constants/show-me-questions/show-me-questions.vocational-trailer.constants';
import safetyQuestionsCatDConstants
  from '@shared/constants/safety-questions.cat-d.constants';
import tellMeQuestionsCatHomeTestConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
import showMeQuestionsCatHomeTestConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import showMeQuestionsCatAdiPart2Constants
  from '@shared/constants/show-me-questions/show-me-questions.cat-adi-part2.constants';
import balanceQuestionsCatAMod2Constants from '@shared/constants/balance-questions.cat-a-mod2.constants';
import safetyQuestionsCatAMod2Constants from '@shared/constants/safety-questions.cat-a-mod2.constants';
import { QuestionProvider } from '../question';

describe('question provider', () => {
  let questionProvider: QuestionProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QuestionProvider,
      ],
    });

    questionProvider = TestBed.inject(QuestionProvider);
  });

  describe('getTellMeQuestions', () => {
    it('should return the correct questions for a category B test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.B)).toEqual(tellMeQuestionsCatBConstants);
    });
    it('should return the correct questions for a category C test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.C)).toEqual(tellMeQuestionsVocationalConstants);
    });
    it('should return the correct questions for a category CE test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.CE)).toEqual(tellMeQuestionsVocationalTrailerConstants);
    });
    it('should return the correct questions for a category C1 test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.C1)).toEqual(tellMeQuestionsVocationalConstants);
    });
    it('should return the correct questions for a category C1E test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.C1E)).toEqual(tellMeQuestionsVocationalTrailerConstants);
    });
    it('should return the correct questions for a category D test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.D)).toEqual(tellMeQuestionsVocationalConstants);
    });
    it('should return the correct questions for a category DE test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.DE)).toEqual(tellMeQuestionsVocationalTrailerConstants);
    });
    it('should return the correct questions for a category D1 test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.D1)).toEqual(tellMeQuestionsVocationalConstants);
    });
    it('should return the correct questions for a category D1E test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.D1E)).toEqual(tellMeQuestionsVocationalTrailerConstants);
    });
    it('should return the correct questions for a category K test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.K)).toEqual(tellMeQuestionsCatHomeTestConstants);
    });
    it('should return the correct questions for a category F test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.F)).toEqual(tellMeQuestionsCatHomeTestConstants);
    });
    it('should return the correct questions for a category G test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.G)).toEqual(tellMeQuestionsCatHomeTestConstants);
    });
    it('should return the correct questions for a category H test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.H)).toEqual(tellMeQuestionsCatHomeTestConstants);
    });
    it('should return no questions for a non-supported category', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.B1)).toEqual([]);
    });
  });

  describe('getShowMeQuestions', () => {
    it('should return the correct questions for a category B test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.B)).toEqual(showMeQuestionsCatBConstants);
    });
    it('should return the correct questions for a category C test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.C)).toEqual(showMeQuestionsVocationalConstants);
    });
    it('should return the correct questions for a category CE test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.CE)).toEqual(showMeQuestionsVocationalTrailerConstants);
    });
    it('should return the correct questions for a category C1 test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.C1)).toEqual(showMeQuestionsVocationalConstants);
    });
    it('should return the correct questions for a category C1E test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.C1E)).toEqual(showMeQuestionsVocationalTrailerConstants);
    });
    it('should return the correct questions for a category D test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.D)).toEqual(showMeQuestionsVocationalConstants);
    });
    it('should return the correct questions for a category DE test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.DE)).toEqual(showMeQuestionsVocationalTrailerConstants);
    });
    it('should return the correct questions for a category D1 test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.D1)).toEqual(showMeQuestionsVocationalConstants);
    });
    it('should return the correct questions for a category D1E test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.D1E)).toEqual(showMeQuestionsVocationalTrailerConstants);
    });
    it('should return the correct questions for a category K test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.K)).toEqual(showMeQuestionsCatHomeTestConstants);
    });
    it('should return the correct questions for a category F test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.F)).toEqual(showMeQuestionsCatHomeTestConstants);
    });
    it('should return the correct questions for a category G test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.G)).toEqual(showMeQuestionsCatHomeTestConstants);
    });
    it('should return the correct questions for a category H test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.H)).toEqual(showMeQuestionsCatHomeTestConstants);
    });
    it('should return the correct questions for a category ADI2 test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.ADI2)).toEqual(showMeQuestionsCatAdiPart2Constants);
    });
    it('should return no questions for a non-supported category', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.B1)).toEqual([]);
    });
  });

  describe('getSafetyQuestions', () => {
    it('should return the correct questions for a category EUA1M2 test', () => {
      expect(questionProvider.getSafetyQuestions(TestCategory.EUA1M2)).toEqual(safetyQuestionsCatAMod2Constants);
    });
    it('should return the correct questions for a category EUA2M2 test', () => {
      expect(questionProvider.getSafetyQuestions(TestCategory.EUA2M2)).toEqual(safetyQuestionsCatAMod2Constants);
    });
    it('should return the correct questions for a category EUA2M2 test', () => {
      expect(questionProvider.getSafetyQuestions(TestCategory.EUAM2)).toEqual(safetyQuestionsCatAMod2Constants);
    });
    it('should return the correct questions for a category EUAMM2 test', () => {
      expect(questionProvider.getSafetyQuestions(TestCategory.EUAMM2)).toEqual(safetyQuestionsCatAMod2Constants);
    });
    it('should return the an empty array for an invalid test', () => {
      expect(questionProvider.getSafetyQuestions(TestCategory.B1)).toEqual([]);
    });
  });

  describe('getBalanceQuestions', () => {
    it('should return the correct questions for a category EUA1M2 test', () => {
      expect(questionProvider.getBalanceQuestions(TestCategory.EUA1M2)).toEqual(balanceQuestionsCatAMod2Constants);
    });
    it('should return the correct questions for a category EUA2M2 test', () => {
      expect(questionProvider.getBalanceQuestions(TestCategory.EUA2M2)).toEqual(balanceQuestionsCatAMod2Constants);
    });
    it('should return the correct questions for a category EUA2M2 test', () => {
      expect(questionProvider.getBalanceQuestions(TestCategory.EUAM2)).toEqual(balanceQuestionsCatAMod2Constants);
    });
    it('should return the correct questions for a category EUAMM2 test', () => {
      expect(questionProvider.getBalanceQuestions(TestCategory.EUAMM2)).toEqual(balanceQuestionsCatAMod2Constants);
    });
    it('should return the an empty array for an invalid test', () => {
      expect(questionProvider.getBalanceQuestions(TestCategory.B1)).toEqual([]);
    });
  });

  describe('getVocationalSafetyQuestions', () => {
    it('should return the correct questions for a category D test', () => {
      expect(questionProvider.getVocationalSafetyQuestions(TestCategory.D)).toEqual(safetyQuestionsCatDConstants);
    });
    it('should return the correct questions for a category D1 test', () => {
      expect(questionProvider.getVocationalSafetyQuestions(TestCategory.D1)).toEqual(safetyQuestionsCatDConstants);
    });
    it('should return the correct questions for a category DE test', () => {
      expect(questionProvider.getVocationalSafetyQuestions(TestCategory.DE)).toEqual(safetyQuestionsCatDConstants);
    });
    it('should return the correct questions for a category D1E test', () => {
      expect(questionProvider.getVocationalSafetyQuestions(TestCategory.D1E)).toEqual(safetyQuestionsCatDConstants);
    });
  });
});
