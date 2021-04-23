import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { CatHomeTestData } from '@shared/unions/test-schema-unions';
import {
  getManoeuvres,
  getVehicleChecks,
  hasManoeuvreBeenCompletedCatHomeTest,
  hasVehicleChecksBeenCompletedCatHomeTest,
} from '../test-data.cat-home.selector';

describe('TestDataSelectors', () => {
  const state: CatHomeTestData = {
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

  describe('getManoeuvres', () => {
    it('should retrieve the manoeuvres data when requested', () => {
      const result = getManoeuvres(state);
      expect(result).toEqual(state.manoeuvres);
    });
  });

  describe('hasManoeuvreBeenCompleted', () => {
    it('should return undefined when manoeuvres are not present', () => {
      const localState: CatHomeTestData = {};
      expect(hasManoeuvreBeenCompletedCatHomeTest(localState)).toEqual(undefined);
    });
    it('should return false when no manoeuvres have been completed', () => {
      const localState: CatHomeTestData = {
        manoeuvres: {},
      };
      expect(hasManoeuvreBeenCompletedCatHomeTest(localState)).toBeFalsy();
    });
    it('should return true when a manoeuvre has been completed', () => {
      const localState: CatHomeTestData = {
        manoeuvres: {
          reverseLeft: { selected: true },
        },
      };
      expect(hasManoeuvreBeenCompletedCatHomeTest(localState)).toEqual(true);
    });
  });

  describe('getVehicleChecks', () => {
    it('should retrieve the vehicle checks data when requested', () => {
      const result = getVehicleChecks(state);
      expect(result).toEqual(state.vehicleChecks);
    });
  });

  describe('hasVehicleChecksBeenCompleted', () => {
    it('should return true if vehicle checks have been completed with a pass', () => {
      const localState = {
        vehicleChecks: {
          showMeQuestions: [
            {
              outcome: CompetencyOutcome.P,
            },
          ],
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.P,
            },
          ],
        },
      } as CatHomeTestData;

      expect(hasVehicleChecksBeenCompletedCatHomeTest(localState)).toEqual(true);
    });
    it('should return true if vehicle checks have been completed with a driving fault', () => {
      const localState = {
        vehicleChecks: {
          showMeQuestions: [
            {
              outcome: CompetencyOutcome.DF,
            },
          ],
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.DF,
            },
          ],
        },
      } as CatHomeTestData;

      expect(hasVehicleChecksBeenCompletedCatHomeTest(localState)).toEqual(true);
    });
    it('should return true if vehicle checks have been completed with a serious fault', () => {
      const localState = {
        vehicleChecks: {
          showMeQuestions: [
            {
              outcome: CompetencyOutcome.S,
            },
          ],
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.S,
            },
          ],
        },
      } as CatHomeTestData;

      expect(hasVehicleChecksBeenCompletedCatHomeTest(localState)).toEqual(true);
    });
    it('should return true if vehicle checks have been completed with a dangerous fault', () => {
      const localState = {
        vehicleChecks: {
          showMeQuestions: [
            {
              outcome: CompetencyOutcome.D,
            },
          ],
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.D,
            },
          ],
        },
      } as CatHomeTestData;

      expect(hasVehicleChecksBeenCompletedCatHomeTest(localState)).toEqual(true);
    });
    it('should return false if show me question outcome is not defined', () => {
      const localState = {
        vehicleChecks: {
          showMeQuestions: [
          ],
          tellMeQuestions: [
            {
              outcome: CompetencyOutcome.DF,
            },
          ],
        },
      } as CatHomeTestData;

      expect(hasVehicleChecksBeenCompletedCatHomeTest(localState)).toEqual(false);
    });
  });
});
