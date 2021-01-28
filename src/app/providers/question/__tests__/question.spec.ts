import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { QuestionProvider } from '../question';

import tellMeQuestionsCatBConstants
  from '../../../shared/constants/tell-me-questions/tell-me-questions.cat-b.constants';
import showMeQuestionsCatBConstants
  from '../../../shared/constants/show-me-questions/show-me-questions.cat-b.constants';
import tellMeQuestionsCatBeConstants
  from '../../../shared/constants/tell-me-questions/tell-me-questions.cat-be.constants';
import showMeQuestionsCatBeConstants
  from '../../../shared/constants/show-me-questions/show-me-questions.cat-be.constants';
import tellMeQuestionsCatCConstants
  from '../../../shared/constants/tell-me-questions/tell-me-questions.cat-c.constants';
import showMeQuestionsCatCConstants
  from '../../../shared/constants/show-me-questions/show-me-questions.cat-c.constants';
import tellMeQuestionsCatCeConstants
  from '../../../shared/constants/tell-me-questions/tell-me-questions.cat-ce.constants';
import showMeQuestionsCatCeConstants
  from '../../../shared/constants/show-me-questions/show-me-questions.cat-ce.constants';
import tellMeQuestionsCatDConstants
  from '../../../shared/constants/tell-me-questions/tell-me-questions.cat-d.constants';
import showMeQuestionsCatDConstants
  from '../../../shared/constants/show-me-questions/show-me-questions.cat-d.constants';
import tellMeQuestionsCatDeConstants
  from '../../../shared/constants/tell-me-questions/tell-me-questions.cat-de.constants';
import showMeQuestionsCatDeConstants
  from '../../../shared/constants/show-me-questions/show-me-questions.cat-de.constants';
import safetyQuestionsCatDConstants
  from '../../../shared/constants/safety-questions.cat-d.constants';

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
      expect(questionProvider.getTellMeQuestions(TestCategory.C)).toEqual(tellMeQuestionsCatCConstants);
    });
    it('should return the correct questions for a category CE test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.CE)).toEqual(tellMeQuestionsCatCeConstants);
    });
    it('should return the correct questions for a category C1 test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.C1)).toEqual(tellMeQuestionsCatCConstants);
    });
    it('should return the correct questions for a category C1E test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.C1E)).toEqual(tellMeQuestionsCatCeConstants);
    });
    it('should return the correct questions for a category D test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.D)).toEqual(tellMeQuestionsCatDConstants);
    });
    it('should return the correct questions for a category DE test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.DE)).toEqual(tellMeQuestionsCatDeConstants);
    });
    it('should return the correct questions for a category D1 test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.D1)).toEqual(tellMeQuestionsCatDConstants);
    });
    it('should return the correct questions for a category D1E test', () => {
      expect(questionProvider.getTellMeQuestions(TestCategory.D1E)).toEqual(tellMeQuestionsCatDeConstants);
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
      expect(questionProvider.getShowMeQuestions(TestCategory.C)).toEqual(showMeQuestionsCatCConstants);
    });
    it('should return the correct questions for a category CE test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.CE)).toEqual(showMeQuestionsCatCeConstants);
    });
    it('should return the correct questions for a category C1 test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.C1)).toEqual(showMeQuestionsCatCConstants);
    });
    it('should return the correct questions for a category C1E test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.C1E)).toEqual(showMeQuestionsCatCeConstants);
    });
    it('should return the correct questions for a category D test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.D)).toEqual(showMeQuestionsCatDConstants);
    });
    it('should return the correct questions for a category DE test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.DE)).toEqual(showMeQuestionsCatDeConstants);
    });
    it('should return the correct questions for a category D1 test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.D1)).toEqual(showMeQuestionsCatDConstants);
    });
    it('should return the correct questions for a category D1E test', () => {
      expect(questionProvider.getShowMeQuestions(TestCategory.D1E)).toEqual(showMeQuestionsCatDeConstants);
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
