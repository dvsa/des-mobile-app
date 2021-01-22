import { Question } from '@dvsa/mes-test-schema/categories/CPC';
import { question, question5 } from '../../../../store/tests/test-data/cat-cpc/_tests_/test-data.cat-cpc.mock';
import { lgvQuestion5 } from '../../../shared/constants/cpc-questions/cpc-lgv-questions.constants';
import { pcvQuestion5 } from '../../../shared/constants/cpc-questions/cpc-pcv-questions.constants';
import { Combination } from '../../../shared/constants/cpc-questions/cpc-question-combinations.constants';

export class CpcQuestionsMock {

  getQuestionsBank(): Question[] {
    return [
      question('1'),
      question('3'),
      question('7'),
      question('2'),
      question5(),
    ];
  }

  getQuestion5ByVehicleType(combinationCode: string) {
    return combinationCode.includes('LGV') ? lgvQuestion5 : pcvQuestion5;
  }

  getQuestionScore() {
    return 15;
  }

  getTotalQuestionScore() {
    return 80;
  }

  getCombinations(combinationCode: string): Combination[] {
    if (combinationCode.includes('LGV')) {
      return [
        {
          code: 'LGV1',
          questions: ['Q06', 'Q04', 'Q03', 'Q11'],
        },
        {
          code: 'LGV2',
          questions: ['Q14', 'Q13', 'Q03', 'Q09'],
        },
        {
          code: 'LGV3',
          questions: ['Q01', 'Q02', 'Q03', 'Q09'],
        },
        {
          code: 'LGV4',
          questions: ['Q08', 'Q04', 'Q15', 'Q11'],
        },
        {
          code: 'LGV5',
          questions: ['Q14', 'Q02', 'Q07', 'Q09'],
        },
        {
          code: 'LGV6',
          questions: ['Q10', 'Q13', 'Q07', 'Q11'],
        },
        {
          code: 'LGV7',
          questions: ['Q12', 'Q04', 'Q15', 'Q11'],
        },
        {
          code: 'LGV8',
          questions: ['Q01', 'Q13', 'Q07', 'Q09'],
        },
      ];
    }
    return [
      {
        code: 'PCV1',
        questions: ['Q01', 'Q04', 'Q03', 'Q06'],
      },
      {
        code: 'PCV2',
        questions: ['Q07', 'Q10', 'Q17', 'Q09'],
      },
      {
        code: 'PCV3',
        questions: ['Q02', 'Q10', 'Q18', 'Q11'],
      },
      {
        code: 'PCV4',
        questions: ['Q07', 'Q12', 'Q17', 'Q13'],
      },
      {
        code: 'PCV5',
        questions: ['Q07', 'Q03', 'Q17', 'Q14'],
      },
      {
        code: 'PCV6',
        questions: ['Q02', 'Q16', 'Q18', 'Q09'],
      },
      {
        code: 'PCV7',
        questions: ['Q02', 'Q10', 'Q04', 'Q08'],
      },
      {
        code: 'PCV8',
        questions: ['Q01', 'Q12', 'Q18', 'Q15'],
      },
    ];
  }
}
