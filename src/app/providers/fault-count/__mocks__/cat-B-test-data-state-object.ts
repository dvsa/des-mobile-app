import { ManoeuvreOutcome } from '@dvsa/mes-test-schema/categories/common';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CompetencyOutcome } from '../../../shared/models/competency-outcome';

export const catBTestDataStateObject: CatBUniqueTypes.TestData = {
  drivingFaults: {
    controlsGears: 1,
    awarenessPlanning: 1,
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
    angledStart: true,
    hillStart: true,
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
    forwardPark: {
      selected: true,
      controlFault: CompetencyOutcome.DF as ManoeuvreOutcome,
    },
  },
  controlledStop: {
    selected: true,
  },
  vehicleChecks: {
    tellMeQuestion: {
      outcome: CompetencyOutcome.DF,
    },
    showMeQuestion: {
      outcome: CompetencyOutcome.P,
    },
  },
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
};
