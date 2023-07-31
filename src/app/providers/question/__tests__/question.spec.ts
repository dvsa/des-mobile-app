import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import tellMeQuestionsCatBConstants from '@shared/constants/tell-me-questions/tell-me-questions.cat-b.constants';
import showMeQuestionsCatBConstants from '@shared/constants/show-me-questions/show-me-questions.cat-b.constants';
import tellMeQuestionsVocationalConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import showMeQuestionsVocationalConstants
  from '@shared/constants/show-me-questions/show-me-questions.vocational.constants';
import tellMeQuestionsVocationalTrailerConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.vocational-trailer.constants';
import showMeQuestionsVocationalTrailerConstants
  from '@shared/constants/show-me-questions/show-me-questions.vocational-trailer.constants';
import safetyQuestionsCatDConstants from '@shared/constants/safety-questions.cat-d.constants';
import tellMeQuestionsCatHomeTestConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-home-test.constants';
import showMeQuestionsCatHomeTestConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-home-test.constants';
import showMeQuestionsCatAdiPart2Constants
  from '@shared/constants/show-me-questions/show-me-questions.cat-adi-part2.constants';
import balanceQuestionsCatAMod2Constants from '@shared/constants/balance-questions.cat-a-mod2.constants';
import safetyQuestionsCatAMod2Constants from '@shared/constants/safety-questions.cat-a-mod2.constants';
import { QuestionProvider } from '../question';

describe('QuestionProvider', () => {
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
      expect(questionProvider.getTellMeQuestions(TestCategory.B))
        .toEqual(tellMeQuestionsCatBConstants);
    });

    it('should return the correct questions for a category CE or DE test', () => {
      [
        TestCategory.CE,
        TestCategory.C1E,
        TestCategory.DE,
        TestCategory.D1E,
      ].forEach((category) => {
        expect(questionProvider.getTellMeQuestions(category))
          .toEqual(tellMeQuestionsVocationalTrailerConstants);
      });
    });
    it('should return the correct questions for a category C or D test', () => {
      [
        TestCategory.C,
        TestCategory.C1,
        TestCategory.D,
        TestCategory.D1,
      ].forEach((category) => {
        expect(questionProvider.getTellMeQuestions(category))
          .toEqual(tellMeQuestionsVocationalConstants);
      });
    });
    it('should return the correct questions for a category Home test', () => {
      [
        TestCategory.K,
        TestCategory.F,
        TestCategory.G,
        TestCategory.H,
      ].forEach((category) => {
        expect(questionProvider.getTellMeQuestions(category))
          .toEqual(tellMeQuestionsCatHomeTestConstants);
      });
    });

    it('should return no questions for a non-supported category', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.B1))
        .toEqual([]);
    });
  });

  describe('getShowMeQuestions', () => {
    it('should return the correct questions for a category B test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.B))
        .toEqual(showMeQuestionsCatBConstants);
    });
    it('should return the correct questions for a category CE or DE test', () => {
      [
        TestCategory.CE,
        TestCategory.C1E,
        TestCategory.DE,
        TestCategory.D1E,
      ].forEach((category) => {
        expect(questionProvider.getShowMeQuestions(category))
          .toEqual(showMeQuestionsVocationalTrailerConstants);
      });
    });
    it('should return the correct questions for a category C or D test', () => {
      [
        TestCategory.C,
        TestCategory.C1,
        TestCategory.D,
        TestCategory.D1,
      ].forEach((category) => {
        expect(questionProvider.getShowMeQuestions(category))
          .toEqual(showMeQuestionsVocationalConstants);
      });
    });
    it('should return the correct questions for a category Home test', () => {
      [
        TestCategory.K,
        TestCategory.F,
        TestCategory.G,
        TestCategory.H,
      ].forEach((category) => {
        expect(questionProvider.getShowMeQuestions(category))
          .toEqual(showMeQuestionsCatHomeTestConstants);
      });
    });
    it('should return the correct questions for a category ADI2 test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.ADI2))
        .toEqual(showMeQuestionsCatAdiPart2Constants);
    });
    it('should return no questions for a non-supported category', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.B1))
        .toEqual([]);
    });
  });

  describe('getSafetyQuestions', () => {
    it('should return the correct questions for a category Mod2 test', () => {
      [
        TestCategory.EUA1M2,
        TestCategory.EUA2M2,
        TestCategory.EUAM2,
        TestCategory.EUAMM2,
      ].forEach((category) => {
        expect(questionProvider.getSafetyQuestions(category))
          .toEqual(safetyQuestionsCatAMod2Constants);
      });
    });
    it('should return the an empty array for an invalid test', () => {
      expect(questionProvider.getSafetyQuestions(TestCategory.B1))
        .toEqual([]);
    });
  });

  describe('getBalanceQuestions', () => {
    it('should return the correct questions for a category Mod2 test', () => {
      [
        TestCategory.EUA1M2,
        TestCategory.EUA2M2,
        TestCategory.EUAM2,
        TestCategory.EUAMM2,
      ].forEach((category) => {
        expect(questionProvider.getBalanceQuestions(category))
          .toEqual(balanceQuestionsCatAMod2Constants);
      });
    });
    it('should return the an empty array for an invalid test', () => {
      expect(questionProvider.getBalanceQuestions(TestCategory.B1))
        .toEqual([]);
    });
  });

  describe('getVocationalSafetyQuestions', () => {
    it('should return the correct questions for a category D test', () => {
      [
        TestCategory.D1,
        TestCategory.D1E,
        TestCategory.DE,
        TestCategory.D,
      ].forEach((category) => {
        expect(questionProvider.getVocationalSafetyQuestions(category))
          .toEqual(safetyQuestionsCatDConstants);
      });
    });
  });
});
