import { CombinationCodes } from '@dvsa/mes-test-schema/categories/CPC';

export enum QuestionNumber {
  ONE = 0,
  TWO = 1,
  THREE = 2,
  FOUR = 3,
  FIVE = 4,
}

export interface Combination {
  code: CombinationCodes;
  questions: string[];
  additionalText?: string;
}

export const questionCombinations: Combination[] = [
  {
    code: 'LGV1',
    questions: ['Q06', 'Q04', 'Q03', 'Q11'],
    additionalText: 'Fire ex',
  },
  {
    code: 'LGV2',
    questions: ['Q14', 'Q13', 'Q03', 'Q09'],
    additionalText: 'LSDT',

  },
  {
    code: 'LGV3',
    questions: ['Q01', 'Q02', 'Q03', 'Q09'],
  },
  {
    code: 'LGV4',
    questions: ['Q08', 'Q04', 'Q15', 'Q11'],
    additionalText: 'LSDT & Fire ex',
  },
  {
    code: 'LGV5',
    questions: ['Q14', 'Q02', 'Q07', 'Q09'],
    additionalText: 'LSDT',
  },
  {
    code: 'LGV6',
    questions: ['Q10', 'Q13', 'Q07', 'Q11'],
    additionalText: 'Fire ex',
  },
  {
    code: 'LGV7',
    questions: ['Q12', 'Q04', 'Q15', 'Q11'],
    additionalText: 'Fire ex',
  },
  {
    code: 'LGV8',
    questions: ['Q01', 'Q13', 'Q07', 'Q09'],
  },
  {
    code: 'PCV1',
    questions: ['Q01', 'Q03', 'Q04', 'Q06'],
    additionalText: 'Fire ex',
  },
  {
    code: 'PCV2',
    questions: ['Q07', 'Q10', 'Q17', 'Q09'],
    additionalText: 'Wheel chair',
  },
  {
    code: 'PCV3',
    questions: ['Q02', 'Q10', 'Q18', 'Q11'],
  },
  {
    code: 'PCV4',
    questions: ['Q07', 'Q12', 'Q17', 'Q13'],
    additionalText: 'Wheel chair & Fire ex',
  },
  {
    code: 'PCV5',
    questions: ['Q07', 'Q03', 'Q17', 'Q14'],
    additionalText: 'Wheel chair',
  },
  {
    code: 'PCV6',
    questions: ['Q02', 'Q16', 'Q18', 'Q09'],
  },
  {
    code: 'PCV7',
    questions: ['Q02', 'Q10', 'Q04', 'Q08'],
    additionalText: 'Fire ex',
  },
  {
    code: 'PCV8',
    questions: ['Q01', 'Q12', 'Q18', 'Q15'],
  },
];
