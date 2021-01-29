import { QuestionResult } from '@dvsa/mes-test-schema/categories/F/partial';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';

export const vehicleChecksNoFaults: CatFUniqueTypes.VehicleChecks = {
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

export const vehicleChecksTwoFaults: CatFUniqueTypes.VehicleChecks = {
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

export const catFTestDataStateObject: CatFUniqueTypes.TestData = {
  drivingFaults: {
    controlsGears: 1,
  },
  seriousFaults: {
    awarenessPlanning: true,
    pedestrianCrossings: true,
  },
  dangerousFaults: {
    useOfSpeed: true,
    ancillaryControls: true,
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
      controlFault: 'DF',
      selected: true,
    },
  },
  controlledStop: {
    fault: 'DF',
    selected: true,
  },
  highwayCodeSafety: {
    selected: true,
    drivingFault: true,
  },
  vehicleChecks: vehicleChecksNoFaults,
};

export const catFTestDataVCStateObject: CatFUniqueTypes.TestData = {
  drivingFaults: {
    controlsGears: 1,
  },
  seriousFaults: {
    awarenessPlanning: true,
    pedestrianCrossings: true,
  },
  dangerousFaults: {
    useOfSpeed: true,
    ancillaryControls: true,
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
      controlFault: 'DF',
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
