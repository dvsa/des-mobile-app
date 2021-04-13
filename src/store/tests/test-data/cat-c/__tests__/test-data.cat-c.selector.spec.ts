import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import {
  hasSeriousFault,
  hasDangerousFault,
  getETAFaultText,
  getEcoFaultText,
} from '../../common/test-data.selector';
import {
  getDrivingFaultCount,
  getManoeuvres,
  hasManoeuvreBeenCompletedCatC,
  areTellMeQuestionsSelected,
  areTellMeQuestionsCorrect,
  hasVehicleChecksBeenCompletedCatC,
} from '../test-data.cat-c.selector';
import { Competencies } from '../../test-data.constants';

describe('TestDataSelectors - CatC', () => {
  const state: CatCUniqueTypes.TestData = {
    drivingFaults: {
      controlsGears: 1,
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
      downhillStart: true,
      uphillStart: true,
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
        selected: true,
        controlFault: CompetencyOutcome.DF,
      },
    },
    vehicleChecks: {
      tellMeQuestions: [
        {
          code: '',
          outcome: CompetencyOutcome.DF,
        },
      ],
      showMeQuestions: [
        {
          code: '',
          outcome: CompetencyOutcome.DF,
        },
      ],
    },
  };

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
    it('should return `Physical and Verbal` if both ETA faults', () => {
      const result = getETAFaultText({
        ...state.ETA,
        physical: true,
        verbal: true,
      });
      expect(result).toEqual('Physical and Verbal');
    });
    it('should return `Physical` if just physical ETA fault', () => {
      const result = getETAFaultText({
        ...state.ETA,
        physical: true,
        verbal: false,
      });
      expect(result).toEqual('Physical');
    });
    it('should return `Verbal` if just verbal ETA fault', () => {
      const result = getETAFaultText({
        ...state.ETA,
        physical: false,
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
        ...state.eco,
        adviceGivenControl: true,
        adviceGivenPlanning: true,
      });
      expect(result).toEqual('Control and Planning');
    });
    it('should return `Control` if just control eco fault', () => {
      const result = getEcoFaultText({
        ...state.eco,
        adviceGivenControl: true,
        adviceGivenPlanning: false,
      });
      expect(result).toEqual('Control');
    });
    it('should return `Planning` if just planning eco fault', () => {
      const result = getEcoFaultText({
        ...state.eco,
        adviceGivenControl: false,
        adviceGivenPlanning: true,
      });
      expect(result).toEqual('Planning');
    });
  });

  describe('getManoeuvres', () => {
    it('should retrive the manoeuvres data when requested', () => {
      const result = getManoeuvres(state);
      expect(result).toEqual(state.manoeuvres);
    });
  });

  describe('hasManoeuvreBeenCompleted', () => {
    it('should return false when no manoeuvres have been completed', () => {
      const mockState: CatCUniqueTypes.TestData = {
        manoeuvres: {},
      };
      expect(hasManoeuvreBeenCompletedCatC(mockState)).toBeFalsy();
    });
    it('should return true when a manoeuvre has been completed', () => {
      const mockState: CatCUniqueTypes.TestData = {
        manoeuvres: {
          reverseLeft: { selected: true },
        },
      };
      expect(hasManoeuvreBeenCompletedCatC(mockState)).toEqual(true);
    });
  });

  describe('vehicle checks selector', () => {
    describe('areTellMeQuestionsSelected', () => {
      it('should return true if there is a tell me question selected', () => {
        const mockState: CatCUniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              code: 'T1',
              description: 'desc',
              outcome: CompetencyOutcome.P,
            },
          ],
        };
        expect(areTellMeQuestionsSelected(mockState)).toBe(true);
      });
      it('should return false if there is no tell me question selected', () => {
        expect(areTellMeQuestionsSelected({})).toBe(false);
      });
    });
    describe('areTellMeQuestionsCorrect', () => {
      const passedState: CatCUniqueTypes.VehicleChecks = {
        tellMeQuestions: [
          {
            code: 'T1',
            description: 'desc',
            outcome: CompetencyOutcome.P,
          },
        ],
      };

      it('should return true if the tell me question is marked as a pass', () => {
        expect(areTellMeQuestionsCorrect(passedState)).toBe(true);
      });
      it('should return false if the tell me question is marked as a driving fault', () => {
        const failedState: CatCUniqueTypes.VehicleChecks = {
          tellMeQuestions: [
            {
              code: 'T1',
              description: 'desc',
              outcome: CompetencyOutcome.D,
            },
          ],
        };
        expect(areTellMeQuestionsCorrect(failedState)).toBe(false);
      });
    });

    describe('hasVehicleChecksBeenCompleted', () => {
      it('should return true if vehicle checks have been completed with a pass', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestions: [
              {
                outcome: CompetencyOutcome.P,
              },
              {
                outcome: CompetencyOutcome.P,
              },
              {
                outcome: CompetencyOutcome.P,
              },
            ],
            tellMeQuestions: [
              {
                outcome: CompetencyOutcome.P,
              },
              {
                outcome: CompetencyOutcome.P,
              },
            ],
          },
        } as CatCUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatC(mockState)).toEqual(true);
      });
      it('should return true if vehicle checks have been completed with a driving fault', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestions: [
              {
                outcome: CompetencyOutcome.DF,
              },
              {
                outcome: CompetencyOutcome.DF,
              },
              {
                outcome: CompetencyOutcome.DF,
              },
            ],
            tellMeQuestions: [
              {
                outcome: CompetencyOutcome.DF,
              },
              {
                outcome: CompetencyOutcome.DF,
              },
            ],
          },
        } as CatCUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatC(mockState)).toEqual(true);
      });
      it('should return true if vehicle checks have been completed with a serious fault', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestions: [
              {
                outcome: CompetencyOutcome.S,
              },
              {
                outcome: CompetencyOutcome.S,
              },
              {
                outcome: CompetencyOutcome.S,
              },
            ],
            tellMeQuestions: [
              {
                outcome: CompetencyOutcome.S,
              },
              {
                outcome: CompetencyOutcome.S,
              },
            ],
          },
        } as CatCUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatC(mockState)).toEqual(true);
      });
      it('should return true if vehicle checks have been completed with a dangerous fault', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestions: [
              {
                outcome: CompetencyOutcome.D,
              },
              {
                outcome: CompetencyOutcome.D,
              },
              {
                outcome: CompetencyOutcome.D,
              },
            ],
            tellMeQuestions: [
              {
                outcome: CompetencyOutcome.D,
              },
              {
                outcome: CompetencyOutcome.D,
              },
            ],
          },
        } as CatCUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatC(mockState)).toEqual(true);
      });
      it('should return false if show me question outcome is not defined', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestions: [
            ],
            tellMeQuestions: [
              {
                outcome: CompetencyOutcome.DF,
              },
              {
                outcome: CompetencyOutcome.DF,
              },
            ],
          },
        } as CatCUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatC(mockState)).toEqual(false);
      });
    });
  });
});
