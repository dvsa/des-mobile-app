import { Question, Question5 } from '@dvsa/mes-test-schema/categories/CPC';

export const question = (questionNumber: string): Question => ({
  questionCode: `Q0${questionNumber}`,
  title: 'string',
  subtitle: 'string',
  additionalItems: ['item 1', 'item2'],
  answer1: {
    selected: true,
    label: 'answer 1',
  },
  answer2: {
    selected: true,
    label: 'answer 2',
  },
  answer3: {
    selected: false,
    label: 'answer 3',
  },
  answer4: {
    selected: false,
    label: 'answer 4',
  },
  score: 20,
});

export const question5 = (): Question5 => ({
  questionCode: 'Q05',
  title: 'string',
  subtitle: 'string',
  additionalItems: ['item 1', 'item2'],
  answer1: {
    selected: true,
    label: 'answer 1',
  },
  answer2: {
    selected: true,
    label: 'answer 2',
  },
  answer3: {
    selected: false,
    label: 'answer 3',
  },
  answer4: {
    selected: false,
    label: 'answer 4',
  },
  answer5: {
    selected: true,
    label: 'answer 5',
  },
  answer6: {
    selected: true,
    label: 'answer 6',
  },
  answer7: {
    selected: true,
    label: 'answer 7',
  },
  answer8: {
    selected: true,
    label: 'answer 8',
  },
  answer9: {
    selected: true,
    label: 'answer 9',
  },
  answer10: {
    selected: true,
    label: 'answer 10',
  },
  score: 15,
});
