import { QuestionResult } from '@dvsa/mes-test-schema/categories/CE/partial';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';

export const catCETestDataStateObject: CatCEUniqueTypes.TestData = {
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
  vehicleChecks: {
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
  },
};
