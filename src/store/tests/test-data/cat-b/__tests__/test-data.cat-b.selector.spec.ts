import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import { OutcomeBehaviourMapProvider } from 'src/app/providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from 'src/app/pages/office/office-behaviour-map';
import { VehicleChecksQuestion } from 'src/app/providers/question/vehicle-checks-question.model';
import {
  hasSeriousFault,
  getTestRequirements,
  hasDangerousFault,
  getETAFaultText,
  getEcoFaultText,
  getShowMeQuestionOptions,
} from '../../common/test-data.selector';
import {
  getDrivingFaultCount,
  getManoeuvres,
  hasManoeuvreBeenCompletedCatB,
  isTellMeQuestionSelected,
  isTellMeQuestionCorrect,
  isTellMeQuestionDrivingFault,
  hasVehicleChecksBeenCompletedCatB,
  hasEyesightTestGotSeriousFault,
  hasEyesightTestBeenCompleted,
} from '../test-data.cat-b.selector';
import { Competencies } from '../../test-data.constants';

describe('TestDataSelectors', () => {
  const state: CatBUniqueTypes.TestData = {
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
        controlFault: CompetencyOutcome.DF,
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

  describe('hasEyesightTestBeenCompleted', () => {
    it('should return true if the eyesight test is complete', () => {
      expect(hasEyesightTestBeenCompleted(state)).toBe(true);
    });

    it('should return false if the eyesight test is not complete', () => {
      const newState: CatBUniqueTypes.TestData = { ...state, eyesightTest: { complete: false } };
      expect(hasEyesightTestBeenCompleted(newState)).toBe(false);
    });
  });

  describe('hasEyesightTestGotSeriousFault', () => {
    it('should return true if the eyesight test has a serious fault', () => {
      const newState: CatBUniqueTypes.TestData = { ...state, eyesightTest: { seriousFault: true } };
      expect(hasEyesightTestGotSeriousFault(newState)).toBe(true);
    });

    it('should return false if the eyesight test does not have a serious fault', () => {
      expect(hasEyesightTestGotSeriousFault(state)).toBe(false);
    });
  });

  describe('getShowMeQuestionOptions', () => {
    const outcomeBehaviourMapProvider = new OutcomeBehaviourMapProvider();
    outcomeBehaviourMapProvider.setBehaviourMap(behaviourMap);

    const showMeQuestions: VehicleChecksQuestion[] = [
      {
        code: 'S1',
        description: 'S1 Desc',
        shortName: 'S1 short',
      },
      {
        code: 'S2',
        description: 'S2 Desc',
        shortName: 'S2 short',
      },
      {
        code: 'N/A',
        description: 'Not applicable',
        shortName: 'Not applicable',
      },
    ];
    it('should return the list of questions without N/A if outcome field does not have showNotApplicable set', () => {
      const result = getShowMeQuestionOptions(showMeQuestions, '1', outcomeBehaviourMapProvider);
      expect(result.length).toBe(2);
      expect(result[0].code).toBe('S1');
      expect(result[1].code).toBe('S2');
    });
    it('should return extra question if outcome showNotApplicable set', () => {
      const result = getShowMeQuestionOptions(showMeQuestions, '4', outcomeBehaviourMapProvider);
      expect(result.length).toBe(3);
      expect(result[2].code).toBe('N/A');
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

  describe('getTestRequirements', () => {
    it('should return all the properties of testRequirements', () => {
      const result = getTestRequirements(state) as CatBUniqueTypes.TestRequirements;

      expect(result.normalStart1).toEqual(true);
      expect(result.normalStart2).toEqual(true);
      expect(result.angledStart).toEqual(true);
      expect(result.hillStart).toEqual(true);
    });
  });

  describe('getETAFaultText', () => {
    it('should return null if no ETA faults', () => {
      const result = getETAFaultText(state.ETA);
      expect(result).toBeUndefined();
    });
    it('should return `Physical and Verbal` if both ETA faults', () => {
      state.ETA.physical = true;
      state.ETA.verbal = true;
      const result = getETAFaultText(state.ETA);
      expect(result).toEqual('Physical and Verbal');
    });
    it('should return `Physical` if just physical ETA fault', () => {
      state.ETA.physical = true;
      state.ETA.verbal = false;
      const result = getETAFaultText(state.ETA);
      expect(result).toEqual('Physical');
    });
    it('should return `Verbal` if just verbal ETA fault', () => {
      state.ETA.physical = false;
      state.ETA.verbal = true;
      const result = getETAFaultText(state.ETA);
      expect(result).toEqual('Verbal');
    });
  });

  describe('getEcoFaultText', () => {
    it('should return null if no eco faults', () => {
      const result = getEcoFaultText(state.eco);
      expect(result).toBeUndefined();
    });
    it('should return `Control and Planning` if both eco faults', () => {
      state.eco.adviceGivenControl = true;
      state.eco.adviceGivenPlanning = true;
      const result = getEcoFaultText(state.eco);
      expect(result).toEqual('Control and Planning');
    });
    it('should return `Control` if just control eco fault', () => {
      state.eco.adviceGivenControl = true;
      state.eco.adviceGivenPlanning = false;
      const result = getEcoFaultText(state.eco);
      expect(result).toEqual('Control');
    });
    it('should return `Planning` if just planning eco fault', () => {
      state.eco.adviceGivenControl = false;
      state.eco.adviceGivenPlanning = true;
      const result = getEcoFaultText(state.eco);
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
      const mockState: CatBUniqueTypes.TestData = {
        manoeuvres: {},
      };
      expect(hasManoeuvreBeenCompletedCatB(mockState)).toBeFalsy();
    });
    it('should return true when a manoeuvre has been completed', () => {
      const mockState: CatBUniqueTypes.TestData = {
        manoeuvres: {
          forwardPark: { selected: true },
        },
      };
      expect(hasManoeuvreBeenCompletedCatB(mockState)).toEqual(true);
    });
  });

  describe('vehicle checks selector', () => {
    describe('isTellMeQuestionSelected', () => {
      it('should return true if there is a tell me question selected', () => {
        const mockState: CatBUniqueTypes.VehicleChecks = {
          tellMeQuestion: {
            code: 'T1',
            description: 'desc',
            outcome: CompetencyOutcome.P,
          },
        };
        expect(isTellMeQuestionSelected(mockState)).toBe(true);
      });
      it('should return false if there is no tell me question selected', () => {
        expect(isTellMeQuestionSelected({})).toBe(false);
      });
    });
    describe('isTellMeQuestionCorrect', () => {
      const passedState: CatBUniqueTypes.VehicleChecks = {
        tellMeQuestion: {
          code: 'T1',
          description: 'desc',
          outcome: CompetencyOutcome.P,
        },
      };

      it('should return true if the tell me question is marked as a pass', () => {
        expect(isTellMeQuestionCorrect(passedState)).toBe(true);
      });
      it('should return false if the tell me question is marked as a driving fault', () => {
        const failedState = {
          ...passedState,
          tellMeQuestion: {
            outcome: 'DF' as QuestionOutcome,
          },
        };
        expect(isTellMeQuestionCorrect(failedState)).toBe(false);
      });
    });
    describe('isTellMeQuestionDrivingFault', () => {
      const faultState: CatBUniqueTypes.VehicleChecks = {
        tellMeQuestion: {
          code: 'T1',
          description: 'desc',
          outcome: 'DF',
        },
      };

      it('should return true if the tell me question is marked as a pass', () => {
        expect(isTellMeQuestionDrivingFault(faultState)).toBe(true);
      });
      it('should return false if the tell me question is marked as a driving fault', () => {
        const passedState = {
          ...faultState,
          tellMeQuestion: {
            outcome: CompetencyOutcome.P,
          },
        };
        expect(isTellMeQuestionDrivingFault(passedState)).toBe(false);
      });
    });

    describe('hasVehicleChecksBeenCompleted', () => {
      it('should return true if vehicle checks have been completed with a pass', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestion: {
              outcome: CompetencyOutcome.P,
            },
            tellMeQuestion: {
              outcome: CompetencyOutcome.P,
            },
          },
        } as CatBUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatB(mockState)).toEqual(true);
      });
      it('should return true if vehicle checks have been completed with a driving fault', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestion: {
              outcome: CompetencyOutcome.DF,
            },
            tellMeQuestion: {
              outcome: CompetencyOutcome.DF,
            },
          },
        } as CatBUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatB(mockState)).toEqual(true);
      });
      it('should return true if vehicle checks have been completed with a serious fault', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestion: {
              outcome: CompetencyOutcome.S,
            },
            tellMeQuestion: {
              outcome: CompetencyOutcome.S,
            },
          },
        } as CatBUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatB(mockState)).toEqual(true);
      });
      it('should return true if vehicle checks have been completed with a dangerous fault', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestion: {
              outcome: CompetencyOutcome.D,
            },
            tellMeQuestion: {
              outcome: CompetencyOutcome.D,
            },
          },
        } as CatBUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatB(mockState)).toEqual(true);
      });
      it('should return false if show me question outcome is not defined', () => {
        const mockState = {
          vehicleChecks: {
            showMeQuestion: {
            },
            tellMeQuestion: {
              outcome: CompetencyOutcome.DF,
            },
          },
        } as CatBUniqueTypes.TestData;

        expect(hasVehicleChecksBeenCompletedCatB(mockState)).toEqual(false);
      });
    });
  });
});
