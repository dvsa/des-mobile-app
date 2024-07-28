import { CombinationCodes, Question, Question5, TestData } from '@dvsa/mes-test-schema/categories/CPC';

export const getCombination = (data: TestData): CombinationCodes => data.combination;
export const getQuestion1 = (data: TestData): Question => data.question1;
export const getQuestion2 = (data: TestData): Question => data.question2;
export const getQuestion3 = (data: TestData): Question => data.question3;
export const getQuestion4 = (data: TestData): Question => data.question4;
export const getQuestion5 = (data: TestData): Question5 => data.question5;
export const getTotalPercent = (data: TestData): number => data.totalPercent;
