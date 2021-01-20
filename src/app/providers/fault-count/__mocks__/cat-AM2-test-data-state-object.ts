import { SafetyAndBalanceQuestions, TestData } from '@dvsa/mes-test-schema/categories/AM2';
import { CompetencyOutcome } from '../../../shared/models/competency-outcome';

export const catAM2TestDataStateObject: TestData = {
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
    verbal: false,
  },
  eco: {
    adviceGivenControl: false,
    adviceGivenPlanning: false,
  },
  eyesightTest: {
    complete: true,
    seriousFault: false,
  },
};

export const safetyAndBalanceMock0Faults: SafetyAndBalanceQuestions = {};

export const safetyAndBalanceMock2FaultsSafety: SafetyAndBalanceQuestions = {
  safetyQuestions: [
    {
      outcome: CompetencyOutcome.DF,
    },
    {
      outcome: CompetencyOutcome.DF,
    },
  ],
};

export const safetyAndBalanceMock2FaultsSafetyAndBalance: SafetyAndBalanceQuestions = {
  safetyQuestions: [
    {
      outcome: CompetencyOutcome.DF,
    },
  ],
  balanceQuestions: [
    {
      outcome: CompetencyOutcome.DF,
    },
  ],
};

export const safetyAndBalanceMock3FaultsSafetyAndBalance: SafetyAndBalanceQuestions = {
  safetyQuestions: [
    {
      outcome: CompetencyOutcome.DF,
    },
    {
      outcome: CompetencyOutcome.DF,
    },
  ],
  balanceQuestions: [
    {
      outcome: CompetencyOutcome.DF,
    }],
};
