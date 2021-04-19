import { SafetyAndBalanceQuestions } from '@dvsa/mes-test-schema/categories/AM2';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector } from '@ngrx/store';

export const getSelectedSafetyQuestions = (
  safetyAndBalanceQuestions: SafetyAndBalanceQuestions,
): QuestionResult[] => safetyAndBalanceQuestions.safetyQuestions;

export const getSelectedBalanceQuestions = (
  safetyAndBalanceQuestions: SafetyAndBalanceQuestions,
): QuestionResult[] => safetyAndBalanceQuestions.balanceQuestions;

export const safetyAndBalanceQuestionsExist = (safetyAndBalanceQuestions: SafetyAndBalanceQuestions): boolean => {
  const questions = [...safetyAndBalanceQuestions.safetyQuestions, ...safetyAndBalanceQuestions.balanceQuestions];
  return questions.some((fault) => !!fault.outcome);
};

export const getSafetyAndBalanceQuestions = createFeatureSelector<SafetyAndBalanceQuestions>(
  'safetyAndBalanceQuestions',
);
