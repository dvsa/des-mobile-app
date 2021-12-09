import { TestData } from '@dvsa/mes-test-schema/categories/AM2';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

export const catAM2TestDataStateObject: TestData = {
  testRequirements: {
    normalStart1: true,
    normalStart2: true,
    angledStart: true,
    hillStart: true,
  },
  drivingFaults: {
    controlsThrottle: 2,
    responseToSignsTrafficSigns: 1,
    responseToSignsTrafficControllers: 2,
  },
  seriousFaults: {
    useOfMirrorsChangeSpeed: true,
    signalsTimed: true,
  },
  dangerousFaults: {
    signalsNecessary: true,
  },
  safetyAndBalanceQuestions: {
    safetyQuestions: [{
      code: 'SQ2',
      description: '',
      outcome: CompetencyOutcome.DF,
    }, {
      code: 'SQ4',
      description: '',
      outcome: CompetencyOutcome.DF,
    }],
    balanceQuestions: [{
      code: 'BQ1',
      description: '',
      outcome: CompetencyOutcome.DF,
    }],
    safetyAndBalanceComments: 'Fell over. A lot!',
  },
  eyesightTest: {
    complete: true,
    seriousFault: true,
  },
  ETA: {
    verbal: false,
  },
};
