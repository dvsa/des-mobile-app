import { QuestionResult } from '@dvsa/mes-test-schema/categories/C/partial';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';

export const vehicleChecksNoFaults = {
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

export const vehicleChecksTwoFaults = {
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

export const vehicleChecksFiveFaults = {
  tellMeQuestions: [
    {
      code: 'string',
      description: 'string',
      outcome: 'DF',
    },
    {
      code: 'string',
      description: 'string',
      outcome: 'DF',
    },
    {
      code: 'string',
      description: 'string',
      outcome: 'DF',
    },
  ] as QuestionResult[],
  showMeQuestions: [
    {
      code: 'string',
      description: 'string',
      outcome: 'DF',
    },
    {
      code: 'string',
      description: 'string',
      outcome: 'DF',
    },
  ] as QuestionResult[],
};

export const catCTestDataStateObject: CatCUniqueTypes.TestData = {
  drivingFaults: {
    controlsGears: 1,
    pedestrianCrossings: 2,
    ancillaryControls: 1,
  },
  seriousFaults: {
    awarenessPlanning: true,
  },
  dangerousFaults: {
    useOfSpeed: true,
  },
  testRequirements: {
    normalStart1: true,
    normalStart2: true,
    angledStartControlledStop: true,
    uphillStart: true,
    downhillStart: true,
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
      controlFault: 'DF',
      selected: true,
    },
  },
  vehicleChecks: vehicleChecksNoFaults,
};
