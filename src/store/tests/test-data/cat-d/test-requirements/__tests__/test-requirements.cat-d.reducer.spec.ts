import { TestRequirements } from '@dvsa/mes-test-schema/categories/common';
import { testRequirementsCatDReducer } from '../test-requirements.cat-d.reducer';
import { LegalRequirements } from '../../../test-data.constants';
import { ToggleLegalRequirement } from '../../../common/test-requirements/test-requirements.actions';

describe('Test Requirements CAT D Reducer', () => {

  describe('TOGGLE_LEGAL_REQUIREMENT', () => {
    it('should toggle uphill start to complete(true) when dispatched first time', () => {
      const state: TestRequirements = {};
      const result = testRequirementsCatDReducer(
        state,
        ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      expect(result[LegalRequirements.uphillStart]).toEqual(true);
    });

    it('should toggle uphill start to incomplete(false) when dispatched second time', () => {
      const state: TestRequirements = {};
      const modifiedState = testRequirementsCatDReducer(
        state, ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      const result = testRequirementsCatDReducer(
        modifiedState, ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      expect(result[LegalRequirements.uphillStart]).toEqual(false);
    });
  });
});
