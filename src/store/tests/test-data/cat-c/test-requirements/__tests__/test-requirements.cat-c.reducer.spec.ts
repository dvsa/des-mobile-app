import { TestRequirements } from '@dvsa/mes-test-schema/categories/common';
import { testRequirementsCatCReducer } from '../test-requirements.cat-c.reducer';
import { LegalRequirements } from '../../../test-data.constants';
import { ToggleLegalRequirement } from '../../../common/test-requirements/test-requirements.actions';

describe('Test Requirements CAT C Reducer', () => {

  describe('TOGGLE_LEGAL_REQUIREMENT', () => {
    it('should toggle uphill start to complete(true) when dispatched first time', () => {
      const state: TestRequirements = {};
      const result = testRequirementsCatCReducer(
        state,
        ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      expect(result[LegalRequirements.uphillStart]).toEqual(true);
    });

    it('should toggle uphill start to incomplete(false) when dispatched second time', () => {
      const state: TestRequirements = {};
      const modifiedState = testRequirementsCatCReducer(
        state, ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      const result = testRequirementsCatCReducer(
        modifiedState, ToggleLegalRequirement(LegalRequirements.uphillStart),
      );
      expect(result[LegalRequirements.uphillStart]).toEqual(false);
    });
  });
});
