import { TestData, SafetyAndBalanceQuestions } from '@dvsa/mes-test-schema/categories/AM2';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import {
  hasSeriousFault,
  hasDangerousFault,
  getETAFaultText,
  getEcoFaultText,
  getShowMeQuestionOptions,
} from '../../common/test-data.selector';
import {
  getDrivingFaultCount,
  haveSafetyAndBalanceQuestionsBeenCompleted,
} from '../test-data.cat-a-mod2.selector';
import { Competencies } from '../../test-data.constants';
import {
  hasEyesightTestBeenCompleted,
  hasEyesightTestGotSeriousFault,
} from '../../common/eyesight-test/eyesight-test.selector';

describe('TestDataSelectors CAT A Mod 2', () => {
  const state: TestData = {
    drivingFaults: {
      controlsGears: 1,
    },
    seriousFaults: {
      awarenessPlanning: true,
    },
    dangerousFaults: {
      useOfSpeed: true,
    },
    ETA: {
      verbal: false,
    },
    eco: {
      adviceGivenControl: false,
      adviceGivenPlanning: false,
    },
    safetyAndBalanceQuestions: {
      balanceQuestions: [
        {
          code: '',
          outcome: CompetencyOutcome.DF,
        },
      ],
      safetyQuestions: [
        {
          code: '',
          outcome: CompetencyOutcome.DF,
        },
        {
          code: '',
          outcome: CompetencyOutcome.DF,
        },
      ],
    },
    eyesightTest: {
      complete: true,
      seriousFault: false,
    },
  };

  describe('hasEyesightTestBeenCompleted', () => {
    it('should return true if the eyesight test is complete', () => {
      expect(hasEyesightTestBeenCompleted(state.eyesightTest)).toBe(true);
    });

    it('should return false if the eyesight test is not complete', () => {
      const newState: TestData = { ...state, eyesightTest: { complete: false } };
      expect(hasEyesightTestBeenCompleted(newState.eyesightTest)).toBe(false);
    });
  });

  describe('hasEyesightTestGotSeriousFault', () => {
    it('should return true if the eyesight test has a serious fault', () => {
      const newState: TestData = { ...state, eyesightTest: { seriousFault: true } };
      expect(hasEyesightTestGotSeriousFault(newState.eyesightTest)).toBe(true);
    });

    it('should return false if the eyesight test does not have a serious fault', () => {
      expect(hasEyesightTestGotSeriousFault(state.eyesightTest)).toBe(false);
    });
  });

  describe('getSafetyQuestionOptions', () => {
    const outcomeBehaviourMapProvider = new OutcomeBehaviourMapProvider();
    outcomeBehaviourMapProvider.setBehaviourMap(behaviourMap);

    const safetyQuestions: VehicleChecksQuestion[] = [
      {
        code: 'SQ1',
        description: 'SQ1 Desc',
        shortName: 'SQ1 short',
      },
      {
        code: 'SQ2',
        description: 'SQ2 Desc',
        shortName: 'SQ2 short',
      },
      {
        code: 'N/A',
        description: 'Not applicable',
        shortName: 'Not applicable',
      },
    ];
    it('should return the list of questions without N/A if outcome field does not have showNotApplicable set', () => {
      const result = getShowMeQuestionOptions(safetyQuestions, '1', outcomeBehaviourMapProvider);
      expect(result.length).toBe(2);
      expect(result[0].code).toBe('SQ1');
      expect(result[1].code).toBe('SQ2');
    });
  });

  describe('getDrivingFaultCount', () => {
    it('should return the driving fault count', () => {
      expect(getDrivingFaultCount(state, Competencies.controlsGears)).toBe(1);
    });
    it('should return undefined when there hasnt been any driving faults', () => {
      expect(getDrivingFaultCount(state, Competencies.controlsParkingBrake)).toBeUndefined();
    });
  });

  describe('hasSeriousFault', () => {
    it('should return true if a competency has a serious fault', () => {
      expect(hasSeriousFault(state, Competencies.awarenessPlanning)).toEqual(true);
    });
    it('should return false if a competency does not have a serious fault', () => {
      expect(hasSeriousFault(state, Competencies.controlsClutch)).toBeFalsy();
    });
  });

  describe('hasDangerousFault', () => {
    it('should return true if a competency has a dangerous fault', () => {
      expect(hasDangerousFault(state, Competencies.useOfSpeed)).toEqual(true);
    });
    it('should return false if a competency does not have a dangerous fault', () => {
      expect(hasDangerousFault(state, Competencies.useOfMirrorsSignalling)).toBeFalsy();
    });
  });

  describe('getETAFaultText', () => {
    it('should return null if no ETA faults', () => {
      const result = getETAFaultText(state.ETA);
      expect(result).toBeUndefined();
    });
    it('should return `Verbal` if just verbal ETA fault', () => {
      const result = getETAFaultText({
        ...state,
        verbal: true,
      });
      expect(result).toEqual('Verbal');
    });
  });

  describe('getEcoFaultText', () => {
    it('should return null if no eco faults', () => {
      const result = getEcoFaultText(state.eco);
      expect(result).toBeUndefined();
    });
    it('should return `Control and Planning` if both eco faults', () => {
      const result = getEcoFaultText({
        ...state,
        adviceGivenControl: true,
        adviceGivenPlanning: true,
      });
      expect(result).toEqual('Control and Planning');
    });
    it('should return `Control` if just control eco fault', () => {
      const result = getEcoFaultText({
        ...state,
        adviceGivenControl: true,
        adviceGivenPlanning: false,
      });
      expect(result).toEqual('Control');
    });
    it('should return `Planning` if just planning eco fault', () => {
      const result = getEcoFaultText({
        ...state,
        adviceGivenControl: false,
        adviceGivenPlanning: true,
      });
      expect(result).toEqual('Planning');
    });
  });

  describe('haveSafetyandBalanceQuestionsBeenCompleted', () => {
    it('should return true if safety and balance questions have been completed with a pass', () => {
      const mockState = {
        safetyQuestions: [
          {
            outcome: CompetencyOutcome.P,
          },
          {
            outcome: CompetencyOutcome.P,
          },
        ],
        balanceQuestions: [
          {
            outcome: CompetencyOutcome.P,
          },
        ],
      } as SafetyAndBalanceQuestions;

      expect(haveSafetyAndBalanceQuestionsBeenCompleted(mockState)).toEqual(true);
    });

    it('should return true if safety and balance questions have been completed with a driving fault', () => {
      const mockState = {
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
          },
        ],
      } as SafetyAndBalanceQuestions;

      expect(haveSafetyAndBalanceQuestionsBeenCompleted(mockState)).toEqual(true);
    });

    it('should return false if safety question outcome is not defined', () => {
      const mockState = {
        safetyQuestions: [
        ],
        balanceQuestions: [
          {
            outcome: CompetencyOutcome.DF,
          },
        ],
      } as SafetyAndBalanceQuestions;

      expect(haveSafetyAndBalanceQuestionsBeenCompleted(mockState)).toEqual(false);
    });
    it('should return false if balance question outcome is not defined', () => {
      const mockState = {
        safetyQuestions: [
          {
            outcome: CompetencyOutcome.DF,
          },
          {
            outcome: CompetencyOutcome.DF,
          },
        ],
        balanceQuestions: [
        ],
      } as SafetyAndBalanceQuestions;
      expect(haveSafetyAndBalanceQuestionsBeenCompleted(mockState)).toEqual(false);
    });
  });
});
