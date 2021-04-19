import { TestRequirements } from '@dvsa/mes-test-schema/categories/common';
import { testRequirementsCatBEReducer } from '../test-requirements.cat-be.reducer';
import { LegalRequirements } from '../../../test-data.constants';
import { ToggleLegalRequirement } from '../../../common/test-requirements/test-requirements.actions';

describe('Test Requirements CAT BE Reducer', () => {

  describe('TOGGLE_LEGAL_REQUIREMENT', () => {
    it('should toggle uphill start to complete(true) when dispatched first time', () => {
      const state: TestRequirements = {};
      const result = testRequirementsCatBEReducer(
        state,
        ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      expect(result[LegalRequirements.uphillStart]).toEqual(true);
    });

    it('should toggle uphill start to incomplete(false) when dispatched second time', () => {
      const state: TestRequirements = {};
      const modifiedState = testRequirementsCatBEReducer(
        state, ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      const result = testRequirementsCatBEReducer(
        modifiedState, ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      expect(result[LegalRequirements.uphillStart]).toEqual(false);
    });
  });
});
