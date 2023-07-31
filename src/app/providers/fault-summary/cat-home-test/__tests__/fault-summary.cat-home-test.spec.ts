import { FaultSummaryCatHomeTestHelper } from '../fault-summary.cat-home-test';
import {
  catFTestDataStateObject,
  catFTestDataVCStateObject,
} from '../../../fault-count/__mocks__/cat-F-test-data-state-object.mock';
import {
  catGTestDataStateObject,
  catGTestDataVCStateObject,
} from '../../../fault-count/__mocks__/cat-G-test-data-state-object.mock';
import {
  catHTestDataStateObject,
  catHTestDataVCStateObject,
} from '../../../fault-count/__mocks__/cat-H-test-data-state-object.mock';
import {
  catKTestDataStateObject,
  catKTestDataVCStateObject,
} from '../../../fault-count/__mocks__/cat-K-test-data-state-object.mock';

describe('FaultSummaryCatHomeTestHelper', () => {
  describe('getDrivingFaultsCatHomeTest (No VehicleChecks)', () => {
    it('should return 4 driving fault count for category F', () => {
      const result = FaultSummaryCatHomeTestHelper.getDrivingFaultsCatHomeTest(catFTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(4);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(4);
      expect(competenciesWithFaults)
        .toContain('controlsGears');
      expect(competenciesWithFaults)
        .toContain('reverseLeftControl');
      expect(competenciesWithFaults)
        .toContain('controlledStop');
      expect(competenciesWithFaults)
        .toContain('highwayCodeSafety');
    });

    it('should return 5 driving fault count for category G', () => {
      const result = FaultSummaryCatHomeTestHelper.getDrivingFaultsCatHomeTest(catGTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(5);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(3);
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
      expect(competenciesWithFaults)
        .toContain('controlsGears');
    });

    it('should return 0 driving fault count for category H', () => {
      const result = FaultSummaryCatHomeTestHelper.getDrivingFaultsCatHomeTest(catHTestDataStateObject);
      let faultCount = 0;
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(0);
    });
    it('should return 4 driving fault count for category K', () => {
      const result = FaultSummaryCatHomeTestHelper.getDrivingFaultsCatHomeTest(catKTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(faultCount)
        .toEqual(4);
      expect(competenciesWithFaults.length)
        .toBe(3);
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
      expect(competenciesWithFaults)
        .toContain('controlsGears');
    });

  });

  describe('getDrivingFaultsCatHomeTest (Including VehicleChecks)', () => {
    it('should return 3 driving fault count for category F', () => {
      const result = FaultSummaryCatHomeTestHelper.getDrivingFaultsCatHomeTest(catFTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(3);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(3);
      expect(competenciesWithFaults)
        .toContain('controlsGears');
      expect(competenciesWithFaults)
        .toContain('reverseLeftControl');
      expect(competenciesWithFaults)
        .toContain('vehicleChecks');
    });

    it('should return 6 driving fault count for category G', () => {
      const result = FaultSummaryCatHomeTestHelper.getDrivingFaultsCatHomeTest(catGTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(6);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(4);
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
      expect(competenciesWithFaults)
        .toContain('controlsGears');
      expect(competenciesWithFaults)
        .toContain('vehicleChecks');
    });

    it('should return 1 driving fault count for category H', () => {
      const result = FaultSummaryCatHomeTestHelper.getDrivingFaultsCatHomeTest(catHTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(1);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(1);
      expect(competenciesWithFaults)
        .toContain('vehicleChecks');
    });
    it('should return 5 driving fault count for category K', () => {
      const result = FaultSummaryCatHomeTestHelper.getDrivingFaultsCatHomeTest(catKTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(faultCount)
        .toEqual(5);
      expect(competenciesWithFaults.length)
        .toBe(4);
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
      expect(competenciesWithFaults)
        .toContain('controlsGears');
      expect(competenciesWithFaults)
        .toContain('vehicleChecks');
    });
  });

  describe('getSeriousFaultsCatHomeTest (No VehicleChecks)', () => {
    it('should return 2 serious fault count for category F', () => {
      const result = FaultSummaryCatHomeTestHelper.getSeriousFaultsCatHomeTest(catFTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(2);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(2);
      expect(competenciesWithFaults)
        .toContain('awarenessPlanning');
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
    });

    it('should return 6 serious fault count for category G', () => {
      const result = FaultSummaryCatHomeTestHelper.getSeriousFaultsCatHomeTest(catGTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(6);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(6);
      expect(competenciesWithFaults)
        .toContain('controlsGears');
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
      expect(competenciesWithFaults)
        .toContain('awarenessPlanning');
      expect(competenciesWithFaults)
        .toContain('reverseLeftControl');
      expect(competenciesWithFaults)
        .toContain('highwayCodeSafety');
    });

    it('should return 2 serious fault count for category H', () => {
      const result = FaultSummaryCatHomeTestHelper.getSeriousFaultsCatHomeTest(catHTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(2);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(2);
      expect(competenciesWithFaults)
        .toContain('awarenessPlanning');
      expect(competenciesWithFaults)
        .toContain('controlledStop');

    });
    it('should return 0 serious fault count for category K', () => {
      const result = FaultSummaryCatHomeTestHelper.getSeriousFaultsCatHomeTest(catKTestDataStateObject);
      let faultCount = 0;
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(0);
    });

  });

  describe('getSeriousFaultsCatHomeTest (Including VehicleChecks)', () => {
    it('should return 2 serious fault count for category F', () => {
      const result = FaultSummaryCatHomeTestHelper.getSeriousFaultsCatHomeTest(catFTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(2);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(2);
      expect(competenciesWithFaults)
        .toContain('awarenessPlanning');
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
    });

    it('should return 5 serious fault count for category G', () => {
      const result = FaultSummaryCatHomeTestHelper.getSeriousFaultsCatHomeTest(catGTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(5);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(5);
      expect(competenciesWithFaults)
        .toContain('controlsGears');
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
      expect(competenciesWithFaults)
        .toContain('awarenessPlanning');
      expect(competenciesWithFaults)
        .toContain('reverseLeftControl');
    });

    it('should return 1 serious fault count for category H', () => {
      const result = FaultSummaryCatHomeTestHelper.getSeriousFaultsCatHomeTest(catHTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(1);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(1);
      expect(competenciesWithFaults)
        .toContain('awarenessPlanning');
    });
    it('should return 0 serious fault count for category K', () => {
      const result = FaultSummaryCatHomeTestHelper.getSeriousFaultsCatHomeTest(catKTestDataVCStateObject);
      let faultCount = 0;
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(0);
    });
  });

  describe('getDangerousFaultsCatHomeTest (No VehicleChecks)', () => {
    it('should return 2 dangerous fault count for category F', () => {
      const result = FaultSummaryCatHomeTestHelper.getDangerousFaultsCatHomeTest(catFTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(2);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(2);
      expect(competenciesWithFaults)
        .toContain('useOfSpeed');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
    });

    it('should return 5 dangerous fault count for category G', () => {
      const result = FaultSummaryCatHomeTestHelper.getDangerousFaultsCatHomeTest(catGTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(5);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(5);
      expect(competenciesWithFaults)
        .toContain('controlsGears');
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
      expect(competenciesWithFaults)
        .toContain('awarenessPlanning');
      expect(competenciesWithFaults)
        .toContain('controlledStop');
    });

    it('should return 2 dangerous fault count for category H', () => {
      const result = FaultSummaryCatHomeTestHelper.getDangerousFaultsCatHomeTest(catHTestDataStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(2);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(2);
      expect(competenciesWithFaults)
        .toContain('useOfSpeed');
      expect(competenciesWithFaults)
        .toContain('reverseLeftControl');

    });
    it('should return 0 dangerous fault count for category K', () => {
      const result = FaultSummaryCatHomeTestHelper.getDangerousFaultsCatHomeTest(catKTestDataStateObject);
      let faultCount = 0;
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(0);
    });
  });

  describe('getDangerousFaultsCatHomeTest (Including VehicleChecks)', () => {
    it('should return 2 dangerous fault count for category F', () => {
      const result = FaultSummaryCatHomeTestHelper.getDangerousFaultsCatHomeTest(catFTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(2);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(2);
      expect(competenciesWithFaults)
        .toContain('useOfSpeed');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
    });

    it('should return 4 dangerous fault count for category G', () => {
      const result = FaultSummaryCatHomeTestHelper.getDangerousFaultsCatHomeTest(catGTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(4);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(4);
      expect(competenciesWithFaults)
        .toContain('controlsGears');
      expect(competenciesWithFaults)
        .toContain('pedestrianCrossings');
      expect(competenciesWithFaults)
        .toContain('ancillaryControls');
      expect(competenciesWithFaults)
        .toContain('awarenessPlanning');
    });

    it('should return 2 dangerous fault count for category H', () => {
      const result = FaultSummaryCatHomeTestHelper.getDangerousFaultsCatHomeTest(catHTestDataVCStateObject);
      let faultCount = 0;
      const competenciesWithFaults: string[] = [];
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(2);
      result.map((fault) => competenciesWithFaults.push(fault.competencyIdentifier));
      expect(competenciesWithFaults.length)
        .toBe(2);
      expect(competenciesWithFaults)
        .toContain('useOfSpeed');
      expect(competenciesWithFaults)
        .toContain('reverseLeftControl');
    });
    it('should return 0 dangerous fault count for category K', () => {
      const result = FaultSummaryCatHomeTestHelper.getDangerousFaultsCatHomeTest(catKTestDataVCStateObject);
      let faultCount = 0;
      result.map((fault) => {
        faultCount += fault.faultCount;
      });
      expect(faultCount)
        .toEqual(0);
    });
  });

});
