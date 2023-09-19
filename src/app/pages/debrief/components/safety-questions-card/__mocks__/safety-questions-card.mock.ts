import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';

export const getMalformedVehicleChecks = (): QuestionResult[] => {
  return [
    {
      code: 'T1',
      description: 'Safety factors while loading',
    },
    {
      code: 'T2',
      description: 'Reflectors condition',
      outcome: 'DF',
    },
    {
      code: 'S1',
      description: 'All doors secure',
    },
    {
      code: 'S2',
      description: 'Air leaks',
      outcome: 'P',
    },
    {
      code: 'S4',
      description: 'Mudguards condition',
    },
  ];
};
