import { QuestionResult } from '@dvsa/mes-test-schema/categories/G/partial';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';

export const vehicleChecksNoFaults: CatGUniqueTypes.VehicleChecks = {
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

export const vehicleChecksTwoFaults: CatGUniqueTypes.VehicleChecks = {
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

export const catGTestDataStateObject: CatGUniqueTypes.TestData = {
  drivingFaults: {
    controlsGears: 1,
    pedestrianCrossings: 2,
    ancillaryControls: 2,
  },
  seriousFaults: {
    controlsGears: true,
    pedestrianCrossings: true,
    ancillaryControls: true,
    awarenessPlanning: true,
  },
  dangerousFaults: {
    controlsGears: true,
    pedestrianCrossings: true,
    ancillaryControls: true,
    awarenessPlanning: true,
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
      controlFault: 'S',
      selected: true,
    },
  },
  controlledStop: {
    fault: 'D',
    selected: true,
  },
  highwayCodeSafety: {
    selected: true,
    seriousFault: true,
  },
  vehicleChecks: vehicleChecksNoFaults,
};
export const catGTestDataVCStateObject: CatGUniqueTypes.TestData = {
  drivingFaults: {
    controlsGears: 1,
    pedestrianCrossings: 2,
    ancillaryControls: 2,
  },
  seriousFaults: {
    controlsGears: true,
    pedestrianCrossings: true,
    ancillaryControls: true,
    awarenessPlanning: true,
  },
  dangerousFaults: {
    controlsGears: true,
    pedestrianCrossings: true,
    ancillaryControls: true,
    awarenessPlanning: true,
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
      controlFault: 'S',
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
