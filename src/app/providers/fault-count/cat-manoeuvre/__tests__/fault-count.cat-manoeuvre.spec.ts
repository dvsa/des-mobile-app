import { FaultCountManoeuvreTestHelper } from '@providers/fault-count/cat-manoeuvre/fault-count.cat-manoeuvre';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { catManoeuvreTestDataStateObject } from '@providers/fault-count/__mocks__/cat-man-test-data-state-object.mock';

describe('FaultCountManoeuvreTestHelper', () => {
  describe('getManoeuvreCountIfAny', () => {
    const manouevreTests = [
      {
        category: 'CM',
        data: catManoeuvreTestDataStateObject,
        expectedDF: 1,
        expectedS: 0,
        expectedD: 0,
      },
    ];

    manouevreTests.forEach((test) => {
      it(`should return ${test.expectedDF} driving fault count for category ${test.category} manoeuvres`, () => {
        const result = FaultCountManoeuvreTestHelper.getManoeuvreCountIfAny(test.data, CompetencyOutcome.DF);
        expect(result)
          .toEqual(test.expectedDF);
      });
    });
  });
  describe('getSeriousFaultSumCountManoeuvreTest', () => {
    const seriousFaultTests = [
      {
        category: 'CM',
        data: catManoeuvreTestDataStateObject,
        expected: 1,
      },
    ];
    seriousFaultTests.forEach((test) => {
      it(`should return ${test.expected} Serious fault count for category ${test.category}`, () => {
        const result = FaultCountManoeuvreTestHelper.getSeriousFaultSumCountManoeuvreTest(test.data);
        expect(result)
          .toEqual(test.expected);
      });
    });

  });
  describe('getDangerousFaultSumCountManoeuvreTest', () => {
    const dangerousFaultTests = [
      {
        category: 'CM',
        data: catManoeuvreTestDataStateObject,
        expected: 1,
      },
    ];
    dangerousFaultTests.forEach((test) => {
      it(`should return ${test.expected} Dangerous fault count for category ${test.category}`, () => {
        const result = FaultCountManoeuvreTestHelper.getDangerousFaultSumCountManoeuvreTest(test.data);
        expect(result)
          .toEqual(test.expected);
      });
    });
  });

});
