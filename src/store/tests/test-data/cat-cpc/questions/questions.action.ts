import { createAction, union } from '@ngrx/store';
import { Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { QuestionNumber } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';

export const PopulateQuestions = createAction(
  '[CatCPC] Populate questions',
  (payload: (Question | Question5)[]) => ({ payload }),
);

export const AnswerToggled = createAction(
  '[CatCPC] Answer toggled',
  (toggled: boolean, questionNumber: QuestionNumber, answerNumber: string) => ({
    toggled,
    questionNumber,
    answerNumber,
  }),
);

export const PopulateQuestionScore = createAction(
  '[CatCPC] Populate question score',
  (questionNumber: QuestionNumber, score: number) => ({ questionNumber, score }),
);

const actions = union({
  PopulateQuestions,
  AnswerToggled,
  PopulateQuestionScore,
});

export type QuestionActionTypes = typeof actions;
