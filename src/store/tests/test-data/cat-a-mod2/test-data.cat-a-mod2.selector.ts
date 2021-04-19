import { TestData, SafetyAndBalanceQuestions } from '@dvsa/mes-test-schema/categories/AM2';
import {
  NUMBER_OF_SAFETY_QUESTIONS,
} from '@shared/constants/safety-questions.cat-a-mod2.constants';
import {
  NUMBER_OF_BALANCE_QUESTIONS,
} from '@shared/constants/balance-questions.cat-a-mod2.constants';
import { Competencies } from '../test-data.constants';

export const getDrivingFaultCount = (
  data: TestData,
  competency: Competencies,
) => data.drivingFaults[competency];

export const getSafetyAndBalanceQuestions = (
  state: TestData,
): SafetyAndBalanceQuestions => state.safetyAndBalanceQuestions;

export const getEyesightTest = (data: TestData) => data.eyesightTest;

export const haveSafetyAndBalanceQuestionsBeenCompleted = (data: SafetyAndBalanceQuestions): boolean => {
  let safetyQuestionComplete = true;
  let balanceQuestionComplete = true;

  if (
    !(data && data.safetyQuestions instanceof Array)
    || data.safetyQuestions.length !== NUMBER_OF_SAFETY_QUESTIONS
  ) {
    safetyQuestionComplete = false;
  } else {
    data.safetyQuestions.forEach((element) => {
      if (element.outcome == null) {
        safetyQuestionComplete = false;
      }
    });
  }

  if (
    !(data && data.balanceQuestions instanceof Array)
    || data.balanceQuestions.length !== NUMBER_OF_BALANCE_QUESTIONS
  ) {
    balanceQuestionComplete = false;
  } else {
    data.balanceQuestions.forEach((element) => {
      if (element.outcome == null) {
        balanceQuestionComplete = false;
      }
    });
  }

  return (safetyQuestionComplete && balanceQuestionComplete);
};
