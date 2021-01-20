import { QuestionResult } from '@dvsa/mes-test-schema/categories/H/partial';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';

export const vehicleChecksNoFaults: CatHUniqueTypes.VehicleChecks = {
  tellMeQuestions: [{
    code: 'string',
    description: 'string',
    outcome: 'P',
  }] as QuestionResult[],
  showMeQuestions: [{
    code: 'string',
    description: 'string',
    outcome: 'P',
  }] as QuestionResult[],
};

export const vehicleChecksTwoFaults: CatHUniqueTypes.VehicleChecks = {
  tellMeQuestions: [{
    code: 'string',
    description: 'string',
    outcome: 'DF',
  }] as QuestionResult[],
  showMeQuestions: [{
    code: 'string',
    description: 'string',
    outcome: 'DF',
  }] as QuestionResult[],
};

export const catHTestDataStateObject: CatHUniqueTypes.TestData = {
  drivingFaults: {},
  seriousFaults: {
    awarenessPlanning: true,
  },
  dangerousFaults: {
    useOfSpeed: true,
  },
  testRequirements: {
    normalStart1: true,
    normalStart2: true,
    angledStart: true,
    uphillStartDesignatedStart: true,
  },
  ETA: {
    physical: false,
    verbal: false,
  },
  eco: {
    adviceGivenControl: false,
    adviceGivenPlanning: false,
  },
  manoeuvres: {
    reverseLeft: {
      controlFault: 'D',
      selected: true,
    },
  },
  controlledStop: {
    fault: 'S',
    selected: true,
  },
  vehicleChecks: vehicleChecksNoFaults,
};
export const catHTestDataVCStateObject: CatHUniqueTypes.TestData = {
  drivingFaults: {},
  seriousFaults: {
    awarenessPlanning: true,
  },
  dangerousFaults: {
    useOfSpeed: true,
  },
  testRequirements: {
    normalStart1: true,
    normalStart2: true,
    angledStart: true,
    uphillStartDesignatedStart: true,
  },
  ETA: {
    physical: false,
    verbal: false,
  },
  eco: {
    adviceGivenControl: false,
    adviceGivenPlanning: false,
  },
  manoeuvres: {
    reverseLeft: {
      controlFault: 'D',
      selected: true,
    },
  },
  vehicleChecks: {
    tellMeQuestions: [{
      code: 'string',
      description: 'string',
      outcome: 'DF',
    }] as QuestionResult[],
    showMeQuestions: [{
      code: 'string',
      description: 'string',
      outcome: 'DF',
    }] as QuestionResult[],
  },
};
