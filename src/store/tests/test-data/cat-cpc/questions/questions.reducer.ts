import { Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { QuestionNumber } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import { Action, createReducer, on } from '@ngrx/store';
import * as questionActionTypes from './questions.action';

const initialState: Question = {
  questionCode: null,
  title: null,
  subtitle: null,
  additionalItems: [],
  answer1: null,
  answer2: null,
  answer3: null,
  answer4: null,
  score: 0,
};
const additionalAnswers: Partial<Question5> = {
  answer5: null,
  answer6: null,
  answer7: null,
  answer8: null,
  answer9: null,
  answer10: null,
};
const initialStateQ5 = {
  ...initialState,
  ...additionalAnswers,
} as Question5;

const getAnswerNumberKey = (questionNumber: string): string => `answer${questionNumber}`;

export const questionReducer = (
  initState: Question | Question5 = initialState,
  action: questionActionTypes.QuestionActionTypes,
  questionNum: QuestionNumber,
) => createReducer(
  initState,
  on(questionActionTypes.PopulateQuestions, (_, {
    payload,
  }): Question | Question5 => ({
    ...payload[questionNum],
  })),
  on(questionActionTypes.AnswerToggled, (state, {
    toggled,
    questionNumber,
    answerNumber,
  }): Question | Question5 => {
    const key: string = getAnswerNumberKey(answerNumber);
    return (questionNumber === questionNum) ? {
      ...state,
      [key]: {
        selected: !toggled,
        label: state[key].label,
      },
    } : state;
  }),
  on(questionActionTypes.PopulateQuestionScore, (state, {
    questionNumber,
    score,
  }): Question | Question5 => ((questionNumber === questionNum) ? { ...state, score } : state)),
);

/**
 * Wrapper function for passing questionNum param into questionReducer
 * Calling questionReducer as function with params as the return type was not a const it was a const function
 * @param {Question} state
 * @param {Action} action
 * @return {Question | Question5}
 */
export function question1Reducer(
  state: Question = initialState,
  action: Action,
) {
  return questionReducer(
    state,
    action as questionActionTypes.QuestionActionTypes,
    QuestionNumber.ONE,
  )(state, action);
}

export function question2Reducer(
  state: Question = initialState,
  action: Action,
) {
  return questionReducer(
    state,
    action as questionActionTypes.QuestionActionTypes,
    QuestionNumber.TWO,
  )(state, action);
}

export function question3Reducer(
  state: Question = initialState,
  action: Action,
) {
  return questionReducer(
    state,
    action as questionActionTypes.QuestionActionTypes,
    QuestionNumber.THREE,
  )(state, action);
}

export function question4Reducer(
  state: Question = initialState,
  action: Action,
) {
  return questionReducer(
    state,
    action as questionActionTypes.QuestionActionTypes,
    QuestionNumber.FOUR,
  )(state, action);
}

export function question5Reducer(
  state: Question5 = initialStateQ5,
  action: Action,
) {
  return questionReducer(
    state,
    action as questionActionTypes.QuestionActionTypes,
    QuestionNumber.FIVE,
  )(state, action) as Question5;
}
