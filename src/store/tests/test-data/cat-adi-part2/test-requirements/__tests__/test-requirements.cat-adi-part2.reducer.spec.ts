import { TestRequirements } from '@dvsa/mes-test-schema/categories/common';
import { testRequirementsCatADI2Reducer }
  from '@store/tests/test-data/cat-adi-part2/test-requirements/test-requirements.cat-adi-part2.reducer';
import { LegalRequirements } from '../../../test-data.constants';
import { ToggleLegalRequirement } from '../../../common/test-requirements/test-requirements.actions';

describe('Test Requirements CAT ADI2 Reducer', () => {

  describe('TOGGLE_LEGAL_REQUIREMENT', () => {
    it('should toggle uphill start to complete(true) when dispatched first time', () => {
      const state: TestRequirements = {};
      const result = testRequirementsCatADI2Reducer(
        state,
        ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      expect(result[LegalRequirements.uphillStart]).toEqual(true);
    });

    it('should toggle uphill start to incomplete(false) when dispatched second time', () => {
      const state: TestRequirements = {};
      const modifiedState = testRequirementsCatADI2Reducer(
        state, ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      const result = testRequirementsCatADI2Reducer(
        modifiedState, ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      expect(result[LegalRequirements.uphillStart]).toEqual(false);
    });
  });
});
