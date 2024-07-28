import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { SafetyQuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector } from '@ngrx/store';
import { some } from 'lodash-es';

export type CatDSafetyQuestions =
  | CatDUniqueTypes.SafetyQuestions
  | CatD1UniqueTypes.SafetyQuestions
  | CatDEUniqueTypes.SafetyQuestions
  | CatD1EUniqueTypes.SafetyQuestions;

export const getSafetyQuestions = (safetyQuestionsCatDReducer: CatDSafetyQuestions): SafetyQuestionResult[] => {
  return safetyQuestionsCatDReducer.questions;
};

export const safetyQuestionsExist = (safetyQuestions: CatDSafetyQuestions): boolean => {
  const questions = [...safetyQuestions.questions];
  return some(questions, (fault) => fault.outcome != null);
};

export const getSafetyQuestionsCatD = createFeatureSelector<CatDSafetyQuestions>('safetyQuestions');
