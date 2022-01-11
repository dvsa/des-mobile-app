import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';

import tellMeQuestionsCatBConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-b.constants';
import showMeQuestionsCatBConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-b.constants';
import tellMeQuestionsCatBeConstants
  from '@shared/constants/tell-me-questions/tell-me-questions.cat-be.constants';
import showMeQuestionsCatBeConstants
  from '@shared/constants/show-me-questions/show-me-questions.cat-be.constants';
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
import { QuestionProvider } from '../question';

describe('question provider', () => {

  let questionProvider: QuestionProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        QuestionProvider,
      ],
    });
  });

  beforeEach(() => {
    questionProvider = TestBed.inject(QuestionProvider);
  });

  describe('getTellMeQuestions', () => {
    it('should return the correct questions for a category B test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.B)).toEqual(tellMeQuestionsCatBConstants);
    });
    it('should return the correct questions for a category B+E test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.BE)).toEqual(tellMeQuestionsCatBeConstants);
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
    it('should return no questions for a non-supported category', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.B1)).toEqual([]);
    });
  });

  describe('getShowMeQuestions', () => {
    it('should return the correct questions for a category B test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.B)).toEqual(showMeQuestionsCatBConstants);
    });
    it('should return the correct questions for a category B+E test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.BE)).toEqual(showMeQuestionsCatBeConstants);
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
    it('should return no questions for a non-supported category', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.B1)).toEqual([]);
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
