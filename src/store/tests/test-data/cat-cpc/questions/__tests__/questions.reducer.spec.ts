import { Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';
import { question, question5 } from '@store/tests/test-data/cat-cpc/__tests__/test-data.cat-cpc.mock';
import { QuestionNumber } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';
import {
  question1Reducer,
  question2Reducer,
  question3Reducer,
  question4Reducer,
  question5Reducer,
} from '../questions.reducer';
import { AnswerToggled, PopulateQuestions, PopulateQuestionScore } from '../questions.action';

const mockQuestions: (Question | Question5)[] = [
  question('1'),
  question('3'),
  question('7'),
  question('2'),
  question5(),
];

const questionNumbers = [
  QuestionNumber.ONE,
  QuestionNumber.TWO,
  QuestionNumber.THREE,
  QuestionNumber.FOUR,
  QuestionNumber.FIVE,
];

const getSpecificReducer = (questionNum: QuestionNumber) => {
  // eslint-disable-next-line default-case
  switch (questionNum) {
    case QuestionNumber.ONE:
      return question1Reducer;
    case QuestionNumber.TWO:
      return question2Reducer;
    case QuestionNumber.THREE:
      return question3Reducer;
    case QuestionNumber.FOUR:
      return question4Reducer;
    case QuestionNumber.FIVE:
      return question5Reducer;
  }
};

describe('questionReducer', () => {
  questionNumbers.forEach((questionNum, index) => {
    describe(`question${index + 1}Reducer`, () => {
      const reducer = getSpecificReducer(questionNum);
      it('should set the questions in the state', () => {
        const result = reducer({} as Question, PopulateQuestions(mockQuestions));
        expect(result).toEqual(mockQuestions[index]);
      });
      it('should update an answers selected value', () => {
        let result = reducer(mockQuestions[index], AnswerToggled(
          false,
          questionNum,
          '2',
        ));
        expect(result.answer2.selected).toEqual(true);
        result = reducer(result, AnswerToggled(
          true,
          questionNum,
          '2',
        ));
        expect(result.answer2.selected).toEqual(false);
      });
      it('should set the question score', () => {
        const result = reducer({} as Question, PopulateQuestionScore(
          questionNum,
          20,
        ));
        expect(result.score).toEqual(20);
      });
    });
  });
});
