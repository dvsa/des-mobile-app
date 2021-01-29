import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CompetencyOutcome } from '../../../shared/models/competency-outcome';

export const catADI2TestDataStateObjectNoDrivingFaults: CatADI2UniqueTypes.TestData = {
  drivingFaults: {},
  dangerousFaults: {},
  seriousFaults: {},
  vehicleChecks: {
    tellMeQuestions: [
      {
        code: 'T1',
        description: 'Brakes',
        outcome: 'P',
      },
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'P',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'P',
      },
    ],
  },
  eco: {},
  ETA: {},
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
  testRequirements: {},
  manoeuvres: [],
  controlledStop: {},
};

export const catADI2TestDataStateObjectManoeuvreFaults: CatADI2UniqueTypes.TestData = {
  drivingFaults: {},
  dangerousFaults: {},
  seriousFaults: {},
  vehicleChecks: {
    tellMeQuestions: [
      {
        code: 'T1',
        description: 'Brakes',
        outcome: 'P',
      },
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'P',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'P',
      },
    ],
  },
  eco: {},
  ETA: {},
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
  testRequirements: {},
  manoeuvres: [
    {
      reverseParkCarpark: {
        selected: true,
        controlFault: 'DF',
      },
    },
  ],
  controlledStop: {},
};

export const catADI2TestDataStateObjectShowMeFaults: CatADI2UniqueTypes.TestData = {
  drivingFaults: {},
  dangerousFaults: {},
  seriousFaults: {},
  vehicleChecks: {
    tellMeQuestions: [
      {
        code: 'T1',
        description: 'Brakes',
        outcome: 'P',
      },
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'P',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'P',
      },
    ],
    showMeQuestions: [
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'DF',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'DF',
      },
    ],
  },
  eco: {},
  ETA: {},
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
  testRequirements: {},
  manoeuvres: [],
  controlledStop: {},
};

export const catADI2TestDataStateObjectTellMeFaults: CatADI2UniqueTypes.TestData = {
  drivingFaults: {},
  dangerousFaults: {},
  seriousFaults: {},
  vehicleChecks: {
    tellMeQuestions: [
      {
        code: 'T1',
        description: 'Brakes',
        outcome: 'DF',
      },
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'DF',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'P',
      },
    ],
    showMeQuestions: [
      {
        code: 'T1',
        description: 'something',
        outcome: 'P',
      },
      {
        code: 'T2',
        description: 'something else',
        outcome: 'P',
      },
    ],
  },
  eco: {},
  ETA: {},
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
  testRequirements: {},
  manoeuvres: [],
  controlledStop: {},
};

export const catADI2TestDataStateObjectTellShowMeFaults: CatADI2UniqueTypes.TestData = {
  drivingFaults: {},
  dangerousFaults: {},
  seriousFaults: {},
  vehicleChecks: {
    tellMeQuestions: [
      {
        code: 'T1',
        description: 'Brakes',
        outcome: 'P',
      },
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'P',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'P',
      },
    ],
    showMeQuestions: [
      {
        code: 'T1',
        description: 'something',
        outcome: 'DF',
      },
      {
        code: 'T2',
        description: 'something else',
        outcome: 'DF',
      },
    ],
  },
  eco: {},
  ETA: {},
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
  testRequirements: {},
  manoeuvres: [],
  controlledStop: {},
};

export const catADI2TestDataStateObjectControlledStopDrivingFaults: CatADI2UniqueTypes.TestData = {
  drivingFaults: {},
  dangerousFaults: {},
  seriousFaults: {},
  vehicleChecks: {
    tellMeQuestions: [
      {
        code: 'T1',
        description: 'Brakes',
        outcome: 'P',
      },
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'P',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'P',
      },
    ],
  },
  eco: {},
  ETA: {},
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
  testRequirements: {},
  manoeuvres: [],
  controlledStop: {
    fault: 'DF',
    selected: true,
  },
};

export const catADI2TestDataStateObjectSeriousFaults: CatADI2UniqueTypes.TestData = {
  drivingFaults: {},
  dangerousFaults: {},
  seriousFaults: {
    useOfMirrorsChangeDirection: true,
  },
  vehicleChecks: {
    tellMeQuestions: [
      {
        code: 'T1',
        description: 'Brakes',
        outcome: 'P',
      },
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'P',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'P',
      },
    ],
    showMeQuestions: [
      {
        outcome: CompetencyOutcome.DF,
      },
    ],
    seriousFault: true,
    dangerousFault: false,
  },
  eco: {},
  ETA: {},
  eyesightTest: {
    complete: true,
    seriousFault: true,
  },
  testRequirements: {},
  manoeuvres: [
    {
      reverseParkCarpark: {
        selected: true,
        controlFault: CompetencyOutcome.S,
      },
    },
  ],
  controlledStop: {
    fault: CompetencyOutcome.S,
    selected: true,
  },
};

export const catADI2TestDataStateObjectDangerousFaults: CatADI2UniqueTypes.TestData = {
  drivingFaults: {},
  dangerousFaults: {
    useOfMirrorsChangeDirection: true,
  },
  seriousFaults: {},
  vehicleChecks: {
    tellMeQuestions: [
      {
        code: 'T1',
        description: 'Brakes',
        outcome: 'P',
      },
      {
        code: 'T2',
        description: 'Tyre pressures',
        outcome: 'P',
      },
      {
        code: 'T3',
        description: 'Head restraint',
        outcome: 'P',
      },
    ],
    showMeQuestions: [
      {
        outcome: CompetencyOutcome.DF,
      },
    ],
    seriousFault: false,
    dangerousFault: true,
  },
  eco: {},
  ETA: {},
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
  testRequirements: {},
  manoeuvres: [
    {
      reverseParkCarpark: {
        selected: true,
        controlFault: CompetencyOutcome.D,
      },
    },
  ],
  controlledStop: {
    fault: CompetencyOutcome.D,
    selected: true,
  },
};
