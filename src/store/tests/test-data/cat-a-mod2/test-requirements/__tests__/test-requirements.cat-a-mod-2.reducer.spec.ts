import {
  testRequirementsCatAMod2Reducer,
} from '@store/tests/test-data/cat-a-mod2/test-requirements/test-requirements.cat-a-mod-2.reducer';
import { LegalRequirements } from '@store/tests/test-data/test-data.constants';
import * as testRequirementsActions from '../../../common/test-requirements/test-requirements.actions';

describe('testRequirementsCatAMod2Reducer', () => {
  describe('ToggleLegalRequirement', () => {
    it('should toggle the value passed when called', () => {
      const result = testRequirementsCatAMod2Reducer(
        { normalStart1: true }, testRequirementsActions.ToggleLegalRequirement(LegalRequirements.normalStart1),
      );
      expect(result).toEqual({ normalStart1: false });
    });
  });
});
