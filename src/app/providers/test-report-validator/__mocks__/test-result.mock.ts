import { TestData as CatAMod2TestData } from '@dvsa/mes-test-schema/categories/AM2';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { CompetencyOutcome } from '../../../shared/models/competency-outcome';
import { legalRequirementsLabels } from '../../../shared/constants/legal-requirements/legal-requirements.constants';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';

export const validTestCatAMod2: CatAMod2TestData = {
  testRequirements: {
    angledStart: true,
    hillStart: true,
    normalStart1: true,
    normalStart2: true,
  },
  safetyAndBalanceQuestions: {
    safetyQuestions: [
      {
        code: 'S03',
        description: 'Mock safety question number 1.',
        outcome: CompetencyOutcome.P,
      },
      {
        code: 'S04',
        description: 'Mock safety question number 2.',
        outcome: CompetencyOutcome.P,
      },
    ],
    balanceQuestions: [
      {
        code: 'B03',
        description: 'Mock balance question.',
        outcome: CompetencyOutcome.P,
      },
    ],
  },
  eco: {
    completed: true,
  },
};

export const validTestCatADIPart2: CatADI2UniqueTypes.TestData = {
  testRequirements: {
    angledStart: true,
    downhillStart: true,
    uphillStart: true,
    normalStart1: true,
    normalStart2: true,
  },
  vehicleChecks: {
    showMeQuestions: [
      {
        outcome: CompetencyOutcome.P,
      },
      {
        outcome: CompetencyOutcome.P,
      },
      {
        outcome: CompetencyOutcome.P,
      },
    ],
    tellMeQuestions: [
      {
        outcome: CompetencyOutcome.P,
      },
      {
        outcome: CompetencyOutcome.P,
      },
      {
        outcome: CompetencyOutcome.P,
      },
    ],
    vehicleChecksCompleted: true,
  },
  manoeuvres: [
    {
      reverseRight: {
        selected: true,
      },
    },
    {
      reverseParkCarpark: {
        selected: true,
      },
    },
  ],
  eco: {
    completed: true,
  },
};

export const validTestCatB: CatBUniqueTypes.TestData = {
  testRequirements: {
    angledStart: true,
    hillStart: true,
    normalStart1: true,
    normalStart2: true,
  },
  vehicleChecks: {
    showMeQuestion: {
      outcome: CompetencyOutcome.P,
    },
    tellMeQuestion: {
      outcome: CompetencyOutcome.P,
    },
  },
  manoeuvres: {
    forwardPark: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
};

export const validTestCatBE: CatBEUniqueTypes.TestData = {
  testRequirements: {
    angledStartControlledStop: true,
    normalStart2: true,
    uphillStart: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
  uncoupleRecouple: {
    selected: true,
  },
};

export const validDelegatedTestCatBE: CatBEUniqueTypes.TestData = {
  testRequirements: {
    angledStartControlledStop: true,
    normalStart2: false,
    uphillStart: false,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
  uncoupleRecouple: {
    selected: true,
  },
};

export const validTestCatC: CatCUniqueTypes.TestData = {
  testRequirements: {
    angledStartControlledStop: true,
    normalStart2: true,
    uphillStart: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
};

export const validDelegatedTestCatCAndC1: CatCUniqueTypes.TestData = {
  testRequirements: {
    angledStartControlledStop: true,
    normalStart2: false,
    uphillStart: false,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
};

export const validTestCatC1: CatC1UniqueTypes.TestData = {
  testRequirements: {
    angledStartControlledStop: true,
    normalStart2: true,
    uphillStart: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
};

export const validDelegatedTestCatCEAndC1E: CatCEUniqueTypes.TestData | CatCEUniqueTypes.TestData = {
  testRequirements: {
    angledStartControlledStop: true,
    normalStart2: false,
    uphillStart: false,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
  uncoupleRecouple: {
    selected: true,
  },
};

export const validTestCatCE: CatCEUniqueTypes.TestData = {
  testRequirements: {
    angledStartControlledStop: true,
    normalStart2: true,
    uphillStart: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
  uncoupleRecouple: {
    selected: true,
  },
};

export const validTestCatC1E: CatC1EUniqueTypes.TestData = {
  testRequirements: {
    angledStartControlledStop: true,
    normalStart2: true,
    uphillStart: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
  uncoupleRecouple: {
    selected: true,
  },
};

export const validDelegatedTestCatDAndD1: CatD1UniqueTypes.TestData | CatDUniqueTypes.TestData = {
  testRequirements: {
    busStop1: false,
    busStop2: false,
    angledStartControlledStop: true,
    uphillStart: false,
  } as CatDUniqueTypes.TestRequirements | CatD1UniqueTypes.TestRequirements,
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
};

export const validTestCatD: CatDUniqueTypes.TestData = {
  testRequirements: {
    busStop1: true,
    busStop2: true,
    angledStartControlledStop: true,
    uphillStart: true,
  } as CatDUniqueTypes.TestRequirements,
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
};

export const validDelegatedTestCatD1AndD1E: CatD1UniqueTypes.TestData | CatD1EUniqueTypes.TestData = {
  testRequirements: {
    normalStart1: true,
    normalStart2: true,
    angledStartControlledStop: true,
    uphillStart: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
  uncoupleRecouple: {
    selected: true,
  },
};

export const validTestCatD1: CatD1UniqueTypes.TestData = {
  testRequirements: {
    normalStart1: true,
    normalStart2: true,
    angledStartControlledStop: true,
    uphillStart: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
};

export const validTestCatDE: CatDEUniqueTypes.TestData = {
  testRequirements: {
    busStop1: true,
    busStop2: true,
    angledStartControlledStop: true,
    uphillStart: true,
  } as CatDEUniqueTypes.TestRequirements,
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
  uncoupleRecouple: {
    selected: true,
  },
};

export const validTestCatD1E: CatD1EUniqueTypes.TestData = {
  testRequirements: {
    normalStart1: true,
    normalStart2: true,
    angledStartControlledStop: true,
    uphillStart: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  eco: {
    completed: true,
  },
  uncoupleRecouple: {
    selected: true,
  },
};

export const validTestCatF: CatFUniqueTypes.TestData = {
  testRequirements: {
    angledStart: true,
    normalStart1: true,
    normalStart2: true,
    uphillStartDesignatedStart: true,
  },
  eco: {
    completed: true,
  },
  highwayCodeSafety: {
    selected: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  controlledStop: {
    selected: true,
  },
};

export const validTestCatG: CatGUniqueTypes.TestData = {
  testRequirements: {
    angledStart: true,
    normalStart1: true,
    normalStart2: true,
    uphillStartDesignatedStart: true,
  },
  eco: {
    completed: true,
  },
  highwayCodeSafety: {
    selected: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  controlledStop: {
    selected: true,
  },
};

export const validTestCatH: CatHUniqueTypes.TestData = {
  testRequirements: {
    angledStart: true,
    normalStart1: true,
    normalStart2: true,
    uphillStartDesignatedStart: true,
  },
  eco: {
    completed: true,
  },
  highwayCodeSafety: {
    selected: true,
  },
  manoeuvres: {
    reverseLeft: {
      selected: true,
    },
  },
  controlledStop: {
    selected: true,
  },
};

export const validTestCatK: CatKUniqueTypes.TestData = {
  testRequirements: {
    angledStart: true,
    normalStart1: true,
    normalStart2: true,
    uphillStartDesignatedStart: true,
  },
  eco: {
    completed: true,
  },
  highwayCodeSafety: {
    selected: true,
  },
  controlledStop: {
    selected: true,
  },
};

export const legalRequirementsAMod2 = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.angledStart,
  legalRequirementsLabels.hillStart,
  legalRequirementsLabels.safetyAndBalanceQuestions,
  legalRequirementsLabels.eco,
];

export const legalRequirementsADIPart2 = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.angledStart,
  legalRequirementsLabels.uphillStart,
  legalRequirementsLabels.downhillStart,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.vehicleChecks,
  legalRequirementsLabels.eco,
];

export const legalRequirementsB = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.angledStart,
  legalRequirementsLabels.hillStart,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.vehicleChecks,
  legalRequirementsLabels.eco,
];

export const legalRequirementsBE = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.uphillStart,
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.uncoupleRecouple,
];

export const delegatedRequirementsBE = [
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.uncoupleRecouple,
];

export const legalRequirementsCatCAndC1 = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.uphillStart,
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
];

export const delegatedRequirementsCatCAndC1 = [
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
];

export const legalRequirementsCatCEAndC1E = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.uphillStart,
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.uncoupleRecouple,
];

export const delegatedRequirementsCatCEAndC1E = [
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.uncoupleRecouple,
];

export const legalRequirementsCatD = [
  legalRequirementsLabels.busStop1,
  legalRequirementsLabels.busStop2,
  legalRequirementsLabels.uphillStart,
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
];

export const delegatedRequirementsCatDAndD1 = [
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
];

export const legalRequirementsCatD1 = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.uphillStart,
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
];

export const legalRequirementsCatDE = [
  legalRequirementsLabels.busStop1,
  legalRequirementsLabels.busStop2,
  legalRequirementsLabels.uphillStart,
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.uncoupleRecouple,
];

export const delegatedRequirementsCatDEAndD1E = [
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.uncoupleRecouple,
];

export const legalRequirementsCatD1E = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.uphillStart,
  legalRequirementsLabels.angledStartControlledStop,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.uncoupleRecouple,
];

export const legalRequirementsCatF = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.angledStart,
  legalRequirementsLabels.uphillStartDesignatedStart,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.highwayCodeSafety,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.controlledStop,
];

export const legalRequirementsCatG = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.angledStart,
  legalRequirementsLabels.uphillStartDesignatedStart,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.highwayCodeSafety,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.controlledStop,
];

export const legalRequirementsCatH = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.angledStart,
  legalRequirementsLabels.uphillStartDesignatedStart,
  legalRequirementsLabels.manoeuvre,
  legalRequirementsLabels.highwayCodeSafety,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.controlledStop,
];

export const legalRequirementsCatK = [
  legalRequirementsLabels.normalStart1,
  legalRequirementsLabels.normalStart2,
  legalRequirementsLabels.angledStart,
  legalRequirementsLabels.uphillStartDesignatedStart,
  legalRequirementsLabels.highwayCodeSafety,
  legalRequirementsLabels.eco,
  legalRequirementsLabels.controlledStop,
];
