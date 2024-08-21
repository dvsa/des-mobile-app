import { TestBed, waitForAsync } from '@angular/core/testing';
import { TestData as CatAMod1TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { TestData } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { FaultCountProvider } from '../../fault-count/fault-count';
import * as mocks from '../__mocks__/test-result.mock';
import { TestReportValidatorProvider } from '../test-report-validator';
import { SpeedCheckState } from '../test-report-validator.constants';

describe('TestReportValidator', () => {
  const categories = [
    {
      category: TestCategory.EUAM2,
      validTest: mocks.validTestCatAMod2,
      legalReqs: mocks.legalRequirementsAMod2,
    },
    {
      category: TestCategory.B,
      validTest: mocks.validTestCatB,
      legalReqs: mocks.legalRequirementsB,
    },
    {
      category: TestCategory.C,
      validTest: mocks.validTestCatC,
      legalReqs: mocks.legalRequirementsCatCAndC1,
    },
    {
      category: TestCategory.C1,
      validTest: mocks.validTestCatC1,
      legalReqs: mocks.legalRequirementsCatCAndC1,
    },
    {
      category: TestCategory.CE,
      validTest: mocks.validTestCatCE,
      legalReqs: mocks.legalRequirementsCatCEAndC1E,
    },
    {
      category: TestCategory.C1E,
      validTest: mocks.validTestCatC1E,
      legalReqs: mocks.legalRequirementsCatCEAndC1E,
    },
    {
      category: TestCategory.D,
      validTest: mocks.validTestCatD,
      legalReqs: mocks.legalRequirementsCatD,
    },
    {
      category: TestCategory.D1,
      validTest: mocks.validTestCatD1,
      legalReqs: mocks.legalRequirementsCatD1,
    },
    {
      category: TestCategory.DE,
      validTest: mocks.validTestCatDE,
      legalReqs: mocks.legalRequirementsCatDE,
    },
    {
      category: TestCategory.D1E,
      validTest: mocks.validTestCatD1E,
      legalReqs: mocks.legalRequirementsCatD1E,
    },
    {
      category: TestCategory.F,
      validTest: mocks.validTestCatF,
      legalReqs: mocks.legalRequirementsCatF,
    },
    {
      category: TestCategory.G,
      validTest: mocks.validTestCatG,
      legalReqs: mocks.legalRequirementsCatG,
    },
    {
      category: TestCategory.H,
      validTest: mocks.validTestCatH,
      legalReqs: mocks.legalRequirementsCatH,
    },
    {
      category: TestCategory.K,
      validTest: mocks.validTestCatK,
      legalReqs: mocks.legalRequirementsCatK,
    },
    {
      category: TestCategory.ADI2,
      validTest: mocks.validTestCatADIPart2,
      legalReqs: mocks.legalRequirementsADIPart2,
    },
  ];
  const delegatedCategories = [
    {
      category: TestCategory.C,
      validTest: mocks.validDelegatedTestCatCAndC1,
      delegatedRequirements: mocks.delegatedRequirementsCatCAndC1,
    },
    {
      category: TestCategory.C1,
      validTest: mocks.validDelegatedTestCatCAndC1,
      delegatedRequirements: mocks.delegatedRequirementsCatCAndC1,
    },
    {
      category: TestCategory.C1E,
      validTest: mocks.validDelegatedTestCatCEAndC1E,
      delegatedRequirements: mocks.delegatedRequirementsCatCEAndC1E,
    },
    {
      category: TestCategory.CE,
      validTest: mocks.validDelegatedTestCatCEAndC1E,
      delegatedRequirements: mocks.delegatedRequirementsCatCEAndC1E,
    },
    {
      category: TestCategory.D,
      validTest: mocks.validDelegatedTestCatDAndD1,
      delegatedRequirements: mocks.delegatedRequirementsCatDAndD1,
    },
    {
      category: TestCategory.D1,
      validTest: mocks.validDelegatedTestCatDAndD1,
      delegatedRequirements: mocks.delegatedRequirementsCatDAndD1,
    },
    {
      category: TestCategory.DE,
      validTest: mocks.validDelegatedTestCatD1AndD1E,
      delegatedRequirements: mocks.delegatedRequirementsCatDEAndD1E,
    },
    {
      category: TestCategory.D1E,
      validTest: mocks.validDelegatedTestCatD1AndD1E,
      delegatedRequirements: mocks.delegatedRequirementsCatDEAndD1E,
    },
  ];

  let testReportValidatorProvider: TestReportValidatorProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [TestReportValidatorProvider, FaultCountProvider],
    });

    testReportValidatorProvider = TestBed.inject(TestReportValidatorProvider);
  }));

  describe('isTestReportValid', () => {
    categories.forEach((cat) => {
      it(`should return true if the test report is valid for a Cat ${cat.category} test`, () => {
        const result = testReportValidatorProvider.isTestReportValid(cat.validTest, cat.category);
        expect(result).toEqual(true);
      });
      it(`should return false if the test report is not valid for a Cat ${cat.category} test`, () => {
        const result = testReportValidatorProvider.isTestReportValid({}, cat.category);
        expect(result).toEqual(false);
      });
    });
  });
  describe('getMissingLegalRequirements', () => {
    const emptyLegal = 'should return an empty array if the legal requirements are met for a Cat';
    const missingLegal = 'should return any missing legal requirements for a Cat';

    categories.forEach((cat) => {
      it(`${emptyLegal} ${cat.category} test`, () => {
        const result = testReportValidatorProvider.getMissingLegalRequirements(cat.validTest, cat.category);
        expect(result).toEqual([]);
      });
      it(`${missingLegal} ${cat.category} test`, () => {
        const result = testReportValidatorProvider.getMissingLegalRequirements({}, cat.category);
        expect(result).toEqual(cat.legalReqs);
      });
    });
    delegatedCategories.forEach((cat) => {
      it(`${emptyLegal} ${cat.category} delegated test`, () => {
        const result = testReportValidatorProvider.getMissingLegalRequirements(cat.validTest, cat.category, true);
        expect(result).toEqual([]);
      });
      it(`${missingLegal} ${cat.category} delegated test`, () => {
        const result = testReportValidatorProvider.getMissingLegalRequirements({}, cat.category, true);
        expect(result).toEqual(cat.delegatedRequirements);
      });
    });
  });
  describe('isETAValid', () => {
    it('should return true if there is no ETA fault', () => {
      const result = testReportValidatorProvider.isETAValid({}, TestCategory.B);
      expect(result).toEqual(true);
    });
    it('should return true if there is a ETA and a Dangerous Fault', () => {
      const data: TestData = {
        ETA: {
          verbal: true,
        },
        dangerousFaults: {
          ancillaryControls: true,
        },
      };

      const result = testReportValidatorProvider.isETAValid(data, TestCategory.B);
      expect(result).toEqual(true);
    });
    it('should return true if there is a Dangerous Fault and no ETA', () => {
      const data: TestData = {
        dangerousFaults: {
          controlsGears: true,
        },
      };

      const result = testReportValidatorProvider.isETAValid(data, TestCategory.B);
      expect(result).toEqual(true);
    });
  });

  describe('validateSpeedChecksCatAMod1', () => {
    it('should return EMERGENCY_STOP_MISSING when speed not met is true & speed is not recorded', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: undefined,
          outcome: CompetencyOutcome.S,
        },
        avoidance: {
          firstAttempt: 1,
          secondAttempt: 1,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.EMERGENCY_STOP_MISSING);
    });

    it('should return SpeedCheckState.NOT_MET when emergency stop speed not met is true & speed is recorded', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: 48,
          secondAttempt: 1,
          outcome: CompetencyOutcome.S,
        },
        avoidance: {
          firstAttempt: 7,
          secondAttempt: 5,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.NOT_MET);
    });

    it('should return AVOIDANCE_MISSING when speed not met is true & speed is not recorded', () => {
      const testData = {
        avoidance: {
          firstAttempt: undefined,
          secondAttempt: undefined,
          outcome: CompetencyOutcome.S,
        },
        emergencyStop: {
          firstAttempt: 1,
          secondAttempt: 1,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.AVOIDANCE_MISSING);
    });

    it('should return SpeedCheckState.VALID when avoidance speed not met is true & speed is recorded', () => {
      const testData = {
        avoidance: {
          firstAttempt: 48,
          secondAttempt: 48,
        },
        emergencyStop: {
          firstAttempt: 56,
          secondAttempt: 56,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.VALID);
    });

    it('should return VALID when avoidance speed not met first attempt is recorded but has Serious fault', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: 56,
          secondAttempt: 56,
        },
        singleFaultCompetencies: {
          avoidance: CompetencyOutcome.S,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.VALID);
    });

    it('should return VALID when avoidance speed not met first attempt is recorded but has Dangerous fault', () => {
      const testData = {
        avoidance: {
          firstAttempt: 48,
          secondAttempt: 48,
        },
        emergencyStop: {
          firstAttempt: 56,
          secondAttempt: 56,
        },
        singleFaultCompetencies: {
          avoidance: CompetencyOutcome.D,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.VALID);
    });

    it('should return SpeedCheckState.EMERGENCY_STOP_SERIOUS_FAULT', () => {
      const testData = {
        singleFaultCompetencies: {
          emergencyStop: CompetencyOutcome.S,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.EMERGENCY_STOP_SERIOUS_FAULT);
    });

    it('should return SpeedCheckState.EMERGENCY_STOP_DANGEROUS_FAULT', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: 55,
        },
        singleFaultCompetencies: {
          emergencyStop: CompetencyOutcome.D,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.EMERGENCY_STOP_DANGEROUS_FAULT);
    });

    it('should return SpeedCheckState.EMERGENCY_STOP_AND_AVOIDANCE_MISSING', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: undefined,
        },
        avoidance: {
          firstAttempt: undefined,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.EMERGENCY_STOP_AND_AVOIDANCE_MISSING);
    });

    it('should return SpeedCheckState.EMERGENCY_STOP_MISSING', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: undefined,
        },
        avoidance: {
          firstAttempt: 48,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.EMERGENCY_STOP_MISSING);
    });

    it('should return VALID when avoidance missing but competency has Serious fault', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: 48,
        },
        avoidance: {
          firstAttempt: undefined,
        },
        singleFaultCompetencies: {
          avoidance: CompetencyOutcome.S,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.VALID);
    });

    it('should return VALID when avoidance missing but competency has Dangerous fault', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: 48,
        },
        avoidance: {
          firstAttempt: undefined,
        },
        singleFaultCompetencies: {
          avoidance: CompetencyOutcome.D,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.VALID);
    });

    it('should return SpeedCheckState.AVOIDANCE_MISSING', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: 48,
        },
        avoidance: {
          firstAttempt: undefined,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.AVOIDANCE_MISSING);
    });

    it('should return SpeedCheckState.VALID', () => {
      const testData = {
        emergencyStop: {
          firstAttempt: 48,
        },
        avoidance: {
          firstAttempt: 49,
        },
      } as CatAMod1TestData;

      const result = testReportValidatorProvider.validateSpeedChecksCatAMod1(testData);

      expect(result).toBe(SpeedCheckState.VALID);
    });
  });
});
