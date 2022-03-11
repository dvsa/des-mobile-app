import { TestData } from '@dvsa/mes-test-schema/categories/CPC';
import { question, question5 } from '@store/tests/test-data/cat-cpc/__tests__/test-data.cat-cpc.mock';

export const mockToggleEvent = {
  answer: {
    label: 'a description of some kind',
    selected: true,
  },
  questionNumber: 1,
  answerNumber: '2',
  score: 5,
};

export const catCPCTestData: TestData = {
  combination: 'LGV1',
  question1: question('4'),
  question2: question('2'),
  question3: question('5'),
  question4: question('1'),
  question5: question5(),
  totalPercent: 85,
};
